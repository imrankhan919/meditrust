import React, { useState } from 'react'
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
import Sidebar from '../common/Sidebar';
import { useLocation } from 'react-router-dom';

const AdminSidebar = () => {

    let { pathname } = useLocation()

    let currentPath = pathname.split("/")[pathname.split("/").length - 1]


    const SIDEBAR_ITEMS = [
        { id: '/', label: 'Admin Overview', icon: Package },
        { id: 'products', label: 'Products & Inventory', icon: Package, badge: '5' },
        { id: 'doctors', label: 'Doctors & Licensure', icon: Stethoscope, badge: '1 Pending' },
        { id: 'pathologists', label: 'Pathology Labs', icon: FlaskConical, badge: '1 Review' },
        { id: 'orders', label: 'Medicine Orders', icon: ShoppingBag, badge: '4' },
        { id: 'users', label: 'Registered Users', icon: Users, badge: '12k' },
    ];

    return (
        <Sidebar
            items={SIDEBAR_ITEMS}
            activeItem={currentPath}
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
    )
}

export default AdminSidebar
