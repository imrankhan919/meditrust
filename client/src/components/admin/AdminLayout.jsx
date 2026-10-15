import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { logoutUser } from '../../features/auth/authSlice';

/**
 * Shared admin shell: responsive sidebar + top bar with admin identity + logout.
 * Individual admin pages render inside <Outlet /> or compose this layout directly.
 */
export default function AdminLayout({ children, title, subtitle }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname.split('/').filter(Boolean).pop() || 'admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Admin navigation</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close admin navigation">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              <AdminSidebar bare />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Open admin navigation">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                Admin Panel
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize truncate">
                {title || `${currentPath} overview`}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900 truncate max-w-40">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-40">{user.email}</p>
              </div>
            )}
            <span className="hidden sm:inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
              {user?.userType || 'ADMIN'}
            </span>
            <Link
              to="/"
              className="hidden md:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline">
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6 min-w-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
