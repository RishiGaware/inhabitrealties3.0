/**
 * Utility functions for role management
 * These functions provide easy access to user role information from localStorage
 */

/**
 * Get user role from localStorage
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role;
};

/**
 * Get user role details from localStorage
 * @returns {object|null} User role details or null if not found
 */
export const getUserRoleDetails = () => {
  const roleDetails = localStorage.getItem('userRoleDetails');
  if (roleDetails) {
      try {
        const parsed = JSON.parse(roleDetails);
        return parsed;
      } catch {
        return null;
      }
  }
  return null;
};

/**
 * Get user role name from localStorage
 * @returns {string|null} User role name or null if not found
 */
export const getUserRoleName = () => {
  // First try to get from direct storage
  const directRoleName = localStorage.getItem('userRoleName');
  if (directRoleName) {
    return directRoleName;
  }
  
  // Fallback to role details
  const roleDetails = getUserRoleDetails();
  const roleName = roleDetails?.name || null;
  return roleName;
};

/**
 * Check if user has a specific role
 * @param {string} roleName - Role name to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (roleName) => {
  const userRole = getUserRole();
  const roleDetails = getUserRoleDetails();
  
  return userRole === roleName || roleDetails?.name === roleName;
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  return hasRole('ADMIN') || hasRole('68162f63ff2da55b40ca61b8');
};

/**
 * Check if user is sales
 * @returns {boolean} True if user is sales
 */
export const isSales = () => {
  return hasRole('SALES');
};

/**
 * Check if user is executive
 * @returns {boolean} True if user is executive
 */
export const isExecutive = () => {
  return hasRole('EXECUTIVE');
};

/**
 * Check if user is client
 * @returns {boolean} True if user is client
 */
export const isClient = () => {
  return hasRole('CLIENT');
};


