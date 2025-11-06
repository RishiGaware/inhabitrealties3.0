import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { hasRouteAccess, getDashboardRoute } from '../../utils/rolePermissions';

/**
 * Protected Route Component
 * Restricts access to routes based on user role
 */
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, getUserRoleName } = useAuth();
  const location = useLocation();
  const userRole = getUserRoleName() || 'USER';

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
        </Box>
      </Center>
    );
  }

  // Check if user is authenticated (only after loading is complete)
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
    // If user is trying to access /dashboard but doesn't have access, redirect to their role-specific dashboard
    if (location.pathname === '/dashboard') {
      const dashboardRoute = getDashboardRoute(userRole);
      return <Navigate to={dashboardRoute} replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;







