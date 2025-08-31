import api from '../api';
import { PURCHASE_BOOKING_ENDPOINTS } from '../apiEndpoints';

export const purchaseBookingService = {
  // Get all purchase bookings with populated property, customer, and salesperson details
  getAllPurchaseBookings: async (params = {}) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_ALL, { params });
    return response.data;
  },

  // Get a specific purchase booking by ID with populated details
  getPurchaseBookingById: async (id) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Create a new purchase booking with property, customer, and payment terms
  createPurchaseBooking: async (bookingData) => {
    // Ensure required fields are present
    const requiredFields = ['propertyId', 'customerId', 'assignedSalespersonId', 'totalPropertyValue', 'downPayment', 'paymentTerms'];
    
    // Check if it's FormData (for file uploads) or regular object
    if (bookingData instanceof FormData) {
      // For FormData, we can't easily check required fields, so we'll let the backend handle validation
      const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.CREATE, bookingData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // For regular objects, validate required fields
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.CREATE, bookingData);
      return response.data;
    }
  },

  // Update purchase booking details (property, payment terms, financing details, etc.)
  updatePurchaseBooking: async (id, bookingData) => {
    const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.UPDATE(id), bookingData);
    return response.data;
  },

  // Soft delete a purchase booking (sets published to false)
  deletePurchaseBooking: async (id) => {
    const response = await api.delete(PURCHASE_BOOKING_ENDPOINTS.DELETE(id));
    return response.data;
  },

  // Get user's own purchase bookings (accessible to all authenticated users)
  getMyPurchaseBookings: async (userId) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_MY_BOOKINGS(userId));
    return response.data;
  },

  // Get all purchase bookings assigned to a specific salesperson
  getPurchaseBookingsBySalesperson: async (salespersonId) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_ASSIGNED_TO_SALESPERSON(salespersonId));
    return response.data;
  },

  // Get the complete installment schedule for a purchase booking
  getInstallmentSchedule: async (id) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_INSTALLMENT_SCHEDULE(id));
    return response.data;
  },

  // Record an installment payment for a specific installment and create payment history
  recordInstallment: async (id, installmentData) => {
    const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.RECORD_INSTALLMENT(id), installmentData);
    return response.data;
  },

  // Update the status of a specific installment (PENDING, PAID, OVERDUE, LATE)
  updateInstallmentStatus: async (id, statusData) => {
    const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.UPDATE_INSTALLMENT_STATUS(id), statusData);
    return response.data;
  },

  // Get all pending installment payments across all purchase bookings
  getPendingInstallmentsReport: async () => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_REPORTS_PENDING_INSTALLMENTS);
    return response.data;
  },

  // Get all overdue installment payments that are past their due date
  getOverdueInstallmentsReport: async () => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_REPORTS_OVERDUE_INSTALLMENTS);
    return response.data;
  },

  // Confirm a purchase booking (change status from PENDING to CONFIRMED)
  confirmPurchaseBooking: async (id) => {
    const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.CONFIRM(id));
    return response.data;
  },

  // Add documents to an existing purchase booking
  addDocumentsToPurchaseBooking: async (id, formData) => {
    const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.ADD_DOCUMENTS(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a specific document from a purchase booking
  deleteDocumentFromPurchaseBooking: async (id, documentId) => {
    const response = await api.delete(PURCHASE_BOOKING_ENDPOINTS.DELETE_DOCUMENT(id, documentId));
    return response.data;
  },

  // Update/Replace a specific document in a purchase booking
  updateDocumentInPurchaseBooking: async (id, documentId, formData) => {
    const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.UPDATE_DOCUMENT(id, documentId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get details of a specific document in a purchase booking
  getDocumentFromPurchaseBooking: async (id, documentId) => {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_DOCUMENT(id, documentId));
    return response.data;
  }
}; 