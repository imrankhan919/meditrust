import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductListingPage from './pages/pharmacy/ProductListingPage';
import DoctorListingPage from './pages/doctors/DoctorListingPage';
import LabTestListingPage from './pages/lab/LabTestListingPage';
import AiHubPage from './pages/ai/AiHubPage';
import AiChatPage from './pages/ai/AiChatPage';
import FindMedicinesBySymptomPage from './pages/ai/FindMedicinesBySymptomPage';
import PrescriptionExplainerPage from './pages/ai/PrescriptionExplainerPage';
import PrescriptionDetailPage from './pages/prescriptions/PrescriptionDetailPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PrivateComponent from './components/PrivateComponent';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import { useSelector } from 'react-redux';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminPathologistsPage from './pages/admin/AdminPathologistsPage';
import AdminAllUsersPage from './pages/admin/AdminAllUsersPage';

// Legacy teaching-view ids used via onNavigate() across older pages.
// Maps them to real router paths so buttons no longer crash.
const viewToRoute = (viewId) => {
  if (!viewId) return '/';
  if (viewId.startsWith('/')) return viewId;
  const map = {
    landing: '/',
    login: '/login',
    register: '/register',
    pharmacy: '/pharmacy',
    'product-detail': '/pharmacy',
    doctors: '/doctors',
    'doctor-booking': '/doctors',
    'doctor-apply': '/doctors',
    lab: '/lab',
    'lab-booking': '/lab',
    'pathologist-apply': '/lab',
    'ai-hub': '/auth/ai-hub',
    'ai-chat': '/auth/ai-chat',
    'ai-prescription': '/auth/ai-prescription',
    'ai-symptoms': '/auth/ai-symptoms',
    dashboard: '/auth/dashboard',
    admin: '/auth/admin',
    orders: '/auth/dashboard',
    'my-appointments': '/auth/dashboard',
    'my-lab-appointments': '/auth/dashboard',
  };
  return map[viewId] || `/${viewId}`;
};

function WithNav({ Component }) {
  const navigate = useNavigate();
  const onNavigate = (viewId) => navigate(viewToRoute(viewId));
  return <Component onNavigate={onNavigate} />;
}

// Legacy /auth/prescriptions/:id bookmarks redirect into the AI Health workflow.
function PrescriptionIdRedirect() {
  const { id } = useParams();
  return <Navigate to={`/auth/ai-prescription/${id}`} replace />;
}

// Single shared client (must not be recreated on every render).
const queryClient = new QueryClient()

export default function App() {

  const { user } = useSelector(state => state.auth)
  const isAdmin = user?.userType === "ADMIN"

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!isAdmin && <Navbar />}
        <Routes>
          <Route path="/" element={<WithNav Component={LandingPage} />} />
          <Route path="/login" element={<WithNav Component={LoginPage} />} />
          <Route path="/register" element={<WithNav Component={RegisterPage} />} />
          <Route path="/pharmacy" element={<WithNav Component={ProductListingPage} />} />
          <Route path="/doctors" element={<WithNav Component={DoctorListingPage} />} />
          <Route path="/lab" element={<WithNav Component={LabTestListingPage} />} />
          <Route path='/auth' element={<PrivateComponent />}>
            <Route path="dashboard" element={<WithNav Component={UserDashboardPage} />} />
            <Route path="ai-hub" element={<WithNav Component={AiHubPage} />} />
            <Route path="ai-chat" element={<WithNav Component={AiChatPage} />} />
            <Route path="ai-symptoms" element={<WithNav Component={FindMedicinesBySymptomPage} />} />
            <Route path="ai-prescription" element={<WithNav Component={PrescriptionExplainerPage} />} />
            <Route path="ai-prescription/:id" element={<PrescriptionDetailPage />} />
            <Route path="ai-prescription-legacy" element={<Navigate to="/auth/ai-prescription" replace />} />
            <Route path="prescriptions" element={<Navigate to="/auth/ai-prescription" replace />} />
            <Route path="prescriptions/:id" element={<PrescriptionIdRedirect />} />
          </Route>
          <Route path='/auth/admin' element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="doctors" element={<AdminDoctorsPage />} />
              <Route path="pathologists" element={<AdminPathologistsPage />} />
              <Route path="users" element={<AdminAllUsersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAdmin && <Footer />}
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}
