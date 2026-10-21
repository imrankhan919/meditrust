import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Pill,
  ShieldCheck,
  Star,
  ArrowRight,
  ChevronDown,
  Check,
  Sparkles,
  Zap
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import productServices from '../../services/medicalService';
import medicalService from '../../services/medicalService';
import Loader from '../../components/common/Loader';

const MOCK_CATEGORIES = [
  'All Products',
  'Prescription Drugs',
  'Pain Relief & OTC',
  'Vitamins & Nutrition',
  'Diabetes Management',
  'First Aid & Surgical',
  'Cardiac Care',
  'Skin & Dermatology',
];

export default function ProductListingPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ['items'], queryFn: medicalService.fetchData })



  if (isLoading) {
    return (
      <Loader />
    )
  }


  if (isError) {
    return (
      <div className="h-screen">
        <h1 className="text-center">{error.message || "Something Went Wrong!!"}</h1>
      </div>
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <Badge variant="success" size="sm" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30">
            Express Medicine Dispatch
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            MediTrust Online Pharmacy
          </h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Order authentic prescription and over-the-counter medications directly to your doorstep. Free delivery on orders above $35.
          </p>
        </div>
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 opacity-20">
          <Pill className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine brand or generic salt..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Action row */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Sort by:</span>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('ai-prescription')}
            icon={Sparkles}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            Upload Prescription
          </Button>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {MOCK_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Grid of Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900 font-bold">{data.medicines.length}</span> Verified Medicines
          </p>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
            Same-day dispatch available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.medicines.map((prod) => (
            <Card
              key={prod._id}
              hoverEffect
              className="flex flex-col justify-between p-4 h-full group"
            >
              <div>
                {/* Product Image Area */}
                <div
                  onClick={() => onNavigate('product-detail')}
                  className="relative rounded-xl overflow-hidden aspect-square mb-3 bg-slate-50 flex items-center justify-center p-4 cursor-pointer"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3
                    onClick={() => onNavigate('product-detail')}
                    className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors cursor-pointer line-clamp-1"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Direct Order Now Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900">₹{prod.price.toFixed(2)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('product-detail')}
                  className="shadow-xs"
                >
                  Order Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination / Load More UI */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Showing 1 to 8 of 148 medicines
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <span className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">1</span>
          <span className="px-3 py-1 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer">2</span>
          <span className="px-3 py-1 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer">3</span>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}
