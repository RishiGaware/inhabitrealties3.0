import api from '../api';
import { PAYMENT_HISTORY_ENDPOINTS } from '../apiEndpoints';

export const paymentHistoryService = {
  // Get all payment records
  getAllPayments: async () => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by type
  getPaymentsByType: async (paymentType) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_TYPE(paymentType));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by status
  getPaymentsByStatus: async (status) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_STATUS(status));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by date range
  getPaymentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.post(PAYMENT_HISTORY_ENDPOINTS.GET_BY_DATE_RANGE, {
        startDate,
        endDate
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single payment record
  getPaymentById: async (id) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update payment record
  updatePayment: async (id, paymentData) => {
    try {
      const response = await api.put(PAYMENT_HISTORY_ENDPOINTS.UPDATE(id), paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve payment
  approvePayment: async (id, approvalData) => {
    try {
      const response = await api.put(PAYMENT_HISTORY_ENDPOINTS.APPROVE(id), approvalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reconcile payment
  reconcilePayment: async (id, reconciliationData) => {
    try {
      const response = await api.put(PAYMENT_HISTORY_ENDPOINTS.RECONCILE(id), reconciliationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by booking
  getPaymentsByBooking: async (bookingId) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_BOOKING(bookingId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by responsible person
  getPaymentsByResponsible: async (responsiblePersonId) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_RESPONSIBLE(responsiblePersonId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payments by booking type
  getPaymentsByBookingType: async (bookingType) => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_BY_BOOKING_TYPE(bookingType));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment summary reports
  getPaymentSummaryReports: async () => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_REPORTS_SUMMARY);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unreconciled payments
  getUnreconciledPayments: async () => {
    try {
      const response = await api.get(PAYMENT_HISTORY_ENDPOINTS.GET_REPORTS_UNRECONCILED);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 