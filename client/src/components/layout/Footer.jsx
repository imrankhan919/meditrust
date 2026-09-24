import React from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Heart
} from 'lucide-react';
import Button from '../common/Button';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Genuine Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic medicines sourced directly from verified pharmacies.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Certified Specialists</h4>
              <p className="text-xs text-slate-400 mt-0.5">Board-certified doctors across 35+ clinical specialties.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Rapid doorstep delivery for priority emergency prescriptions.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">AI Health Assistant</h4>
              <p className="text-xs text-slate-400 mt-0.5">Smart triage, prescription interpretation, and symptom checks.</p>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Medi<span className="text-teal-400">Trust</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your comprehensive digital health ecosystem. Connecting patients with trusted physicians, certified diagnostic laboratories, and genuine pharmaceutical deliveries with clinical intelligence.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Emergency: 1-800-MEDITRUST (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@meditrust-health.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>450 Healthcare Boulevard, Suite 800, Boston, MA</span>
              </div>
            </div>
          </div>

          {/* Column: Clinical Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Clinical Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button type="button" onClick={() => onNavigate('doctors')} className="hover:text-teal-300 transition-colors">
                  Find Doctors
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('pharmacy')} className="hover:text-teal-300 transition-colors">
                  Online Pharmacy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('lab')} className="hover:text-teal-300 transition-colors">
                  Diagnostic Lab Tests
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('ai-hub')} className="hover:text-indigo-300 transition-colors">
                  AI Symptom Triage
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('doctor-apply')} className="hover:text-teal-300 transition-colors">
                  Join as Doctor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('pathologist-apply')} className="hover:text-teal-300 transition-colors">
                  Join as Pathologist
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Patients */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Patient Portal</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-teal-300 transition-colors">
                  Patient Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('orders')} className="hover:text-teal-300 transition-colors">
                  Track Medicine Orders
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('my-appointments')} className="hover:text-teal-300 transition-colors">
                  Doctor Appointments
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('my-lab-appointments')} className="hover:text-teal-300 transition-colors">
                  Lab Test Reports
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('admin')} className="hover:text-teal-300 transition-colors">
                  Hospital Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Health Bulletin</h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive verified weekly medical insights and preventative health alerts.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="doctor@hospital.org"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <Button variant="primary" size="sm" className="w-full justify-center">
                Subscribe
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Medical Disclaimer:</span> MediTrust is a digital healthcare platform. The clinical content and AI tools are intended solely for educational, triage, and logistical coordination purposes and do not constitute formal medical diagnosis or emergency treatment. Always consult licensed medical professionals for clinical emergencies.
          </p>
          <div className="flex items-center gap-1 text-slate-400 whitespace-nowrap">
            <span>© {new Date().getFullYear()} MediTrust Healthcare Inc. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for education.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
