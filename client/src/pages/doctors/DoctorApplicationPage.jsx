import React, { useState } from 'react';
import { 
  Stethoscope, 
  Check, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Award, 
  Building, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STEPS = [
  { id: 1, name: 'Personal Info', desc: 'Identity & Contacts' },
  { id: 2, name: 'License & Board', desc: 'State Medical Board' },
  { id: 3, name: 'Clinical Specialty', desc: 'Practice & Experience' },
  { id: 4, name: 'Verification Files', desc: 'Credential Dropzone' },
];

export default function DoctorApplicationPage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <Badge variant="info" size="sm">
          Physician Enrollment Portal
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Join MediTrust as a Verified Doctor
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Offer virtual telehealth consultations, manage your patient records securely, and expand your clinical practice.
        </p>
      </div>

      {/* Step Progress Indicator */}
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
                  isCurrent ? 'bg-teal-50/80 border border-teal-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-teal-600 text-white'
                        : isCurrent
                        ? 'bg-teal-600 text-white ring-2 ring-teal-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-700'}`}>
                    {s.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pl-8 hidden sm:block">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Form Content */}
      <Card className="p-8 shadow-sm">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted for Credentialing</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Thank you for applying to the MediTrust Clinical Network. Our medical verification board will review your license and credentials within 24 to 48 hours.
            </p>
            <div className="pt-4">
              <Button variant="primary" size="md" onClick={() => onNavigate('landing')}>
                Return to Homepage
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 1: Personal & Legal Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue="Alexander" required />
                  <Input label="Last Name" defaultValue="Wright" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Professional Email" type="email" defaultValue="dr.wright@mountsinai.org" icon={Mail} required />
                  <Input label="Direct Mobile Phone" type="tel" defaultValue="+1 (555) 782-9012" icon={Phone} required />
                </div>
                <Input label="Clinic or Hospital Affiliation" defaultValue="Mount Sinai Health System, New York" icon={Building} />
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 2: State Medical Board & Licensure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Medical License Number" defaultValue="NY-MED-849102-X" required />
                  <Input label="Licensing State" defaultValue="New York" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="National Provider Identifier (NPI)" defaultValue="1892019482" required />
                  <Input label="DEA Registration Number" defaultValue="AW-9812903" />
                </div>
                <Input label="Medical School of Graduation" defaultValue="Columbia University Vagelos College of Physicians" />
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 3: Clinical Specialization & Experience
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Medical Specialty *
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500">
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Pediatrics</option>
                    <option>General Medicine</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Years of Active Clinical Practice" type="number" defaultValue="12" required />
                  <Input label="Standard Telehealth Consultation Fee ($)" type="number" defaultValue="95" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Professional Bio (Shown to Patients)
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Board-certified specialist dedicated to patient-centered evidence-based clinical care."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Step 4: Upload Credential Documents
                </h3>
                <p className="text-xs text-slate-500">
                  Please upload high-resolution PDF or JPG scans of your state medical license and board certifications.
                </p>

                {/* Dropzone visual */}
                <div className="border-2 border-dashed border-teal-300 rounded-2xl p-8 bg-teal-50/30 text-center hover:bg-teal-50/60 transition-colors cursor-pointer space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag & Drop credentials here, or <span className="text-teal-600 underline">Browse Files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG up to 25MB</p>
                  </div>
                </div>

                {/* Uploaded mock files list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800">State_Medical_License_2026.pdf</span>
                      <span className="text-slate-400">(2.4 MB)</span>
                    </div>
                    <Badge variant="success" size="sm">Ready to submit</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800">Board_Certification_Cardiology.pdf</span>
                      <span className="text-slate-400">(1.8 MB)</span>
                    </div>
                    <Badge variant="success" size="sm">Ready to submit</Badge>
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
                  Submit Application for Verification
                </Button>
              )}
            </div>

          </form>
        )}
      </Card>

    </div>
  );
}
