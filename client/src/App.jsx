import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
        {
          !user.userType === "ADMIN" && <Navbar />
        }
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pharmacy" element={<ProductListingPage />} />
          <Route path="/doctors" element={<DoctorListingPage />} />
          <Route path="/lab" element={<LabTestListingPage />} />
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
          !user.userType === "ADMIN" && <Footer />
        }
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}
