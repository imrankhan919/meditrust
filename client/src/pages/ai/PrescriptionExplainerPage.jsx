import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Camera,
  FileText,
  Scan,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import prescriptionService, {
  PRESCRIPTION_ACCEPT,
  PRESCRIPTION_LIMIT_BYTES,
} from '../../services/prescriptionService';
import toast from 'react-hot-toast';

const statusVariant = (status) => {
  if (status === 'confirmed') return 'success';
  if (status === 'needs_review') return 'warning';
  if (status === 'failed') return 'danger';
  return 'info';
};

const emptyMedicine = () => ({
  name: '',
  strength: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
  notes: '',
  confidence: null,
  needsReview: true,
});

const META_FIELDS = [
  ['patient_name', 'Patient name'],
  ['doctor_name', 'Doctor name'],
  ['clinic_name', 'Clinic name'],
  ['date', 'Prescription date'],
];

const MED_FIELDS = [
  ['name', 'Medicine name'],
  ['strength', 'Strength'],
  ['dosage', 'Dosage'],
  ['frequency', 'Frequency'],
  ['duration', 'Duration'],
  ['instructions', 'Instructions'],
];

export default function PrescriptionExplainerPage() {
  const navigate = useNavigate();
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  // In-flight guard: one user action must never fire duplicate scan requests
  // (each duplicate would previously burn scan budget and create dup records).
  const scanningRef = useRef(false);

  const [history, setHistory] = useState([]);
  const [historyState, setHistoryState] = useState('loading'); // loading|error|ready
  const [budget, setBudget] = useState(null); // { limit, remaining, retryAfterSeconds }
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchHistory = async () => {
    setHistoryState('loading');
    try {
      const data = await prescriptionService.listPrescriptions();
      setHistory(Array.isArray(data) ? data : []);
      setHistoryState('ready');
    } catch {
      setHistoryState('error');
    }
  };

  // Live per-user scan budget (counts only — no identity or patient data).
  const fetchBudget = async () => {
    try {
      const status = await prescriptionService.getScanStatus();
      setBudget(status);
    } catch {
      setBudget(null);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchBudget();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (f) => {
    if (!f) return 'Please choose a prescription image.';
    if (!PRESCRIPTION_ACCEPT.includes(f.type)) {
      return 'Only JPEG, JPG, PNG, and WEBP images are supported.';
    }
    if (f.size > PRESCRIPTION_LIMIT_BYTES) {
      return 'Image must be 5MB or smaller.';
    }
    return '';
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    setFormError(err);
    if (err) return;
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setUploadProgress(0);
  };

  const formatRetryWait = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '';
    if (totalSeconds < 60) return `Please try again in about ${totalSeconds} second${totalSeconds === 1 ? '' : 's'}.`;
    const minutes = Math.ceil(totalSeconds / 60);
    return `Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;
  };

  const handleUploadScan = async () => {
    // Ignore duplicate clicks while a scan is already in flight. No automatic
    // retries: the user explicitly retries by pressing the button again.
    if (scanningRef.current) return;
    const err = validateFile(file);
    if (err) {
      setFormError(err);
      return;
    }
    scanningRef.current = true;
    setScanning(true);
    setFormError('');
    try {
      const created = await prescriptionService.uploadScan(file, setUploadProgress);
      setResult(created);
      toast.success('Prescription scanned. Please review the extracted details.');
      fetchHistory();
      fetchBudget();
    } catch (e) {
      const status = e?.response?.status;
      const serverMsg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        'Scan failed. Please retry with a clearer image.';
      let msg = serverMsg;
      if (status === 429 || status === 503) {
        const headerWait = Number(e?.response?.headers?.['retry-after']);
        const bodyWait = Number(e?.response?.data?.retryAfterSeconds);
        const wait = Number.isFinite(headerWait) && headerWait > 0 ? headerWait : bodyWait;
        const waitText = formatRetryWait(wait);
        if (waitText && !/\d+\s?(second|minute)/i.test(serverMsg)) msg = `${serverMsg} ${waitText}`;
      }
      // Refresh the authoritative budget readout after a rejection.
      if (status === 429 || status === 503) fetchBudget();
      setFormError(msg);
      toast.error(msg);
    } finally {
      setScanning(false);
      scanningRef.current = false;
    }
  };

  const updateMedicine = (idx, key, value) => {
    setResult((prev) => {
      const medicines = [...(prev.medicines || [])];
      medicines[idx] = {
        ...medicines[idx],
        [key]: value,
        needsReview: key === 'name' && !value ? true : medicines[idx].needsReview,
      };
      return { ...prev, medicines };
    });
  };

  const handleSaveEdits = async (confirm) => {
    if (!result?._id) return;
    setSaving(true);
    try {
      const payload = {
        patient_name: result.patient_name,
        doctor_name: result.doctor_name,
        clinic_name: result.clinic_name,
        date: result.date,
        diagnosis_notes: result.diagnosis_notes,
        additional_instructions: result.additional_instructions || [],
        unreadable_text: result.unreadable_text || [],
        medicines: result.medicines || [],
      };
      const updated = confirm
        ? await prescriptionService.confirmPrescription(result._id, payload)
        : await prescriptionService.updatePrescription(result._id, payload);
      setResult(updated);
      fetchHistory();
      toast.success(confirm ? 'Prescription confirmed and saved.' : 'Edits saved for review.');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Save failed. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Delete this prescription? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await prescriptionService.deletePrescription(id);
      toast.success('Prescription deleted.');
      if (result?._id === id) setResult(null);
      fetchHistory();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="purple" size="sm">
          Vision OCR &amp; Clinical Parser
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explain My Prescription
        </h1>
        <p className="text-sm text-slate-600">
          Upload any handwritten doctor&apos;s slip or clinic discharge summary. Our medical
          vision model deciphers medication schedules, food instructions, and safety
          precautions.
        </p>
      </div>

      {/* Upload Zone & Scan State */}
      <Card className="p-6 sm:p-8 border-dashed border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 transition-all">
        {scanning ? (
          <div className="py-10 space-y-4 max-w-md mx-auto animate-pulse text-center">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Scan className="w-10 h-10 animate-spin" />
              </div>
              <div className="absolute inset-0 border-2 border-indigo-400 rounded-2xl animate-ping" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-indigo-950">
                Scanning Doctor&apos;s Handwriting...
              </h3>
              <p className="text-xs text-indigo-700/80">
                Running optical character recognition and matching against the pharmacy
                database...
              </p>
            </div>
            <div className="w-48 bg-indigo-200 rounded-full h-1.5 mx-auto overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{ width: `${uploadProgress || 40}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {preview ? (
              <img
                src={preview}
                alt="Prescription preview"
                className="w-full sm:w-56 h-56 object-contain rounded-xl border border-slate-200 bg-white"
              />
            ) : (
              <div className="w-full sm:w-56 h-56 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 gap-2">
                <Upload className="w-8 h-8" />
                <span className="text-xs">Image preview appears here</span>
              </div>
            )}
            <div className="flex-1 space-y-3 w-full">
              <h3 className="text-base font-bold text-slate-800">
                Scan Prescription Slip
              </h3>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, WEBP up to 5MB. Clear lighting produces best accuracy.
              </p>
              <input
                ref={galleryRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => galleryRef.current?.click()}
                  icon={Upload}
                >
                  Upload image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cameraRef.current?.click()}
                  icon={Camera}
                >
                  Take a photo
                </Button>
                <Button
                  variant="ai"
                  size="sm"
                  onClick={handleUploadScan}
                  disabled={!file || scanning}
                  icon={Sparkles}
                >
                  Upload &amp; Scan
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                On compatible mobile devices &quot;Take a photo&quot; opens the camera directly.
              </p>
              {budget && (
                <p className="text-xs text-slate-500">
                  Scan budget: {budget.remaining} of {budget.limit} scans remaining this hour
                  {budget.remaining === 0 && budget.retryAfterSeconds > 0
                    ? ` — resets in ${formatRetryWait(budget.retryAfterSeconds).replace('Please try again in ', '')}`
                    : '.'}
                </p>
              )}
              {formError && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {formError}
                </p>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Review extracted results */}
      {result && !scanning && (
        <Card className="p-6 space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" /> Review extracted details
            </h2>
            <Badge variant={statusVariant(result.status)} size="sm">
              {result.status || 'needs_review'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {META_FIELDS.map(([key, label]) => {
              const missing = !result[key];
              return (
                <label key={key} className="text-xs space-y-1">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    {label}
                    {missing && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                        Unclear — verify
                      </span>
                    )}
                  </span>
                  <input
                    value={result[key] || ''}
                    onChange={(e) => setResult({ ...result, [key]: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-teal-500 ${
                      missing ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'
                    }`}
                    placeholder="Unclear — verify from image"
                  />
                </label>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Medicines ({(result.medicines || []).length})
            </h3>
            {(result.medicines || []).length === 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                No medicines were readable in this scan. Add rows manually or retry with a
                clearer image.
              </p>
            )}
            {(result.medicines || []).map((med, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  med.needsReview ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">Medicine {idx + 1}</span>
                  {med.needsReview && (
                    <Badge variant="warning" size="sm" dot>
                      Needs review
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MED_FIELDS.map(([key, label]) => {
                    const missing = !med[key];
                    return (
                      <label key={key} className="text-xs space-y-1">
                        <span className="font-medium text-slate-500 flex items-center gap-1">
                          {label}
                          {missing && key === 'name' && (
                            <span className="text-[10px] font-bold text-amber-700">• unreadable</span>
                          )}
                        </span>
                        <input
                          value={med[key] || ''}
                          onChange={(e) => updateMedicine(idx, key, e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-sm focus:outline-none focus:border-teal-500 ${
                            missing && key === 'name'
                              ? 'border-amber-300 bg-white'
                              : 'border-slate-200'
                          }`}
                          placeholder="—"
                        />
                      </label>
                    );
                  })}
                </div>
                {typeof med.confidence === 'number' && (
                  <p className="text-[11px] text-slate-400">
                    AI confidence: {(med.confidence * 100).toFixed(0)}%
                    {med.confidence < 0.85 ? ' — please verify carefully.' : '.'}
                  </p>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setResult({ ...result, medicines: [...(result.medicines || []), emptyMedicine()] })
              }
            >
              + Add medicine row
            </Button>
          </div>

          {(result.diagnosis_notes || (result.unreadable_text || []).length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.diagnosis_notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Diagnosis notes
                  </span>
                  <p className="text-xs text-slate-700">{result.diagnosis_notes}</p>
                </div>
              )}
              {(result.unreadable_text || []).length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Unreadable sections — needs review
                  </span>
                  <ul className="text-xs text-amber-900 list-disc pl-4 space-y-0.5">
                    {result.unreadable_text.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSaveEdits(false)} disabled={saving}>
              Save edits
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSaveEdits(true)}
              disabled={saving}
              icon={CheckCircle2}
            >
              {saving ? 'Saving…' : 'Confirm details'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/auth/ai-prescription/${result._id}`)}
            >
              Open details →
            </Button>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              AI extraction can be inaccurate. Verify every field against the original image
              and consult a qualified healthcare professional. This is not medical advice.
            </span>
          </div>
        </Card>
      )}

      {/* Saved history within the same workflow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Prescription history ({history.length})
          </h2>
          <Button variant="outline" size="sm" onClick={fetchHistory} icon={RefreshCw}>
            Refresh
          </Button>
        </div>
        {historyState === 'loading' && <Loader />}
        {historyState === 'error' && (
          <Card className="p-6 text-center text-sm text-slate-500 space-y-2">
            <p>Could not load prescriptions.</p>
            <Button variant="outline" size="sm" onClick={fetchHistory}>
              Retry
            </Button>
          </Card>
        )}
        {historyState === 'ready' && history.length === 0 && (
          <Card className="p-8 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No prescriptions yet</p>
            <p className="text-xs text-slate-400">
              Upload your first prescription above to get started.
            </p>
          </Card>
        )}
        {historyState === 'ready' &&
          history.map((rx) => (
            <Card
              key={rx._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{rx._id?.slice(-8)}</span>
                    <Badge variant={statusVariant(rx.status)} size="sm">
                      {rx.status}
                    </Badge>
                    {rx.isConfirmed && (
                      <Badge variant="success" size="sm">
                        confirmed
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    {rx.doctor_name || 'Unknown doctor'}
                    {rx.clinic_name ? ` • ${rx.clinic_name}` : ''}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {rx.createdAt ? new Date(rx.createdAt).toLocaleString() : ''} •{' '}
                    {(rx.medicines || []).length} medicine(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/auth/ai-prescription/${rx._id}`)}
                >
                  Open details
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteHistory(rx._id)}
                  disabled={deletingId === rx._id}
                  icon={Trash2}
                >
                  {deletingId === rx._id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            </Card>
          ))}
      </div>

      <div className="rounded-xl bg-slate-100 p-4 text-xs text-slate-500 text-center">
        MediTrust AI extraction is an assistive readout. Always double-check dosage
        instructions with the packaging label and your pharmacist.
      </div>
    </div>
  );
}
