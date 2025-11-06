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
      // 'sales-dashboard',
      // 'executive-dashboard',
      // 'user-dashboard',
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
  // Define route to menu and submenu mapping
  const routeToMenuMap = {
    '/dashboard': { menu: 'dashboard', submenu: null },
    '/user-dashboard': { menu: 'user-dashboard', submenu: null },
    '/sales-dashboard': { menu: 'sales-dashboard', submenu: null },
    '/executive-dashboard': { menu: 'executive-dashboard', submenu: null },
    '/admin/user-management': { menu: 'admin', submenu: 'user-management' },
    '/admin/role-management': { menu: 'admin', submenu: 'role-management' },
    '/admin/meeting-status-management': { menu: 'admin', submenu: 'meeting-status-management' },
    '/admin/document-type-management': { menu: 'documentManagement', submenu: 'document-type-management' },
    '/admin/document-management': { menu: 'documentManagement', submenu: 'document-management' },
    '/client/documents': { menu: 'documentManagement', submenu: 'my-documents' },
    '/property/property-master': { menu: 'property', submenu: 'property-master' },
    '/property/property-types': { menu: 'property', submenu: 'property-types' },
    '/property/favorite-properties': { menu: 'property', submenu: 'favorite-properties' },
    '/properties': { menu: 'displayProperties', submenu: 'properties' },
    '/properties/favorite-properties': { menu: 'displayProperties', submenu: 'favorite' },
    '/lead/add': { menu: 'leads', submenu: 'leads' },
    '/lead/view': { menu: 'leads', submenu: 'leads' },
    '/lead/qualification': { menu: 'leads', submenu: 'lead-status' },
    '/lead/reference-source': { menu: 'leads', submenu: 'reference-source' },
    '/customers/profiles': { menu: 'customers', submenu: 'customer-profiles' },
    '/admin-meetings': { menu: 'scheduleMeetings', submenu: 'admin-meetings' },
    '/sales-meetings': { menu: 'scheduleMeetings', submenu: 'sales-meetings' },
    '/my-meetings': { menu: 'scheduleMeetings', submenu: 'my-meetings' },
    '/purchase-bookings/all': { menu: 'purchaseBookings', submenu: 'all-purchase-bookings' },
    '/purchase-bookings/my-assigned': { menu: 'purchaseBookings', submenu: 'my-assigned-bookings' },
    '/purchase-bookings/my-bookings': { menu: 'purchaseBookings', submenu: 'my-bookings' },
    '/purchase-bookings/create': { menu: 'purchaseBookings', submenu: 'create-new-purchase' },
    '/rental-bookings/all': { menu: 'rentalBookings', submenu: 'all-rental-bookings' },
    '/rental-bookings/my-assigned': { menu: 'rentalBookings', submenu: 'my-assigned-rentals' },
    '/rental-bookings/my-bookings': { menu: 'rentalBookings', submenu: 'my-bookings' },
    '/rental-bookings/create': { menu: 'rentalBookings', submenu: 'create-new-rental' },
    '/payment-history/all': { menu: 'payments', submenu: 'all-payment-history' },
    '/payment-history/assigned': { menu: 'payments', submenu: 'assigned-payment-history' },
    '/payment-history/my': { menu: 'payments', submenu: 'my-payment-history' },
    '/client/my-bookings': { menu: 'client', submenu: 'my-bookings' },
    '/client/my-meetings': { menu: 'client', submenu: 'my-meetings' },
    '/client/payments': { menu: 'client', submenu: 'payments' },
    '/settings': { menu: 'settings', submenu: null }
  };
  
  const routeMapping = routeToMenuMap[route];
  
  // If route is not in the mapping, allow access by default (don't restrict unknown routes)
  if (!routeMapping) {
    return true;
  }
  
  const { menu: menuKey, submenu: subMenuKey } = routeMapping;
  
  // Check if role has access to the menu
  if (!hasMenuAccess(roleName, menuKey)) {
    // Menu access denied - restrict route
    return false;
  }
  
  // If there's a submenu, check submenu access
  if (subMenuKey) {
    const hasSubAccess = hasSubMenuAccess(roleName, menuKey, subMenuKey);
    // Enforce submenu access - restrict if no access
    return hasSubAccess;
  }
  
  // Menu access granted and no submenu restriction, allow route
  return true;
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

/**
 * Get the dashboard route for a specific role
 * @param {string} roleName - Role name
 * @returns {string} Dashboard route path
 */
export const getDashboardRoute = (roleName) => {
  const roleDashboardMap = {
    'ADMIN': '/dashboard',
    'SALES': '/sales-dashboard',
    'EXECUTIVE': '/executive-dashboard',
    'USER': '/user-dashboard',
    'CLIENT': '/user-dashboard'
  };
  
  return roleDashboardMap[roleName] || '/user-dashboard';
};
