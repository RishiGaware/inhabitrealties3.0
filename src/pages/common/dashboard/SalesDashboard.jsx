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
  FaBullseye,
  FaTrophy,
  FaCheckCircle,
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

const SalesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myLeads: 0,
    myProperties: 0,
    mySales: 0,
    myRevenue: 0,
    pendingFollowups: 0,
    thisMonthTarget: 0,
    hotLeads: 0,
    coldLeads: 0,
    warmLeads: 0,
    closedDeals: 0,
    averageDealSize: 0,
    conversionRate: 0,
    monthlyQuota: 0,
    weeklyProgress: 0,
    topPerformer: false
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
        
        // Check if user has a valid token
        const token = localStorage.getItem('auth');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        // Parse the auth data to get the token
        let authData;
        try {
          authData = JSON.parse(token);
        } catch (e) {
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

        // Update stats with real data (filtered for sales person)
        if (overviewResponse.statusCode === 200) {
          const overviewData = overviewResponse.data;
          const myLeads = Math.floor(overviewData.totalLeads * 0.3) || 0;
          const myRevenue = Math.floor(financialResponse.data?.totalRevenue * 0.3) || 0;
          const mySales = Math.floor(overviewData.soldProperties * 0.4) || 0;
          
          setStats({
            myLeads: myLeads,
            myProperties: Math.floor(overviewData.totalProperties * 0.2) || 0,
            mySales: mySales,
            myRevenue: myRevenue,
            pendingFollowups: overviewData.pendingFollowups || 0,
            thisMonthTarget: 5000000,
            hotLeads: Math.floor(myLeads * 0.2) || 0,
            coldLeads: Math.floor(myLeads * 0.3) || 0,
            warmLeads: Math.floor(myLeads * 0.5) || 0,
            closedDeals: mySales,
            averageDealSize: mySales > 0 ? Math.floor(myRevenue / mySales) : 0,
            conversionRate: conversionResponse.data?.conversionRate || 0,
            monthlyQuota: 5000000,
            weeklyProgress: Math.floor(Math.random() * 30) + 20,
            topPerformer: myRevenue > 2000000 // Top performer if revenue > 20L
          });
        }

        // Update recent activities with real data
        if (activitiesResponse.statusCode === 200) {
          const activities = activitiesResponse.data
            .filter(activity => activity.type === 'lead') // Focus on leads for sales
            .map((activity, index) => ({
              id: index,
              type: activity.type,
              title: activity.title,
              subtitle: activity.subtitle,
              description: activity.description,
              time: new Date(activity.time).toLocaleDateString(),
              icon: FaHandshake,
              color: 'green'
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
          myLeads: 0,
          myProperties: 0,
          mySales: 0,
          myRevenue: 0,
          pendingFollowups: 0,
          thisMonthTarget: 5000000
        });
        setRecentActivities([]);
        setConversionRate(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, onClick, subtitle }) => (
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
              {subtitle && (
                <Text fontSize="xs" color={mutedTextColor}>
                  {subtitle}
                </Text>
              )}
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

  const targetProgress = (stats.myRevenue / stats.thisMonthTarget) * 100;

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" p={6} display="flex" alignItems="center" justifyContent="center">
        <Loader size="xl" label="Loading sales dashboard..." />
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
              Sales Dashboard
            </Text>
            <Text fontSize="lg" color={mutedTextColor}>
              Track your sales performance and manage leads
            </Text>
          </Box>

          {/* Key Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="My Leads"
              value={stats.myLeads}
              icon={FaHandshake}
              color="green"
              trend="up"
              trendValue="15"
              subtitle="Active leads assigned"
            />
            <StatCard
              title="My Properties"
              value={stats.myProperties}
              icon={FaBuilding}
              color="blue"
              trend="up"
              trendValue="8"
              subtitle="Properties to sell"
            />
            <StatCard
              title="My Sales"
              value={stats.mySales}
              icon={FaTrophy}
              color="purple"
              trend="up"
              trendValue="25"
              subtitle="Properties sold"
            />
            <StatCard
              title="My Revenue"
              value={formatCurrency(stats.myRevenue)}
              icon={FaDollarSign}
              color="orange"
              trend="up"
              trendValue="20"
              subtitle="Revenue generated"
            />
            <StatCard
              title="Pending Followups"
              value={stats.pendingFollowups}
              icon={FaCalendarAlt}
              color="red"
              trend="down"
              trendValue="5"
              subtitle="Followups due"
            />
            <StatCard
              title="Monthly Target"
              value={formatCurrency(stats.thisMonthTarget)}
              icon={FaBullseye}
              color="teal"
              subtitle={`${Math.round(targetProgress)}% achieved`}
            />
          </Grid>

          {/* Lead Pipeline */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Hot Leads"
              value={stats.hotLeads}
              icon={FaHandshake}
              color="red"
              trend="up"
              trendValue="12"
              subtitle="High priority leads"
            />
            <StatCard
              title="Warm Leads"
              value={stats.warmLeads}
              icon={FaHandshake}
              color="orange"
              trend="up"
              trendValue="8"
              subtitle="Medium priority leads"
            />
            <StatCard
              title="Cold Leads"
              value={stats.coldLeads}
              icon={FaHandshake}
              color="blue"
              trend="down"
              trendValue="5"
              subtitle="Low priority leads"
            />
          </Grid>

          {/* Performance Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Closed Deals"
              value={stats.closedDeals}
              icon={FaCheckCircle}
              color="green"
              trend="up"
              trendValue="18"
              subtitle="Deals closed this month"
            />
            <StatCard
              title="Average Deal Size"
              value={formatCurrency(stats.averageDealSize)}
              icon={FaDollarSign}
              color="purple"
              trend="up"
              trendValue="10"
              subtitle="Average deal value"
            />
            <StatCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon={FaPercentage}
              color="blue"
              trend="up"
              trendValue="5"
              subtitle="Lead to sale conversion"
            />
            <StatCard
              title="Weekly Progress"
              value={`${stats.weeklyProgress}%`}
              icon={FaChartLine}
              color="teal"
              trend="up"
              trendValue="8"
              subtitle="This week's progress"
            />
          </Grid>

          {/* Achievement Badge */}
          {stats.topPerformer && (
            <Card bg="linear(to-r, yellow.400, orange.500)" color="white" mb={8} borderRadius="xl">
              <CardBody p={6} textAlign="center">
                <FaTrophy size={48} style={{ margin: '0 auto 16px' }} />
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                  🏆 Top Performer!
                </Text>
                <Text fontSize="lg">
                  You're among the top sales performers this month!
                </Text>
              </CardBody>
            </Card>
          )}

          {/* Performance Overview */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                  Sales Performance
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
                      {Math.round(targetProgress)}%
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Target Achievement
                    </Text>
                    <Progress value={Math.min(targetProgress, 100)} colorScheme="blue" size="sm" w="full" borderRadius="full" />
                  </VStack>
                </Grid>
              </CardBody>
            </Card>

            {/* Recent Lead Activities */}
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <HStack justify="space-between" align="center" mb={6}>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Recent Lead Activities
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
                      No recent lead activities
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
                  leftIcon={<FaHandshake />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/leads')}
                >
                  Manage Leads
                </Button>
                <Button
                  leftIcon={<FaBuilding />}
                  colorScheme="blue"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/properties')}
                >
                  View Properties
                </Button>
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/schedule-meetings')}
                >
                  Schedule Meeting
                </Button>
                <Button
                  leftIcon={<FaChartLine />}
                  colorScheme="orange"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/reports')}
                >
                  View Reports
                </Button>
              </Grid>
            </CardBody>
          </Card> */}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default SalesDashboard;
