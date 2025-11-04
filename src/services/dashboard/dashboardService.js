import api from '../api';

// Dashboard service for fetching dashboard data
export const fetchDashboardOverview = async () => {
  try {
    const response = await api.get('/dashboard/overview');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch overview error:', error);
    console.error('Dashboard Service: Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const fetchRecentActivities = async () => {
  try {
    const response = await api.get('/dashboard/activities');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch activities error:', error);
    console.error('Dashboard Service: Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const fetchPropertyAnalytics = async (timeFrame = '12M') => {
  try {
    const response = await api.get(`/dashboard/properties/analytics?timeFrame=${timeFrame}`);
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch property analytics error:', error);
    throw error;
  }
};

export const fetchLeadAnalytics = async (timeFrame = '12M') => {
  try {
    const response = await api.get(`/dashboard/leads/analytics?timeFrame=${timeFrame}`);
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch lead analytics error:', error);
    throw error;
  }
};

export const fetchSalesAnalytics = async (timeFrame = '12M') => {
  try {
    const response = await api.get(`/dashboard/sales/analytics?timeFrame=${timeFrame}`);
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch sales analytics error:', error);
    throw error;
  }
};

export const fetchFinancialSummary = async () => {
  try {
    const response = await api.get('/dashboard/financial-summary');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch financial summary error:', error);
    throw error;
  }
};

export const fetchTodaySchedules = async () => {
  try {
    const response = await api.get('/dashboard/today-schedules');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch today schedules error:', error);
    throw error;
  }
};

export const fetchLeadConversionRates = async () => {
  try {
    const response = await api.get('/dashboard/lead-conversion');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch lead conversion rates error:', error);
    throw error;
  }
};

export const fetchMonthlyTrends = async () => {
  try {
    const response = await api.get('/dashboard/monthly-trends');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch monthly trends error:', error);
    throw error;
  }
};

export const fetchWeeklyPerformance = async () => {
  try {
    const response = await api.get('/dashboard/weekly-performance');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch weekly performance error:', error);
    throw error;
  }
};

export const fetchTopProperties = async () => {
  try {
    const response = await api.get('/dashboard/top-properties');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch top properties error:', error);
    throw error;
  }
};

export const fetchUserAnalytics = async () => {
  try {
    const response = await api.get('/dashboard/users/analytics');
    return response.data;
  } catch (error) {
    console.error('Dashboard Service: Fetch user analytics error:', error);
    throw error;
  }
};
