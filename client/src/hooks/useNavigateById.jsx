import { useNavigate } from 'react-router-dom';

// Maps the legacy view ids (still referenced throughout the page
// components) to their React Router paths.
const VIEW_ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  pharmacy: '/pharmacy',
  'product-detail': '/product-detail',
  doctors: '/doctors',
  'doctor-booking': '/doctor-booking',
  'doctor-apply': '/doctors/apply',
  lab: '/lab',
  'lab-booking': '/lab/booking',
  'pathologist-apply': '/lab/apply',
  'my-appointments': '/auth/my-appointments',
  'my-lab-appointments': '/auth/my-lab-appointments',
  orders: '/auth/orders',
  dashboard: '/auth/dashboard',
  admin: '/auth/admin',
  'ai-hub': '/auth/ai-hub',
  'ai-chat': '/ai-chat',
  'ai-prescription': '/ai/prescription',
  'ai-symptoms': '/ai/symptoms',
};

// Returns an onNavigate(viewId) handler backed by React Router,
// so components can keep navigating by view id.
export default function useNavigateById() {
  const navigate = useNavigate();
  return (viewId) => navigate(VIEW_ROUTES[viewId] ?? '/');
}
