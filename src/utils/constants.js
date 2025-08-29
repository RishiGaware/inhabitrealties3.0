// Route constants for the application
// This file centralizes all route paths to avoid hardcoding strings throughout the app

// User Role Constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SALES: 'SALES',
  EXECUTIVE: 'EXECUTIVE',
  CLIENT: 'CLIENT'
};

// Role-based access control
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    name: 'Admin',
    description: 'Full system access with all permissions',
    canAccess: ['dashboard', 'admin', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'sales', 'bookings', 'payments', 'paymentHistory', 'financialReports', 'rent', 'postSale', 'client', 'settings']
  },
  [USER_ROLES.SALES]: {
    name: 'Sales',
    description: 'Sales personnel with limited access',
    canAccess: ['dashboard', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'bookings', 'payments', 'paymentHistory', 'postSale', 'client', 'settings']
  },
  [USER_ROLES.EXECUTIVE]: {
    name: 'Executive',
    description: 'Executive with financial overview and approvals',
    canAccess: ['dashboard', 'property', 'displayProperties', 'leads', 'customers', 'scheduleMeetings', 'sales', 'bookings', 'payments', 'paymentHistory', 'financialReports', 'rent', 'postSale', 'client', 'settings']
  },
  [USER_ROLES.CLIENT]: {
    name: 'Client',
    description: 'Client portal access only',
    canAccess: ['dashboard', 'client', 'settings']
  }
};

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

  // My Meetings (Standalone)
  MY_MEETINGS: '/my-meetings',

  // Schedule Meetings Routes
  ADMIN_MEETINGS: '/admin-meetings',
  SALES_MEETINGS: '/sales-meetings',
  CLIENT_MY_MEETINGS: '/client/my-meetings',

  // Admin Routes
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_ROLE_MANAGEMENT: '/admin/role-management',
  ADMIN_DOCUMENT_TYPE_MANAGEMENT: '/admin/document-type-management',
  ADMIN_DOCUMENT_MANAGEMENT: '/admin/document-management',
  ADMIN_MEETING_STATUS_MANAGEMENT: '/admin/meeting-status-management',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SALESPERSON_MANAGEMENT: '/admin/salesperson-management',

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


  // Sales Management Routes
  SALES_LIST: '/sales/sales-list',
  SALES_ADD_PAYMENT: '/sales/add-payment',
  SALES_PENDING_PAYMENTS: '/sales/pending-payments',
  SALES_REPORTS: '/sales/sales-reports',

  // Bookings Routes
  BOOKINGS_INVENTORY: '/bookings/inventory',
  BOOKINGS_BOOKED_UNITS: '/bookings/booked-units',
  BOOKINGS_PAYMENT_STATUS: '/bookings/payment-status',
  BOOKINGS_PURCHASE_MANAGEMENT: '/bookings/purchase-management',
  BOOKINGS_RENTAL_MANAGEMENT: '/bookings/rental-management',
  
  // Purchase Bookings Routes
  PURCHASE_ALL_BOOKINGS: '/purchase-bookings/all',
  PURCHASE_VIEW_BOOKING: '/purchase-bookings/:id',
  PURCHASE_UPDATE_BOOKING: '/purchase-bookings/update/:id',
  PURCHASE_DELETE_BOOKING: '/purchase-bookings/delete/:id',
  PURCHASE_CREATE_NEW: '/purchase-bookings/create',
  PURCHASE_EDIT: '/purchase-bookings/edit/:id',
  PURCHASE_INSTALLMENT_SCHEDULE: '/purchase-bookings/installment-schedule',
  PURCHASE_PENDING_INSTALLMENTS: '/purchase-bookings/pending-installments',
  PURCHASE_OVERDUE_INSTALLMENTS: '/purchase-bookings/overdue-installments',
  PURCHASE_MY_BOOKINGS: '/purchase-bookings/my-assigned',
  
  // Purchase Booking API Endpoints
  PURCHASE_API_ALL: '/api/purchase-booking/all',
  PURCHASE_API_VIEW: '/api/purchase-booking/:id',
  PURCHASE_API_UPDATE: '/api/purchase-booking/update/:id',
  PURCHASE_API_DELETE: '/api/purchase-booking/delete/:id',
  PURCHASE_API_CREATE: '/api/purchase-booking/create',
  PURCHASE_API_SEARCH: '/api/purchase-booking/search',
  PURCHASE_API_FILTER: '/api/purchase-booking/filter',
  PURCHASE_API_EXPORT_EXCEL: '/api/purchase-booking/export/excel',
  PURCHASE_API_EXPORT_PDF: '/api/purchase-booking/export/pdf',
  PURCHASE_API_BULK_UPDATE: '/api/purchase-booking/bulk-update',
  PURCHASE_API_BULK_DELETE: '/api/purchase-booking/bulk-delete',
  
  // Rental Bookings Routes
  RENTAL_ALL_BOOKINGS: '/rental-bookings/all',
  RENTAL_MY_RENTALS: '/rental-bookings/my-assigned',
  RENTAL_CREATE_NEW: '/rental-bookings/create',
  RENTAL_RENT_SCHEDULE: '/rental-bookings/rent-schedule',
  RENTAL_PENDING_RENTS: '/rental-bookings/pending-rents',
  RENTAL_OVERDUE_RENTS: '/rental-bookings/overdue-rents',

  // Payments Routes
  PAYMENTS_INSTALLMENTS: '/payments/installments',
  PAYMENTS_HISTORY: '/payments/payment-history',
  PAYMENTS_DUE: '/payments/due-payments',
  PAYMENTS_HISTORY_ENHANCED: '/payments/payment-history-enhanced',
  PAYMENTS_REPORTS: '/payments/reports',
  PAYMENTS_FILTERING: '/payments/filtering',
  
  // Payment Management Routes (New)
  PAYMENTS_RECORD: '/payments/record',
  PAYMENTS_APPROVAL: '/payments/approval',
  PAYMENTS_RECONCILIATION: '/payments/reconciliation',
  
  // Payment History Routes
  PAYMENT_HISTORY_ALL: '/payment-history/all',
  PAYMENT_HISTORY_DETAILS: '/payment-history/details',
  PAYMENT_HISTORY_RECORD: '/payment-history/record',
  
  // Payment Reports Routes
  PAYMENT_REPORTS_SUMMARY: '/payment-reports/summary',
  PAYMENT_REPORTS_PENDING: '/payment-reports/pending',
  PAYMENT_REPORTS_OVERDUE: '/payment-reports/overdue',
  PAYMENT_REPORTS_COLLECTION: '/payment-reports/collection',
  PAYMENT_REPORTS_REVENUE: '/payment-reports/revenue',

  // Financial Reports Routes (New)
  FINANCIAL_PAYMENT_SUMMARY: '/financial-reports/payment-summary',
  FINANCIAL_PENDING_PAYMENTS: '/financial-reports/pending-payments',
  FINANCIAL_OVERDUE_PAYMENTS: '/financial-reports/overdue-payments',
  FINANCIAL_COLLECTION_REPORTS: '/financial-reports/collection-reports',
  FINANCIAL_REVENUE_ANALYSIS: '/financial-reports/revenue-analysis',

  // Rent Management Routes
  RENT_ROLL: '/rent/rent-roll',
  LEASE_MANAGEMENT: '/rent/lease-management',
  RENT_SCHEDULE: '/rent-management/schedule',
  RENT_OVERDUE_RENTS: '/rent-management/overdue-rents',



  // Post-Sale Routes
  POST_SALE_REFERRALS: '/post-sale/referrals',
  POST_SALE_REWARDS: '/post-sale/rewards',
  POST_SALE_POINTS: '/post-sale/points',

  // Client Portal Routes
  CLIENT_MY_BOOKINGS: '/client/my-bookings',
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
    ROUTES.ADMIN_MEETING_STATUS_MANAGEMENT,
    ROUTES.ADMIN_REPORTS,
    ROUTES.ADMIN_SALESPERSON_MANAGEMENT
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
    ROUTES.BOOKINGS_PAYMENT_STATUS,
    ROUTES.BOOKINGS_PURCHASE_MANAGEMENT,
    ROUTES.BOOKINGS_RENTAL_MANAGEMENT,
    ROUTES.PURCHASE_ALL_BOOKINGS,
    ROUTES.PURCHASE_MY_BOOKINGS,
    ROUTES.PURCHASE_CREATE_NEW,
    ROUTES.PURCHASE_INSTALLMENT_SCHEDULE,
    ROUTES.PURCHASE_PENDING_INSTALLMENTS,
    ROUTES.PURCHASE_OVERDUE_INSTALLMENTS,
    ROUTES.RENTAL_ALL_BOOKINGS,
    ROUTES.RENTAL_MY_RENTALS,
    ROUTES.RENTAL_CREATE_NEW,
    ROUTES.RENTAL_RENT_SCHEDULE,
    ROUTES.RENTAL_PENDING_RENTS,
    ROUTES.RENTAL_OVERDUE_RENTS
  ],
  PAYMENTS: [
    ROUTES.PAYMENTS_INSTALLMENTS,
    ROUTES.PAYMENTS_HISTORY,
    ROUTES.PAYMENTS_DUE,
    ROUTES.PAYMENTS_HISTORY_ENHANCED,
    ROUTES.PAYMENTS_REPORTS,
    ROUTES.PAYMENTS_FILTERING,
    ROUTES.PAYMENTS_RECORD,
    ROUTES.PAYMENTS_APPROVAL,
    ROUTES.PAYMENTS_RECONCILIATION
  ],
  FINANCIAL_REPORTS: [
    ROUTES.FINANCIAL_PAYMENT_SUMMARY,
    ROUTES.FINANCIAL_PENDING_PAYMENTS,
    ROUTES.FINANCIAL_OVERDUE_PAYMENTS,
    ROUTES.FINANCIAL_COLLECTION_REPORTS,
    ROUTES.FINANCIAL_REVENUE_ANALYSIS
  ],
  RENT: [
    ROUTES.RENT_ROLL,
    ROUTES.LEASE_MANAGEMENT,
    ROUTES.RENT_SCHEDULE,
    ROUTES.RENT_OVERDUE_RENTS
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

// Schedule Meetings Routes
export const ADMIN_MEETINGS = '/admin-meetings';
export const SALES_MEETINGS = '/sales-meetings';
export const MY_MEETINGS = '/my-meetings';

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