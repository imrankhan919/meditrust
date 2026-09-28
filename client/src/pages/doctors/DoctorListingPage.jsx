import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Building2,
  Award,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import medicalService from '../../services/medicalService';
import Loader from '../../components/common/Loader';


const MOCK_SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'General Physician',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Gynecology',
];


export default function DoctorListingPage({ onNavigate }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');


  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ['items'], queryFn: medicalService.fetchData })



  if (isLoading) {
    return (
      <Loader />
    )
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <Badge variant="info" size="sm" className="bg-white/20 text-white border-white/30">
            Certified Telehealth & In-Person Care
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Consult Top Medical Specialists
          </h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Connect with verified board-certified physicians for immediate video visits or in-person clinic appointments.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('doctor-apply')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              Are you a licensed doctor? Join Our Network →
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name, clinical condition, or hospital..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="relative w-full md:w-64">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="City or State (e.g. New York)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <Button variant="primary" size="md" className="w-full md:w-auto">
          Search Doctors
        </Button>
      </div>

      {/* Specialty Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {MOCK_SPECIALTIES.map((spec) => {
          const isActive = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {/* Doctors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Specialists ({data.doctors.length})
          </span>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Doctors Ready Now
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.doctors.map((doc) => (
            <Card key={doc._id} hoverEffect className="p-5 flex flex-col justify-between h-full">
              <div>

                {/* Doctor Photo & Header */}
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <Badge variant="info" size="sm">
                        {doc.specialization}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-1 truncate">
                      {doc.user.name}
                    </h3>
                    <p className="text-xs text-slate-500">{doc.experience} Years</p>
                  </div>
                </div>

                {/* Hospital & Credentials */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.clinicName}</span>
                  </div>
                </div>

                {/* Slot Badge */}
                <div className="mt-3 py-2 px-3 rounded-xl bg-teal-50/70 border border-teal-100 text-xs flex items-center justify-between text-teal-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Next Slot:
                  </span>
                  <strong className="font-bold">{doc.workingHours.start} - {doc.workingHours.end}</strong>
                </div>

              </div>

              {/* Fee & Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Consult Fee</span>
                  <span className="text-lg font-black text-slate-900">{doc.consultationFee}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('doctor-booking')}
                  icon={Calendar}
                >
                  Book Appointment
                </Button>
              </div>

            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
