/**
 * Role-based access control permissions
 * Defines what menus and routes each role can access
 */

export const ROLE_PERMISSIONS = {
  ADMIN: {
    name: 'ADMIN',
    description: 'Full system access with all permissions',
    allowedMenus: [
      'dashboard',
      'admin',
      'documentManagement',
      'property',
      'leads',
      'scheduleMeetings',
      'purchaseBookings',
      'rentalBookings',
      'payments',
      'settings'
    ],
    allowedSubMenus: {
      admin: ['user-management', 'role-management', 'meeting-status-management'],
      documentManagement: ['document-type-management', 'document-management'],
      property: ['property-master', 'property-types', 'favorite-properties'],
      leads: ['leads', 'lead-status', 'lead-follow-up', 'reference-source'],
      scheduleMeetings: ['admin-meetings'],
      purchaseBookings: ['all-purchase-bookings', 'create-new-purchase'],
      rentalBookings: ['all-rental-bookings', 'create-new-rental'],
      payments: ['all-payment-history']
    }
  },
  
  SALES: {
    name: 'SALES',
    description: 'Sales personnel with limited access',
    allowedMenus: [
      'sales-dashboard',
      'property',
      'leads',
      'scheduleMeetings',
      'purchaseBookings',
      'rentalBookings',
      'payments',
      'settings'
    ],
    allowedSubMenus: {
      property: ['property-master', 'property-types', 'favorite-properties'],
      leads: ['leads', 'lead-status', 'lead-follow-up', 'reference-source'],
      scheduleMeetings: ['sales-meetings', 'my-meetings'],
      purchaseBookings: ['my-assigned-bookings', 'create-new-purchase'],
      rentalBookings: ['my-assigned-rentals', 'create-new-rental'],
      payments: ['assigned-payment-history']
    }
  },
  
  EXECUTIVE: {
    name: 'EXECUTIVE',
    description: 'Executive with financial overview and approvals',
    allowedMenus: [
      'executive-dashboard',
      'documentManagement',
      'property',
      'leads',
      'customers',
      'scheduleMeetings',
      'purchaseBookings',
      'rentalBookings',
      'payments',
      'settings'
    ],
    allowedSubMenus: {
      documentManagement: ['document-management'],
      property: ['property-master', 'property-types', 'favorite-properties'],
      leads: ['leads', 'lead-status', 'lead-follow-up', 'reference-source'],
      customers: ['customer-profiles'],
      scheduleMeetings: ['sales-meetings', 'my-meetings'],
      purchaseBookings: ['all-purchase-bookings', 'create-new-purchase'],
      rentalBookings: ['all-rental-bookings', 'create-new-rental'],
      payments: ['all-payment-history']
    }
  },
  
  USER: {
    name: 'USER',
    description: 'Limited user access with basic functionality',
    allowedMenus: [
      'user-dashboard',
      'documentManagement',
      'displayProperties',
      'scheduleMeetings',
      'purchaseBookings',
      'rentalBookings',
      'payments',
      'settings'
    ],
    allowedSubMenus: {
      documentManagement: ['my-documents'],
      displayProperties: ['properties', 'favorite'],
      scheduleMeetings: ['my-meetings'],
      purchaseBookings: ['my-bookings'],
      rentalBookings: ['my-bookings'],
      payments: ['my-payment-history']
    }
  },
  
  CLIENT: {
    name: 'CLIENT',
    description: 'Client portal access only',
    allowedMenus: [
      'user-dashboard',
      'client',
      'settings'
    ],
    allowedSubMenus: {
      client: ['my-bookings', 'my-meetings', 'payments']
    }
  }
};

/**
 * Check if a role has access to a specific menu
 * @param {string} roleName - Role name (e.g., 'USER', 'ADMIN')
 * @param {string} menuKey - Menu key (e.g., 'dashboard', 'property')
 * @returns {boolean} True if role has access to menu
 */
export const hasMenuAccess = (roleName, menuKey) => {
  const role = ROLE_PERMISSIONS[roleName];
  if (!role) return false;
  return role.allowedMenus.includes(menuKey);
};

