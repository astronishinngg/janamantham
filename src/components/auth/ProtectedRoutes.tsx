import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types/auth';

export const RequireAuth: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return null; // Or a full-screen loading spinner

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export const RequireRole: React.FC<{ allowedRoles: UserRole[] }> = ({ allowedRoles }) => {
  const { role, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  return role && allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export const RedirectIfAuthenticated: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};