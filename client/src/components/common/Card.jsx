import React from 'react';

/**
 * Reusable Card component for MediTrust UI.
 * Standard rounded-2xl, soft shadow, healthcare styling.
 */
export default function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  const hoverClasses = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-xl hover:border-teal-200/60 transition-all duration-300 cursor-pointer'
    : 'transition-shadow duration-200';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${padding} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