/**
 * Check if a role has access to a specific submenu
 * @param {string} roleName - Role name (e.g., 'USER', 'ADMIN')
 * @param {string} menuKey - Parent menu key
 * @param {string} subMenuKey - Submenu key
 * @returns {boolean} True if role has access to submenu
 */
export const hasSubMenuAccess = (roleName, menuKey, subMenuKey) => {
  const role = ROLE_PERMISSIONS[roleName];
  if (!role) return false;
  
  const allowedSubMenus = role.allowedSubMenus[menuKey];
  if (!allowedSubMenus) return false;
  
  return allowedSubMenus.includes(subMenuKey);
};

/**
 * Get allowed menus for a role
 * @param {string} roleName - Role name
 * @returns {Array} Array of allowed menu keys
 */
export const getAllowedMenus = (roleName) => {
  const role = ROLE_PERMISSIONS[roleName];
  return role ? role.allowedMenus : [];
};

/**
 * Get allowed submenus for a role and menu
 * @param {string} roleName - Role name
 * @param {string} menuKey - Parent menu key
 * @returns {Array} Array of allowed submenu keys
 */
export const getAllowedSubMenus = (roleName, menuKey) => {
  const role = ROLE_PERMISSIONS[roleName];
  if (!role) return [];
  
  const allowedSubMenus = role.allowedSubMenus[menuKey];
  return allowedSubMenus || [];
};

/**
 * Check if user has access to a route
 * @param {string} roleName - Role name
 * @param {string} route - Route path
 * @returns {boolean} True if role has access to route
 */
export const hasRouteAccess = (roleName, route) => {
  // Define route to menu mapping
  const routeToMenuMap = {
    '/dashboard': 'dashboard',
    '/user-dashboard': 'user-dashboard',
    '/sales-dashboard': 'sales-dashboard',
    '/executive-dashboard': 'executive-dashboard',
    '/admin/user-management': 'admin',
    '/admin/role-management': 'admin',
    '/admin/document-type-management': 'documentManagement',
    '/admin/document-management': 'documentManagement',
    '/client/documents': 'documentManagement',
    '/property/property-master': 'property',
    '/property/property-types': 'property',
    '/property/favorite-properties': 'property',
    '/properties': 'displayProperties',
    '/properties/favorite-properties': 'displayProperties',
    '/lead/add': 'leads',
    '/lead/view': 'leads',
    '/lead/qualification': 'leads',
    '/lead/reference-source': 'leads',
    '/customers/profiles': 'customers',
    '/admin-meetings': 'scheduleMeetings',
    '/sales-meetings': 'scheduleMeetings',
    '/my-meetings': 'scheduleMeetings',
    '/purchase-bookings/all': 'purchaseBookings',
    '/purchase-bookings/my-assigned': 'purchaseBookings',
    '/purchase-bookings/my-bookings': 'purchaseBookings',
    '/purchase-bookings/create': 'purchaseBookings',
    '/rental-bookings/all': 'rentalBookings',
    '/rental-bookings/my-assigned': 'rentalBookings',
    '/rental-bookings/my-bookings': 'rentalBookings',
    '/rental-bookings/create': 'rentalBookings',
    '/payment-history/all': 'payments',
    '/payment-history/assigned': 'payments',
    '/payment-history/my': 'payments',
    '/client/my-bookings': 'client',
    '/client/my-meetings': 'client',
    '/client/payments': 'client',
    '/settings': 'settings'
  };
  
  const menuKey = routeToMenuMap[route];
  if (!menuKey) return true; // Allow unknown routes by default
  
  return hasMenuAccess(roleName, menuKey);
};

/**
 * Get role display name
 * @param {string} roleName - Role name
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (roleName) => {
  const role = ROLE_PERMISSIONS[roleName];
  return role ? role.name : roleName;
};

/**
 * Get role description
 * @param {string} roleName - Role name
 * @returns {string} Description for the role
 */
export const getRoleDescription = (roleName) => {
  const role = ROLE_PERMISSIONS[roleName];
  return role ? role.description : 'Unknown role';
};
