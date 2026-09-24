import React, { useState } from 'react';
import { 
  HeartPulse, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.auth.register({ name, email, phone, password })
// ==========================================

export default function RegisterPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Join MediTrust to manage prescriptions, doctors, and lab tests
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-8 shadow-xl border-slate-200/80">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            <Input
              label="Full Legal Name"
              type="text"
              placeholder="Sarah Connor"
              icon={User}
              defaultValue="Sarah Connor"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              icon={Mail}
              defaultValue="sarah.connor@healthmail.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              defaultValue="+1 (555) 234-5678"
              required
            />

            <div className="space-y-1">
              <Input
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                icon={Lock}
                defaultValue="SecureHealthcare2026!"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {/* Password strength visual indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1 h-1.5">
                <div className="w-1/3 rounded-full bg-emerald-500" />
                <div className="w-1/3 rounded-full bg-emerald-500" />
                <div className="w-1/3 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">Strong password meets HIPAA security standards</p>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span>
                  I agree to the MediTrust{' '}
                  <span className="text-teal-600 underline">Terms of Service</span> and{' '}
                  <span className="text-teal-600 underline">HIPAA Privacy Notice</span>
                </span>
              </label>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md shadow-teal-600/20 mt-4"
              onClick={() => onNavigate('dashboard')}
            >
              Complete Registration
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
              >
                Sign In Instead
              </button>
            </p>
          </div>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>Patient data stored under end-to-end medical encryption</span>
        </div>

      </div>
    </div>
  );
}
