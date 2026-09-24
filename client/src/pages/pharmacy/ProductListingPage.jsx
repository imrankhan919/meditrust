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

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.products.getAll({ category, search, sort })
// ==========================================

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

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Amoxicillin Trihydrate 500mg',
    brand: 'Novartis Healthcare',
    category: 'Prescription Drugs',
    price: 18.50,
    originalPrice: 24.00,
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 142,
    stockStatus: 'In Stock',
    rxRequired: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    desc: 'Broad spectrum antibiotic used to treat bacterial infections of ear, nose, throat, and lower respiratory tract.',
  },
  {
    id: 'prod-2',
    name: 'Metformin HCl 500mg ER',
    brand: 'Merck Healthcare',
    category: 'Diabetes Management',
    price: 14.20,
    originalPrice: 19.00,
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 215,
    stockStatus: 'In Stock',
    rxRequired: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    desc: 'Extended release glycemic management tablets for adult patients diagnosed with Type 2 diabetes.',
  },
  {
    id: 'prod-3',
    name: 'Cetirizine Allergy Relief 10mg',
    brand: 'GSK Consumer Health',
    category: 'Pain Relief & OTC',
    price: 11.25,
    originalPrice: 15.00,
    discount: '25% OFF',
    rating: 4.7,
    reviewsCount: 98,
    stockStatus: 'In Stock',
    rxRequired: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400',
    desc: 'Rapid 24-hour relief against seasonal allergies, runny nose, watery eyes, and histamine-induced itchiness.',
  },
  {
    id: 'prod-4',
    name: 'Vitamin D3 5000 IU + K2',
    brand: 'NatureMade Health',
    category: 'Vitamins & Nutrition',
    price: 16.99,
    originalPrice: 22.99,
    discount: '26% OFF',
    rating: 4.9,
    reviewsCount: 380,
    stockStatus: 'In Stock',
    rxRequired: false,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=400',
    desc: 'Synergistic formulation promoting maximum calcium absorption, immune defense, and vascular artery integrity.',
  },
  {
    id: 'prod-5',
    name: 'Atorvastatin Calcium 20mg',
    brand: 'Pfizer Bio',
    category: 'Cardiac Care',
    price: 28.50,
    originalPrice: 38.00,
    discount: '25% OFF',
    rating: 4.8,
    reviewsCount: 164,
    stockStatus: 'In Stock',
    rxRequired: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
    desc: 'Primary preventive statin medication lowering LDL bad cholesterol and triglyceride blood plasma levels.',
  },
  {
    id: 'prod-6',
    name: 'Advanced Hydrocolloid Dressing Kit',
    brand: 'Johnson & Johnson Medical',
    category: 'First Aid & Surgical',
    price: 21.00,
    originalPrice: 26.50,
    discount: '20% OFF',
    rating: 4.6,
    reviewsCount: 77,
    stockStatus: 'In Stock',
    rxRequired: false,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    desc: 'Sterile waterproof gel bandages promoting fast cellular regeneration for burns, scrapes, and post-op wounds.',
  },
  {
    id: 'prod-7',
    name: 'Omeprazole 20mg Delayed-Release',
    brand: 'AstraZeneca Health',
    category: 'Pain Relief & OTC',
    price: 15.40,
    originalPrice: 20.00,
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 189,
    stockStatus: 'In Stock',
    rxRequired: false,
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?auto=format&fit=crop&q=80&w=400',
    desc: 'Proton pump inhibitor treating frequent heartburn, acid indigestion, and gastric reflux disorders.',
  },
  {
    id: 'prod-8',
    name: 'Cerave Hydrating Cleanser & Barrier Cream',
    brand: 'L’Oréal Dermatological',
    category: 'Skin & Dermatology',
    price: 19.80,
    originalPrice: 24.50,
    discount: '19% OFF',
    rating: 4.9,
    reviewsCount: 520,
    stockStatus: 'In Stock',
    rxRequired: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    desc: 'Essential ceramides and hyaluronic acid for skin moisture restoration and eczema flare-up protection.',
  },
];

export default function ProductListingPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Products');

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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
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
            Showing <span className="text-slate-900 font-bold">{MOCK_PRODUCTS.length}</span> Verified Medicines
          </p>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
            Same-day dispatch available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <Card
              key={prod.id}
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
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {prod.discount}
                    </span>
                    {prod.rxRequired && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="inline-flex items-center gap-0.5 bg-white/95 px-1.5 py-0.5 rounded-md text-[11px] font-bold text-slate-700 shadow-xs border border-slate-100">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {prod.rating}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <h3 
                    onClick={() => onNavigate('product-detail')}
                    className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors cursor-pointer line-clamp-1"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">{prod.brand}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {prod.desc}
                  </p>
                </div>
              </div>

              {/* Direct Order Now Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through block -mb-0.5">${prod.originalPrice.toFixed(2)}</span>
                  <span className="text-base font-extrabold text-slate-900">${prod.price.toFixed(2)}</span>
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
