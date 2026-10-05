import React, { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Stethoscope,
  FlaskConical,
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Sidebar from '../../components/common/Sidebar';
import AddProductModal from './AddProductModal';
import VerificationModal from './VerificationModal';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';


// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.admin.getDashboardMetrics()
// ==========================================


const MOCK_USERS_DATA = [
  { id: 'usr-1', name: 'Sarah Connor', email: 'sarah.connor@healthmail.com', role: 'Patient', joined: 'Jan 12, 2026', orders: 4, status: 'Active', badgeVariant: 'success' },
  { id: 'usr-2', name: 'Dr. Sarah Jenkins', email: 'dr.jenkins@mountsinai.org', role: 'Doctor', joined: 'Feb 03, 2026', orders: 0, status: 'Verified', badgeVariant: 'success' },
  { id: 'usr-3', name: 'Marcus Sterling', email: 'marcus.s@metrolabs.com', role: 'Pathologist', joined: 'Mar 15, 2026', orders: 0, status: 'Verified', badgeVariant: 'success' },
  { id: 'usr-4', name: 'David Henderson', email: 'david.h@gmail.com', role: 'Patient', joined: 'Apr 20, 2026', orders: 12, status: 'Active', badgeVariant: 'success' },
  { id: 'usr-5', name: 'Dr. James Wilson', email: 'dr.wilson@princeton.edu', role: 'Doctor Applicant', joined: 'Sep 21, 2026', orders: 0, status: 'Pending Review', badgeVariant: 'warning' },
];

const MOCK_PRODUCTS_DATA = [
  { id: 'prod-1', name: 'Amoxicillin Trihydrate 500mg', category: 'Prescription Drugs', price: '$18.50', stock: 142, rx: 'Required', status: 'In Stock', badgeVariant: 'success' },
  { id: 'prod-2', name: 'Metformin HCl 500mg ER', category: 'Diabetes Management', price: '$14.20', stock: 89, rx: 'Required', status: 'In Stock', badgeVariant: 'success' },
  { id: 'prod-3', name: 'Cetirizine 10mg Allergy Relief', category: 'Pain Relief & OTC', price: '$11.25', stock: 240, rx: 'No', status: 'In Stock', badgeVariant: 'success' },
  { id: 'prod-4', name: 'Lipitor (Atorvastatin) 20mg', category: 'Cardiac Care', price: '$32.00', stock: 54, rx: 'Required', status: 'Low Stock', badgeVariant: 'warning' },
  { id: 'prod-5', name: 'Vitamin D3 5000 IU', category: 'Vitamins & Nutrition', price: '$16.99', stock: 320, rx: 'No', status: 'In Stock', badgeVariant: 'success' },
];

const MOCK_DOCTORS_DATA = [
  { id: 'doc-1', name: 'Dr. Sarah Jenkins, MD', specialty: 'Cardiology', hospital: 'Mount Sinai Heart Center', license: 'NY-MED-849102-X', status: 'Verified', badgeVariant: 'success' },
  { id: 'doc-2', name: 'Dr. Marcus Vance, DO', specialty: 'Dermatology', hospital: 'Boston Skin Pavilion', license: 'MA-MED-771920-D', status: 'Verified', badgeVariant: 'success' },
  { id: 'doc-3', name: 'Dr. Alexander Wright, MD', specialty: 'Cardiology', hospital: 'Mount Sinai Health System', license: 'NY-MED-992014-A', status: 'Pending Verification', badgeVariant: 'warning' },
  { id: 'doc-4', name: 'Dr. Elena Rostova, MD', specialty: 'Pediatrics', hospital: "Children's Health Pavilion", license: 'IL-MED-661209-E', status: 'Verified', badgeVariant: 'success' },
];

const MOCK_PATHOLOGISTS_DATA = [
  { id: 'path-1', name: 'Metro Diagnostic Pathology Labs', director: 'Dr. Kenneth Harris', city: 'Boston, MA', license: 'NABL-ISO-15189', capacity: '2,500/day', status: 'Verified', badgeVariant: 'success' },
  { id: 'path-2', name: 'Apex Clinical Genomics Center', director: 'Dr. Rachel Green', city: 'New York, NY', license: 'CLIA-NY-88910', capacity: '1,800/day', status: 'Under Review', badgeVariant: 'warning' },
  { id: 'path-3', name: 'BioReference Diagnostic Hub', director: 'Dr. Simon Chen', city: 'Chicago, IL', license: 'CAP-IL-55410', capacity: '3,200/day', status: 'Verified', badgeVariant: 'success' },
];

const MOCK_ORDERS_DATA = [
  { id: 'ORD-98421', user: 'Sarah Connor', items: '2 items', total: '$37.00', date: 'Sep 22, 2026', status: 'Shipped', badgeVariant: 'info' },
  { id: 'ORD-98305', user: 'David Henderson', items: '2 items', total: '$51.24', date: 'Sep 15, 2026', status: 'Delivered', badgeVariant: 'success' },
  { id: 'ORD-97910', user: 'Maria Vasquez', items: '1 item', total: '$11.25', date: 'Aug 28, 2026', status: 'Delivered', badgeVariant: 'success' },
  { id: 'ORD-96540', user: 'Julian Ramos', items: '1 item', total: '$28.50', date: 'Jul 14, 2026', status: 'Cancelled', badgeVariant: 'danger' },
];

const MOCK_APPOINTMENTS_DATA = [
  { id: 'APT-1082', patient: 'Sarah Connor', doctor: 'Dr. Sarah Jenkins', date: 'Sep 23, 3:30 PM', mode: 'Video Call', fee: '$95', status: 'Upcoming', badgeVariant: 'info' },
  { id: 'APT-1049', patient: 'David Henderson', doctor: 'Dr. Marcus Vance', date: 'Sep 10, 11:00 AM', mode: 'In-Clinic', fee: '$85', status: 'Completed', badgeVariant: 'success' },
  { id: 'APT-0994', patient: 'Elena Cruz', doctor: 'Dr. Elena Rostova', date: 'Aug 18, 4:00 PM', mode: 'Video Call', fee: '$90', status: 'Completed', badgeVariant: 'success' },
];

export default function AdminDashboardPage({ onNavigate }) {

  const { user } = useSelector(state => state.auth)


  const [activeSection, setActiveSection] = useState('products');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [verificationTarget, setVerificationTarget] = useState(null);

  const SIDEBAR_ITEMS = [
    { id: 'products', label: 'Products & Inventory', icon: Package, badge: '5' },
    { id: 'doctors', label: 'Doctors & Licensure', icon: Stethoscope, badge: '1 Pending' },
    { id: 'pathologists', label: 'Pathology Labs', icon: FlaskConical, badge: '1 Review' },
    { id: 'orders', label: 'Medicine Orders', icon: ShoppingBag, badge: '4' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: '3' },
    { id: 'users', label: 'Registered Users', icon: Users, badge: '12k' },
  ];

  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ["items"], queryFn: () => adminService.fetchAllAdminData(user.token) })

  let verifiedDoctors = data?.doctors.filter(doc => doc.isVerified).length
  let totalOrders = data?.orders.filter(order => order.status !== "cancelled").length
  let verifiedPathologists = data?.pathologists.filter(path => path.isVerified).length

  const MOCK_STATS = [
    { id: 'revenue', label: 'Total Revenue', value: '$184,500', change: '+14.2% vs last month', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'orders', label: 'Total Orders', value: totalOrders, change: '+8.1% vs last month', icon: ShoppingBag, color: 'text-teal-600 bg-teal-50' },
    { id: 'doctors', label: 'Verified Doctors', value: verifiedDoctors, change: '+24 new this week', icon: Stethoscope, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'pathologists', label: 'Verified Pathologists', value: verifiedPathologists, change: '+18.5% year-to-date', icon: Users, color: 'text-sky-600 bg-sky-50' },
    { id: 'users', label: 'Total Registered Users', value: data?.users.length, change: '+18.5% year-to-date', icon: Users, color: 'text-sky-600 bg-sky-50' },
  ];



  useEffect(() => {
    if (isError && isError) {
      toast.error(error.response.data.message)
    }

  }, [isError, error])



  if (isLoading) {
    return <Loader />
  }




  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar Navigation */}
      <Sidebar
        items={SIDEBAR_ITEMS}
        activeItem={activeSection}
        onSelect={setActiveSection}
        header={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              M
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Admin Portal</h2>
              <p className="text-[10px] text-teal-700 font-semibold uppercase tracking-wider">MediTrust Hospital Operations</p>
            </div>
          </div>
        }
        footer={
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Audit Compliance: Active</p>
            <p className="text-[11px] text-slate-400">HIPAA Admin Role #9941</p>
          </div>
        }
      />

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
              {activeSection} Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live hospital operations, verification workflows, and pharmaceutical stock control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSection === 'products' && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsAddProductOpen(true)}
              >
                Add New Product
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('landing')}
            >
              Exit to Patient Portal
            </Button>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.id} className="p-5 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                  <p className="text-[11px] text-teal-700 font-semibold mt-1">{stat.change}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Table Container Card */}
        <Card className="p-6 border-slate-200 shadow-xs space-y-4">

          {/* Table Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeSection}...`}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC DATA TABLE BY SECTION */}
          <div className="overflow-x-auto">

            {/* 1. PRODUCTS TABLE */}
            {activeSection === 'products' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rx Gate</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PRODUCTS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4">{row.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.price}</td>
                      <td className="py-3 px-4">{row.stock} units</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.rx === 'Required' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          {row.rx}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1 hover:bg-slate-100 rounded text-slate-600" title="Edit">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:bg-rose-50 rounded text-rose-600" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 2. DOCTORS TABLE */}
            {activeSection === 'doctors' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Physician Name</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">Affiliated Hospital</th>
                    <th className="py-3 px-4">State License</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Licensure Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_DOCTORS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4 text-teal-700 font-medium">{row.specialty}</td>
                      <td className="py-3 px-4">{row.hospital}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{row.license}</td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={row.status === 'Verified' ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => setVerificationTarget({ ...row, type: 'Doctor' })}
                        >
                          {row.status === 'Verified' ? 'View Credentials' : 'Audit & Approve'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. PATHOLOGISTS TABLE */}
            {activeSection === 'pathologists' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Laboratory Center</th>
                    <th className="py-3 px-4">Medical Director</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Daily Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PATHOLOGISTS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4">{row.director}</td>
                      <td className="py-3 px-4">{row.city}</td>
                      <td className="py-3 px-4">{row.capacity}</td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVerificationTarget({ ...row, type: 'Pathologist' })}
                        >
                          Inspect Audit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4. ORDERS TABLE */}
            {activeSection === 'orders' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ORDERS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                      <td className="py-3 px-4">{row.user}</td>
                      <td className="py-3 px-4">{row.items}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.total}</td>
                      <td className="py-3 px-4">{row.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-teal-600 font-semibold hover:underline">Update Tracking</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 5. APPOINTMENTS TABLE */}
            {activeSection === 'appointments' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Appointment ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_APPOINTMENTS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                      <td className="py-3 px-4">{row.patient}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{row.doctor}</td>
                      <td className="py-3 px-4">{row.date}</td>
                      <td className="py-3 px-4">{row.mode}</td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-teal-600 font-semibold hover:underline">View Logs</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 6. USERS TABLE */}
            {activeSection === 'users' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Portal Role</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_USERS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4">{row.email}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{row.role}</span>
                      </td>
                      <td className="py-3 px-4">{row.joined}</td>
                      <td className="py-3 px-4">{row.orders} orders</td>
                      <td className="py-3 px-4">
                        <Badge variant={row.badgeVariant} size="sm" dot>{row.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <MoreVertical className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </Card>

      </main>

      {/* MODAL: ADD PRODUCT */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={() => setIsAddProductOpen(false)}
      />

      {/* MODAL: DOCTOR / PATHOLOGIST VERIFICATION */}
      <VerificationModal
        isOpen={!!verificationTarget}
        onClose={() => setVerificationTarget(null)}
        item={verificationTarget}
        type={verificationTarget?.type}
        onApprove={() => setVerificationTarget(null)}
        onReject={() => setVerificationTarget(null)}
      />

    </div>
  );
}
