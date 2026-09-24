import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  ArrowRight, 
  RotateCw, 
  Search, 
  ShoppingBag,
  ExternalLink,
  MapPin
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.orders.getUserOrders({ status })
// ==========================================

const MOCK_ORDERS = [
  {
    id: 'ORD-98421',
    date: 'Sep 22, 2026',
    total: 37.00,
    status: 'Shipped',
    statusVariant: 'info',
    eta: 'Tomorrow by 2:00 PM',
    trackingNumber: 'TRK-MED-849102',
    address: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        name: 'Amoxicillin Trihydrate 500mg',
        quantity: 2,
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
        rxVerified: true,
      },
    ],
    timelineStep: 2, // 0: Placed, 1: Processed, 2: Shipped, 3: Delivered
  },
  {
    id: 'ORD-98305',
    date: 'Sep 15, 2026',
    total: 51.24,
    status: 'Delivered',
    statusVariant: 'success',
    eta: 'Delivered on Sep 16',
    trackingNumber: 'TRK-MED-771920',
    address: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        name: 'Lipitor (Atorvastatin) 20mg',
        quantity: 1,
        price: 32.00,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200',
        rxVerified: true,
      },
      {
        name: 'Vitamin D3 5000 IU Softgels',
        quantity: 1,
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=200',
        rxVerified: false,
      },
    ],
    timelineStep: 3,
  },
  {
    id: 'ORD-97910',
    date: 'Aug 28, 2026',
    total: 11.25,
    status: 'Delivered',
    statusVariant: 'success',
    eta: 'Delivered on Aug 29',
    trackingNumber: 'TRK-MED-662301',
    address: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        name: 'Cetirizine Allergy Relief 10mg',
        quantity: 1,
        price: 11.25,
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200',
        rxVerified: false,
      },
    ],
    timelineStep: 3,
  },
  {
    id: 'ORD-96540',
    date: 'Jul 14, 2026',
    total: 28.50,
    status: 'Cancelled',
    statusVariant: 'danger',
    eta: 'Cancelled by Patient',
    trackingNumber: 'N/A',
    address: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        name: 'Omeprazole 20mg Delayed-Release',
        quantity: 1,
        price: 15.40,
        image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?auto=format&fit=crop&q=80&w=200',
        rxVerified: false,
      },
    ],
    timelineStep: 0,
  },
];

const FILTER_TABS = ['All Orders', 'Pending / Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function MyOrdersPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [showEmptyState, setShowEmptyState] = useState(false);

  const displayedOrders = showEmptyState ? [] : MOCK_ORDERS.filter((ord) => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Pending / Processing') return ord.status === 'Pending';
    if (activeTab === 'Shipped') return ord.status === 'Shipped';
    if (activeTab === 'Delivered') return ord.status === 'Delivered';
    if (activeTab === 'Cancelled') return ord.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="info" size="sm" className="mb-1">
            Medicine Dispatch & History
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Medicine Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fulfillment tracking, digital invoices, and prescription logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle for teaching preview: empty state vs normal */}
          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 font-medium"
          >
            {showEmptyState ? 'Preview Filled Orders' : 'Preview Empty State UI'}
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('pharmacy')}
            icon={ShoppingBag}
          >
            Order Medicines
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setShowEmptyState(false);
              }}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Orders List or Empty State */}
      {displayedOrders.length === 0 ? (
        /* Empty State Illustration Area */
        <Card className="p-12 text-center max-w-lg mx-auto border-dashed border-2 border-slate-200 space-y-4">
          <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
            <Package className="w-10 h-10 stroke-1" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't placed any medicine orders under this category yet. Find authentic medicines with doorstep express dispatch.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('pharmacy')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore MediTrust Pharmacy
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {displayedOrders.map((order) => (
            <Card key={order.id} className="p-6 border-slate-200/90 shadow-sm space-y-6">
              
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-slate-900 text-base">{order.id}</span>
                  <span className="text-xs text-slate-400">• Placed on {order.date}</span>
                  <Badge variant={order.statusVariant} size="sm" dot>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-base font-extrabold text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Tracker (Timeline steps) */}
              {order.status !== 'Cancelled' && (
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span className={order.timelineStep >= 0 ? 'text-teal-700' : ''}>Order Placed</span>
                    <span className={order.timelineStep >= 1 ? 'text-teal-700' : ''}>Prescription Verified</span>
                    <span className={order.timelineStep >= 2 ? 'text-teal-700' : ''}>Out for Delivery</span>
                    <span className={order.timelineStep >= 3 ? 'text-teal-700' : ''}>Delivered</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(order.timelineStep / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-teal-600" />
                      Status: <strong className="text-slate-800">{order.eta}</strong>
                    </span>
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                </div>
              )}

              {/* Item Previews */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>${item.price.toFixed(2)} each</span>
                          {item.rxVerified && (
                            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              Rx Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Delivering to: {order.address}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" icon={FileText}>
                    Invoice
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate('pharmacy')}
                    icon={RotateCw}
                  >
                    Reorder
                  </Button>
                </div>
              </div>

            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
