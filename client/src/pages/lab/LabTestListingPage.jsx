import React, { useState } from 'react';
import {
  Search,
  FlaskConical,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Home,
  Building2,
  ArrowRight,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import medicalService from '../../services/medicalService';
import Loader from '../../components/common/Loader';

const MOCK_CATEGORIES = [
  'All Lab Tests',
  'Full Body Checkups',
  'Diabetes & Sugar',
  'Thyroid Profile',
  'Lipid & Heart Health',
  'Liver & Renal Function',
  'Vitamin Deficiencies',
  'Infectious Disease',
];


export default function LabTestListingPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Lab Tests');

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

      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="bg-amber-400/20 text-amber-300 border-amber-400/30">
              NABL & CAP Certified Laboratories
            </Badge>
            <Badge variant="info" size="sm" className="bg-teal-400/20 text-teal-300 border-teal-400/30">
              Free Home Sample Pickup
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Diagnostic Lab Tests & Health Checkups
          </h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Certified phlebotomist arrives at your home. 100% sterile sample collection with verified digital reports delivered straight to your dashboard.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('pathologist-apply')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              Are you an accredited laboratory? Join MediTrust Network →
            </Button>
          </div>
        </div>
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
          <FlaskConical className="w-56 h-56 text-teal-200" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lab test by name, parameter, or disease profile..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
        <Button variant="primary" size="md" className="w-full md:w-auto">
          Search Tests
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {MOCK_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lab Tests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Diagnostic Tests ({data.tests.length})
          </span>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Home sample collection available across 150+ postal codes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.tests.map((test) => (
            <Card key={test._id} hoverEffect className="p-6 flex flex-col justify-between h-full">
              <div>

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="info" size="sm">
                    {test.title}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {test.description}
                </p>


              </div>

              {/* Pricing & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>

                  <span className="text-xl font-black text-slate-900">${test.price.toFixed(2)}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('lab-booking')}
                  icon={FlaskConical}
                >
                  Book Test
                </Button>
              </div>

            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
