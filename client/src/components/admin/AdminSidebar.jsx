import React from 'react'
import {
    Users,
    Package,
    Stethoscope,
    FlaskConical,
    ShoppingBag,
    LayoutDashboard,
} from 'lucide-react';
import Sidebar from '../common/Sidebar';
import { useLocation } from 'react-router-dom';

const AdminSidebar = ({ bare = false, counts = {} }) => {

    let { pathname } = useLocation()

    const segments = pathname.split("/").filter(Boolean)
    // /auth/admin -> overview (''); /auth/admin/users -> 'users'
    let currentPath = segments.length <= 2 ? '' : segments[segments.length - 1]

    const pendingDoctors = counts.pendingDoctors;
    const pendingPathologists = counts.pendingPathologists;

    const SIDEBAR_ITEMS = [
        { id: '', label: 'Admin Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products & Inventory', icon: Package, badge: counts.products != null ? String(counts.products) : undefined },
        { id: 'doctors', label: 'Doctors & Licensure', icon: Stethoscope, badge: pendingDoctors ? `${pendingDoctors} Pending` : undefined },
        { id: 'pathologists', label: 'Pathology Labs', icon: FlaskConical, badge: pendingPathologists ? `${pendingPathologists} Review` : undefined },
        { id: 'orders', label: 'Medicine Orders', icon: ShoppingBag, badge: counts.orders != null ? String(counts.orders) : undefined },
        { id: 'users', label: 'Registered Users', icon: Users, badge: counts.users != null ? String(counts.users) : undefined },
    ];

    const sidebar = (
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
                        <p className="text-[10px] text-teal-900 font-semibold uppercase tracking-wider">MediTrust Health Hospital </p>
                    </div>
                </div>
            }
            footer={
                <div className="text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">Audit Compliance: Active</p>
                    <p className="text-[11px] text-slate-400">Restricted to administrators</p>
                </div>
            }
        />
    );

    if (bare) {
        return sidebar;
    }

    return sidebar;
}

export default AdminSidebar
