import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  FileText, 
  RotateCw, 
  XCircle, 
  ShieldCheck, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.appointments.getPatientAppointments()
// ==========================================

const MOCK_APPOINTMENTS = [
  {
    id: 'APT-1082',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialty: 'Cardiologist',
    hospital: 'Mount Sinai Heart Center',
    date: 'Today, Sep 23, 2026',
    time: '03:30 PM - 04:00 PM',
    status: 'Upcoming',
    statusVariant: 'info',
    mode: 'Video Call',
    meetingLinkAvailable: true,
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    fee: '$95.00',
  },
  {
    id: 'APT-1049',
    doctorName: 'Dr. Marcus Vance, DO',
    specialty: 'Dermatologist',
    hospital: 'Boston Skin & Laser Pavilion',
    date: 'Sep 10, 2026',
    time: '11:00 AM - 11:30 AM',
    status: 'Completed',
    statusVariant: 'success',
    mode: 'In-Clinic',
    meetingLinkAvailable: false,
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    fee: '$85.00',
    prescriptionAvailable: true,
  },
  {
    id: 'APT-0994',
    doctorName: 'Dr. Elena Rostova, MD',
    specialty: 'Pediatrics',
    hospital: "Children's Health Pavilion",
    date: 'Aug 18, 2026',
    time: '04:00 PM - 04:30 PM',
    status: 'Completed',
    statusVariant: 'success',
    mode: 'Video Call',
    meetingLinkAvailable: false,
    doctorImage: 'https://images.unsplash.com/photo-1594824813576-9694c979d50a?auto=format&fit=crop&q=80&w=200',
    fee: '$90.00',
    prescriptionAvailable: true,
  },
  {
    id: 'APT-0881',
    doctorName: 'Dr. David Kim, MD',
    specialty: 'Neurologist',
    hospital: 'Metropolitan Brain Institute',
    date: 'Jul 29, 2026',
    time: '02:00 PM - 02:30 PM',
    status: 'Cancelled',
    statusVariant: 'danger',
    mode: 'In-Clinic',
    meetingLinkAvailable: false,
    doctorImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    fee: '$110.00',
  },
];

const TABS = ['All Appointments', 'Upcoming', 'Completed', 'Cancelled'];

export default function MyAppointmentsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('All Appointments');

  const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
    if (activeTab === 'All Appointments') return true;
    return apt.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="info" size="sm" className="mb-1">
            Clinical Care Timeline
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Doctor Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View scheduled consultations, launch telehealth video rooms, and retrieve digital prescriptions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('doctors')}
          icon={Calendar}
        >
          Book New Consultation
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto border-dashed border-2">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Appointments</h3>
            <p className="text-xs text-slate-500 mt-1">You have no records in this appointment view.</p>
          </Card>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="p-6 border-slate-200 shadow-xs space-y-5">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Doctor Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">{apt.id}</span>
                      <Badge variant={apt.statusVariant} size="sm" dot>
                        {apt.status}
                      </Badge>
                      <Badge variant={apt.mode === 'Video Call' ? 'purple' : 'neutral'} size="sm">
                        {apt.mode}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-1">{apt.doctorName}</h3>
                    <p className="text-xs font-semibold text-teal-700">{apt.specialty}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{apt.hospital}</p>
                  </div>
                </div>

                {/* Date & Time Highlight Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{apt.date}</span>
                    <span className="text-xs text-slate-500">{apt.time}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  Consultation Fee: <strong className="text-slate-800">{apt.fee}</strong>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {apt.meetingLinkAvailable && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Video}
                      className="shadow-sm shadow-teal-600/20"
                    >
                      Join Video Call Room
                    </Button>
                  )}

                  {apt.prescriptionAvailable && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileText}
                      onClick={() => onNavigate('pharmacy')}
                    >
                      View & Order Prescribed Meds
                    </Button>
                  )}

                  {apt.status === 'Upcoming' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={RotateCw}
                        onClick={() => onNavigate('doctor-booking')}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        icon={XCircle}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

            </Card>
          ))
        )}
      </div>

    </div>
  );
}
