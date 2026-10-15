
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ImagePlus } from "lucide-react";

import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import adminService from "../../services/adminService";

export default function AddProductModal({
  isOpen,
  onClose,
}) {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState("");


  const mutation = useMutation({
    mutationFn: async (productData) => adminService.createProduct(productData, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "overview"],
      });

      handleClose();
    },

    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
        error.message ||
        "Failed to create product"
      );
    },
  });

  const handleClose = () => {
    setPreview(null);
    setFormError("");
    mutation.reset();
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFormError("Please select a PNG or JPG image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setFormError("");
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!user?.token) {
      setFormError("Please log in to add a product.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Please enter a valid price.");
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setFormError("Stock must be a non-negative integer.");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Pharmacy Product"
      subtitle="Enter pharmaceutical inventory details for the MediTrust catalog"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="add-product-form"
            variant="primary"
            size="sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving Product..."
              : "Save to Catalog"}
          </Button>
        </>
      }
    >
      <form
        id="add-product-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Product Image */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Product Packaging Image *
          </label>

          <label className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center transition-colors hover:bg-slate-50">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-32 w-32 rounded-xl object-cover"
                />

                <span className="mt-2 block text-xs font-semibold text-teal-700">
                  Click to change image
                </span>
              </div>
            ) : (
              <>
                <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />

                <p className="text-xs font-semibold text-slate-700">
                  Click to upload product image
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  PNG or JPG, up to 5MB
                </p>
              </>
            )}

            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg"
              required
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Name and Manufacturer */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Medicine Brand Name"
            name="name"
            placeholder="e.g. Amoxicillin Trihydrate"
            required
          />

          <Input
            label="Manufacturer / Brand"
            name="manufacturer"
            placeholder="e.g. Novartis Healthcare"
            required
          />
        </div>

        {/* Category, Price, Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Category *
            </label>

            <select
              name="category"
              required
              defaultValue="Prescription Drugs"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              <option value="Prescription Drugs">
                Prescription Drugs
              </option>
              <option value="Pain Relief & OTC">
                Pain Relief & OTC
              </option>
              <option value="Vitamins & Supplements">
                Vitamins & Supplements
              </option>
              <option value="Cardiac Care">
                Cardiac Care
              </option>
              <option value="Diabetes Management">
                Diabetes Management
              </option>
            </select>
          </div>

          <Input
            label="Unit Price ($)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="18.50"
            required
          />

          <Input
            label="Initial Inventory Stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="250"
            required
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Expiry Date *
          </label>

          <input
            type="date"
            name="expiresOn"
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Clinical Description & Uses *
          </label>

          <textarea
            name="description"
            rows={3}
            required
            placeholder="Brief overview of drug class and primary clinical indications..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Prescription Requirement */}
        <div className="pt-1">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              name="requiresPrescription"
              value="true"
              className="rounded text-teal-600 focus:ring-teal-500"
            />

            <span className="font-semibold">
              Requires Doctor's Prescription (Rx Verification Gate)
            </span>
          </label>
        </div>

        {/* Error Message */}
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {formError}
          </div>
        )}

        {mutation.isSuccess && (
          <p className="text-sm text-teal-700">
            Product created successfully.
          </p>
        )}
      </form>
    </Modal>
  );
}
