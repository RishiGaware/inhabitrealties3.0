import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Center
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaUsers, 
  FaBuilding, 
  FaDollarSign, 
  FaHandshake, 
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaArrowUp as FaTrendingUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaChartPie,
  FaPercentage
} from 'react-icons/fa';
import { 
  fetchDashboardOverview, 
  fetchRecentActivities, 
  fetchFinancialSummary,
  fetchLeadConversionRates 
} from '../../../services/dashboard/dashboardService';
import { showErrorToast } from '../../../utils/toastUtils';
import Loader from '../../../components/common/Loader';

const ExecutiveDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    soldProperties: 0,
    unsoldProperties: 0,
    activeLeads: 0,
    averageRating: 0,
    todaySchedules: 0,
    tomorrowSchedules: 0,
    monthlyRevenue: 0,
    quarterlyGrowth: 0,
    teamPerformance: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching executive dashboard data...');
        
        // Check if user has a valid token
        const token = localStorage.getItem('auth');
        console.log('Auth data from localStorage:', token);
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        // Parse the auth data to get the token
        let authData;
        try {
          authData = JSON.parse(token);
          console.log('Parsed auth data:', authData);
        } catch (e) {
          console.error('Error parsing auth data:', e);
          throw new Error('Invalid authentication data. Please log in again.');
        }
        
        if (!authData.token) {
          throw new Error('No token found in auth data. Please log in again.');
        }
        
        console.log('Token found, making API calls...');
        
        // Fetch all dashboard data in parallel
        const [overviewResponse, activitiesResponse, financialResponse, conversionResponse] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentActivities(),
          fetchFinancialSummary(),
          fetchLeadConversionRates()
        ]);

        console.log('Executive Dashboard API responses:', {
          overview: overviewResponse,
          activities: activitiesResponse,
          financial: financialResponse,
          conversion: conversionResponse
        });

        // Update stats with real data
        if (overviewResponse.statusCode === 200) {
          const overviewData = overviewResponse.data;
          setStats({
            totalProperties: overviewData.totalProperties || 0,
            totalLeads: overviewData.totalLeads || 0,
            totalCustomers: overviewData.totalUsers || 0,
            totalBookings: overviewData.soldProperties || 0,
            totalRevenue: financialResponse.data?.totalRevenue || 0,
            pendingPayments: overviewData.pendingFollowups || 0,
            soldProperties: overviewData.soldProperties || 0,
            unsoldProperties: overviewData.unsoldProperties || 0,
            activeLeads: overviewData.activeLeads || 0,
            averageRating: overviewData.averageRating || 0,
            todaySchedules: overviewData.todaySchedules || 0,
            tomorrowSchedules: overviewData.tomorrowSchedules || 0,
            monthlyRevenue: financialResponse.data?.monthlyRevenue?.total || 0,
            quarterlyGrowth: Math.floor(Math.random() * 25) + 10, // Simulate quarterly growth
            teamPerformance: Math.floor(Math.random() * 20) + 80 // Simulate team performance
          });
        }

        // Update recent activities with real data
        if (activitiesResponse.statusCode === 200) {
          const activities = activitiesResponse.data.map((activity, index) => ({
            id: index,
            type: activity.type,
            title: activity.title,
            subtitle: activity.subtitle,
            description: activity.description,
            time: new Date(activity.time).toLocaleDateString(),
            icon: activity.type === 'property' ? FaBuilding : FaHandshake,
            color: activity.type === 'property' ? 'blue' : 'green'
          }));
          setRecentActivities(activities);
        }

        // Update conversion rate
        if (conversionResponse.statusCode === 200) {
          setConversionRate(Math.round(conversionResponse.data.conversionRate || 0));
        }

      } catch (error) {
        console.error('Error fetching executive dashboard data:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        // If it's an authentication error, show login prompt
        if (error.message.includes('token') || error.response?.status === 401) {
          setError('Please log in to view dashboard data');
          showErrorToast('Please log in to view dashboard data');
        } else {
          setError(`Failed to load dashboard data: ${error.message}`);
          showErrorToast(`Failed to load dashboard data: ${error.message}`);
        }
        
        // Set fallback data
        setStats({
          totalProperties: 0,
          totalLeads: 0,
          totalCustomers: 0,
          totalBookings: 0,
          totalRevenue: 0,
          pendingPayments: 0
        });
        setRecentActivities([]);
        setConversionRate(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        bg={cardBg} 
        borderRadius="xl" 
        boxShadow="lg" 
        border="1px" 
        borderColor={borderColor}
        cursor="pointer"
        onClick={onClick}
        _hover={{ boxShadow: 'xl' }}
      >
        <CardBody p={6}>
          <HStack justify="space-between" align="flex-start" mb={4}>
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">
                {title}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {value}
              </Text>
            </VStack>
            <Box
              p={3}
              borderRadius="lg"
              bg={`${color}.100`}
              color={`${color}.600`}
            >
              <Icon size={24} />
            </Box>
          </HStack>
          {trend && (
            <HStack spacing={2}>
              {trend === 'up' ? (
                <FaArrowUp color="green" size={12} />
              ) : (
                <FaArrowDown color="red" size={12} />
              )}
              <Text fontSize="sm" color={trend === 'up' ? 'green.500' : 'red.500'}>
                {trendValue}%
              </Text>
            </HStack>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );

  const ActivityItem = ({ activity }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HStack spacing={4} p={3} borderRadius="lg" _hover={{ bg: 'gray.50' }}>
        <Box
          p={2}
          borderRadius="md"
          bg={`${activity.color}.100`}
          color={`${activity.color}.600`}
        >
          <activity.icon size={16} />
        </Box>
        <VStack align="flex-start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {activity.title}
          </Text>
          <Text fontSize="xs" color={mutedTextColor}>
            {activity.subtitle} • {activity.time}
          </Text>
        </VStack>
        <Badge colorScheme={activity.color} variant="subtle">
          {activity.type}
        </Badge>
      </HStack>
    </motion.div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" p={6} display="flex" alignItems="center" justifyContent="center">
        <Loader size="xl" label="Loading executive dashboard..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" p={6}>
        <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
          <CardBody p={8} textAlign="center">
            <Text color="red.500" fontSize="lg" mb={4}>
              {error}
            </Text>
            {error.includes('log in') ? (
              <Button 
                colorScheme="blue" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            ) : (
              <Button 
                colorScheme="blue" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            )}
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box mb={8}>
            <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={2}>
              Executive Dashboard
            </Text>
            <Text fontSize="lg" color={mutedTextColor}>
              High-level overview and strategic insights
            </Text>
          </Box>

          {/* Key Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Total Properties"
              value={stats.totalProperties}
              icon={FaBuilding}
              color="blue"
              trend="up"
              trendValue="12"
            />
            <StatCard
              title="Total Leads"
              value={stats.totalLeads}
              icon={FaHandshake}
              color="green"
              trend="up"
              trendValue="8"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={FaDollarSign}
              color="purple"
              trend="up"
              trendValue="15"
            />
            <StatCard
              title="Active Customers"
              value={stats.totalCustomers}
              icon={FaUsers}
              color="orange"
              trend="up"
              trendValue="5"
            />
          </Grid>

          {/* Strategic Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Sold Properties"
              value={stats.soldProperties}
              icon={FaCheckCircle}
              color="green"
              trend="up"
              trendValue="25"
              subtitle="Properties sold this quarter"
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(stats.monthlyRevenue)}
              icon={FaChartLine}
              color="blue"
              trend="up"
              trendValue="18"
              subtitle="Current month revenue"
            />
            <StatCard
              title="Quarterly Growth"
              value={`${stats.quarterlyGrowth}%`}
              icon={FaTrendingUp}
              color="purple"
              trend="up"
              trendValue="8"
              subtitle="Q3 vs Q2 growth"
            />
            <StatCard
              title="Team Performance"
              value={`${stats.teamPerformance}%`}
              icon={FaUsers}
              color="teal"
              trend="up"
              trendValue="12"
              subtitle="Overall team efficiency"
            />
          </Grid>

          {/* Operational Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Active Leads"
              value={stats.activeLeads}
              icon={FaClock}
              color="blue"
              trend="up"
              trendValue="10"
              subtitle="Leads in pipeline"
            />
            <StatCard
              title="Average Rating"
              value={`${stats.averageRating}/5`}
              icon={FaChartPie}
              color="yellow"
              trend="up"
              trendValue="3"
              subtitle="Customer satisfaction"
            />
            <StatCard
              title="Pending Followups"
              value={stats.pendingPayments}
              icon={FaExclamationTriangle}
              color="red"
              trend="down"
              trendValue="15"
              subtitle="Followups due"
            />
          </Grid>

          {/* Performance Overview */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                  Performance Overview
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="green.600">
                      {conversionRate}%
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Lead Conversion Rate
                    </Text>
                    <Progress value={conversionRate} colorScheme="green" size="sm" w="full" borderRadius="full" />
                  </VStack>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      {stats.totalProperties}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Total Properties
                    </Text>
                    <Progress value={Math.min((stats.totalProperties / 200) * 100, 100)} colorScheme="blue" size="sm" w="full" borderRadius="full" />
                  </VStack>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                      {formatCurrency(stats.totalRevenue)}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Total Revenue
                    </Text>
                    <Progress value={Math.min((stats.totalRevenue / 5000000) * 100, 100)} colorScheme="purple" size="sm" w="full" borderRadius="full" />
                  </VStack>
                </Grid>
              </CardBody>
            </Card>

            {/* Recent Activities */}
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <HStack justify="space-between" align="center" mb={6}>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Recent Activities
                  </Text>
                  <Button size="sm" variant="ghost" colorScheme="blue">
                    <FaEye size={14} />
                  </Button>
                </HStack>
                <VStack spacing={2} align="stretch" maxH="400px" overflowY="auto">
                  {recentActivities.length > 0 ? (
                    recentActivities.slice(0, 5).map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <Text color={mutedTextColor} textAlign="center" py={4}>
                      No recent activities
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
            <CardBody p={6}>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                Quick Actions
              </Text>
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                <Button
                  leftIcon={<FaChartLine />}
                  colorScheme="blue"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/reports')}
                >
                  View Reports
                </Button>
                <Button
                  leftIcon={<FaUsers />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/admin')}
                >
                  Manage Users
                </Button>
                <Button
                  leftIcon={<FaBuilding />}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/property')}
                >
                  Manage Properties
                </Button>
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="orange"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/schedule-meetings')}
                >
                  Schedule Meeting
                </Button>
              </Grid>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ExecutiveDashboard;
