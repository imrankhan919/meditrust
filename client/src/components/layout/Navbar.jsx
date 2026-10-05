import React, { useState } from 'react';
import {
  HeartPulse,
  Menu,
  X,
  Search,
  User,
  Calendar,
  Pill,
  FlaskConical,
  Sparkles,
  Package,
  ShieldAlert,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import Button from '../common/Button';
import { logoutUser } from '../../features/auth/authSlice';

export default function Navbar({ currentView, onNavigate }) {


  const { user } = useSelector(state => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch(logoutUser())
    navigate("/login")
  }


  const handleNavigate = (route) => {
    navigate(route)
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user ? [
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'doctors', label: 'Doctors', icon: Calendar },
    { id: 'lab', label: 'Lab Tests', icon: FlaskConical },
    { id: 'auth/ai-hub', label: 'AI Health', icon: Sparkles, isAi: true },
    { id: 'auth/orders', label: 'My Orders', icon: Package },
    user.userType === "ADMIN" ? { id: 'auth/admin', label: 'Admin', icon: ShieldAlert } :
      { id: 'auth/dashboard', label: 'Dashboard', icon: User },
    ,
  ] : [
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'doctors', label: 'Doctors', icon: Calendar },
    { id: 'lab', label: 'Lab Tests', icon: FlaskConical },
  ]

  const handleNav = (viewId) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      {/* Top micro emergency & announcement bar */}
      {
        !user.userType === "ADMIN" && (
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-teal-100 text-xs py-1.5 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">24/7 Emergency Health Line:</span>
                <span className="font-bold text-white tracking-wide">1-800-MEDITRUST</span>
              </div>
              <div className="hidden md:flex items-center gap-4 text-[11px] text-teal-200/80">
                <span>✓ 100% Genuine Medicines</span>
                <span>✓ Verified Medical Specialists</span>
                <span>✓ NABL Certified Labs</span>
              </div>
            </div>
          </div>
        )
      }

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Medi<span className="text-teal-600">Trust</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-teal-700/80 -mt-1">
                Healthcare Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate("/" + link.id)}
                  type="button"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : link.isAi
                      ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/70 font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : link.isAi ? 'text-indigo-500' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                  {link.isAi && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold leading-none">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Auth & CTA Buttons */}

          {
            user && (
              <Button
                variant="danger"
                size="md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )
          }

          {
            !user && (
              <>
                <div className="hidden sm:flex items-center gap-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigate("/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleNavigate("/register")}
                  >
                    Create Account
                  </Button>
                </div>

              </>
            )
          }

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden text-xs py-1 px-2.5"
              onClick={() => handleNav('login')}
            >
              Sign In
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />}
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}




          </div>

          <div className="pt-4 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => handleNav('login')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => handleNav('register')}
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
