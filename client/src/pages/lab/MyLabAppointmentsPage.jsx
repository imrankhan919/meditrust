import React, { useState } from 'react';
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  User, 
  ArrowRight 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.labTests.getPatientBookings()
// ==========================================

const MOCK_LAB_BOOKINGS = [
  {
    id: 'LAB-59201',
    testName: 'Comprehensive Full Body Platinum Checkup',
    parametersCount: 84,
    date: 'Tomorrow, Sep 24, 2026',
    time: '07:45 AM - 08:15 AM',
    mode: 'Home Sample Pickup',
    status: 'Scheduled',
    statusVariant: 'info',
    address: '742 Evergreen Terrace, Springfield, OR',
    phlebotomist: 'Marcus Sterling (Certified Phlebotomist • ID #PB-8841)',
    price: 65.00,
    reportReady: false,
    fastingRequired: 'Requires 10h overnight fasting',
  },
  {
    id: 'LAB-58102',
    testName: 'Advanced HbA1c & Fasting Blood Sugar Profile',
    parametersCount: 4,
    date: 'Sep 05, 2026',
    time: '08:00 AM',
    mode: 'Home Sample Pickup',
    status: 'Report Ready',
    statusVariant: 'success',
    address: '742 Evergreen Terrace, Springfield, OR',
    phlebotomist: 'Elena Cruz, CPT',
    price: 22.00,
    reportReady: true,
    reportFileName: 'HbA1c_Report_Sep2026.pdf',
    fastingRequired: 'Completed',
  },
  {
    id: 'LAB-56940',
    testName: 'Complete Thyroid Hormone Panel (T3, T4, TSH)',
    parametersCount: 3,
    date: 'Aug 12, 2026',
    time: '09:30 AM',
    mode: 'Diagnostic Center Visit',
    status: 'Report Ready',
    statusVariant: 'success',
    address: 'MediTrust Central Pathology Lab, Suite 200',
    phlebotomist: 'Central Lab Diagnostic Team',
    price: 25.00,
    reportReady: true,
    reportFileName: 'Thyroid_Panel_Aug2026.pdf',
    fastingRequired: 'Completed',
  },
];

export default function MyLabAppointmentsPage({ onNavigate }) {
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleDownload = (fileName) => {
    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="warning" size="sm" className="mb-1">
            Diagnostic Health History
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Lab Test Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track phlebotomist sample collections and download verified pathology reports.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('lab')}
          icon={FlaskConical}
        >
          Book Another Test
        </Button>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mock download initiated for <strong>{downloadSuccess}</strong> (UI Simulation).</span>
          </div>
          <span className="font-semibold text-emerald-600">Complete</span>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-6">
        {MOCK_LAB_BOOKINGS.map((booking) => (
          <Card key={booking.id} className="p-6 border-slate-200 shadow-xs space-y-5">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-400 font-mono">{booking.id}</span>
                  <Badge variant={booking.statusVariant} size="sm" dot>
                    {booking.status}
                  </Badge>
                  <span className="text-xs text-slate-600 font-medium">
                    {booking.mode}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                  {booking.testName}
                </h3>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">
                  {booking.parametersCount} Biomarkers Included
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Total Package Fee</span>
                <span className="text-lg font-black text-slate-900">${booking.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Appointment Date</span>
                  <span>{booking.date}</span>
                  <span className="block text-slate-400">{booking.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Sample Collector</span>
                  <span>{booking.phlebotomist}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Collection Location</span>
                  <span>{booking.address}</span>
                </div>
              </div>
            </div>

            {/* Preparation / Fasting note */}
            {booking.status === 'Scheduled' && (
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Important Fasting Reminder:</strong> {booking.fastingRequired}</span>
                </div>
                <Badge variant="warning" size="sm">Fasting</Badge>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NABL & ISO 15189 Quality Assured</span>
              </div>

              <div className="flex items-center gap-2">
                {booking.reportReady ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownload(booking.reportFileName)}
                    className="shadow-xs"
                  >
                    Download Digital Report (PDF)
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Report will generate within 24h of sample draw
                  </span>
                )}
              </div>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
