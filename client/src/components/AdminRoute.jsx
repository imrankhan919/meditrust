import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Loader from "./common/Loader";

/**
 * Admin-only route guard.
 * Backend (protect.forAdmin) is the real enforcement; this is UI-level
 * protection so non-admin users never see admin screens.
 */
const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const { isLoggedIn, checkingUser } = useAuthStatus();
  const location = useLocation();

  if (checkingUser) {
    return <Loader />;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.userType !== "ADMIN") {
    return <Navigate to="/auth/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
