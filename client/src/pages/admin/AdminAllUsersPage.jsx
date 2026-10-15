import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Search, AlertCircle, Users } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import adminService from "../../services/adminService";

const ROLE_OPTIONS = ["ALL", "USER", "DOCTOR", "PATHOLOGIST", "ADMIN"];

const roleBadge = (role) => {
  switch (role) {
    case "ADMIN":
      return "purple";
    case "DOCTOR":
      return "info";
    case "PATHOLOGIST":
      return "warning";
    default:
      return "neutral";
  }
};

export default function AdminAllUsersPage() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const { data: users = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminService.fetchUsers(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load users");
    }
  }, [isError, error]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...users]
      .filter((u) => (roleFilter === "ALL" ? true : u.userType === roleFilter))
      .filter((u) =>
        q ? `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(q) : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users, search, roleFilter]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Showing name, email, role and join date only. Role changes and deletions are
        not available — the backend exposes no authorized user-update endpoint.
      </p>

      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <label htmlFor="admin-user-search" className="sr-only">Search users by name or email</label>
            <input
              id="admin-user-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="admin-role-filter" className="text-xs font-semibold text-slate-600">
              Role
            </label>
            <select
              id="admin-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500">
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role === "ALL" ? "All roles" : role}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 sm:ml-auto" aria-live="polite">
            {filtered.length} of {users.length} users
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading users">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center space-y-3 py-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">
              {error?.response?.data?.message || error?.message || "Failed to load users."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No users match your search</p>
            <p className="text-xs text-slate-500">Try a different name, email or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4">Full Name</th>
                  <th scope="col" className="py-3 px-4">Email</th>
                  <th scope="col" className="py-3 px-4">Portal Role</th>
                  <th scope="col" className="py-3 px-4">Joined</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                    <td className="py-3 px-4">{row.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={roleBadge(row.userType)} size="sm">{row.userType}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={row.isActive ? "success" : "danger"} size="sm" dot>
                        {row.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
