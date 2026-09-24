import React, { useState } from 'react';
import { 
  Compass, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Pill, 
  Stethoscope, 
  FlaskConical, 
  User, 
  ShieldCheck, 
  Package,
  Layers,
  Check
} from 'lucide-react';

export const ALL_PAGES = [
  { group: 'Core', items: [
    { id: 'landing', label: '1. Landing Page' },
    { id: 'login', label: '2. Login Page' },
    { id: 'register', label: '3. Register Page' },
  ]},
  { group: 'Pharmacy & Orders', items: [
    { id: 'pharmacy', label: '4. Product Listing' },
    { id: 'product-detail', label: '5. Product Detail' },
    { id: 'orders', label: '6. My Orders Page' },
  ]},
  { group: 'Doctors', items: [
    { id: 'doctors', label: '7. Doctor Listing' },
    { id: 'doctor-booking', label: '8. Doctor Booking' },
    { id: 'my-appointments', label: '9. My Appointments' },
    { id: 'doctor-apply', label: '10. Become a Doctor' },
  ]},
  { group: 'Lab Tests', items: [
    { id: 'lab', label: '11. Lab Test Listing' },
    { id: 'lab-booking', label: '12. Book Lab Test' },
    { id: 'my-lab-appointments', label: '13. My Lab Bookings' },
    { id: 'pathologist-apply', label: '14. Become Pathologist' },
  ]},
  { group: 'AI Health Suite', items: [
    { id: 'ai-hub', label: '15. AI Hub' },
    { id: 'ai-chat', label: '16. AI Chat' },
    { id: 'ai-prescription', label: '17. Prescription Explainer' },
    { id: 'ai-symptoms', label: '18. Find Meds by Symptom' },
  ]},
  { group: 'Portals', items: [
    { id: 'dashboard', label: '19. User Dashboard' },
    { id: 'admin', label: '20. Admin Dashboard' },
  ]}
];

export default function PageSwitcher({ currentView, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  // Find active label
  const activeItem = ALL_PAGES.flatMap(g => g.items).find(i => i.id === currentView);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 w-80 sm:w-96 max-h-[80vh] flex flex-col backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-100">Teaching View Navigator</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-1"
            >
              <span>Minimize</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 py-2 border-b border-slate-800/60">
            Directly preview any of MediTrust's 20 UI views and templates:
          </p>

          <div className="overflow-y-auto space-y-4 py-3 pr-1 text-xs">
            {ALL_PAGES.map((group) => (
              <div key={group.group}>
                <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1.5 px-2">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isCurrent = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? 'bg-teal-600 text-white font-medium shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-400">
            UI Only • Static Mock Data • Ready for API wiring
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl border border-slate-700/80 backdrop-blur-md hover:scale-105 transition-all text-xs font-semibold group"
          title="Open Page Switcher"
        >
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-slate-200">
            View: <span className="text-teal-300">{activeItem?.label || currentView}</span>
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      )}
    </div>
  );
}
