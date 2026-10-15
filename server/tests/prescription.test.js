import { describe, it } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import prescriptionController from "../controllers/prescription/prescriptionController.js";
import {
    SCAN_LIMIT,
    SCAN_WINDOW_MS,
    scanRateLimit,
    recordScanHit,
    _test as limiterTest,
} from "../middleware/scanRateLimitMiddleware.js";

const { normalizeExtraction, coreTokens, isExpiredProduct, mapGeminiError, getGeminiModel, googleDetails } = prescriptionController._test;

describe("prescription extraction normalization", () => {
    it("nulls missing values and flags uncertain medicines", () => {
        const out = normalizeExtraction({
            patient_name: "  ",
            doctor_name: "Dr A",
            medicines: [{ name: "Paracetamol", dosage: "500mg" }],
        });
        assert.equal(out.patient_name, null);
        assert.equal(out.doctor_name, "Dr A");
        assert.equal(out.medicines.length, 1);
        assert.equal(out.medicines[0].name, "Paracetamol");
        // no confidence provided -> needs review
        assert.equal(out.medicines[0].needsReview, true);
    });

    it("caps medicines at 50 and coerces confidence", () => {
        const many = Array.from({ length: 60 }, (_, i) => ({ name: `Med ${i}`, confidence: 0.99 }));
        const out = normalizeExtraction({ medicines: many });
        assert.equal(out.medicines.length, 50);
        assert.equal(out.medicines[0].confidence, 0.99);
        assert.equal(out.medicines[0].needsReview, false);
    });

    it("rejects out-of-range confidence", () => {
        const out = normalizeExtraction({ medicines: [{ name: "X", confidence: 5 }] });
        assert.equal(out.medicines[0].confidence, null);
        assert.equal(out.medicines[0].needsReview, true);
    });
});

describe("catalog matching helpers", () => {
    it("tokenizes names ignoring strength stop-words", () => {
        assert.deepEqual(coreTokens("Paracetamol 500mg Tablets"), ["paracetamol"]);
        assert.deepEqual(coreTokens("Vitamin C Tablets"), ["vitamin", "c"]);
    });

    it("detects expired products", () => {
        assert.equal(isExpiredProduct({ expiresOn: "2000-01-01" }), true);
        assert.equal(isExpiredProduct({ expiresOn: "2099-01-01" }), false);
        assert.equal(isExpiredProduct({}), false);
    });
});

describe("ownership guardrails", () => {
    it("rejects malformed ObjectIds", () => {
        assert.equal(mongoose.isValidObjectId("not-an-id"), false);
        assert.equal(mongoose.isValidObjectId(new mongoose.Types.ObjectId().toString()), true);
    });
});

describe("scan rate limiter (success-only accounting)", () => {
    const makeReq = (id) => ({ user: { _id: new mongoose.Types.ObjectId().toString(), id }, ip: "127.0.0.1" });
    const makeRes = () => {
        const res = { statusCode: null, body: null, headers: {} };
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (body) => { res.body = body; return res; };
        res.set = (k, v) => { res.headers[k] = v; return res; };
        return res;
    };

    it("lets the gate pass without recording a hit (failed scans cost nothing)", () => {
        const req = makeReq();
        const res = makeRes();
        let nextCalled = 0;
        for (let i = 0; i < SCAN_LIMIT + 5; i++) {
            scanRateLimit(req, res, () => { nextCalled += 1; });
        }
        // Gate alone must never consume budget: all attempts pass through.
        assert.equal(nextCalled, SCAN_LIMIT + 5);
        assert.equal(res.statusCode, null);
    });

    it("blocks only after SCAN_LIMIT successful scans, with retry timing", () => {
        const req = makeReq();
        for (let i = 0; i < SCAN_LIMIT; i++) {
            recordScanHit(req);
        }
        const res = makeRes();
        let nextCalled = 0;
        scanRateLimit(req, res, () => { nextCalled += 1; });
        assert.equal(nextCalled, 0);
        assert.equal(res.statusCode, 429);
        assert.equal(res.body.error, "Too many prescription scans. Please try again later.");
        assert.equal(res.body.retryable, true);
        assert.ok(res.body.retryAfterSeconds >= 1 && res.body.retryAfterSeconds <= SCAN_WINDOW_MS / 1000);
        assert.equal(res.headers["Retry-After"], String(res.body.retryAfterSeconds));
    });

    it("isolates budgets per user and prunes stale keys", () => {
        const reqA = makeReq();
        const reqB = makeReq();
        for (let i = 0; i < SCAN_LIMIT; i++) recordScanHit(reqA);
        const resB = makeRes();
        let nextB = 0;
        scanRateLimit(reqB, resB, () => { nextB += 1; });
        assert.equal(nextB, 1);
        assert.equal(resB.statusCode, null);

        // Stale entries are dropped instead of leaking memory.
        const staleKey = "user:stale-test-key";
        limiterTest.scanHits.set(staleKey, [Date.now() - SCAN_WINDOW_MS - 1000]);
        const pruned = limiterTest.pruneHits(staleKey, Date.now());
        assert.deepEqual(pruned, []);
        assert.equal(limiterTest.scanHits.has(staleKey), false);
    });

    it("throttle rejection exposes budget numbers but no identity or secrets", () => {        const userId = new mongoose.Types.ObjectId().toString();
        const req = { user: { _id: userId }, ip: "127.0.0.1" };
        for (let i = 0; i < SCAN_LIMIT; i++) {
            recordScanHit(req);
        }
        const res = makeRes();
        scanRateLimit(req, res, () => {});
        assert.equal(res.statusCode, 429);
        assert.equal(res.body.limit, SCAN_LIMIT);
        assert.equal(res.body.scansUsedInWindow, SCAN_LIMIT);
        const serialized = JSON.stringify(res.body);
        assert.ok(!serialized.includes(userId), "429 body must not contain the user id");
        assert.ok(!serialized.includes("127.0.0.1"), "429 body must not contain the client IP");
    });

    it("scan budget snapshot reports counts only, with live retry timing", () => {
        const req = makeReq();
        const fresh = limiterTest.getScanBudget(req);
        assert.equal(fresh.limit, SCAN_LIMIT);
        assert.equal(fresh.scansUsedInWindow, 0);
        assert.equal(fresh.remaining, SCAN_LIMIT);
        assert.equal(fresh.retryAfterSeconds, 0);
        assert.deepEqual(
            Object.keys(fresh).sort(),
            ["limit", "remaining", "retryAfterSeconds", "scansUsedInWindow", "windowHours"]
        );
        for (let i = 0; i < SCAN_LIMIT; i++) recordScanHit(req);
        const spent = limiterTest.getScanBudget(req);
        assert.equal(spent.scansUsedInWindow, SCAN_LIMIT);
        assert.equal(spent.remaining, 0);
        assert.ok(spent.retryAfterSeconds >= 1);
    });

    it("application throttle 429 is distinct from Gemini quota 429", () => {
        const throttleMessage = "Too many prescription scans. Please try again later.";
        const geminiQuota = mapGeminiError({ status: 429, message: "Quota exceeded for quota metric" });
        assert.equal(geminiQuota.statusCode, 429);
        assert.equal(geminiQuota.retryable, true);
        assert.notEqual(geminiQuota.error, throttleMessage);
        assert.match(geminiQuota.error, /AI service is rate-limited/);
    });
});

