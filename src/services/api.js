import axios from 'axios';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';
// const API_URL = 'https://updatedbackend-bqg8.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first
    let token = Cookies.get('AuthToken');
    
    // If not found in cookies, try localStorage as fallback
    if (!token) {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          token = parsedAuth.token;
        } catch (e) {
          console.error('Error parsing auth data from localStorage:', e);
        }
      }
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request: Token found and added to headers');
    } else {
      console.log('API Request: No token found');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('AuthToken');
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Meeting Schedule API functions
export const meetingAPI = {
  // Get all meetings
  getAllMeetings: () => api.get('/meeting-schedule'),
  
  // Get my meetings
  getMyMeetings: (userId) => api.get(`/meeting-schedule/my-meetings/${userId}`),
  
  // Get my today's meetings
  getMyTodaysMeetings: (userId) => api.get(`/meeting-schedule/my-todays-meetings/${userId}`),
  
  // Get my tomorrow's meetings
  getMyTomorrowsMeetings: (userId) => api.get(`/meeting-schedule/my-tomorrows-meetings/${userId}`),
  
  // Get meeting by ID
  getMeetingById: (meetingId) => api.get(`/meeting-schedule/${meetingId}`),
  
  // Create meeting
  createMeeting: (meetingData) => api.post('/meeting-schedule/create', meetingData),
  
  // Update meeting
  updateMeeting: (meetingId, meetingData) => api.put(`/meeting-schedule/edit/${meetingId}`, meetingData),
  
  // Delete meeting
  deleteMeeting: (meetingId) => api.delete(`/meeting-schedule/delete/${meetingId}`)
};

// Payment History API functions
export const paymentHistoryAPI = {
  getAll: () => api.get('/payment-history/all'),
  getById: (id) => api.get(`/payment-history/${id}`),
};

// Purchase Booking API functions
export const purchaseBookingAPI = {
  // id is bookingId string (e.g., PURCHASE-...)
  getById: (id) => api.get(`/purchase-bookings/${encodeURIComponent(id)}`),
};

export const rentalBookingAPI = {
  // id is bookingId string (e.g., RENTAL-...)
  getById: (id) => api.get(`/rental-bookings/${encodeURIComponent(id)}`),
};

export default api;
