// Route constants for the application
// This file centralizes all route paths to avoid hardcoding strings throughout the app

export const ROUTES = {
  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Main Routes
  HOME: '/',
  FEATURES: '/features',
  ABOUT: '/about',
  CONTACT: '/contact',
  PROPERTY_DETAILS: '/property-details',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Admin Routes
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_ROLE_MANAGEMENT: '/admin/role-management',
  ADMIN_DOCUMENT_TYPE_MANAGEMENT: '/admin/document-type-management',
  ADMIN_DOCUMENT_MANAGEMENT: '/admin/document-management',
  ADMIN_REPORTS: '/admin/reports',

  // Property Routes
  PROPERTY_MASTER: '/property/property-master',
  PROPERTY_TYPES: '/property/property-types',
  PROPERTY_FAVORITES: '/property/favorite-properties',

  // Display Properties Routes
  PROPERTIES: '/properties',
  DISPLAY_FAVORITES: '/properties/favorite-properties',
  PROPERTY_MASTER_DISPLAY: '/property-master-display',

  // Lead Management Routes
  LEAD_ADD: '/lead/add',
  LEAD_VIEW: '/lead/view',
  LEAD_QUALIFICATION: '/lead/qualification',
  LEAD_REFERENCE_SOURCE: '/lead/reference-source',

  // Customer Management Routes
  CUSTOMER_PROFILES: '/customers/profiles',
  CUSTOMER_DOCUMENTS: '/customers/documents',
  CUSTOMER_DOCUMENT_TYPES: '/customers/document-types',
  CUSTOMER_MEETING_SCHEDULER: '/customers/meeting-scheduler',

  // Sales Management Routes
  SALES_LIST: '/sales/sales-list',
  SALES_ADD_PAYMENT: '/sales/add-payment',
  SALES_PENDING_PAYMENTS: '/sales/pending-payments',
  SALES_REPORTS: '/sales/sales-reports',

  // Bookings Routes
  BOOKINGS_INVENTORY: '/bookings/inventory',
  BOOKINGS_BOOKED_UNITS: '/bookings/booked-units',
  BOOKINGS_PAYMENT_STATUS: '/bookings/payment-status',

  // Payments Routes
  PAYMENTS_INSTALLMENTS: '/payments/installments',
  PAYMENTS_HISTORY: '/payments/payment-history',
  PAYMENTS_DUE: '/payments/due-payments',

  // Rent Management Routes
  RENT_ROLL: '/rent/rent-roll',
  LEASE_MANAGEMENT: '/rent/lease-management',

  // Accounting Routes
  ACCOUNTING_EXPENSE_TRACKING: '/accounting/expense-tracking',
  ACCOUNTING_INCOME_STATEMENT: '/accounting/income-statement',

  // Post-Sale Routes
  POST_SALE_REFERRALS: '/post-sale/referrals',
  POST_SALE_REWARDS: '/post-sale/rewards',
  POST_SALE_POINTS: '/post-sale/points',

  // Client Portal Routes
  CLIENT_MY_BOOKINGS: '/client/my-bookings',
  CLIENT_MY_MEETINGS: '/client/my-meetings',
  CLIENT_DOCUMENTS: '/client/documents',
  CLIENT_PAYMENTS: '/client/payments',
  CLIENT_REFERRALS: '/client/referrals',

  // Settings & Profile
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Theme Demo
  THEME_DEMO: '/theme-demo',
};

// Route groups for easier management
export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER],
  MAIN: [ROUTES.HOME, ROUTES.FEATURES, ROUTES.ABOUT, ROUTES.CONTACT, ROUTES.PROPERTY_DETAILS],
  ADMIN: [
    ROUTES.ADMIN_USER_MANAGEMENT,
    ROUTES.ADMIN_ROLE_MANAGEMENT,
    ROUTES.ADMIN_DOCUMENT_TYPE_MANAGEMENT,
    ROUTES.ADMIN_DOCUMENT_MANAGEMENT,
    ROUTES.ADMIN_REPORTS
  ],
  PROPERTY: [
    ROUTES.PROPERTY_MASTER,
    ROUTES.PROPERTY_TYPES,
    ROUTES.PROPERTY_FAVORITES
  ],
  DISPLAY_PROPERTIES: [
    ROUTES.PROPERTIES,
    ROUTES.DISPLAY_FAVORITES,
    ROUTES.PROPERTY_MASTER_DISPLAY
  ],
  LEAD: [
    ROUTES.LEAD_ADD,
    ROUTES.LEAD_VIEW,
    ROUTES.LEAD_QUALIFICATION,
    ROUTES.LEAD_REFERENCE_SOURCE
  ],
  CUSTOMER: [
    ROUTES.CUSTOMER_PROFILES,
    ROUTES.CUSTOMER_DOCUMENTS,
    ROUTES.CUSTOMER_DOCUMENT_TYPES,
    ROUTES.CUSTOMER_MEETING_SCHEDULER
  ],
  SALES: [
    ROUTES.SALES_LIST,
    ROUTES.SALES_ADD_PAYMENT,
    ROUTES.SALES_PENDING_PAYMENTS,
    ROUTES.SALES_REPORTS
  ],
  BOOKINGS: [
    ROUTES.BOOKINGS_INVENTORY,
    ROUTES.BOOKINGS_BOOKED_UNITS,
    ROUTES.BOOKINGS_PAYMENT_STATUS
  ],
  PAYMENTS: [
    ROUTES.PAYMENTS_INSTALLMENTS,
    ROUTES.PAYMENTS_HISTORY,
    ROUTES.PAYMENTS_DUE
  ],
  RENT: [
    ROUTES.RENT_ROLL,
    ROUTES.LEASE_MANAGEMENT
  ],
  ACCOUNTING: [
    ROUTES.ACCOUNTING_EXPENSE_TRACKING,
    ROUTES.ACCOUNTING_INCOME_STATEMENT
  ],
  POST_SALE: [
    ROUTES.POST_SALE_REFERRALS,
    ROUTES.POST_SALE_REWARDS,
    ROUTES.POST_SALE_POINTS
  ],
  CLIENT: [
    ROUTES.CLIENT_MY_BOOKINGS,
    ROUTES.CLIENT_MY_MEETINGS,
    ROUTES.CLIENT_DOCUMENTS,
    ROUTES.CLIENT_PAYMENTS,
    ROUTES.CLIENT_REFERRALS
  ]
};

// Helper function to get route by name
export const getRoute = (routeName) => {
  return ROUTES[routeName] || '/';
};

// Helper function to check if a path matches a route
export const isRoute = (path, routeName) => {
  return path === ROUTES[routeName];
};

// Helper function to get route group
export const getRouteGroup = (path) => {
  for (const [groupName, routes] of Object.entries(ROUTE_GROUPS)) {
    if (routes.includes(path)) {
      return groupName;
    }
  }
  return null;
}; 