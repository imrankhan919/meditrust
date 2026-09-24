import React from 'react';

/**
 * Reusable Sidebar component for Dashboards and Admin panels.
 * Pure Tailwind CSS utility classes.
 */
export default function Sidebar({
  items = [],
  activeItem,
  onSelect,
  header,
  footer,
  className = '',
}) {
  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen ${className}`}>
      {header && (
        <div className="p-5 border-b border-slate-100">
          {header}
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect && onSelect(item.id)}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                )}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {footer && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {footer}
        </div>
      )}
    </aside>
  );
}
