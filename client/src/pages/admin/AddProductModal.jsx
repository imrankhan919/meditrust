import React from 'react';
import { Upload, X, Pill, DollarSign } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function AddProductModal({ isOpen, onClose, onSave }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pharmacy Product"
      subtitle="Enter pharmaceutical inventory details for the MediTrust catalog"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onSave || onClose}>
            Save to Catalog
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        
        {/* Mock Image Upload Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Packaging Image
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer space-y-1">
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">Click to upload product image</p>
            <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB (Square 1:1 recommended)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Medicine Brand Name" placeholder="e.g. Amoxicillin Trihydrate" required />
          <Input label="Manufacturer / Brand" placeholder="e.g. Novartis Healthcare" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500">
              <option>Prescription Drugs</option>
              <option>Pain Relief & OTC</option>
              <option>Vitamins & Supplements</option>
              <option>Cardiac Care</option>
              <option>Diabetes Management</option>
            </select>
          </div>

          <Input label="Unit Price ($)" type="number" placeholder="18.50" required />
          <Input label="Initial Inventory Stock" type="number" placeholder="250" required />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Clinical Description & Uses
          </label>
          <textarea
            rows={2}
            placeholder="Brief overview of drug class and primary clinical indications..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
            <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
            <span className="font-semibold">Requires Doctor's Prescription (Rx Verification Gate)</span>
          </label>
        </div>

      </form>
    </Modal>
  );
}
