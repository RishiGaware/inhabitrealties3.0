import api from '../api';
import { PURCHASE_BOOKING_ENDPOINTS, RENTAL_BOOKING_ENDPOINTS } from '../apiEndpoints';

/**
 * Service for managing user's own bookings
 */

/**
 * Get user's purchase bookings
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const getMyPurchaseBookings = async (userId) => {
  try {
    const response = await api.get(PURCHASE_BOOKING_ENDPOINTS.GET_MY_BOOKINGS(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching my purchase bookings:', error);
    throw error;
  }
};

/**
 * Get user's rental bookings
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const getMyRentalBookings = async (userId) => {
  try {
    const response = await api.get(RENTAL_BOOKING_ENDPOINTS.GET_MY_BOOKINGS(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching my rental bookings:', error);
    throw error;
  }
};

/**
 * Get all user's bookings (both purchase and rental)
 * @param {string} userId - User ID
 * @returns {Promise} Combined bookings data
 */
export const getAllMyBookings = async (userId) => {
  try {
    const [purchaseBookings, rentalBookings] = await Promise.all([
      getMyPurchaseBookings(userId),
      getMyRentalBookings(userId)
    ]);

    // Transform purchase bookings to common format
    const transformedPurchaseBookings = purchaseBookings.data?.map(booking => ({
      ...booking,
      bookingType: 'Purchase',
      displayAmount: booking.totalPropertyValue,
      displayDate: booking.createdAt,
      status: booking.bookingStatus
    })) || [];

    // Transform rental bookings to common format
    const transformedRentalBookings = rentalBookings.data?.map(booking => ({
      ...booking,
      bookingType: 'Rental',
      displayAmount: booking.monthlyRent,
      displayDate: booking.createdAt,
      status: booking.bookingStatus
    })) || [];

    // Combine and sort by date
    const allBookings = [...transformedPurchaseBookings, ...transformedRentalBookings]
      .sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));

    return {
      success: true,
      data: allBookings,
      purchaseCount: transformedPurchaseBookings.length,
      rentalCount: transformedRentalBookings.length,
      totalCount: allBookings.length
    };
  } catch (error) {
    console.error('Error fetching all my bookings:', error);
    throw error;
  }
};
