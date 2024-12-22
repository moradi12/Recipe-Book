// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserType } from '../../Models/UserType';
import { getUserType, isAuthenticated } from '../../Utiles/authService';

interface ProtectedRouteProps {
  requiredRole: UserType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const auth = isAuthenticated();
  const userType = getUserType();

  if (!auth) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
