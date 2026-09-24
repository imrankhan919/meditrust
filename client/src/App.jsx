import React, { useState, useEffect } from 'react';
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

export default function App() {

  // Create a client
  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
}
