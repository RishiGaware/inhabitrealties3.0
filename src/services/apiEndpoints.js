export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/normaluser/registernormaluser',
};

export const USER_ENDPOINTS = {
  REGISTER: '/users/register',
  GET_ALL: '/users/',
  GET_BY_ID: (id) => `/users/${id}`,
  EDIT: (id) => `/users/edit/${id}`,
  DELETE: (id) => `/users/delete/${id}`,
  GET_ALL_WITH_PARAMS: '/users/withparams',
};

export const CUSTOMER_ENDPOINTS = {
  REGISTER: '/customers/register',
  GET_ALL: '/customers/',
  EDIT: (id) => `/customers/edit/${id}`,
  DELETE: (id) => `/customers/delete/${id}`,
};

export const ROLE_ENDPOINTS = {
  GET_ALL: '/roles/',
  CREATE: '/roles/create',
  EDIT: (id) => `/roles/edit/${id}`,
  DELETE: (id) => `/roles/delete/${id}`,
};

export const PROPERTY_TYPE_ENDPOINTS = {
  GET_ALL: '/propertytypes',
  CREATE: '/propertytypes/create',
  EDIT: (id) => `/propertytypes/edit/${id}`,
  DELETE: (id) => `/propertytypes/delete/${id}`,
};

export const LEAD_STATUS_ENDPOINTS = {
  GET_ALL: '/leadstatus/',
  GET_BY_ID: (id) => `/leadstatus/${id}`,
  CREATE: '/leadstatus/create',
  EDIT: (id) => `/leadstatus/edit/${id}`,
  DELETE: (id) => `/leadstatus/delete/${id}`,
};

export const FOLLOWUP_STATUS_ENDPOINTS = {
  GET_ALL: '/followupstatus/',
  GET_BY_ID: (id) => `/followupstatus/${id}`,
  CREATE: '/followupstatus/create',
  EDIT: (id) => `/followupstatus/edit/${id}`,
  DELETE: (id) => `/followupstatus/delete/${id}`,
};

export const LEADS_ENDPOINTS = {
  GET_ALL: '/leads/',
  GET_BY_ID: (id) => `/leads/${id}`,
  CREATE: '/leads/create',
  EDIT: (id) => `/leads/edit/${id}`,
  DELETE: (id) => `/leads/delete/${id}`,
  GET_ALL_WITH_PARAMS: '/leads/getallleadswithparams',
};

export const PROPERTY_ENDPOINTS = {
  CREATE: '/property/create',
  GET_ALL: '/property/',
  GET_WITH_PARAMS: '/property/withparams',
  EDIT: (id) => `/property/edit/${id}`,
  DELETE: (id) => `/property/delete/${id}`,
  UPLOAD_IMAGE: (id) => `/property/image/create/${id}`,
  GET_IMAGES: (id) => `/property/images/all/${id}`,
  DELETE_IMAGE: (id) => `/property/image/delete/${id}`,
  DELETE_ALL_IMAGES: (id) => `/property/image/delete/all/${id}`,
  GET_IMAGE_BY_ID: (id) => `/property/image/${id}`,
};

export const DOCUMENT_TYPE_ENDPOINTS = {
  GET_ALL: '/documenttypes/',
  GET_BY_ID: (id) => `/documenttypes/${id}`,
  CREATE: '/documenttypes/create',
  EDIT: (id) => `/documenttypes/edit/${id}`,
  DELETE: (id) => `/documenttypes/delete/${id}`,
  GET_NOT_PUBLISHED: '/documenttypes/notpublished',
  GET_WITH_PARAMS: '/documenttypes/withparams',
};

export const DOCUMENT_ENDPOINTS = {
  GET_ALL: '/documents/',
  GET_BY_ID: (id) => `/documents/${id}`,
  CREATE: '/documents/create',
  EDIT: (id) => `/documents/edit/${id}`,
  DELETE: (id) => `/documents/delete/${id}`,
  GET_BY_USER: (userId) => `/documents/${userId}`,
  GET_BY_DOCUMENT_TYPE: (documentTypeId) => `/documents/type/${documentTypeId}`,
};

export const FAVORITE_PROPERTY_ENDPOINTS = {
  CREATE: '/favoriteproperty/create',
  GET_ALL: '/favoriteproperty/',
  GET_BY_USER_ID: (userId) => `/favoriteproperty/user/${userId}`,
  GET_WITH_PARAMS: '/favoriteproperty/withparams',
  GET_BY_ID: (id) => `/favoriteproperty/${id}`,
  DELETE: (id) => `/favoriteproperty/delete/${id}`,
};

export const MEETING_SCHEDULE_ENDPOINTS = {
  GET_ALL: '/meetingschedule',
  GET_BY_ID: (id) => `/meetingschedule/${id}`,
  GET_BY_SCHEDULED_USER_ID: (id) => `/meetingschedule/scheduledByUserId/${id}`,
  CREATE: '/meetingschedule/create',
  UPDATE: (id) => `/meetingschedule/edit/${id}`,
  DELETE: (id) => `/meetingschedule/delete/${id}`,
  GET_MY_MEETINGS: (id) => `/meetingschedule/my-meetings/${id}`,
  GET_NOT_PUBLISHED: '/meetingschedule/notpublished',
};

