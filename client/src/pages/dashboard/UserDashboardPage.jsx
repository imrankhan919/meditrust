import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Calendar, 
  FlaskConical, 
  FileText, 
  Settings, 
  Camera, 
  Mail, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Download, 
  Bell, 
  KeyRound, 
  Save, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.user.getProfile()
// ==========================================

const MOCK_PROFILE = {
  patientId: 'PT-992014',
  fullName: 'Sarah Connor',
  email: 'sarah.connor@healthmail.com',
  phone: '+1 (555) 234-5678',
  dateOfBirth: '1988-06-14',
  gender: 'Female',
  bloodGroup: 'O Positive (O+)',
  emergencyContact: 'John Connor (Son) • +1 (555) 987-6543',
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  allergies: ['Penicillin (Mild rash)', 'Sulfa Drugs', 'Latex'],
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
};

const MOCK_PRESCRIPTIONS = [
  {
    id: 'RX-2026-88',
    doctor: 'Dr. Sarah Jenkins, MD (Cardiology)',
    date: 'Sep 22, 2026',
    diagnosis: 'Acute Bronchitis & Hypertension Review',
    medicines: 'Amoxicillin 500mg, Lipitor 20mg',
    fileName: 'Prescription_Sep22_2026.pdf',
  },
  {
    id: 'RX-2026-45',
    doctor: 'Dr. Marcus Vance, DO (Dermatology)',
    date: 'Aug 14, 2026',
    diagnosis: 'Contact Dermatitis & Eczema Flare',
    medicines: 'Cerave Barrier Cream, Cetirizine 10mg',
    fileName: 'Prescription_Aug14_2026.pdf',
  },
];

export default function UserDashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const TABS = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package, count: 4 },
    { id: 'appointments', label: 'Doctor Appointments', icon: Calendar, count: 2 },
    { id: 'lab', label: 'Lab Tests', icon: FlaskConical, count: 3 },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, count: 2 },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Profile Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar with edit badge */}
          <div className="relative group shrink-0">
            <img
              src={MOCK_PROFILE.avatar}
              alt={MOCK_PROFILE.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-400 p-1.5 rounded-xl text-white shadow-md transition-colors"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{MOCK_PROFILE.fullName}</h1>
              <Badge variant="success" size="sm" dot>
                Verified Patient
              </Badge>
              <span className="text-xs text-teal-200/80 font-mono bg-teal-950/60 px-2 py-0.5 rounded border border-teal-700/50">
                {MOCK_PROFILE.patientId}
              </span>
            </div>

            <p className="text-xs text-teal-100/90 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <span>{MOCK_PROFILE.email}</span>
              <span>•</span>
              <span>{MOCK_PROFILE.phone}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-white font-medium">
                Blood Group: <strong className="text-teal-300">{MOCK_PROFILE.bloodGroup}</strong>
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-white font-medium">
                Emergency: <strong className="text-teal-300">{MOCK_PROFILE.emergencyContact}</strong>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="w-full justify-start overflow-x-auto"
      />

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile information successfully updated in clinical vault (UI Simulation).</span>
          </div>
          <span className="font-semibold text-emerald-600">Saved</span>
        </div>
      )}

      {/* Tab 1: Profile Info Form */}
      {activeTab === 'profile' && (
        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Health Profile</h2>
              <p className="text-xs text-slate-500">Edit demographic and medical contact details</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleSave} icon={Save}>
              Save Changes
            </Button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={MOCK_PROFILE.fullName} icon={User} required />
              <Input label="Date of Birth" type="date" defaultValue={MOCK_PROFILE.dateOfBirth} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email Address" type="email" defaultValue={MOCK_PROFILE.email} icon={Mail} required />
              <Input label="Phone Number" type="tel" defaultValue={MOCK_PROFILE.phone} icon={Phone} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Blood Type" defaultValue={MOCK_PROFILE.bloodGroup} />
              <Input label="Emergency Contact (Name & Phone)" defaultValue={MOCK_PROFILE.emergencyContact} required />
            </div>

            <Input label="Default Delivery Address" defaultValue={MOCK_PROFILE.address} required />

            {/* Drug Allergies */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Known Drug Allergies & Clinical Alerts
              </label>
              <div className="flex flex-wrap gap-2">
                {MOCK_PROFILE.allergies.map((all, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    {all}
                  </span>
                ))}
                <button type="button" className="px-3 py-1 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs hover:border-slate-400">
                  + Add Allergy Tag
                </button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Orders Redirect */}
      {activeTab === 'orders' && (
        <Card className="p-8 text-center space-y-4">
          <Package className="w-12 h-12 text-teal-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Medicine Order Management</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You have active orders in transit. Manage doorstep deliveries and view invoices in the dedicated orders hub.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('orders')}>
            Open Full Orders View →
          </Button>
        </Card>
      )}

      {/* Tab 3: Appointments Redirect */}
      {activeTab === 'appointments' && (
        <Card className="p-8 text-center space-y-4">
          <Calendar className="w-12 h-12 text-teal-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Doctor Telehealth Consultations</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You have upcoming consultations with Dr. Sarah Jenkins. Launch video room or reschedule visits.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('my-appointments')}>
            Open Doctor Appointments View →
          </Button>
        </Card>
      )}

      {/* Tab 4: Lab Tests Redirect */}
      {activeTab === 'lab' && (
        <Card className="p-8 text-center space-y-4">
          <FlaskConical className="w-12 h-12 text-teal-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Diagnostic Laboratory Bookings</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Check sample collection status, track phlebotomist arrival, and download verified PDF reports.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('my-lab-appointments')}>
            Open Lab Appointments View →
          </Button>
        </Card>
      )}

      {/* Tab 5: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Verified Digital Prescriptions ({MOCK_PRESCRIPTIONS.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('ai-prescription')}
              icon={FileText}
            >
              Scan New Prescription with AI
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_PRESCRIPTIONS.map((rx) => (
              <Card key={rx.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">{rx.id}</span>
                      <span className="text-xs text-slate-400">• {rx.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{rx.doctor}</h4>
                    <p className="text-xs text-teal-700 font-medium">{rx.diagnosis}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Medications: {rx.medicines}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={Download}>
                    Download PDF
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => onNavigate('pharmacy')}>
                    Order Meds
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Settings */}
      {activeTab === 'settings' && (
        <Card className="p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Account Preferences & HIPAA Security
          </h3>
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Email & SMS Health Notifications</p>
                <p className="text-xs text-slate-400">Receive order dispatch updates and appointment links</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Export Medical History (HIPAA)</p>
                <p className="text-xs text-slate-400">Download complete diagnostic and prescription records archive</p>
              </div>
              <Button variant="outline" size="sm">Export Data</Button>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm" icon={KeyRound}>
                Change Account Password
              </Button>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
