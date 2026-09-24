import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  AlertCircle, 
  Minus, 
  Plus, 
  Star, 
  Heart, 
  Share2, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Pill,
  Clock,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.products.getById(id)
// ==========================================

const MOCK_PRODUCT_DETAIL = {
  id: 'prod-1',
  name: 'Amoxicillin Trihydrate Capsules 500mg',
  brand: 'Novartis Healthcare Ltd.',
  genericName: 'Amoxicillin USP (Active Pharmaceutical Ingredient)',
  category: 'Prescription Antibiotics',
  price: 18.50,
  originalPrice: 24.00,
  discount: '23% OFF',
  rating: 4.8,
  reviewsCount: 284,
  stockStatus: 'In Stock (120+ units available)',
  rxRequired: true,
  packaging: 'Blister Pack of 30 Capsules (3 x 10)',
  deliveryEstimate: 'Tomorrow by 2:00 PM (Express)',
  images: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400',
  ],
  description: 'Amoxicillin is a moderate-spectrum penicillin antibiotic used to treat a wide variety of bacterial infections. It works by stopping the growth and cell-wall synthesis of susceptible bacteria.',
  indications: [
    'Upper respiratory tract bacterial infections (sinusitis, pharyngitis, tonsillitis)',
    'Lower respiratory tract infections (acute bronchitis, pneumonia)',
    'Otitis media (middle ear infection in pediatric and adult cases)',
    'Uncomplicated urinary tract infections (UTI)',
  ],
  dosageInstructions: 'Take 1 capsule orally every 8 hours with water. Can be taken with or without food. Complete the full prescribed course even if symptoms subside early.',
  sideEffects: 'Mild nausea, abdominal discomfort, diarrhea, skin rash. If severe allergic swelling occurs, seek immediate clinical attention.',
  manufacturer: 'Novartis Pharma AG, Basel, Switzerland • NDC 0078-0110-05',
};

const MOCK_RELATED_PRODUCTS = [
  {
    id: 'prod-2',
    name: 'Probiotic Multi-Enzyme Gut Defense',
    brand: 'NatureMade Health',
    price: 15.99,
    originalPrice: 20.00,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300',
    desc: 'Recommended alongside antibiotics to maintain healthy gut microbiota balance.',
  },
  {
    id: 'prod-3',
    name: 'Cetirizine 10mg Non-Drowsy',
    brand: 'GSK Consumer',
    price: 11.25,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=300',
    desc: 'Fast antihistamine relief for secondary allergic flares.',
  },
  {
    id: 'prod-7',
    name: 'Omeprazole 20mg Acid Reducer',
    brand: 'AstraZeneca',
    price: 15.40,
    originalPrice: 20.00,
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?auto=format&fit=crop&q=80&w=300',
    desc: 'Reduces excess stomach acid and eases gastrointestinal irritation.',
  },
];

export default function ProductDetailPage({ onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(MOCK_PRODUCT_DETAIL.images[0]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('landing')} className="hover:text-teal-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('pharmacy')} className="hover:text-teal-600">Pharmacy</button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate">{MOCK_PRODUCT_DETAIL.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-center aspect-square overflow-hidden relative">
            <img
              src={selectedImage}
              alt={MOCK_PRODUCT_DETAIL.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
            {MOCK_PRODUCT_DETAIL.rxRequired && (
              <div className="absolute top-4 left-4">
                <Badge variant="warning" size="md">
                  Prescription Required
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail row */}
          <div className="flex gap-3">
            {MOCK_PRODUCT_DETAIL.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl bg-white border-2 p-1 overflow-hidden transition-all ${
                  selectedImage === img ? 'border-teal-600 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* AI Clinical Explainer Promo Card */}
          <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200/80 p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950">MediTrust AI Prescription Check</h4>
              <p className="text-xs text-indigo-800/80 mt-0.5">
                Have an active doctor's prescription slip? Upload it to auto-verify dosage instructions.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('ai-prescription')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
              >
                Upload & Verify Rx Now <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Info & Direct Purchase Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="info" size="sm">
                {MOCK_PRODUCT_DETAIL.category}
              </Badge>
              <Badge variant="success" size="sm" dot>
                {MOCK_PRODUCT_DETAIL.stockStatus}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {MOCK_PRODUCT_DETAIL.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Brand: <span className="text-slate-800 font-semibold">{MOCK_PRODUCT_DETAIL.brand}</span>
            </p>
            <p className="text-xs text-teal-700 italic">
              Generic: {MOCK_PRODUCT_DETAIL.genericName}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{MOCK_PRODUCT_DETAIL.rating}</span>
              <span className="text-xs text-slate-400">({MOCK_PRODUCT_DETAIL.reviewsCount} verified patient reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ${(MOCK_PRODUCT_DETAIL.price * quantity).toFixed(2)}
              </span>
              <span className="text-base text-slate-400 line-through">
                ${(MOCK_PRODUCT_DETAIL.originalPrice * quantity).toFixed(2)}
              </span>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-md">
                {MOCK_PRODUCT_DETAIL.discount}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Packaging: <span className="font-semibold text-slate-700">{MOCK_PRODUCT_DETAIL.packaging}</span>
            </p>
          </div>

          {/* Direct Buy Section: Quantity Stepper & Order Now Button */}
          <div className="bg-white rounded-2xl p-5 border border-teal-200/80 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Stepper */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg hover:bg-white text-slate-600 transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg hover:bg-white text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* DIRECT ORDER NOW CTA (No Cart!) */}
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:flex-1 justify-center shadow-md shadow-teal-600/25"
                onClick={() => onNavigate('orders')}
              >
                Order Now (${(MOCK_PRODUCT_DETAIL.price * quantity).toFixed(2)})
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{MOCK_PRODUCT_DETAIL.deliveryEstimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>100% Genuine Pharmacy Guarantee</span>
              </div>
            </div>
          </div>

          {/* Dosage & Usage Information Accordion / Card */}
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Clinical Description & Indications
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {MOCK_PRODUCT_DETAIL.description}
              </p>
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Common Medical Uses:</h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {MOCK_PRODUCT_DETAIL.indications.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-amber-200 rounded-2xl p-5 bg-amber-50/50 space-y-2">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                Dosage & Administration Guidelines
              </h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {MOCK_PRODUCT_DETAIL.dosageInstructions}
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-600" />
                Safety Notes & Side Effects
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {MOCK_PRODUCT_DETAIL.sideEffects}
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                {MOCK_PRODUCT_DETAIL.manufacturer}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Row */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Frequently Purchased Together</h2>
            <p className="text-xs text-slate-500 mt-0.5">Complementary supplements and care essentials</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('pharmacy')}
          >
            Browse More
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MOCK_RELATED_PRODUCTS.map((prod) => (
            <Card key={prod.id} hoverEffect className="p-4 flex flex-col justify-between">
              <div>
                <div className="aspect-square bg-slate-50 rounded-xl p-4 mb-3 flex items-center justify-center">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                <p className="text-xs text-slate-400">{prod.brand}</p>
                <p className="text-xs text-slate-500 mt-1">{prod.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">${prod.price.toFixed(2)}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('orders')}
                >
                  Order Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
