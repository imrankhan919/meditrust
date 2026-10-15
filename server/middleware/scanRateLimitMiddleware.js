import mongoose from "mongoose";

// Per-user prescription scan throttle (no new dependencies).
// Budget: 20 SUCCESSFUL scans per user per rolling hour.
//
// Accounting rule: a hit is recorded only after a scan succeeds
// (see recordScanHit, called by the controller after Prescription.create).
// Validation failures, missing server configuration, Gemini errors, and
// image-storage failures never consume budget, so retrying a failed scan
// cannot lock a user out. The cap still bounds costly successful AI calls.
const SCAN_LIMIT = 20;
const SCAN_WINDOW_MS = 60 * 60 * 1000;

const scanHits = new Map();

function limiterKey(req) {
    const id = req.user?._id || req.user?.id;
    if (id && mongoose.isValidObjectId(String(id))) return `user:${String(id)}`;
    if (id) return `user:${String(id)}`;
    return `ip:${req.ip}`;
}

function pruneHits(key, now) {
    const hits = (scanHits.get(key) || []).filter((t) => now - t < SCAN_WINDOW_MS);
    if (hits.length === 0) {
        scanHits.delete(key);
        return [];
    }
    scanHits.set(key, hits);
    return hits;
}

function retryAfterSeconds(hits, now) {
    if (!hits.length) return 0;
    const oldest = Math.min(...hits);
    return Math.max(1, Math.ceil((oldest + SCAN_WINDOW_MS - now) / 1000));
}

// Gate: rejects over-budget users WITHOUT recording a hit.
// The hit is recorded later, only on success, via recordScanHit(req).
const scanRateLimit = (req, res, next) => {
    try {
        const key = limiterKey(req);
        const now = Date.now();
        const hits = pruneHits(key, now);
        if (hits.length >= SCAN_LIMIT) {
            const wait = retryAfterSeconds(hits, now);
            res.set("Retry-After", String(wait));
            return res.status(429).json({
                error: "Too many prescription scans. Please try again later.",
                retryAfterSeconds: wait,
                retryable: true,
                limit: SCAN_LIMIT,
                scansUsedInWindow: hits.length,
            });
        }
        req.scanLimitKey = key;
        return next();
    } catch {
        return next();
    }
};

// Read-only budget snapshot for the calling user. Powers the
// GET /api/prescriptions/scan-status diagnostic (counts only —
// no identity, tokens, images, or patient data ever leave the server).
const getScanBudget = (req) => {
    const key = req?.scanLimitKey || (req ? limiterKey(req) : "ip:unknown");
    const now = Date.now();
    const hits = pruneHits(key, now);
    const used = hits.length;
    const remaining = Math.max(0, SCAN_LIMIT - used);
    return {
        limit: SCAN_LIMIT,
        windowHours: SCAN_WINDOW_MS / 3600000,
        scansUsedInWindow: used,
        remaining,
        retryAfterSeconds: used >= SCAN_LIMIT ? retryAfterSeconds(hits, now) : 0,
    };
};

// Called by the controller only after a scan is successfully persisted.
const recordScanHit = (req) => {
    try {
        const key = req?.scanLimitKey || (req ? limiterKey(req) : null);
        if (!key) return;
        const now = Date.now();
        const hits = pruneHits(key, now);
        hits.push(now);
        scanHits.set(key, hits);
    } catch {
        // rate-limit accounting must never break a successful scan
    }
};

export { SCAN_LIMIT, SCAN_WINDOW_MS, scanRateLimit, recordScanHit, getScanBudget, limiterKey };

// Exported for offline unit tests (no DB/Gemini needed).
export const _test = { scanHits, pruneHits, retryAfterSeconds, limiterKey, getScanBudget };

export default scanRateLimit;
