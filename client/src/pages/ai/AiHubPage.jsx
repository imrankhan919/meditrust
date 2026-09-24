import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  FileSearch, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Zap
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function AiHubPage({ onNavigate }) {
  const AI_FEATURES = [
    {
      id: 'ai-chat',
      title: 'Chat with AI Doctor',
      desc: 'Ask complex health questions, understand diagnostic numbers, and receive instant clinical triage before seeing a doctor.',
      icon: MessageSquare,
      badge: 'Interactive Triage',
      color: 'from-indigo-600 to-violet-600',
      actionText: 'Start AI Conversation',
    },
    {
      id: 'ai-prescription',
      title: 'Explain My Prescription',
      desc: 'Upload handwritten or printed doctor prescription slips. Our vision model decodes dosages, timings, food interactions, and side effects.',
      icon: FileSearch,
      badge: 'Vision Scanner',
      color: 'from-violet-600 to-purple-600',
      actionText: 'Scan Prescription Slip',
    },
    {
      id: 'ai-symptoms',
      title: 'Find Medicines by Symptom',
      desc: 'Describe what you are feeling in plain words. MediTrust AI maps symptoms to proven over-the-counter remedies and connects directly to pharmacy.',
      icon: Activity,
      badge: 'Symptom Matcher',
      color: 'from-purple-600 to-teal-600',
      actionText: 'Match Symptoms to Meds',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* AI Hero Banner with Glowing Violet Gradients */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-indigo-900/50">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            MediTrust Clinical AI Intelligence Suite
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Next-Generation AI Assistance for Your Healthcare Journey
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Harness safe, clinically-grounded machine intelligence to understand medical handwriting, decode complex prescription regimens, and receive instant 24/7 symptom guidance.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              HIPAA Compliant & Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Sub-second Clinical Response
            </span>
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-teal-400" />
              Verified Medical Evidence Base
            </span>
          </div>
        </div>
      </div>

      {/* The Three Primary Feature Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Select an AI Health Tool
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the specific clinical intelligence workflow you would like to initiate:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.id}
                hoverEffect
                onClick={() => onNavigate(feat.id)}
                className="p-8 flex flex-col justify-between h-full border-slate-200 hover:border-indigo-400 group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <Badge variant="purple" size="sm">
                      {feat.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Clinical Disclaimer Callout */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Important Clinical Safety Disclaimer
          </h4>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            MediTrust AI is an informational and triage assistance tool trained on clinical reference data. It does not provide formal medical diagnoses or prescribe controlled pharmaceuticals. If you are experiencing symptoms of a stroke, heart attack, or acute medical trauma, immediately dial 911 or head to the closest emergency room.
          </p>
        </div>
      </div>

    </div>
  );
}
