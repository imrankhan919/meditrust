import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
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
import AdminSidebar from '../../components/admin/AdminSidebar';


const MOCK_DOCTORS_DATA = [
    { id: 'doc-1', name: 'Dr. Sarah Jenkins, MD', specialty: 'Cardiology', hospital: 'Mount Sinai Heart Center', license: 'NY-MED-849102-X', status: 'Verified', badgeVariant: 'success' },
    { id: 'doc-2', name: 'Dr. Marcus Vance, DO', specialty: 'Dermatology', hospital: 'Boston Skin Pavilion', license: 'MA-MED-771920-D', status: 'Verified', badgeVariant: 'success' },
    { id: 'doc-3', name: 'Dr. Alexander Wright, MD', specialty: 'Cardiology', hospital: 'Mount Sinai Health System', license: 'NY-MED-992014-A', status: 'Pending Verification', badgeVariant: 'warning' },
    { id: 'doc-4', name: 'Dr. Elena Rostova, MD', specialty: 'Pediatrics', hospital: "Children's Health Pavilion", license: 'IL-MED-661209-E', status: 'Verified', badgeVariant: 'success' },
];


export default function AdminDoctorsPage({ onNavigate }) {

    const { user } = useSelector(state => state.auth)


    let { pathname } = useLocation()

    let currentPath = pathname.split("/")[pathname.split("/").length - 1]

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

            <AdminSidebar />


            {/* Main Admin Area */}
            <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">

                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
                            {currentPath.toUpperCase()} OVERVIEW
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
                    </div>
                </Card>

            </main>


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
