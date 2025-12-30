import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { useAuth } from '../auth/AuthProvider';
import { PrivateRoute } from '../auth/PrivateRoute';

import { SuperAdminLayout } from '../pages/superadmin/components/SuperAdminLayout';
import { ManagerLayout } from '../pages/manager/components/ManagerLayout';
import { TechLayout } from '../pages/tech/components/TechLayout';

import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';
import { SuperAdminProfile } from '../pages/superadmin/Profile';
import { UserManagement } from '../pages/superadmin/UserManagement';

import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { ManagerProfile } from '../pages/manager/Profile';

import { TechDashboard } from '../pages/tech/TechDashboard';
import { TechProfile } from '../pages/tech/Profile';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === 'superadmin' && <Navigate to="/superadmin-dashboard" replace />}
              {user?.role === 'manager' && <Navigate to="/manager-dashboard" replace />}
              {user?.role === 'tech' && <Navigate to="/tech-dashboard" replace />}
            </PrivateRoute>
          }
        />

        <Route
          path="/superadmin-dashboard"
          element={
            <PrivateRoute requiredRoles={['superadmin']}>
              <SuperAdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoute requiredRoles={['manager']}>
              <ManagerLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>

        <Route
          path="/tech-dashboard"
          element={
            <PrivateRoute requiredRoles={['tech']}>
              <TechLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<TechDashboard />} />
          <Route path="profile" element={<TechProfile />} />
        </Route>

        <Route path="/unauthorized" element={<div className="flex items-center justify-center min-h-screen">Unauthorized Access</div>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};
