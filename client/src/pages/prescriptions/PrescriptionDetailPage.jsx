import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import prescriptionService from "../../services/prescriptionService";
import toast from "react-hot-toast";

export default function PrescriptionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rx, setRx] = useState(null);
    const [image, setImage] = useState(null);
    const [matches, setMatches] = useState(null);
    const [state, setState] = useState("loading");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const load = async () => {
        setState("loading");
        setError("");
        try {
            const detail = await prescriptionService.getPrescription(id);
            setRx(detail);
            try {
                const img = await prescriptionService.getPrescriptionImage(id);
                setImage(img);
            } catch {
                setImage(null);
            }
            try {
                const m = await prescriptionService.getPrescriptionMatches(id);
                setMatches(m);
            } catch {
                setMatches(null);
            }
            setState("ready");
        } catch (e) {
            setError(e?.response?.data?.error || "Prescription not found or access denied.");
            setState("error");
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const updateMed = (idx, key, value) => {
        setRx((prev) => {
            const medicines = [...(prev.medicines || [])];
            medicines[idx] = { ...medicines[idx], [key]: value };
            return { ...prev, medicines };
        });
    };

    const handleSave = async (confirm) => {
        setSaving(true);
        try {
            const payload = {
                patient_name: rx.patient_name,
                doctor_name: rx.doctor_name,
                clinic_name: rx.clinic_name,
                date: rx.date,
                diagnosis_notes: rx.diagnosis_notes,
                additional_instructions: rx.additional_instructions || [],
                unreadable_text: rx.unreadable_text || [],
                medicines: rx.medicines || [],
            };
            const updated = confirm
                ? await prescriptionService.confirmPrescription(id, payload)
                : await prescriptionService.updatePrescription(id, payload);
            setRx(updated);
            toast.success(confirm ? "Confirmed." : "Saved.");
        } catch (e) {
            toast.error(e?.response?.data?.error || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this prescription? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await prescriptionService.deletePrescription(id);
            toast.success("Prescription deleted.");
            navigate("/auth/ai-prescription");
        } catch (e) {
            toast.error(e?.response?.data?.error || "Delete failed.");
        } finally {
            setDeleting(false);
        }
    };

    if (state === "loading") return <Loader />;
    if (state === "error") {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-center">
                <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> {error}
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth/ai-prescription")} icon={ArrowLeft}>
                    Back to Explain My Prescription
                </Button>
            </div>
        );
    }

    const imgSrc = image?.signedUrl || image?.imageUrl || null;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth/ai-prescription")} icon={ArrowLeft}>
                Back
            </Button>

            <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">Prescription details</h1>
                <Badge variant={rx.status === "confirmed" ? "success" : "warning"} size="sm">{rx.status}</Badge>
                {rx.isConfirmed && <Badge variant="success" size="sm">confirmed</Badge>}
            </div>
            <p className="text-xs text-slate-500">
                Uploaded {rx.createdAt ? new Date(rx.createdAt).toLocaleString() : "—"}
                {rx.confirmedAt ? ` • Confirmed ${new Date(rx.confirmedAt).toLocaleString()}` : ""}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 space-y-2">
                    <h2 className="text-sm font-bold text-slate-800">Original image (secure, owner-only)</h2>
                    {imgSrc ? (
                        <img src={imgSrc} alt="Prescription" className="w-full max-h-[560px] object-contain rounded-xl border border-slate-200 bg-white" />
                    ) : (
                        <p className="text-xs text-slate-400">Image unavailable.</p>
                    )}
                    {image?.legacy && (
                        <p className="text-[11px] text-amber-700">Legacy public-URL image: link requires login to discover, but the URL itself is not signed. Avoid resharing.</p>
                    )}
                </Card>

                <Card className="p-5 space-y-4">
                    <h2 className="text-sm font-bold text-slate-800">Extracted information (editable)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[["patient_name", "Patient"], ["doctor_name", "Doctor"], ["clinic_name", "Clinic"], ["date", "Date"]].map(([key, label]) => (
                            <label key={key} className="text-xs space-y-1">
                                <span className="font-semibold text-slate-600">{label}</span>
                                <input
                                    value={rx[key] || ""}
                                    onChange={(e) => setRx({ ...rx, [key]: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
                                />
                            </label>
                        ))}
                    </div>
                    <label className="text-xs space-y-1 block">
                        <span className="font-semibold text-slate-600">Diagnosis notes</span>
                        <textarea
                            value={rx.diagnosis_notes || ""}
                            onChange={(e) => setRx({ ...rx, diagnosis_notes: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
                            rows={3}
                        />
                    </label>

                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Medicines</h3>
                        {(rx.medicines || []).map((med, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border space-y-2 ${med.needsReview ? "border-amber-300 bg-amber-50/50" : "border-slate-200"}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold">#{idx + 1}</span>
                                    {med.needsReview && <Badge variant="warning" size="sm">needs review</Badge>}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[["name", "Name"], ["strength", "Strength"], ["dosage", "Dosage"], ["frequency", "Frequency"], ["duration", "Duration"], ["instructions", "Instructions"]].map(([key, label]) => (
                                        <label key={key} className="text-[11px] space-y-1">
                                            <span className="text-slate-500">{label}</span>
                                            <input
                                                value={med[key] || ""}
                                                onChange={(e) => updateMed(idx, key, e.target.value)}
                                                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving}>
                            Save edits
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleSave(true)} disabled={saving} icon={CheckCircle2}>
                            Confirm details
                        </Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting} icon={Trash2}>
                            {deleting ? "Deleting…" : "Delete"}
                        </Button>
                    </div>

                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-900">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>AI extraction can be inaccurate. Verify against the original image and a qualified professional. Not medical advice.</span>
                    </div>
                </Card>
            </div>

            <Card className="p-5 space-y-3">
                <h2 className="text-sm font-bold text-slate-800">Pharmacy catalog matches (name-based only)</h2>
                {!matches && <p className="text-xs text-slate-400">Match data unavailable.</p>}
                {matches && (
                    <>
                        <p className="text-xs text-slate-500">
                            {matches.summary?.medicines_available} of {matches.summary?.total_medicines_prescribed} available. {matches.limitation}
                        </p>
                        <div className="space-y-2">
                            {matches.medicines?.map((m, i) => (
                                <div key={i} className="p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <p className="font-bold text-slate-800">{m.prescribed_name || `Item ${i + 1}`}</p>
                                        <p className="text-slate-500">
                                            {m.available ? `Available: ${m.matched_product_name} • ₹${m.price} • stock ${m.stock}` : m.reason}
                                        </p>
                                    </div>
                                    <Badge variant={m.available ? "success" : "warning"} size="sm">
                                        {m.match_confidence}{m.needsReview ? " • review" : ""}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
