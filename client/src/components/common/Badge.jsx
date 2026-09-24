import React from 'react';

/**
 * Reusable Badge component for MediTrust UI.
 * Pure Tailwind CSS utility classes.
 * 
 * @param {'success'|'warning'|'danger'|'info'|'purple'|'neutral'} variant
 * @param {'sm'|'md'} size
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    info: 'bg-teal-50 text-teal-700 border-teal-200/60',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/70',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-teal-500',
    purple: 'bg-indigo-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-slate-400'}`} />}
      {children}
    </span>
  );
}