describe("gemini error mapping (accurate per-status messages)", () => {
    it("maps numeric 404 to model-unavailable", () => {
        const mapped = mapGeminiError({
            status: 404,
            message: "got status: 404 Not Found. {\"error\":{\"code\":404,\"message\":\"models/gemini-2.5-flash is not found for API version v1beta\",\"status\":\"NOT_FOUND\"}}",
        });
        assert.equal(mapped.statusCode, 502);
        assert.match(mapped.error, /model is unavailable/);
    });

    it("maps a model+missing message to model-unavailable even without status", () => {
        const mapped = mapGeminiError({ message: "models/gemini-xyz is not found for API version v1beta" });
        assert.equal(mapped.statusCode, 502);
    });

    it("does NOT blame the model for messages that merely mention 'model'", () => {
        const mapped = mapGeminiError({ message: "Request payload model field is malformed" });
        assert.doesNotMatch(mapped.error, /model is unavailable/);
    });

    it("maps rejected credentials (400/401/403) to the API-key message", () => {
        for (const status of [400, 401, 403]) {
            const mapped = mapGeminiError({ status, message: "request failed" });
            assert.equal(mapped.statusCode, 500);
            assert.match(mapped.error, /GEMINI_API_KEY/);
        }
        const invalidKey = mapGeminiError({ message: "API key not valid. Please pass a valid API key." });
        assert.match(invalidKey.error, /GEMINI_API_KEY/);
        assert.doesNotMatch(invalidKey.error, /model is unavailable/);
    });

    it("keeps quota, timeout, and generic mappings intact", () => {
        assert.equal(mapGeminiError({ status: 429 }).statusCode, 429);
        assert.equal(mapGeminiError({ message: "request timed out" }).statusCode, 504);
        assert.equal(mapGeminiError({ message: "boom" }).statusCode, 500);
    });

    it("maps Google 503 overload to a retryable overload message", () => {
        const mapped = mapGeminiError({
            status: 503,
            message: '{"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}',
        });
        assert.equal(mapped.statusCode, 503);
        assert.equal(mapped.retryable, true);
        assert.match(mapped.error, /temporarily overloaded/);
    });

    it("truncates upstream Google error text for safe echoing", () => {
        assert.equal(googleDetails(null), null);
        assert.equal(googleDetails({}), null);
        assert.equal(googleDetails({ message: "short" }), "short");
        const long = googleDetails({ message: "x".repeat(500) });
        assert.equal(long.length, 301);
    });
});

describe("gemini model resolution", () => {
    it("is a code constant (no GEMINI_MODEL env required)", () => {
        delete process.env.GEMINI_MODEL;
        assert.equal(getGeminiModel(), "gemini-3.8-flash");
    });

    it("ignores any stale GEMINI_MODEL env value", () => {
        process.env.GEMINI_MODEL = "gemini-2.5-flash";
        try {
            assert.equal(getGeminiModel(), "gemini-3.8-flash");
        } finally {
            delete process.env.GEMINI_MODEL;
        }
    });
});
