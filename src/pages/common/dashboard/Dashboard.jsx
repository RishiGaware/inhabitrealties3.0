import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Card,
  CardBody,
  Heading,
  Badge,
  Progress,
  useColorModeValue,
  Flex,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaArrowUp as FaTrendingUp,
  FaArrowDown as FaTrendingDown,
  FaPercentage,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHandshake
} from 'react-icons/fa';
import { BiUserPlus } from 'react-icons/bi';
import { MdInventory } from 'react-icons/md';
import Loader from '../../../components/common/Loader';
import { 
  fetchDashboardOverview, 
  fetchRecentActivities, 
  fetchFinancialSummary,
  fetchLeadConversionRates 
} from '../../../services/dashboard/dashboardService';
import { showErrorToast } from '../../../utils/toastUtils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Dashboard = () => {
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
    tomorrowSchedules: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Move all useColorModeValue hooks to the top level
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const activityBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching dashboard data...');
        
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

        console.log('Dashboard API responses:', {
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
            tomorrowSchedules: overviewData.tomorrowSchedules || 0
          });
        }

        // Update recent activities with real data
        if (activitiesResponse.statusCode === 200) {
          const activities = activitiesResponse.data.map((activity, index) => ({
            id: index + 1,
            type: activity.type,
            message: activity.title,
            time: new Date(activity.time).toLocaleString(),
            icon: activity.type === 'property' ? FaBuilding : 
                  activity.type === 'lead' ? BiUserPlus : 
                  activity.type === 'booking' ? MdInventory : FaUsers,
            color: activity.type === 'property' ? 'orange' :
                   activity.type === 'lead' ? 'green' :
                   activity.type === 'booking' ? 'blue' : 'purple',
            status: 'info'
          }));
          setRecentActivities(activities);
        }

        // Update conversion rate
        if (conversionResponse.statusCode === 200) {
          setConversionRate(Math.round(conversionResponse.data.conversionRate || 0));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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

  const handleStatCardClick = (type) => {
    let path = '';
    switch (type) {
      case 'totalproperties':
        path = '/properties';
        break;
      case 'totalleads':
        path = '/leads';
        break;
      case 'totalcustomers':
        path = '/customers/profiles';
        break;
      case 'totalbookings':
        path = '/bookings/booked-units';
        break;
      case 'totalrevenue':
        path = '/admin/reports';
        break;
      case 'pendingpayments':
        path = '/payments/due-payments';
        break;
      default:
        path = '/';
    }
    navigate(path);
  };

  const handleQuickActionClick = (type) => {
    let path = '';
    switch (type) {
      case 'addlead':
        path = '/lead/add';
        break;
      case 'addproperty':
        path = '/property/property-master';
        break;
      case 'recordpayment':
        path = '/payments/installments';
        break;
      case 'viewreports':
        path = '/admin/reports';
        break;
      default:
        path = '/';
    }
    navigate(path);
  };

  const StatCard = ({ title, value, icon: IconComponent, change, gradient }) => (
    <Tooltip 
      label={`Click to view ${title.toLowerCase()}`} 
      placement="top" 
      hasArrow
      bg="gray.800"
      color="white"
    >
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="visible"
    >
      <Card
        bg={cardBg}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
        position="relative"
        _hover={{
          boxShadow: 'xl',
          transform: 'translateY(-2px)',
          bg: 'gray.50',
        }}
        transition="all 0.3s ease"
        onClick={() => handleStatCardClick(title.toLowerCase().replace(/\s/g, ''))}
        cursor="pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStatCardClick(title.toLowerCase().replace(/\s/g, ''));
          }
        }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bgGradient={gradient}
        />
        <CardBody p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={2} flex={1}>
              <Text fontSize="sm" fontWeight="medium" color={mutedTextColor}>
                {title}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                {value}
              </Text>
          {change && (
                <HStack spacing={1}>
                  <Icon
                    as={change > 0 ? FaArrowUp : FaArrowDown}
                    color={change > 0 ? 'green.500' : 'red.500'}
                    boxSize={4}
                  />
                  <Text
                    fontSize="sm"
                    color={change > 0 ? 'green.500' : 'red.500'}
                    fontWeight="medium"
                  >
                    {change > 0 ? '+' : ''}{change}%
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    from last month
                  </Text>
                </HStack>
              )}
            </VStack>
            <Box
              p={4}
              borderRadius="xl"
              bgGradient={gradient}
              boxShadow="lg"
              animation={`${pulseAnimation} 2s infinite`}
            >
              <Icon as={IconComponent} color="white" boxSize={6} />
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </motion.div>
    </Tooltip>
  );

  const ActivityItem = ({ activity, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <HStack
        p={4}
        borderRadius="lg"
        bg={activityBg}
        _hover={{
          bg: hoverBg,
          transform: 'translateX(5px)',
        }}
        transition="all 0.2s ease"
        spacing={4}
      >
        <Box
          p={2}
          borderRadius="full"
          bg={`${activity.color}.100`}
          color={`${activity.color}.600`}
        >
          <Icon as={activity.icon} boxSize={4} />
        </Box>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {activity.message}
          </Text>
          <Text fontSize="xs" color={mutedTextColor}>
            {activity.time}
          </Text>
        </VStack>
        <Badge colorScheme={activity.status} variant="subtle" fontSize="xs">
          {activity.type}
        </Badge>
      </HStack>
    </motion.div>
  );

  const QuickActionButton = ({ icon: IconComponent, label, color }) => (
    <Tooltip 
      label={`Click to ${label.toLowerCase()}`} 
      placement="top" 
      hasArrow
      bg="gray.800"
      color="white"
    >
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="lg"
        h="auto"
        p={6}
        borderRadius="xl"
        borderColor={borderColor}
        bg={cardBg}
        _hover={{
          bg: `${color}.50`,
          borderColor: `${color}.300`,
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        }}
        transition="all 0.2s ease"
        onClick={() => handleQuickActionClick(label.toLowerCase().replace(/\s/g, ''))}
      >
        <VStack spacing={3}>
          <Box
            p={3}
            borderRadius="full"
            bg={`${color}.100`}
            color={`${color}.600`}
          >
            <Icon as={IconComponent} boxSize={6} />
          </Box>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {label}
          </Text>
        </VStack>
      </Button>
    </motion.div>
    </Tooltip>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" p={6} display="flex" alignItems="center" justifyContent="center">
        <Loader size="xl" label="Loading dashboard..." />
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={8} align="stretch">
      {/* Header */}
            <motion.div variants={itemVariants}>
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="lg"
                border="1px"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Box
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  p={8}
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top="-50%"
                    right="-50%"
                    w="200%"
                    h="200%"
                    bg="white"
                    opacity="0.1"
                    borderRadius="full"
                  />
                  <VStack align="start" spacing={3} position="relative" zIndex={1}>
                    <HStack spacing={3}>
                      <Box
                        p={3}
                        bg="white"
                        borderRadius="full"
                        boxShadow="lg"
                      >
                        <Icon as={FaChartLine} color="blue.500" boxSize={6} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color="white">
                          Dashboard
                        </Heading>
                        <Text color="blue.100" fontSize="md">
                          Welcome back! Here's what's happening with your real estate business.
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </Card>
            </motion.div>

      {/* Statistics Grid */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
                  icon={FaBuilding}
          change={12}
                  gradient="linear(to-r, blue.500, blue.600)"
        />
              </GridItem>
              <GridItem>
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
                  icon={BiUserPlus}
          change={8}
                  gradient="linear(to-r, green.500, green.600)"
        />
              </GridItem>
              <GridItem>
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
                  icon={FaUsers}
          change={15}
                  gradient="linear(to-r, purple.500, purple.600)"
        />
              </GridItem>
              <GridItem>
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
                  icon={MdInventory}
          change={-3}
                  gradient="linear(to-r, orange.500, orange.600)"
        />
              </GridItem>
              <GridItem>
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
                  icon={FaMoneyBillWave}
          change={22}
                  gradient="linear(to-r, green.600, green.700)"
        />
              </GridItem>
              <GridItem>
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
                  icon={FaCalendarAlt}
          change={-5}
                  gradient="linear(to-r, red.500, red.600)"
        />
              </GridItem>
            </Grid>

          {/* Additional Metrics */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mb={8}>
            <GridItem>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
                Property Status
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <StatCard
                  title="Sold Properties"
                  value={stats.soldProperties}
                  icon={FaCheckCircle}
                  change={25}
                  gradient="linear(to-r, green.500, green.600)"
                />
                <StatCard
                  title="Unsold Properties"
                  value={stats.unsoldProperties}
                  icon={FaExclamationTriangle}
                  change={-5}
                  gradient="linear(to-r, red.500, red.600)"
                />
              </Grid>
            </GridItem>

            <GridItem>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
                Lead Analytics
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <StatCard
                  title="Active Leads"
                  value={stats.activeLeads}
                  icon={FaClock}
                  change={10}
                  gradient="linear(to-r, blue.500, blue.600)"
                />
                <StatCard
                  title="Conversion Rate"
                  value={`${conversionRate}%`}
                  icon={FaPercentage}
                  change={8}
                  gradient="linear(to-r, purple.500, purple.600)"
                />
              </Grid>
            </GridItem>

            <GridItem>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
                Schedule Overview
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <StatCard
                  title="Today's Schedules"
                  value={stats.todaySchedules}
                  icon={FaCalendarAlt}
                  change={15}
                  gradient="linear(to-r, teal.500, teal.600)"
                />
                <StatCard
                  title="Tomorrow's Schedules"
                  value={stats.tomorrowSchedules}
                  icon={FaCalendarAlt}
                  change={8}
                  gradient="linear(to-r, cyan.500, cyan.600)"
                />
              </Grid>
            </GridItem>
          </Grid>

      {/* Recent Activities and Quick Actions */}
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {/* Recent Activities */}
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <CardBody p={6}>
                    <HStack justify="space-between" mb={6}>
                      <Heading size="md" color={textColor}>
                        Recent Activities
                      </Heading>
                      <Badge colorScheme="blue" variant="subtle">
                        Live
                      </Badge>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      {recentActivities.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} index={index} />
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>

        {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <CardBody p={6}>
                    <Heading size="md" color={textColor} mb={6}>
                      Quick Actions
                    </Heading>
                    <SimpleGrid columns={2} spacing={4}>
                      <QuickActionButton
                        icon={BiUserPlus}
                        label="Add Lead"
                        color="blue"
                      />
                      <QuickActionButton
                        icon={FaBuilding}
                        label="Add Property"
                        color="green"
                      />
                      <QuickActionButton
                        icon={FaMoneyBillWave}
                        label="Record Payment"
                        color="purple"
                      />
                      <QuickActionButton
                        icon={FaChartLine}
                        label="View Reports"
                        color="orange"
                      />
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </motion.div>
            </Grid>

      {/* Performance Overview */}
            <motion.div variants={itemVariants}>
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="lg"
                border="1px"
                borderColor={borderColor}
              >
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={6}>
                    Performance Overview
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack spacing={3}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="green.100"
                        color="green.600"
                      >
                        <Icon as={FaArrowUp} boxSize={8} />
                      </Box>
                      <VStack spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="green.600">
                          {conversionRate}%
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Lead Conversion Rate
                        </Text>
                      </VStack>
                      <Progress value={conversionRate} colorScheme="green" size="sm" w="full" borderRadius="full" />
                    </VStack>

                    <VStack spacing={3}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="blue.100"
                        color="blue.600"
                      >
                        <Icon as={FaBuilding} boxSize={8} />
                      </Box>
                      <VStack spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                          {stats.totalProperties}
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Total Properties
                        </Text>
                      </VStack>
                      <Progress value={Math.min((stats.totalProperties / 200) * 100, 100)} colorScheme="blue" size="sm" w="full" borderRadius="full" />
                    </VStack>

                    <VStack spacing={3}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg="purple.100"
                        color="purple.600"
                      >
                        <Icon as={FaMoneyBillWave} boxSize={8} />
                      </Box>
                      <VStack spacing={1}>
                        <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                          {formatCurrency(stats.totalRevenue)}
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Total Revenue
                        </Text>
                      </VStack>
                      <Progress value={Math.min((stats.totalRevenue / 5000000) * 100, 100)} colorScheme="purple" size="sm" w="full" borderRadius="full" />
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </motion.div>
          </VStack>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Dashboard;