import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Page Named Imports
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { Dashboard } from '@/pages/Dashboard';
import { ManthanEngine } from '@/pages/ManthanEngine';
import { Analytics } from '@/pages/Analytics';
import { IndiaHeatmap } from '@/pages/IndiaHeatmap';
import { RootCauseAnalysis } from '@/pages/RootCauseAnalysis';
import { PolicyBriefs } from '@/pages/PolicyBriefs';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('jm_authenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('jm_authenticated') === 'true';
  return !isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.DASHBOARD} replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Landing />} />
        
        {/* Auth Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.MANTHAN_ENGINE} element={<ManthanEngine />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.INDIA_HEATMAP} element={<IndiaHeatmap />} />
          <Route path={ROUTES.ROOT_CAUSE} element={<RootCauseAnalysis />} />
          <Route path={ROUTES.POLICY_BRIEFS} element={<PolicyBriefs />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};