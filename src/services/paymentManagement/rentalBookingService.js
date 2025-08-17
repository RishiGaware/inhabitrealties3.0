import api from '../api';
import { RENTAL_BOOKING_ENDPOINTS } from '../apiEndpoints';

export const rentalBookingService = {
  // Get all rental bookings
  getAllRentalBookings: async () => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get rental bookings by type
  getRentalBookingsByType: async (bookingType) => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_BY_BOOKING_TYPE(bookingType));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new rental booking
  createRentalBooking: async (bookingData) => {
    try {
      const response = await api.post(RENTAL_BOOKING_ENDPOINTS.CREATE, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get rental booking by ID
  getRentalBookingById: async (id) => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get rent schedule for a booking
  getRentSchedule: async (id) => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_RENT_SCHEDULE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update rental booking
  updateRentalBooking: async (id, bookingData) => {
    try {
      const response = await api.put(RENTAL_BOOKING_ENDPOINTS.UPDATE(id), bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Record rent payment
  recordRentPayment: async (id, paymentData) => {
    try {
      const response = await api.post(RENTAL_BOOKING_ENDPOINTS.RECORD_RENT_PAYMENT(id), paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update month status
  updateMonthStatus: async (id, statusData) => {
    try {
      const response = await api.put(RENTAL_BOOKING_ENDPOINTS.UPDATE_MONTH_STATUS(id), statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get rental bookings assigned to salesperson
  getRentalBookingsBySalesperson: async (salespersonId) => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_ASSIGNED_TO_SALESPERSON(salespersonId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending rent reports
  getPendingRentsReport: async () => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_REPORTS_PENDING_RENTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get overdue rent reports
  getOverdueRentsReport: async () => {
    try {
      const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_REPORTS_OVERDUE_RENTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 