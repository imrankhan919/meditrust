import React, { useState } from 'react';
import { 
  FlaskConical, 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Phone, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.labTests.bookTest(bookingPayload)
// ==========================================

const MOCK_TEST = {
  id: 'test-1',
  name: 'Comprehensive Full Body Platinum Checkup',
  category: 'Full Body Preventive Panel',
  parametersCount: 84,
  price: 65.00,
  originalPrice: 120.00,
  sampleCollectionFee: 0.00, // FREE
  fastingNote: 'Requires 10-12 hours overnight fasting. Drink water only.',
  reportTurnaround: 'Within 24 Hours via MediTrust Dashboard & PDF Email',
};

const MOCK_TIME_SLOTS = [
  '07:00 AM - 07:30 AM',
  '07:45 AM - 08:15 AM',
  '08:30 AM - 09:00 AM',
  '09:15 AM - 09:45 AM',
  '10:00 AM - 10:30 AM',
  '11:00 AM - 11:30 AM',
];

export default function BookLabTestPage({ onNavigate }) {
  const [collectionMode, setCollectionMode] = useState('home'); // 'home' | 'center'
  const [selectedSlot, setSelectedSlot] = useState('07:45 AM - 08:15 AM');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Sep 24');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('landing')} className="hover:text-teal-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('lab')} className="hover:text-teal-600">Lab Tests</button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate">Schedule Test</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Test Header Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="info" size="sm" className="mb-2">
                  {MOCK_TEST.category}
                </Badge>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {MOCK_TEST.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Covers {MOCK_TEST.parametersCount} key biomarkers across liver, kidney, thyroid, heart, and metabolic health.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-teal-700">${MOCK_TEST.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through block">${MOCK_TEST.originalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 rounded-xl bg-amber-50/60 p-3.5 border border-amber-200/70 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Preparation Guideline: </span>
                {MOCK_TEST.fastingNote}
              </div>
            </div>
          </Card>

          {/* Home vs Center Toggle */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              1. Choose Sample Collection Mode
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCollectionMode('home')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  collectionMode === 'home'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${collectionMode === 'home' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Home Sample Pickup</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Certified phlebotomist arrives with sterile vacuum tubes at your doorstep.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCollectionMode('center')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  collectionMode === 'center'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${collectionMode === 'center' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Visit Diagnostic Lab</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Walk into our nearest NABL accredited center with priority skip-the-line check-in.
                  </p>
                </div>
              </button>
            </div>
          </Card>

          {/* Date & Time Slot Picker */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              2. Select Collection Date & Morning Slot
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {['Tomorrow, Sep 24', 'Thu, Sep 25', 'Fri, Sep 26'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  type="button"
                  className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedDate === d
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">Fasting Morning Slots:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {MOCK_TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      type="button"
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-50 text-teal-800 border-teal-600 font-bold ring-1 ring-teal-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Address Form (Shown for Home Collection) */}
          {collectionMode === 'home' && (
            <Card className="p-6 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                3. Sample Collection Address
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  defaultValue="742 Evergreen Terrace"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Apt / Suite" defaultValue="Apt 4B" />
                  <Input label="City" defaultValue="Springfield" required />
                  <Input label="Postal Code" defaultValue="97477" required />
                </div>
                <Input
                  label="Contact Phone for Phlebotomist"
                  type="tel"
                  defaultValue="+1 (555) 234-5678"
                  icon={Phone}
                  required
                />
              </div>
            </Card>
          )}

        </div>

        {/* Right: Booking Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 sticky top-24 border-teal-200/90 shadow-lg space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Lab Booking Summary</h3>
              <p className="text-xs text-slate-500">Accredited diagnostic report delivery</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Selected Test:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[180px] truncate">{MOCK_TEST.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Collection:</span>
                <Badge variant={collectionMode === 'home' ? 'success' : 'neutral'} size="sm">
                  {collectionMode === 'home' ? 'Home Collection' : 'Lab Center'}
                </Badge>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Scheduled:</span>
                <span className="font-bold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Slot:</span>
                <span className="font-semibold text-teal-700">{selectedSlot}</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-b border-slate-100 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Test Package Price</span>
                <span>${MOCK_TEST.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Home Phlebotomist Visit</span>
                <span className="text-emerald-600 font-bold">FREE ($0.00)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Amount</span>
                <span className="text-teal-700 text-base">${MOCK_TEST.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md shadow-teal-600/25"
              onClick={() => onNavigate('my-lab-appointments')}
            >
              Confirm Lab Booking
            </Button>

            <div className="space-y-2 text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NABL ISO 15189 Certified Pathology</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Reports digitally synced to profile in 24h</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