export const MEETING_SCHEDULE_STATUS_ENDPOINTS = {
  GET_ALL: '/meetingschedulestatus',
  GET_BY_ID: (id) => `/meetingschedulestatus/${id}`,
  CREATE: '/meetingschedulestatus/create',
  UPDATE: (id) => `/meetingschedulestatus/edit/${id}`,
  DELETE: (id) => `/meetingschedulestatus/delete/${id}`,
};

// Payment Management Endpoints
export const PAYMENT_HISTORY_ENDPOINTS = {
  GET_ALL: '/payment-history/all',
  GET_BY_TYPE: (paymentType) => `/payment-history/type/${paymentType}`,
  GET_BY_STATUS: (status) => `/payment-history/status/${status}`,
  GET_BY_DATE_RANGE: '/payment-history/date-range',
  GET_BY_ID: (id) => `/payment-history/${id}`,
  UPDATE: (id) => `/payment-history/update/${id}`,
  APPROVE: (id) => `/payment-history/approve/${id}`,
  RECONCILE: (id) => `/payment-history/reconcile/${id}`,
  GET_BY_BOOKING: (bookingId) => `/payment-history/booking/${bookingId}`,
  GET_BY_RESPONSIBLE: (responsiblePersonId) => `/payment-history/responsible/${responsiblePersonId}`,
  GET_BY_BOOKING_TYPE: (bookingType) => `/payment-history/booking-type/${bookingType}`,
  GET_REPORTS_SUMMARY: '/payment-history/reports/summary',
  GET_REPORTS_UNRECONCILED: '/payment-history/reports/unreconciled',
};

// Purchase Booking Endpoints - Updated to match backend implementation
export const PURCHASE_BOOKING_ENDPOINTS = {
  // Core CRUD operations
  GET_ALL: '/purchase-bookings/all',
  GET_BY_ID: (id) => `/purchase-bookings/${id}`,
  CREATE: '/purchase-bookings/create',
  UPDATE: (id) => `/purchase-bookings/update/${id}`,
  DELETE: (id) => `/purchase-bookings/delete/${id}`,
  
  // User-specific operations
  GET_MY_BOOKINGS: (userId) => `/purchase-bookings/my-bookings/${userId}`,
  GET_ASSIGNED_TO_SALESPERSON: (salespersonId) => `/purchase-bookings/assigned/${salespersonId}`,
  
  // Installment operations
  GET_INSTALLMENT_SCHEDULE: (id) => `/purchase-bookings/${id}/installment-schedule`,
  RECORD_INSTALLMENT: (id) => `/purchase-bookings/${id}/record-installment`,
  UPDATE_INSTALLMENT_STATUS: (id) => `/purchase-bookings/${id}/update-installment-status`,
  
  // Reports
  GET_REPORTS_PENDING_INSTALLMENTS: '/purchase-bookings/reports/pending-installments',
  GET_REPORTS_OVERDUE_INSTALLMENTS: '/purchase-bookings/reports/overdue-installments',
  
  // Additional operations
  CONFIRM: (id) => `/purchase-bookings/confirm/${id}`,
  ADD_DOCUMENTS: (id) => `/purchase-bookings/${id}/add-documents`,
  DELETE_DOCUMENT: (id, documentId) => `/purchase-bookings/${id}/documents/${documentId}`,
  UPDATE_DOCUMENT: (id, documentId) => `/purchase-bookings/${id}/documents/${documentId}`,
  GET_DOCUMENT: (id, documentId) => `/purchase-bookings/${id}/documents/${documentId}`,
};

// Rental Booking Endpoints
export const RENTAL_BOOKING_ENDPOINTS = {
  GET_ALL: '/rental-bookings/all',
  GET_BY_BOOKING_TYPE: (bookingType) => `/rental-bookings/booking-type/${bookingType}`,
  CREATE: '/rental-bookings/create',
  GET_BY_ID: (id) => `/rental-bookings/${id}`,
  GET_RENT_SCHEDULE: (id) => `/rental-bookings/${id}/rent-schedule`,
  UPDATE: (id) => `/rental-bookings/update/${id}`,
  RECORD_RENT_PAYMENT: (id) => `/rental-bookings/${id}/record-rent-payment`,
  UPDATE_MONTH_STATUS: (id) => `/rental-bookings/${id}/update-month-status`,
  GET_ASSIGNED_TO_SALESPERSON: (salespersonId) => `/rental-bookings/assigned/${salespersonId}`,
  GET_REPORTS_PENDING_RENTS: '/rental-bookings/reports/pending-rents',
  GET_REPORTS_OVERDUE_RENTS: '/rental-bookings/reports/overdue-rents',
};