import React from 'react';

/**
 * Reusable Tabs component with pill or underline styling.
 * Pure Tailwind CSS utility classes.
 */
export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}) {
  if (variant === 'underline') {
    return (
      <div className={`border-b border-slate-200 ${className}`}>
        <nav className="flex space-x-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange && onChange(tab.id)}
                type="button"
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'border-teal-600 text-teal-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon && <tab.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Pill variant
  return (
    <div className={`inline-flex p-1 bg-slate-100 rounded-xl space-x-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange && onChange(tab.id)}
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-white text-teal-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tab.icon && <tab.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
