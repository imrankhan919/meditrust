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





export default function AdminProductsPage({ onNavigate }) {

    const { user } = useSelector(state => state.auth)


    let { pathname } = useLocation()

    let currentPath = pathname.split("/")[pathname.split("/").length - 1]

    const [activeSection, setActiveSection] = useState('products');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [verificationTarget, setVerificationTarget] = useState(null);


    const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ["items"], queryFn: () => adminService.fetchAllAdminData(user.token) })


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

                        {/* 1. PRODUCTS TABLE */}

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
                                {data?.products.map((row) => (
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




                    </div>
                </Card>

            </main>

            {/* MODAL: ADD PRODUCT */}
            <AddProductModal
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onSave={() => setIsAddProductOpen(false)}
            />



        </div>
    );
}
