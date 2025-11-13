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
import { useAuth } from '../../../context/AuthContext';
import { hasRouteAccess } from '../../../utils/rolePermissions';

const ExecutiveDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalRentalBookings: 0,
    totalPurchaseBookings: 0,
    roleWiseCustomers: {},
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
  const { getUserRoleName } = useAuth();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const roleCardBg = useColorModeValue('gray.50', 'gray.700');
  const roleCardBorder = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        
        // Check if user has a valid token
        const token = localStorage.getItem('auth');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        // Parse the auth data to get the token
        let authData;
        try {
          authData = JSON.parse(token);
        } catch {
          throw new Error('Invalid authentication data. Please log in again.');
        }
        
        if (!authData.token) {
          throw new Error('No token found in auth data. Please log in again.');
        }
        
        
        // Fetch all dashboard data in parallel
        const [overviewResponse, activitiesResponse, financialResponse, conversionResponse] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentActivities(),
          fetchFinancialSummary(),
          fetchLeadConversionRates()
        ]);

      

        // Update stats with real data
        if (overviewResponse.statusCode === 200) {
          const overviewData = overviewResponse.data;
          setStats({
            totalProperties: overviewData.totalProperties || 0,
            totalLeads: overviewData.totalLeads || 0,
            totalCustomers: overviewData.totalUsers || 0,
            totalRentalBookings: overviewData.totalRentalBookings || 0,
            totalPurchaseBookings: overviewData.totalPurchaseBookings || 0,
            roleWiseCustomers: overviewData.roleWiseCustomers || {},
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

  // Navigation handler with role access check
  const handleCardClick = (route) => {
    const userRole = getUserRoleName() || 'EXECUTIVE';
    
    // Check if user has access to this route
    if (hasRouteAccess(userRole, route)) {
      navigate(route);
    } else {
      showErrorToast('You do not have access to this page');
    }
  };

  // Map stat cards to routes
  const getRouteForStat = (title) => {
    const routeMap = {
      'Total Properties': '/property/property-master',
      'Total Leads': '/lead/add',
      'Rental Bookings': '/rental-bookings/all',
      'Purchase Bookings': '/purchase-bookings/all',
      'Sold Properties': '/property/property-master',
      'Monthly Revenue': '/payment-history/all',
      'Quarterly Growth': '/admin/reports',
      'Team Performance': null, // No navigation for Team Performance
      'Active Leads': '/lead/add',
      'Average Rating': '/admin/reports',
      'Pending Followups': '/lead/add'
    };
    return routeMap[title] || null;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
    const route = getRouteForStat(title);
    const isClickable = route !== null;
    return (
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
          cursor={isClickable ? "pointer" : "default"}
          onClick={isClickable ? () => handleCardClick(route) : undefined}
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
  };

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
          <Box 
            overflowX="auto" 
            mb={8}
            css={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
            }}
          >
            <Grid templateColumns={{ base: "repeat(4, 250px)", md: "repeat(4, 280px)", lg: "repeat(4, 300px)" }} gap={6} minW="fit-content">
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
              title="Rental Bookings"
              value={stats.totalRentalBookings}
              icon={FaBuilding}
              color="teal"
              trend="up"
              trendValue="5"
            />
            <StatCard
              title="Purchase Bookings"
              value={stats.totalPurchaseBookings}
              icon={FaDollarSign}
              color="orange"
              trend="up"
              trendValue="3"
            />
            </Grid>
          </Box>

          {/* Strategic Metrics */}
          <Box 
            overflowX="auto" 
            mb={8}
            css={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
            }}
          >
            <Grid templateColumns={{ base: "repeat(4, 250px)", md: "repeat(4, 280px)", lg: "repeat(4, 300px)" }} gap={6} minW="fit-content">
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
              title="Team Performance"
              value={`${stats.teamPerformance}%`}
              icon={FaUsers}
              color="teal"
              trend="up"
              trendValue="12"
              subtitle="Overall team efficiency"
            />
            </Grid>
          </Box>

          {/* Operational Metrics */}
          <Box 
            overflowX="auto" 
            mb={8}
            css={{
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              },
            }}
          >
            <Grid templateColumns={{ base: "repeat(3, 250px)", md: "repeat(3, 280px)", lg: "repeat(3, 300px)" }} gap={6} minW="fit-content">
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
          </Box>

          {/* Role-wise Customers */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor} mb={8}>
            <CardBody p={6}>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                Role-wise Customer Distribution
              </Text>
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
                {Object.keys(stats.roleWiseCustomers).length > 0 ? (
                  Object.entries(stats.roleWiseCustomers).map(([role, count]) => (
                    <Box
                      key={role}
                      p={4}
                      borderRadius="lg"
                      bg={roleCardBg}
                      border="1px"
                      borderColor={roleCardBorder}
                    >
                      <VStack spacing={2}>
                        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                          {count}
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center" textTransform="capitalize">
                          {role.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>
                      </VStack>
                    </Box>
                  ))
                ) : (
                  <Box
                    colSpan={4}
                    p={8}
                    textAlign="center"
                    color={mutedTextColor}
                  >
                    <Text>No role data available</Text>
                  </Box>
                )}
              </Grid>
            </CardBody>
          </Card>

          {/* Performance Overview */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                  Performance Overview
                </Text>
                <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="green.600">
                      {conversionRate}%
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Lead Conversion Rate
                    </Text>
                    <Progress value={conversionRate} colorScheme="green" size="sm" w="full" borderRadius="full" />
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

          {/* Quick Actions - Hidden */}
          {/* <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
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
          </Card> */}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ExecutiveDashboard;
