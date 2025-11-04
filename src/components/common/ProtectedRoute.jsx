import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasRouteAccess } from '../../utils/rolePermissions';

/**
 * Protected Route Component
 * Restricts access to routes based on user role
 */
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { isAuthenticated, getUserRoleName } = useAuth();
  const location = useLocation();
  const userRole = getUserRoleName() || 'USER';

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific role is required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If specific roles are allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check route access based on role permissions
  const hasAccess = hasRouteAccess(userRole, location.pathname);
  
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;







