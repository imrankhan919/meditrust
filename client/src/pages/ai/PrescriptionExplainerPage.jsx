import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw,
  Eye
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.ai.scanPrescription(file)
// ==========================================

const MOCK_PARSED_PRESCRIPTION = {
  prescriptionId: 'RX-SCAN-9042',
  prescribedBy: 'Dr. Sarah Jenkins, MD (Cardiology)',
  patientName: 'Sarah Connor',
  date: 'Sep 22, 2026',
  confidenceScore: '98.6% Optical Clarity',
  medicines: [
    {
      name: 'Amoxicillin Trihydrate 500mg',
      brand: 'Novartis Healthcare',
      schedule: 'Morning: 1 | Afternoon: 0 | Night: 1',
      scheduleVisual: [1, 0, 1], // Morning, Afternoon, Night
      duration: '7 Days (Total 14 Capsules)',
      instruction: 'Take with full glass of water after food',
      purpose: 'Bacterial upper respiratory infection treatment',
      interactions: 'Avoid taking at exact same hour as dairy or antacids',
      price: 18.50,
      inStock: true,
    },
    {
      name: 'Lipitor (Atorvastatin) 20mg',
      brand: 'Pfizer Bio',
      schedule: 'Morning: 0 | Afternoon: 0 | Night: 1',
      scheduleVisual: [0, 0, 1],
      duration: '30 Days (Total 30 Tablets)',
      instruction: 'Take before bedtime with water',
      purpose: 'Cardiovascular lipid stabilization and LDL reduction',
      interactions: 'Avoid consuming grapefruit juice during statin therapy',
      price: 32.00,
      inStock: true,
    },
  ],
};

export default function PrescriptionExplainerPage({ onNavigate }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);

  const triggerMockScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="purple" size="sm">
          Vision OCR & Clinical Parser
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Prescription Explainer
        </h1>
        <p className="text-sm text-slate-600">
          Upload any handwritten doctor's slip or clinic discharge summary. Our medical vision model deciphers medication schedules, food instructions, and safety precautions.
        </p>
      </div>

      {/* Upload Zone & Scan State */}
      <Card className="p-8 border-dashed border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 text-center transition-all">
        
        {isScanning ? (
          /* Animated Scanning State */
          <div className="py-10 space-y-4 max-w-md mx-auto animate-pulse">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Scan className="w-10 h-10 animate-spin" />
              </div>
              <div className="absolute inset-0 border-2 border-indigo-400 rounded-2xl animate-ping" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-indigo-950">
                Scanning Doctor's Handwriting...
              </h3>
              <p className="text-xs text-indigo-700/80">
                Running optical character recognition and matching against FDA pharmacopeia database...
              </p>
            </div>

            <div className="w-48 bg-indigo-200 rounded-full h-1.5 mx-auto overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        ) : (
          /* Dropzone */
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Drag & Drop Your Prescription Image or PDF
              </h3>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, PDF up to 20MB. Clear lighting produces best accuracy.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="ai"
                size="md"
                onClick={triggerMockScan}
                icon={Sparkles}
              >
                Upload & Scan New Slip
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setHasScanned(!hasScanned)}
              >
                {hasScanned ? 'Reset to Upload Demo' : 'View Sample Results'}
              </Button>
            </div>
          </div>
        )}

      </Card>

      {/* Extracted Results Section */}
      {hasScanned && !isScanning && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Metadata Strip */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">{MOCK_PARSED_PRESCRIPTION.prescriptionId}</span>
                <Badge variant="success" size="sm" dot>
                  {MOCK_PARSED_PRESCRIPTION.confidenceScore}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Prescribed by: {MOCK_PARSED_PRESCRIPTION.prescribedBy}
              </h3>
              <p className="text-xs text-slate-500">Patient: {MOCK_PARSED_PRESCRIPTION.patientName} • Date: {MOCK_PARSED_PRESCRIPTION.date}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('pharmacy')}
              icon={Pill}
            >
              Order All Medicines via Pharmacy
            </Button>
          </div>

          {/* Cards for each extracted medicine */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Extracted Medications & Dosage Schedule ({MOCK_PARSED_PRESCRIPTION.medicines.length})
            </h3>

            {MOCK_PARSED_PRESCRIPTION.medicines.map((med, index) => (
              <Card key={index} className="p-6 border-slate-200 shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">{med.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 pl-7">{med.brand}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-slate-900">${med.price.toFixed(2)}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('product-detail')}
                    >
                      Order Now
                    </Button>
                  </div>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  
                  {/* Daily Timing Pills */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Daily Timing (Morning - Noon - Night)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${med.scheduleVisual[0] ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        Morning ({med.scheduleVisual[0]})
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${med.scheduleVisual[1] ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        Noon ({med.scheduleVisual[1]})
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${med.scheduleVisual[2] ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        Night ({med.scheduleVisual[2]})
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block pt-1">{med.duration}</span>
                  </div>

                  {/* Food Instruction */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Administration Guideline
                    </span>
                    <p className="text-xs font-medium text-slate-800 flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      {med.instruction}
                    </p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Indication: {med.purpose}
                    </p>
                  </div>

                  {/* Safety & Interactions */}
                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      Safety & Food Precautions
                    </span>
                    <p className="text-xs text-amber-900 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      {med.interactions}
                    </p>
                  </div>

                </div>

              </Card>
            ))}
          </div>

          <div className="rounded-xl bg-slate-100 p-4 text-xs text-slate-500 text-center">
            MediTrust AI extraction is an assistive readout. Always double-check dosage instructions with the packaging label and your pharmacist.
          </div>

        </div>
      )}

    </div>
  );
}
