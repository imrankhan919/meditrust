import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageSwitcher from './components/navigation/PageSwitcher';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductListingPage from './pages/pharmacy/ProductListingPage';
import ProductDetailPage from './pages/pharmacy/ProductDetailPage';
import MyOrdersPage from './pages/orders/MyOrdersPage';
import DoctorListingPage from './pages/doctors/DoctorListingPage';
import DoctorBookingPage from './pages/doctors/DoctorBookingPage';
import MyAppointmentsPage from './pages/doctors/MyAppointmentsPage';
import DoctorApplicationPage from './pages/doctors/DoctorApplicationPage';
import LabTestListingPage from './pages/lab/LabTestListingPage';
import BookLabTestPage from './pages/lab/BookLabTestPage';
import MyLabAppointmentsPage from './pages/lab/MyLabAppointmentsPage';
import PathologistApplicationPage from './pages/lab/PathologistApplicationPage';
import AiHubPage from './pages/ai/AiHubPage';
import AiChatPage from './pages/ai/AiChatPage';
import PrescriptionExplainerPage from './pages/ai/PrescriptionExplainerPage';
import FindMedicinesBySymptomPage from './pages/ai/FindMedicinesBySymptomPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PrivateComponent from './components/PrivateComponent';
import { useSelector } from 'react-redux';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminAllUsersPage from './pages/admin/AdminAllUsersPage';

export default function App() {

  const { user } = useSelector(state => state.auth)

  // Create a client
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent user={user} />
      </Router>
    </QueryClientProvider>
  );
}

// Renders everything that needs React Router context (useNavigate / useLocation).
function AppContent({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Client-side navigation used by pages and the navbar.
  // Every page id maps to an existing route (reusing existing components).
  const ROUTE_BY_PAGE = {
    landing: '/',
    login: '/login',
    register: '/register',
    pharmacy: '/pharmacy',
    doctors: '/doctors',
    lab: '/lab',
    'doctor-booking': '/doctor-booking',
    'product-detail': '/product-detail',
    'ai-prescription': '/ai-prescription',
    'ai-chat': '/ai-chat',
    'auth/dashboard': '/auth/dashboard',
    'auth/admin': '/auth/admin',
    'auth/ai-hub': '/auth/ai-hub',
    'auth/orders': '/auth/orders',
    'auth/products': '/auth/products',
  }

  const onNavigate = (pageId) => {
    const route = ROUTE_BY_PAGE[pageId]
    if (route) {
      navigate(route)
    }
  }

  const PAGE_BY_PATH = {
    '/': 'landing',
    '/login': 'login',
    '/register': 'register',
    '/pharmacy': 'pharmacy',
    '/doctors': 'doctors',
    '/lab': 'lab',
    '/doctor-booking': 'doctor-booking',
    '/product-detail': 'product-detail',
    '/ai-prescription': 'ai-prescription',
    '/ai-chat': 'ai-chat',
  }

  let currentView = PAGE_BY_PATH[location.pathname]
  if (!currentView && location.pathname.startsWith('/auth/')) {
    currentView = location.pathname.slice(1)
  }


  return (
    <>
      <Navbar onNavigate={onNavigate} currentView={currentView} />
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={onNavigate} />} />
        <Route path="/login" element={<LoginPage onNavigate={onNavigate} />} />
        <Route path="/register" element={<RegisterPage onNavigate={onNavigate} />} />
        <Route path="/pharmacy" element={<ProductListingPage />} />
        <Route path="/doctors" element={<DoctorListingPage />} />
        <Route path="/lab" element={<LabTestListingPage />} />
        <Route path="/doctor-booking" element={<DoctorBookingPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/ai-prescription" element={<PrescriptionExplainerPage />} />
        <Route path="/ai-chat" element={<AiChatPage />} />
        <Route path='/auth' element={<PrivateComponent />}>
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="ai-hub" element={<AiHubPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/products" element={<AdminProductsPage />} />
          <Route path="admin/doctors" element={<AdminDoctorsPage />} />
          <Route path="admin/pathologists" element={<AdminDoctorsPage />} />
          <Route path="admin/users" element={<AdminAllUsersPage />} />
        </Route>
      </Routes>
      {
        !user?.userType === "ADMIN" && <Footer />
      }
      <Toaster />
    </>
  );
}
