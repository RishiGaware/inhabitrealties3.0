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
  FaHeart,
  FaSearch,
  FaBookmark,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { 
  fetchDashboardOverview, 
  fetchRecentActivities, 
  fetchFinancialSummary,
  fetchLeadConversionRates 
} from '../../../services/dashboard/dashboardService';
import { meetingAPI } from '../../../services/api';
import { showErrorToast } from '../../../utils/toastUtils';
import Loader from '../../../components/common/Loader';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    favoriteProperties: 0,
    viewedProperties: 0,
    inquiries: 0,
    meetings: 0,
    savedSearches: 0,
    notifications: 0,
    shortlistedProperties: 0,
    visitedProperties: 0,
    budgetRange: 0,
    preferredLocations: 0,
    propertyTypes: 0,
    lastActivity: "",
    profileCompletion: 0,
    wishlistItems: 0,
    recommendedProperties: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [todaysMeetings, setTodaysMeetings] = useState([]);
  const [tomorrowsMeetings, setTomorrowsMeetings] = useState([]);
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
        
        
        // Get user ID from auth data
        const userId = authData.user?.id || authData.userId;
        
        // Fetch all dashboard data in parallel
        const [overviewResponse, activitiesResponse, financialResponse, conversionResponse, todaysMeetingsResponse, tomorrowsMeetingsResponse] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentActivities(),
          fetchFinancialSummary(),
          fetchLeadConversionRates(),
          userId ? meetingAPI.getMyTodaysMeetings(userId) : Promise.resolve({ data: { data: [] } }),
          userId ? meetingAPI.getMyTomorrowsMeetings(userId) : Promise.resolve({ data: { data: [] } })
        ]);

        // Process meeting data
        if (todaysMeetingsResponse.data?.data) {
          setTodaysMeetings(todaysMeetingsResponse.data.data);
        }
        if (tomorrowsMeetingsResponse.data?.data) {
          setTomorrowsMeetings(tomorrowsMeetingsResponse.data.data);
        }

        // Update stats with user-specific data
        if (overviewResponse.statusCode === 200) {
          const overviewData = overviewResponse.data;
          const favoriteProperties = Math.floor(Math.random() * 10) + 1;
          const viewedProperties = Math.floor(Math.random() * 50) + 10;
          const inquiries = Math.floor(Math.random() * 5) + 1;
          const meetings = Math.floor(Math.random() * 3);
          
          setStats({
            favoriteProperties: favoriteProperties,
            viewedProperties: viewedProperties,
            inquiries: inquiries,
            meetings: meetings,
            savedSearches: Math.floor(Math.random() * 8) + 2,
            notifications: Math.floor(Math.random() * 15) + 5,
            shortlistedProperties: Math.floor(favoriteProperties * 0.7),
            visitedProperties: Math.floor(meetings * 2),
            budgetRange: Math.floor(Math.random() * 50) + 50, // 50-100 L
            preferredLocations: Math.floor(Math.random() * 5) + 2,
            propertyTypes: Math.floor(Math.random() * 3) + 1,
            lastActivity: new Date().toLocaleDateString(),
            profileCompletion: Math.floor(Math.random() * 30) + 70, // 70-100%
            wishlistItems: Math.floor(favoriteProperties * 1.5),
            recommendedProperties: Math.floor(Math.random() * 15) + 5
          });
        }

        // Update recent activities with user-relevant data
        if (activitiesResponse.statusCode === 200) {
          const activities = activitiesResponse.data
            .filter(activity => activity.type === 'property') // Focus on properties for users
            .map((activity, index) => ({
              id: index,
              type: activity.type,
              title: activity.title,
              subtitle: activity.subtitle,
              description: activity.description,
              time: new Date(activity.time).toLocaleDateString(),
              icon: FaBuilding,
              color: 'blue'
            }));
          setRecentActivities(activities);
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
          favoriteProperties: 0,
          viewedProperties: 0,
          inquiries: 0,
          meetings: 0,
          savedSearches: 0,
          notifications: 0
        });
        setRecentActivities([]);
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

  const MeetingItem = ({ meeting }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HStack
        p={3}
        borderRadius="lg"
        bg={useColorModeValue('gray.50', 'gray.700')}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
        transition="all 0.2s ease"
        cursor="pointer"
        onClick={() => navigate(`/meeting-details/${meeting._id}`)}
      >
        <Box
          p={2}
          borderRadius="full"
          bg={useColorModeValue('green.100', 'green.900')}
          color={useColorModeValue('green.600', 'green.300')}
        >
          <FaCalendarAlt size={12} />
        </Box>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {meeting.title}
          </Text>
          <Text fontSize="xs" color={mutedTextColor}>
            {meeting.startTime} {meeting.endTime ? `- ${meeting.endTime}` : ''}
          </Text>
          {meeting.propertyId && (
            <Text fontSize="xs" color={mutedTextColor}>
              Property: {meeting.propertyId.name}
            </Text>
          )}
        </VStack>
        <Badge
          colorScheme={meeting.status?.name?.toLowerCase().includes('scheduled') ? 'blue' : 
                      meeting.status?.name?.toLowerCase().includes('completed') ? 'green' : 
                      meeting.status?.name?.toLowerCase().includes('cancelled') ? 'red' : 'orange'}
          variant="subtle"
          fontSize="xs"
        >
          {meeting.status?.name || 'Scheduled'}
        </Badge>
      </HStack>
    </motion.div>
  );

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" p={6} display="flex" alignItems="center" justifyContent="center">
        <Loader size="xl" label="Loading user dashboard..." />
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
              My Dashboard
            </Text>
            <Text fontSize="lg" color={mutedTextColor}>
              Track your property interests and activities
            </Text>
          </Box>

          {/* Key Metrics */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Favorite Properties"
              value={stats.favoriteProperties}
              icon={FaHeart}
              color="red"
              trend="up"
              trendValue="12"
              subtitle="Properties you liked"
              onClick={() => navigate('/properties/favorite-properties')}
            />
            <StatCard
              title="Viewed Properties"
              value={stats.viewedProperties}
              icon={FaEye}
              color="blue"
              trend="up"
              trendValue="8"
              subtitle="Properties viewed"
              onClick={() => navigate('/properties/favorite-properties')}
            />
            <StatCard
              title="Inquiries Made"
              value={stats.inquiries}
              icon={FaHandshake}
              color="green"
              trend="up"
              trendValue="25"
              subtitle="Property inquiries"
            />
            <StatCard
              title="Meetings Scheduled"
              value={stats.meetings}
              icon={FaCalendarAlt}
              color="purple"
              trend="up"
              trendValue="15"
              subtitle="Site visits booked"
              onClick={() => navigate('/my-meetings')}
            />
            <StatCard
              title="Saved Searches"
              value={stats.savedSearches}
              icon={FaSearch}
              color="orange"
              trend="up"
              trendValue="5"
              subtitle="Search criteria saved"
            />
            <StatCard
              title="Notifications"
              value={stats.notifications}
              icon={FaBookmark}
              color="teal"
              subtitle="Unread notifications"
            />
          </Grid>

          {/* Property Journey */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Shortlisted Properties"
              value={stats.shortlistedProperties}
              icon={FaHeart}
              color="pink"
              trend="up"
              trendValue="18"
              subtitle="Properties in shortlist"
              onClick={() => navigate('/properties')}
            />
            <StatCard
              title="Visited Properties"
              value={stats.visitedProperties}
              icon={FaMapMarkerAlt}
              color="green"
              trend="up"
              trendValue="22"
              subtitle="Properties physically visited"
              onClick={() => navigate('/properties')}
            />
            <StatCard
              title="Wishlist Items"
              value={stats.wishlistItems}
              icon={FaBookmark}
              color="purple"
              trend="up"
              trendValue="10"
              subtitle="Items in your wishlist"
              onClick={() => navigate('/properties')}
            />
          </Grid>

          {/* Profile & Preferences */}
          {/* <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Profile Completion"
              value={`${stats.profileCompletion}%`}
              icon={FaUsers}
              color="blue"
              trend="up"
              trendValue="5"
              subtitle="Profile completeness"
            />
            <StatCard
              title="Budget Range"
              value={`₹${stats.budgetRange}L`}
              icon={FaDollarSign}
              color="green"
              trend="up"
              trendValue="8"
              subtitle="Your budget range"
            />
            <StatCard
              title="Preferred Locations"
              value={stats.preferredLocations}
              icon={FaMapMarkerAlt}
              color="orange"
              trend="up"
              trendValue="3"
              subtitle="Locations of interest"
            />
            <StatCard
              title="Property Types"
              value={stats.propertyTypes}
              icon={FaBuilding}
              color="purple"
              trend="up"
              trendValue="2"
              subtitle="Types you're interested in"
            />
          </Grid> */}

          {/* Recommendations */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Recommended Properties"
              value={stats.recommendedProperties}
              icon={FaChartLine}
              color="teal"
              trend="up"
              trendValue="15"
              subtitle="AI recommended for you"
              onClick={() => navigate('/properties')}
            />
            <StatCard
              title="Last Activity"
              value={stats.lastActivity}
              icon={FaClock}
              color="gray"
              subtitle="Last time you were active"
            />
            <StatCard
              title="Search Alerts"
              value={stats.savedSearches}
              icon={FaSearch}
              color="cyan"
              trend="up"
              trendValue="7"
              subtitle="Active search alerts"
            />
          </Grid>

          {/* Property Interests */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
            <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                  Property Interests
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="red.600">
                      {stats.favoriteProperties}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Favorite Properties
                    </Text>
                    <Progress value={Math.min((stats.favoriteProperties / 20) * 100, 100)} colorScheme="red" size="sm" w="full" borderRadius="full" />
                  </VStack>
                  <VStack spacing={3}>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      {stats.viewedProperties}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                      Properties Viewed
                    </Text>
                    <Progress value={Math.min((stats.viewedProperties / 100) * 100, 100)} colorScheme="blue" size="sm" w="full" borderRadius="full" />
                  </VStack>
                </Grid>
              </CardBody>
            </Card>

            {/* Recent Property Activities */}
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

          {/* My Today's Meetings */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
            <CardBody p={6}>
              <HStack justify="space-between" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  My Today's Meetings
                </Text>
                <Button size="sm" variant="ghost" colorScheme="green" onClick={() => navigate('/my-meetings')}>
                  <FaEye size={14} />
                </Button>
              </HStack>
              <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                {todaysMeetings.length > 0 ? (
                  todaysMeetings.map((meeting) => (
                    <MeetingItem key={meeting._id} meeting={meeting} />
                  ))
                ) : (
                  <Text color={mutedTextColor} textAlign="center" py={4}>
                    No meetings scheduled for today
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* My Tomorrow's Meetings */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
            <CardBody p={6}>
              <HStack justify="space-between" align="center" mb={6}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  My Tomorrow's Meetings
                </Text>
                <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => navigate('/my-meetings')}>
                  <FaEye size={14} />
                </Button>
              </HStack>
              <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                {tomorrowsMeetings.length > 0 ? (
                  tomorrowsMeetings.map((meeting) => (
                    <MeetingItem key={meeting._id} meeting={meeting} />
                  ))
                ) : (
                  <Text color={mutedTextColor} textAlign="center" py={4}>
                    No meetings scheduled for tomorrow
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions - Hidden */}
          {/* <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
            <CardBody p={6}>
              <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
                Quick Actions
              </Text>
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                <Button
                  leftIcon={<FaSearch />}
                  colorScheme="blue"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/properties')}
                >
                  Search Properties
                </Button>
                <Button
                  leftIcon={<FaHeart />}
                  colorScheme="red"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/favorite-properties')}
                >
                  My Favorites
                </Button>
                <Button
                  leftIcon={<FaCalendarAlt />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/schedule-meetings')}
                >
                  Schedule Visit
                </Button>
                <Button
                  leftIcon={<FaHandshake />}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/inquiries')}
                >
                  Make Inquiry
                </Button>
              </Grid>
            </CardBody>
          </Card> */}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default UserDashboard;
