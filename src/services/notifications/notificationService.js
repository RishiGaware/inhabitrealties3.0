import api from '../api';
import { NOTIFICATION_ENDPOINTS } from '../apiEndpoints';

export const notificationService = {
  // Get current user's notifications
  getMyNotifications: async (params = {}) => {
    try {
      const response = await api.get(NOTIFICATION_ENDPOINTS.GET_MY_NOTIFICATIONS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count for current user
  getUnreadCount: async () => {
    try {
      const response = await api.get(NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark notification as unread
  markAsUnread: async (notificationId) => {
    try {
      const response = await api.put(NOTIFICATION_ENDPOINTS.MARK_AS_UNREAD(notificationId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

