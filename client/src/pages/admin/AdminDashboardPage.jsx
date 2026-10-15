import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  Stethoscope,
  FlaskConical,
  ShoppingBag,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import adminService from "../../services/adminService";

const roleCount = (users = [], role) => users.filter((u) => u.userType === role).length;

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <Card className="p-5 border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <div className={`p-2 rounded-xl ${tone}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-black text-slate-900">{value}</span>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="mt-4 h-7 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => adminService.fetchAllAdminData(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load dashboard data");
    }
  }, [isError, error]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <Card className="p-8 border-slate-200 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Could not load dashboard</h2>
        <p className="text-sm text-slate-500">
          {error?.response?.data?.message || error?.message || "Something went wrong while fetching platform data."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
          Retry
        </button>
      </Card>
    );
  }

  const users = data?.users || [];
  const doctors = data?.doctors || [];
  const pathologists = data?.pathologists || [];
  const products = data?.products || [];
  const orders = data?.orders || [];

  const verifiedDoctors = doctors.filter((d) => d.isVerified).length;
  const pendingDoctors = doctors.length - verifiedDoctors;
  const verifiedPathologists = pathologists.filter((p) => p.isVerified).length;
  const pendingPathologists = pathologists.length - verifiedPathologists;
  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length;

  const orderStatus = orders.reduce((acc, o) => {
    const key = (o.status || "unknown").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <p className="text-xs text-slate-500">
        Live platform data from the MediTrust API. Figures below are real counts — no estimates.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Registered Users" value={users.length} icon={Users} tone="text-sky-600 bg-sky-50" />
        <StatCard label="Ordinary Users (USER)" value={roleCount(users, "USER")} icon={UserCheck} tone="text-slate-600 bg-slate-100" />
        <StatCard label="Total Doctors" value={doctors.length} icon={Stethoscope} tone="text-indigo-600 bg-indigo-50" />
        <StatCard label="Verified Doctors" value={verifiedDoctors} icon={Stethoscope} tone="text-emerald-600 bg-emerald-50" />
        <StatCard label="Total Pathologists" value={pathologists.length} icon={FlaskConical} tone="text-indigo-600 bg-indigo-50" />
        <StatCard label="Verified Pathologists" value={verifiedPathologists} icon={FlaskConical} tone="text-emerald-600 bg-emerald-50" />
        <StatCard label="Products In Catalog" value={products.length} icon={Package} tone="text-teal-600 bg-teal-50" />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} tone="text-amber-600 bg-amber-50" />
      </div>

      {/* Registration breakdown + attention items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Registrations by role</h2>
          <dl className="divide-y divide-slate-100 text-sm">
            {["USER", "DOCTOR", "PATHOLOGIST", "ADMIN"].map((role) => (
              <div key={role} className="flex items-center justify-between py-2.5">
                <dt className="font-semibold text-slate-600">{role}</dt>
                <dd className="font-black text-slate-900">{roleCount(users, role)}</dd>
              </div>
            ))}
          </dl>
          <Link to="/auth/admin/users" className="text-xs font-semibold text-teal-700 hover:underline">
            Manage users →
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Needs attention</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Doctors awaiting verification</span>
              <Badge variant={pendingDoctors > 0 ? "warning" : "success"} size="sm" dot>
                {pendingDoctors} pending
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Pathologists awaiting verification</span>
              <Badge variant={pendingPathologists > 0 ? "warning" : "success"} size="sm" dot>
                {pendingPathologists} pending
              </Badge>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-slate-600">Products out of stock</span>
              <Badge variant={products.length - inStock > 0 ? "danger" : "success"} size="sm" dot>
                {products.length - inStock} of {products.length}
              </Badge>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold">
            <Link to="/auth/admin/doctors" className="text-teal-700 hover:underline">Review doctors →</Link>
            <Link to="/auth/admin/pathologists" className="text-teal-700 hover:underline">Review labs →</Link>
            <Link to="/auth/admin/products" className="text-teal-700 hover:underline">Check inventory →</Link>
          </div>
        </Card>
      </div>

      {/* Orders by status + recent signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Orders by status</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders recorded yet.</p>
          ) : (
            <dl className="divide-y divide-slate-100 text-sm">
              {Object.entries(orderStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-2.5">
                  <dt className="font-semibold text-slate-600 uppercase">{status}</dt>
                  <dd className="font-black text-slate-900">{count}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link to="/auth/admin/orders" className="text-xs font-semibold text-teal-700 hover:underline">
            View all orders →
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Recent signups</h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No users found.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <li key={u._id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <Badge variant="neutral" size="sm">{u.userType}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
