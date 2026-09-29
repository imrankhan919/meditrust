import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import authService from '../../services/authService';
import Loader from '../../components/common/Loader';
import { getProfile } from '../../features/auth/authSlice';
import toast from "react-hot-toast"
import ProfileForm from '../../components/ProfileForm';


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

  const { user } = useSelector(state => state.auth)

  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ['user', user.token], queryFn: (token) => authService.getMyProfile(token) })

  const navigate = useNavigate()
  const dispatch = useDispatch()


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


  useEffect(() => {

    if (data && isSuccess) {
      dispatch(getProfile(data))
    }

    if (isError && error) {
      toast.error(error.response.data.message)
    }

    if (!user) {
      navigate("/login")
    }


  }, [data, isError, error, isSuccess])





  if (isLoading) {
    return <Loader />
  }


  if (isError) {
    return (
      <div className="h-screen">
        <h1 className="text-center">{error.message || "Something Went Wrong!!"}</h1>
      </div>
    )
  }




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Patient Profile Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">

          {/* Avatar with edit badge */}
          <div className="relative group shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
              alt={user.name}
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
              <h1 className="text-2xl font-extrabold tracking-tight">{user.name}</h1>
              <Badge variant="success" size="sm" dot>
                {user.userType}
              </Badge>
              <span className="text-xs text-teal-200/80 font-mono bg-teal-950/60 px-2 py-0.5 rounded border border-teal-700/50">
                {user._id}
              </span>
            </div>

            <p className="text-xs text-teal-100/90 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
            </p>
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

        user.address && <ProfileForm user={user} />

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
