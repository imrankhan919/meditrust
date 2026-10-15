import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Search, AlertCircle, FlaskConical } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import VerificationModal from "./VerificationModal";
import adminService from "../../services/adminService";

const STATUS_OPTIONS = ["ALL", "VERIFIED", "PENDING"];

export default function AdminPathologistsPage() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verificationTarget, setVerificationTarget] = useState(null);

  const { data: pathologists = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "pathologists"],
    queryFn: () => adminService.fetchPathologists(token),
    enabled: !!token,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }) =>
      adminService.updatePathologistVerification({ id, isVerified }, token),
    onSuccess: (_, variables) => {
      toast.success(variables.isVerified ? "Pathologist verified" : "Pathologist verification revoked");
      setVerificationTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "pathologists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Verification update failed");
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load pathologists");
    }
  }, [isError, error]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pathologists
      .filter((p) => {
        if (statusFilter === "VERIFIED") return p.isVerified;
        if (statusFilter === "PENDING") return !p.isVerified;
        return true;
      })
      .filter((p) =>
        q ? `${p.laboratoryName || ""} ${p.specialization || ""} ${p.laboratoryAddress || ""}`.toLowerCase().includes(q) : true
      );
  }, [pathologists, search, statusFilter]);

  const handleApprove = () => {
    if (!verificationTarget) return;
    verifyMutation.mutate({ id: verificationTarget._id, isVerified: true });
  };

  const handleReject = () => {
    if (!verificationTarget) return;
    verifyMutation.mutate({ id: verificationTarget._id, isVerified: false });
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Approving sets <code className="font-mono">isVerified</code> via{" "}
        <code className="font-mono">PUT /api/admin/pathologists/:pid</code> — the backend also
        promotes the linked user to <code className="font-mono">PATHOLOGIST</code>.
      </p>

      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <label htmlFor="admin-lab-search" className="sr-only">Search pathology labs</label>
            <input
              id="admin-lab-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laboratory, specialty, address..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="admin-lab-status" className="text-xs font-semibold text-slate-600">Status</label>
            <select
              id="admin-lab-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "ALL" ? "All" : s === "VERIFIED" ? "Verified" : "Pending"}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 sm:ml-auto" aria-live="polite">
            {filtered.length} of {pathologists.length} labs
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading pathology labs">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center space-y-3 py-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">
              {error?.response?.data?.message || error?.message || "Failed to load pathology labs."}
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
            <FlaskConical className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No pathology labs found</p>
            <p className="text-xs text-slate-500">Try a different search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4">Laboratory Center</th>
                  <th scope="col" className="py-3 px-4">Specializations</th>
                  <th scope="col" className="py-3 px-4">Address</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.laboratoryName || "—"}</td>
                    <td className="py-3 px-4">{row.specialization || "—"}</td>
                    <td className="py-3 px-4">{row.laboratoryAddress || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={row.isVerified ? "success" : "warning"} size="sm" dot>
                        {row.isVerified ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVerificationTarget({ ...row, type: "Pathologist" })}>
                        Inspect Audit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <VerificationModal
        isOpen={!!verificationTarget}
        onClose={() => (verifyMutation.isPending ? null : setVerificationTarget(null))}
        item={verificationTarget}
        type="Pathologist"
        isPending={verifyMutation.isPending}
        mutationError={verifyMutation.error?.response?.data?.message || verifyMutation.error?.message}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
