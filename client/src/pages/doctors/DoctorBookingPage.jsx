import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Award, 
  GraduationCap, 
  FileCheck, 
  CheckCircle2, 
  User, 
  AlertCircle,
  Phone,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.doctors.getSchedule(doctorId)
// ==========================================

const MOCK_DOCTOR = {
  id: 'doc-1',
  name: 'Dr. Sarah Jenkins, MD, FACC',
  title: 'Senior Consultant Cardiologist & Cardiac Electrophysiologist',
  specialty: 'Cardiovascular Medicine',
  experience: '14+ Years Clinical Practice',
  hospital: 'Mount Sinai Heart Center • New York, NY',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  rating: 4.9,
  reviewsCount: 382,
  fee: 95.00,
  platformFee: 5.00,
  bio: 'Dr. Sarah Jenkins is an internationally recognized cardiologist specializing in preventative cardiovascular health, hypertension management, heart arrhythmias, and advanced coronary diagnostic interpretation. She completed her cardiology fellowship at Johns Hopkins and serves as adjunct faculty at Mount Sinai.',
  education: [
    'MD, Magna Cum Laude - Harvard Medical School',
    'Residency in Internal Medicine - Massachusetts General Hospital',
    'Fellowship in Cardiovascular Disease - Johns Hopkins Hospital',
    'Fellow of the American College of Cardiology (FACC)',
  ],
  reviews: [
    {
      author: 'David Henderson',
      date: '2 weeks ago',
      rating: 5,
      comment: 'Dr. Jenkins took 30 minutes to review my full ECG history and explained everything in clear, reassuring terms. Highly recommend her tele-consultation.',
    },
    {
      author: 'Maria Vasquez',
      date: '1 month ago',
      rating: 5,
      comment: 'Thorough, attentive, and very knowledgeable. She adjusted my medication and my blood pressure has returned to normal levels.',
    },
  ],
};

const MOCK_DAYS = [
  { day: 'Today', date: 'Sep 23', slotsCount: 4 },
  { day: 'Tomorrow', date: 'Sep 24', slotsCount: 7 },
  { day: 'Thu', date: 'Sep 25', slotsCount: 6 },
  { day: 'Fri', date: 'Sep 26', slotsCount: 5 },
  { day: 'Sat', date: 'Sep 27', slotsCount: 3 },
];

const MOCK_SLOTS = {
  morning: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM'],
  afternoon: ['02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'],
  evening: ['05:30 PM', '06:15 PM'],
};

export default function DoctorBookingPage({ onNavigate }) {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('03:30 PM');
  const [consultMode, setConsultMode] = useState('video'); // 'video' | 'clinic'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('landing')} className="hover:text-teal-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('doctors')} className="hover:text-teal-600">Doctors</button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate">Book Appointment</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Doctor Profile & Interactive Slot Chooser */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Doctor Overview Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200">
                <img src={MOCK_DOCTOR.image} alt={MOCK_DOCTOR.name} className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-1.5 right-1.5 bg-teal-600 text-white p-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info" size="sm">
                    {MOCK_DOCTOR.specialty}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {MOCK_DOCTOR.rating} ({MOCK_DOCTOR.reviewsCount} reviews)
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900">{MOCK_DOCTOR.name}</h1>
                <p className="text-xs font-medium text-teal-700">{MOCK_DOCTOR.title}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {MOCK_DOCTOR.hospital}
                </p>
                <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                  {MOCK_DOCTOR.bio}
                </p>
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Medical Qualifications & Accreditations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {MOCK_DOCTOR.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <span>{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Consultation Mode Picker */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Select Consultation Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConsultMode('video')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  consultMode === 'video'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${consultMode === 'video' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">HD Video Consultation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Secure HIPAA encrypted tele-call from any device. Digital Rx provided.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultMode('clinic')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  consultMode === 'clinic'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${consultMode === 'clinic' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">In-Person Clinic Visit</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Visit Mount Sinai Heart Pavilion with dedicated priority token.</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Date Picker Strip */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Select Appointment Date
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose your preferred day for the doctor's calendar.</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {MOCK_DAYS.map((d) => {
                const isSelected = selectedDay === d.day;
                return (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    type="button"
                    className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-medium uppercase opacity-90">{d.day}</span>
                    <span className="block text-sm sm:text-base font-bold my-0.5">{d.date}</span>
                    <span className={`block text-[10px] ${isSelected ? 'text-teal-100' : 'text-teal-600 font-semibold'}`}>
                      {d.slotsCount} slots
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Available Time Slots
              </h4>

              {/* Morning */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">Morning Slots</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MOCK_SLOTS.morning.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        type="button"
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">Afternoon Slots</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MOCK_SLOTS.afternoon.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        type="button"
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">Evening Slots</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MOCK_SLOTS.evening.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        type="button"
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Patient Reviews Section */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Verified Patient Experiences ({MOCK_DOCTOR.reviewsCount})
            </h3>
            <div className="space-y-4">
              {MOCK_DOCTOR.reviews.map((rev, i) => (
                <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right 4 Cols: Dedicated Booking Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 sticky top-24 border-teal-200/90 shadow-lg space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Appointment Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">Please review your consultation details</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-semibold text-slate-800 text-right">{MOCK_DOCTOR.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Specialty:</span>
                <span className="font-semibold text-teal-700">{MOCK_DOCTOR.specialty}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Mode:</span>
                <Badge variant={consultMode === 'video' ? 'info' : 'neutral'} size="sm">
                  {consultMode === 'video' ? 'Video Consult' : 'Clinic Visit'}
                </Badge>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-900">{selectedDay} at {selectedSlot}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-b border-slate-100 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Doctor Consultation Fee</span>
                <span>${MOCK_DOCTOR.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Service & Telehealth Fee</span>
                <span>${MOCK_DOCTOR.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Payable</span>
                <span className="text-teal-700 text-base">${(MOCK_DOCTOR.fee + MOCK_DOCTOR.platformFee).toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md shadow-teal-600/25"
              onClick={() => onNavigate('my-appointments')}
            >
              Confirm & Book Appointment
            </Button>

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-teal-600" />
                Free Rescheduling Policy
              </div>
              <p>Reschedule anytime up to 2 hours before the appointment with zero cancellation penalty.</p>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
