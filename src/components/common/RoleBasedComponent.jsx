import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

// Component that shows different content based on user role
const RoleBasedComponent = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  showRoleInfo = false 
}) => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  // Check if user has access
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // If no access, show fallback or nothing
  if (!hasAccess) {
    return fallback || null;
  }

  return (
    <div className="role-based-component">
      {showRoleInfo && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <strong>Role:</strong> {userRole} | <strong>Access:</strong> Granted
        </div>
      )}
      {children}
    </div>
  );
};

// Specific role components for easier use
export const AdminOnly = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.ADMIN]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const SalesOnly = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.SALES]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const ExecutiveOnly = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.EXECUTIVE]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const ClientOnly = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.CLIENT]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const AdminAndExecutive = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.EXECUTIVE]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const SalesAndExecutive = ({ children, fallback }) => (
  <RoleBasedComponent allowedRoles={[USER_ROLES.SALES, USER_ROLES.EXECUTIVE]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

// Component that shows different content for different roles
export const RoleSpecificContent = ({ 
  adminContent, 
  salesContent, 
  executiveContent, 
  clientContent,
  defaultContent = "No content available for your role"
}) => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  let content;
  switch (userRole) {
    case USER_ROLES.ADMIN:
      content = adminContent;
      break;
    case USER_ROLES.SALES:
      content = salesContent;
      break;
    case USER_ROLES.EXECUTIVE:
      content = executiveContent;
      break;
    case USER_ROLES.CLIENT:
      content = clientContent;
      break;
    default:
      content = defaultContent;
  }

  return (
    <div className="role-specific-content">
      {content}
    </div>
  );
};

// Hook for conditional rendering based on role
export const useRoleAccess = () => {
  const { getUserRole, isAdmin, isSales, isExecutive, isClient } = useAuth();
  const userRole = getUserRole();

  return {
    userRole,
    isAdmin: isAdmin(),
    isSales: isSales(),
    isExecutive: isExecutive(),
    isClient: isClient(),
    hasRole: (roles) => {
      if (Array.isArray(roles)) {
        return roles.includes(userRole);
      }
      return roles === userRole;
    }
  };
};

export default RoleBasedComponent; 