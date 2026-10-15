import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Search, AlertCircle, ShoppingBag } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import adminService from "../../services/adminService";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

const statusBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
};

const shortId = (id) => (id ? String(id).slice(-8) : "—");

export default function AdminOrdersPage() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: orders = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => adminService.fetchOrders(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load orders");
    }
  }, [isError, error]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) =>
        statusFilter === "ALL" ? true : (o.status || "").toLowerCase() === statusFilter.toLowerCase()
      )
      .filter((o) =>
        q
          ? `${o._id || ""} ${typeof o.user === "string" ? o.user : o.user?.name || ""} ${typeof o.product === "string" ? o.product : o.product?.name || ""} ${o.status || ""}`
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        The orders API returns unpopulated user/product references, so only IDs and
        status are shown. Order-status updates are not available in the backend.
      </p>

      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <label htmlFor="admin-order-search" className="sr-only">Search orders</label>
            <input
              id="admin-order-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or status..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="admin-order-status" className="text-xs font-semibold text-slate-600">Status</label>
            <select
              id="admin-order-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 sm:ml-auto" aria-live="polite">
            {filtered.length} of {orders.length} orders
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading orders">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center space-y-3 py-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">
              {error?.response?.data?.message || error?.message || "Failed to load orders."}
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
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-500">Try a different search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4">Order ID</th>
                  <th scope="col" className="py-3 px-4">User Ref</th>
                  <th scope="col" className="py-3 px-4">Product Ref</th>
                  <th scope="col" className="py-3 px-4">Date</th>
                  <th scope="col" className="py-3 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900" title={row._id}>
                      …{shortId(row._id)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]" title={typeof row.user === "string" ? row.user : row.user?._id}>
                      {typeof row.user === "string" ? `…${shortId(row.user)}` : row.user?.name || `…${shortId(row.user?._id)}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]" title={typeof row.product === "string" ? row.product : row.product?._id}>
                      {typeof row.product === "string" ? `…${shortId(row.product)}` : row.product?.name || `…${shortId(row.product?._id)}`}
                    </td>
                    <td className="py-3 px-4">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusBadge(row.status)} size="sm" dot>
                        {(row.status || "UNKNOWN").toUpperCase()}
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
