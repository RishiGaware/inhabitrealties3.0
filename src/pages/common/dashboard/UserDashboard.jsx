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
  Center,
  Image,
  Flex,
  IconButton
} from '@chakra-ui/react';
// eslint-disable-next-line no-unused-vars
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
  FaClock,
  FaBed,
  FaBath,
  FaRuler,
  FaImage
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { 
  fetchDashboardOverview, 
  fetchRecentActivities, 
  fetchFinancialSummary,
  fetchLeadConversionRates 
} from '../../../services/dashboard/dashboardService';
import { meetingAPI } from '../../../services/api';
import { fetchProperties } from '../../../services/propertyService';
import { showErrorToast } from '../../../utils/toastUtils';
import Loader from '../../../components/common/Loader';
import { ROUTES } from '../../../utils/constants';
import { getFavoritePropertiesByUserId } from '../../../services/favoriteproperty/favoritePropertyService';
import { getMyMeetings } from '../../../services/meetings/meetingScheduleService';
import { inquiriesService } from '../../../services/inquiries/inquiriesService';
import { getUserViewCount } from '../../../services/propertyView/propertyViewService';

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
  const [latestProperties, setLatestProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
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
        } catch {
          throw new Error('Invalid authentication data. Please log in again.');
        }
        
        if (!authData.token) {
          throw new Error('No token found in auth data. Please log in again.');
        }
        
        
        // Get user ID from auth data
        const userId = authData.data?._id || authData.user?.id || authData.userId;
        const userEmail = authData.data?.email || authData.user?.email;
        
        // Fetch all dashboard data in parallel
        const [
          , 
          activitiesResponse, 
          , 
          , 
          todaysMeetingsResponse, 
          tomorrowsMeetingsResponse,
          favoritePropertiesResponse,
          myMeetingsResponse,
          inquiriesResponse,
          viewedPropertiesResponse
        ] = await Promise.all([
          fetchDashboardOverview(), // Keep for potential future use
          fetchRecentActivities(),
          fetchFinancialSummary(), // Keep for potential future use
          fetchLeadConversionRates(), // Keep for potential future use
          userId ? meetingAPI.getMyTodaysMeetings(userId).catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
          userId ? meetingAPI.getMyTomorrowsMeetings(userId).catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
          userId ? getFavoritePropertiesByUserId(userId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          userId ? getMyMeetings(userId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          userEmail ? inquiriesService.getAllInquiries({ search: userEmail }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          userId ? getUserViewCount(userId).catch(() => ({ count: 0 })) : Promise.resolve({ count: 0 })
        ]);

        // Fetch latest properties
        setPropertiesLoading(true);
        try {
          const propertiesResponse = await fetchProperties();
          if (propertiesResponse?.data) {
            // Get latest 6 properties (sorted by creation date or just take first 6)
            const latest = Array.isArray(propertiesResponse.data) 
              ? propertiesResponse.data.slice(0, 6)
              : [];
            setLatestProperties(latest);
          }
        } catch (error) {
          console.error('Failed to fetch latest properties:', error);
          setLatestProperties([]);
        } finally {
          setPropertiesLoading(false);
        }

        // Process meeting data
        if (todaysMeetingsResponse.data?.data) {
          setTodaysMeetings(todaysMeetingsResponse.data.data);
        }
        if (tomorrowsMeetingsResponse.data?.data) {
          setTomorrowsMeetings(tomorrowsMeetingsResponse.data.data);
        }

        // Calculate real stats from API responses
        // Handle different response structures for favorite properties
        let favoritePropertiesCount = 0;
        if (favoritePropertiesResponse?.data) {
          if (Array.isArray(favoritePropertiesResponse.data)) {
            favoritePropertiesCount = favoritePropertiesResponse.data.length;
          } else if (favoritePropertiesResponse.data.data && Array.isArray(favoritePropertiesResponse.data.data)) {
            favoritePropertiesCount = favoritePropertiesResponse.data.data.length;
          }
        }
        
        // Handle different response structures for meetings
        let meetingsCount = 0;
        if (myMeetingsResponse?.data) {
          if (Array.isArray(myMeetingsResponse.data)) {
            meetingsCount = myMeetingsResponse.data.length;
          } else if (myMeetingsResponse.data.data && Array.isArray(myMeetingsResponse.data.data)) {
            meetingsCount = myMeetingsResponse.data.data.length;
          }
        }
        
        // Handle different response structures for inquiries
        // Filter inquiries by user email to get only user's inquiries
        let inquiriesCount = 0;
        if (inquiriesResponse?.data) {
          let inquiriesList = [];
          if (Array.isArray(inquiriesResponse.data)) {
            inquiriesList = inquiriesResponse.data;
          } else if (inquiriesResponse.data.data && Array.isArray(inquiriesResponse.data.data)) {
            inquiriesList = inquiriesResponse.data.data;
          }
          // Filter by user email if available
          if (userEmail && inquiriesList.length > 0) {
            inquiriesCount = inquiriesList.filter(inquiry => 
              inquiry.email && inquiry.email.toLowerCase() === userEmail.toLowerCase()
            ).length;
          } else {
            inquiriesCount = inquiriesList.length;
          }
        }
        
        // Get viewed properties count from API response
        const viewedPropertiesCount = viewedPropertiesResponse?.count || 0;
        
        // Update stats with real data
        setStats({
          favoriteProperties: favoritePropertiesCount,
          viewedProperties: viewedPropertiesCount,
          inquiries: inquiriesCount,
          meetings: meetingsCount,
          savedSearches: 0, // TODO: Implement saved searches tracking
          notifications: 0, // TODO: Implement notifications tracking
          shortlistedProperties: favoritePropertiesCount, // Using favorite properties as shortlisted
          visitedProperties: meetingsCount, // Using meetings as visited properties
          budgetRange: 0, // TODO: Get from user profile
          preferredLocations: 0, // TODO: Get from user profile
          propertyTypes: 0, // TODO: Get from user profile
          lastActivity: new Date().toLocaleDateString(),
          profileCompletion: 0, // TODO: Calculate from user profile
          wishlistItems: favoritePropertiesCount, // Using favorite properties as wishlist
          recommendedProperties: 0 // TODO: Implement recommendations
        });

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

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ title, value, icon: IconComponent, color, trend, trendValue, onClick, subtitle }) => (
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
              <IconComponent size={24} />
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

  // Helper functions for property display
  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyImage = (property) => {
    // Priority 1: Check for images array
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const firstImage = property.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
        return firstImage;
      }
    }
    // Priority 2: Check for single image property
    if (property.image && typeof property.image === 'string' && property.image.trim() !== '') {
      return property.image;
    }
    // Return null for fallback
    return null;
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        bg={cardBg}
        borderRadius="xl"
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
        cursor="pointer"
        onClick={() => navigate(`${ROUTES.PROPERTIES}?propertyId=${property._id}`)}
        _hover={{ boxShadow: 'xl', borderColor: 'purple.400' }}
        transition="all 0.2s"
        overflow="hidden"
        h="full"
      >
        {/* Property Image */}
        <Box
          h="200px"
          overflow="hidden"
          position="relative"
          bg="gray.100"
        >
          {getPropertyImage(property) ? (
            <Image
              src={getPropertyImage(property)}
              alt={property.name || 'Property Image'}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="full"
              bg="gray.100"
              color="gray.400"
            >
              <FaImage size={32} />
              <Text fontSize="xs" mt={2} textAlign="center">
                No Image
              </Text>
            </Flex>
          )}
          {/* Status Badge */}
          {property.status && (
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme={property.status === 'available' ? 'green' : 'orange'}
              variant="solid"
              fontSize="xs"
            >
              {property.status}
            </Badge>
          )}
        </Box>

        <CardBody p={4}>
          {/* Property Name */}
          <Text
            fontSize="md"
            fontWeight="bold"
            color={textColor}
            mb={2}
            noOfLines={1}
          >
            {property.name || 'Unnamed Property'}
          </Text>

          {/* Price */}
          <Text
            color="purple.600"
            fontWeight="bold"
            fontSize="lg"
            mb={2}
          >
            {formatPrice(property.price)}
          </Text>

          {/* Location */}
          {property.propertyAddress && (
            <Flex align="center" gap={1} color={mutedTextColor} fontSize="sm" mb={3}>
              <MdLocationOn size={14} />
              <Text noOfLines={1}>
                {property.propertyAddress.area || ''}
                {property.propertyAddress.city ? `, ${property.propertyAddress.city}` : ''}
              </Text>
            </Flex>
          )}

          {/* Property Features */}
          <Flex justify="space-between" color={mutedTextColor} fontSize="xs" gap={2}>
            {property.bedrooms && (
              <Flex align="center" gap={1}>
                <FaBed size={12} />
                <Text>{property.bedrooms}</Text>
              </Flex>
            )}
            {property.bathrooms && (
              <Flex align="center" gap={1}>
                <FaBath size={12} />
                <Text>{property.bathrooms}</Text>
              </Flex>
            )}
            {property.area && (
              <Flex align="center" gap={1}>
                <FaRuler size={12} />
                <Text>{property.area} sqft</Text>
              </Flex>
            )}
          </Flex>
        </CardBody>
      </Card>
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
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            <StatCard
              title="Favorite Properties"
              value={stats.favoriteProperties}
              icon={FaHeart}
              color="red"
              subtitle="Properties you liked"
              onClick={() => navigate('/properties/favorite-properties')}
            />
            <StatCard
              title="Viewed Properties"
              value={stats.viewedProperties}
              icon={FaEye}
              color="blue"
              subtitle="Properties viewed"
              onClick={() => navigate('/properties')}
            />
            <StatCard
              title="Inquiries Made"
              value={stats.inquiries}
              icon={FaHandshake}
              color="green"
              subtitle="Property inquiries"
            />
            <StatCard
              title="Meetings Scheduled"
              value={stats.meetings}
              icon={FaCalendarAlt}
              color="purple"
              subtitle="Site visits booked"
              onClick={() => navigate('/my-meetings')}
            />
          </Grid>

              {/* Property Suggestions */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor} mb={8}>
            <CardBody p={6}>
              <HStack justify="space-between" align="center" mb={6}>
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Latest Properties
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Discover our newest property listings
                  </Text>
                </VStack>
                <Button
                  colorScheme="purple"
                  variant="outline"
                  rightIcon={<FaArrowUp style={{ transform: 'rotate(45deg)' }} />}
                  onClick={() => navigate(ROUTES.PROPERTIES)}
                  _hover={{ bg: 'purple.50', borderColor: 'purple.400' }}
                >
                  See More
                </Button>
              </HStack>

              {propertiesLoading ? (
                <Center py={8}>
                  <Spinner size="lg" color="purple.500" />
                </Center>
              ) : latestProperties.length > 0 ? (
                <Grid
                  templateColumns={{
                    base: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  }}
                  gap={6}
                >
                  {latestProperties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
          </Grid>
              ) : (
                <Box textAlign="center" py={8}>
                  <Box mb={4}>
                    <FaBuilding size={48} color={mutedTextColor} style={{ margin: '0 auto' }} />
                  </Box>
                  <Text color={mutedTextColor} fontSize="md">
                    No properties available at the moment
                  </Text>
                  <Button
                    mt={4}
                    colorScheme="purple"
                    variant="outline"
                    onClick={() => navigate(ROUTES.PROPERTIES)}
                  >
                    Browse All Properties
                  </Button>
                </Box>
              )}
            </CardBody>
          </Card>


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
