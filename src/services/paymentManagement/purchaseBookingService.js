import api from '../api';
import { PURCHASE_BOOKING_ENDPOINTS } from '../apiEndpoints';

export const purchaseBookingService = {
  // Get all purchase bookings
  getAllPurchaseBookings: async () => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get purchase bookings by type
  getPurchaseBookingsByType: async (bookingType) => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_BY_BOOKING_TYPE(bookingType));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new purchase booking
  createPurchaseBooking: async (bookingData) => {
    try {
      const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.CREATE, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get purchase booking by ID
  getPurchaseBookingById: async (id) => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get installment schedule for a booking
  getInstallmentSchedule: async (id) => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_INSTALLMENT_SCHEDULE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update purchase booking
  updatePurchaseBooking: async (id, bookingData) => {
    try {
      const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.UPDATE(id), bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Record installment payment
  recordInstallment: async (id, installmentData) => {
    try {
      const response = await api.post(PURCHASE_BOOKING_ENDPOINTS.RECORD_INSTALLMENT(id), installmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update installment status
  updateInstallmentStatus: async (id, statusData) => {
    try {
      const response = await api.put(PURCHASE_BOOKING_ENDPOINTS.UPDATE_INSTALLMENT_STATUS(id), statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get purchase bookings assigned to salesperson
  getPurchaseBookingsBySalesperson: async (salespersonId) => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_ASSIGNED_TO_SALESPERSON(salespersonId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending installment reports
  getPendingInstallmentsReport: async () => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_REPORTS_PENDING_INSTALLMENTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get overdue installment reports
  getOverdueInstallmentsReport: async () => {
    try {
      const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_REPORTS_OVERDUE_INSTALLMENTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 