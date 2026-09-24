import React from 'react';

/**
 * Reusable Button component for MediTrust UI.
 * Pure Tailwind CSS utility classes.
 * 
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'ai'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantClasses = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow focus:ring-teal-500 active:scale-[0.98]',
    secondary: 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 focus:ring-teal-500 active:scale-[0.98]',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300 focus:ring-slate-400 active:scale-[0.98]',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow focus:ring-rose-500 active:scale-[0.98]',
    ai: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:from-indigo-700 hover:via-purple-700 hover:to-teal-600 text-white shadow-md hover:shadow-indigo-200/50 hover:scale-[1.01] active:scale-[0.98] focus:ring-indigo-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
    </button>
  );
}
