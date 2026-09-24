import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Activity, 
  AlertCircle, 
  Pill, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Star 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.ai.findMedicinesBySymptom(query)
// ==========================================

const POPULAR_SYMPTOMS = [
  'Acid Reflux & Heartburn',
  'Seasonal Allergies & Sneezing',
  'Mild Tension Headache',
  'Chest Congestion & Cough',
  'Joint Pain & Muscle Soreness',
];

const MOCK_AI_ANALYSIS = {
  symptomQuery: 'Acid Reflux & Heartburn after meals',
  clinicalAssessment: 'Symptoms are consistent with gastroesophageal reflux (GERD) or mild gastric hyperacidity. Over-the-counter H2-blockers or Proton Pump Inhibitors (PPIs) are common first-line remedies alongside dietary adjustments.',
  lifestyleAdvice: 'Avoid laying down within 2 hours of eating, reduce coffee and spicy foods, and elevate the head during sleep.',
  redFlags: 'Seek immediate medical attention if you experience difficulty swallowing, radiating chest pressure, or unexplained weight loss.',
  suggestedMedicines: [
    {
      id: 'prod-7',
      name: 'Omeprazole 20mg Delayed-Release',
      brand: 'AstraZeneca Health',
      category: 'Proton Pump Inhibitor (PPI)',
      indication: 'Deactivates acid-pumping cells for 24h relief',
      price: 15.40,
      originalPrice: 20.00,
      discount: '23% OFF',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?auto=format&fit=crop&q=80&w=300',
      fastActing: false,
      dailyDose: '1 tablet in the morning before breakfast',
    },
    {
      id: 'prod-9',
      name: 'Famotidine Maximum Strength 20mg',
      brand: 'Johnson & Johnson Consumer',
      category: 'H2-Receptor Blocker',
      indication: 'Fast relief within 15-30 minutes of heartburn onset',
      price: 12.80,
      originalPrice: 16.00,
      discount: '20% OFF',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
      fastActing: true,
      dailyDose: 'Take 1 tablet with water as needed',
    },
  ],
};

export default function FindMedicinesBySymptomPage({ onNavigate }) {
  const [query, setQuery] = useState('Acid Reflux & Heartburn');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="purple" size="sm">
          Symptom-to-Medicine Matching
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Safe OTC Medicines by Symptom
        </h1>
        <p className="text-sm text-slate-600">
          Describe your discomfort or select a common symptom. Our clinical engine suggests safe over-the-counter relief options and highlights red-flag warning signs.
        </p>
      </div>

      {/* Symptom Search Bar */}
      <Card className="p-6 border-indigo-200/80 shadow-md space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-indigo-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe symptoms, e.g. 'burning throat after dinner', 'stuffy nose and itchy eyes'..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Popular chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-500">Popular Queries:</span>
          {POPULAR_SYMPTOMS.map((sym, i) => (
            <button
              key={i}
              onClick={() => setQuery(sym)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                query === sym
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-medium'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </Card>

      {/* AI Clinical Reasoning Result */}
      <div className="space-y-6">
        
        {/* Diagnostic Assessment Card */}
        <Card className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base">MediTrust AI Clinical Analysis</h3>
            </div>
            <Badge variant="purple" size="sm" className="bg-indigo-500/30 text-indigo-200 border-indigo-400/40">
              Matched for: {query}
            </Badge>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {MOCK_AI_ANALYSIS.clinicalAssessment}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="font-bold text-teal-300 block mb-1">Non-Pharmacological Guidance:</span>
              <p className="text-slate-300">{MOCK_AI_ANALYSIS.lifestyleAdvice}</p>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">When to Seek Immediate Care:</span>
              <p className="text-amber-200/90">{MOCK_AI_ANALYSIS.redFlags}</p>
            </div>
          </div>
        </Card>

        {/* Suggested Medicines Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Clinically Recommended OTC Options ({MOCK_AI_ANALYSIS.suggestedMedicines.length})
            </h3>
            <span className="text-xs text-slate-400">Direct order dispatch via MediTrust Pharmacy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_AI_ANALYSIS.suggestedMedicines.map((med) => (
              <Card key={med.id} hoverEffect className="p-6 flex flex-col justify-between h-full border-slate-200">
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img src={med.image} alt={med.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <Badge variant={med.fastActing ? 'warning' : 'info'} size="sm">
                          {med.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {med.rating}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1 truncate">{med.name}</h4>
                      <p className="text-xs text-slate-400">{med.brand}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p><strong className="text-slate-800">Action:</strong> {med.indication}</p>
                    <p><strong className="text-slate-800">Standard Dosing:</strong> {med.dailyDose}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through block -mb-1">${med.originalPrice.toFixed(2)}</span>
                    <span className="text-lg font-black text-slate-900">${med.price.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('product-detail')}
                    icon={Pill}
                  >
                    View & Order Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Doctor consult callout */}
        <div className="rounded-2xl bg-teal-50 border border-teal-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-teal-950 text-sm">Symptoms lasting more than 7 days?</h4>
              <p className="text-xs text-teal-800/80">Connect with a licensed gastroenterologist or family physician for personalized diagnosis.</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('doctors')}
            className="whitespace-nowrap shrink-0"
          >
            Find a Doctor
          </Button>
        </div>

      </div>

    </div>
  );
}
