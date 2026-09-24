import React, { useState } from 'react';
import { 
  FlaskConical, 
  Check, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Award, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STEPS = [
  { id: 1, name: 'Lab Info', desc: 'Facility & Director' },
  { id: 2, name: 'Accreditations', desc: 'NABL & CLIA Licenses' },
  { id: 3, name: 'Capabilities', desc: 'Equipment & Tests' },
  { id: 4, name: 'Certificates', desc: 'License Dropzone' },
];

export default function PathologistApplicationPage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <Badge variant="warning" size="sm">
          Diagnostic Partner Network
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Join MediTrust as an Accredited Pathology Partner
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Partner with our healthcare platform to fulfill home sample collections and process high-volume diagnostic checkup panels.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                type="button"
                className={`text-left p-2 rounded-xl transition-colors ${
                  isCurrent ? 'bg-amber-50/80 border border-amber-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-amber-600 text-white'
                        : isCurrent
                        ? 'bg-amber-600 text-white ring-2 ring-amber-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-amber-900' : 'text-slate-700'}`}>
                    {s.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pl-8 hidden sm:block">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <Card className="p-8 shadow-sm">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Lab Application Under Clinical Audit</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your diagnostic center registration has been submitted. Our pathology accreditation team will inspect submitted calibration data and schedule a facility audit within 3 business days.
            </p>
            <div className="pt-4">
              <Button variant="primary" size="md" onClick={() => onNavigate('landing')}>
                Back to Homepage
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 1: Diagnostic Facility & Laboratory Director Info
                </h3>
                <Input label="Registered Laboratory Name" defaultValue="Metro Diagnostic Pathology Labs Inc." icon={Building2} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Chief Pathologist / Medical Director" defaultValue="Dr. Kenneth Harris, MD, FACP" required />
                  <Input label="Director State Medical License" defaultValue="MD-PATH-99201" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Official Lab Email" type="email" defaultValue="compliance@metropathology.com" icon={Mail} required />
                  <Input label="Direct Facility Contact Phone" type="tel" defaultValue="+1 (555) 345-9011" icon={Phone} required />
                </div>
                <Input label="Physical Facility Address" defaultValue="1200 Science Park Drive, Suite 400, Boston, MA" icon={MapPin} />
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 2: Regulatory Accreditations & Quality Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="CLIA / NABL Certificate Number" defaultValue="NABL-MED-ISO-15189" required />
                  <Input label="Accreditation Expiry Date" defaultValue="2028-12-31" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="College of American Pathologists (CAP) ID" defaultValue="CAP-849102" />
                  <Input label="Daily Testing Processing Capacity" type="number" defaultValue="2500" required />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 3: Clinical Diagnostic Capabilities & Equipment
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Supported Diagnostic Disciplines
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Clinical Biochemistry', 'Hematology & Coagulation', 'Microbiology & Serology', 'Histopathology', 'Molecular Genetics & PCR', 'Immunoassays (ELISA/CLIA)'].map((dept, i) => (
                      <label key={i} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
                        <span>{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phlebotomist Home Collection Fleet Size
                  </label>
                  <Input defaultValue="24 certified full-time mobile phlebotomists" />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 4: Upload Accreditation Documents
                </h3>
                <p className="text-xs text-slate-500">
                  Upload current NABL/CLIA certificates, facility license, and calibration quality audit documents.
                </p>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-amber-300 rounded-2xl p-8 bg-amber-50/30 text-center hover:bg-amber-50/60 transition-colors cursor-pointer space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag & Drop lab certificates here, or <span className="text-amber-700 underline">Browse Files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, ZIP up to 50MB</p>
                  </div>
                </div>

                {/* File list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-slate-800">NABL_ISO15189_Accreditation_Certificate.pdf</span>
                      <span className="text-slate-400">(4.2 MB)</span>
                    </div>
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-slate-800">Clinical_Pathology_Facility_License_2026.pdf</span>
                      <span className="text-slate-400">(3.1 MB)</span>
                    </div>
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  icon={ArrowLeft}
                >
                  Previous Step
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Continue to Step {currentStep + 1}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsSubmitted(true)}
                  icon={ShieldCheck}
                >
                  Submit Laboratory for Audit
                </Button>
              )}
            </div>

          </form>
        )}
      </Card>

    </div>
  );
}
