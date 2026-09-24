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

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.labTests.getAll({ category, search })
// ==========================================

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

const MOCK_LAB_TESTS = [
  {
    id: 'test-1',
    name: 'Comprehensive Full Body Platinum Checkup',
    category: 'Full Body Checkups',
    parametersCount: 84,
    price: 65.00,
    originalPrice: 120.00,
    discount: '46% OFF',
    sampleType: 'Blood & Urine',
    fastingRequired: '10-12 hours overnight fasting mandatory',
    turnaround: 'Digital Report in 24 Hours',
    homeCollection: true,
    desc: 'Complete metabolic panel including Complete Blood Count (CBC), Lipid Profile, Liver & Kidney tests, HbA1c, Vitamin D3/B12, and Thyroid screen.',
  },
  {
    id: 'test-2',
    name: 'Advanced HbA1c & Fasting Blood Sugar Profile',
    category: 'Diabetes & Sugar',
    parametersCount: 4,
    price: 22.00,
    originalPrice: 35.00,
    discount: '37% OFF',
    sampleType: 'Blood (Plasma)',
    fastingRequired: '8-10 hours fasting required',
    turnaround: 'Same-day Report (6 Hours)',
    homeCollection: true,
    desc: 'Evaluates your 3-month average blood glucose control and detects prediabetes or insulin resistance.',
  },
  {
    id: 'test-3',
    name: 'Complete Thyroid Hormone Panel (T3, T4, TSH)',
    category: 'Thyroid Profile',
    parametersCount: 3,
    price: 25.00,
    originalPrice: 40.00,
    discount: '38% OFF',
    sampleType: 'Blood (Serum)',
    fastingRequired: 'No fasting required. Morning sample advised',
    turnaround: 'Digital Report in 12 Hours',
    homeCollection: true,
    desc: 'Accurately diagnoses hypothyroidism, hyperthyroidism, unexplained fatigue, and metabolic fluctuations.',
  },
  {
    id: 'test-4',
    name: 'Cardiac Risk & Lipid Profile Plus',
    category: 'Lipid & Heart Health',
    parametersCount: 12,
    price: 34.00,
    originalPrice: 50.00,
    discount: '32% OFF',
    sampleType: 'Blood (Serum)',
    fastingRequired: '12 hours strict fasting (water permitted)',
    turnaround: 'Digital Report in 18 Hours',
    homeCollection: true,
    desc: 'Measures Total Cholesterol, Triglycerides, HDL, LDL, VLDL, and high-sensitivity C-Reactive Protein (hs-CRP).',
  },
  {
    id: 'test-5',
    name: 'Renal (Kidney) & Liver Function Combined (KFT + LFT)',
    category: 'Liver & Renal Function',
    parametersCount: 22,
    price: 38.00,
    originalPrice: 58.00,
    discount: '34% OFF',
    sampleType: 'Blood (Serum)',
    fastingRequired: '8 hours fasting recommended',
    turnaround: 'Digital Report in 24 Hours',
    homeCollection: true,
    desc: 'Checks Creatinine, Urea, Bilirubin, SGOT, SGPT, Alkaline Phosphatase, and Albumin/Globulin ratio.',
  },
  {
    id: 'test-6',
    name: 'Vitamin D (25-OH) & Vitamin B12 Duo',
    category: 'Vitamin Deficiencies',
    parametersCount: 2,
    price: 32.00,
    originalPrice: 48.00,
    discount: '33% OFF',
    sampleType: 'Blood (Serum)',
    fastingRequired: 'No fasting required',
    turnaround: 'Digital Report in 24 Hours',
    homeCollection: true,
    desc: 'Diagnoses bone weakness, chronic fatigue, muscle pain, tingling, and neuropathy deficiencies.',
  },
];

export default function LabTestListingPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Lab Tests');

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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
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
            Available Diagnostic Tests ({MOCK_LAB_TESTS.length})
          </span>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Home sample collection available across 150+ postal codes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LAB_TESTS.map((test) => (
            <Card key={test.id} hoverEffect className="p-6 flex flex-col justify-between h-full">
              <div>
                
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="info" size="sm">
                    {test.category}
                  </Badge>
                  <span className="bg-teal-50 text-teal-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-teal-200/80">
                    {test.parametersCount} Parameters
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {test.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {test.desc}
                </p>

                {/* Test details highlights */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Turnaround: <strong className="text-slate-800">{test.turnaround}</strong></span>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-600">{test.fastingRequired}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-600">Sample: {test.sampleType}</span>
                  </div>
                </div>

              </div>

              {/* Pricing & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 line-through">${test.originalPrice.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {test.discount}
                    </span>
                  </div>
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
