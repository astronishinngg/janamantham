// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if jm_token is missing
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes (like Dashboard) if authenticated
  return <Outlet />;
};