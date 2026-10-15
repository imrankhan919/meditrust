import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Search, Plus, AlertCircle, Package } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import AddProductModal from "./AddProductModal";
import adminService from "../../services/adminService";

export default function AdminProductsPage() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  const [search, setSearch] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const { data: products = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminService.fetchProducts(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load products");
    }
  }, [isError, error]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name || ""} ${p.description || ""} ${p.category || ""}`.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {products.length} products in catalog. Deletion is not available — the backend
          exposes no product-delete endpoint.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddProductOpen(true)}>
            Add New Product
          </Button>
          <Link
            to="/"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Exit to Patient Portal
          </Link>
        </div>
      </div>

      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <label htmlFor="admin-product-search" className="sr-only">Search products</label>
            <input
              id="admin-product-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
          <p className="text-xs text-slate-500 sm:ml-auto" aria-live="polite">
            {filtered.length} of {products.length} products
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center space-y-3 py-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">
              {error?.response?.data?.message || error?.message || "Failed to load products."}
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
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="text-xs text-slate-500">Try a different search, or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4">Product Name</th>
                  <th scope="col" className="py-3 px-4">Price</th>
                  <th scope="col" className="py-3 px-4">Stock</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{row.price}</td>
                    <td className="py-3 px-4">{row.stock} units</td>
                    <td className="py-3 px-4">
                      <Badge variant={row.stock > 0 ? "success" : "danger"} size="sm" dot>
                        {row.stock > 0 ? "IN-STOCK" : "OUT-OF-STOCK"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </div>
  );
}
