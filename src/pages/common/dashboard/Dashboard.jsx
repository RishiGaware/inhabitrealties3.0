import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaDollarSign,
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
  FaHandshake,
} from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { MdInventory } from "react-icons/md";
import Loader from "../../../components/common/Loader";
import {
  fetchDashboardOverview,
  fetchRecentActivities,
  fetchFinancialSummary,
  fetchLeadConversionRates,
} from "../../../services/dashboard/dashboardService";
import { meetingAPI } from "../../../services/api";
import { showErrorToast } from "../../../utils/toastUtils";

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
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [todaysMeetings, setTodaysMeetings] = useState([]);
  const [tomorrowsMeetings, setTomorrowsMeetings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Move all useColorModeValue hooks to the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const activityBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching dashboard data...");

        // Check if user has a valid token
        const token = localStorage.getItem("auth");
        console.log("Auth data from localStorage:", token);

        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        // Parse the auth data to get the token
        let authData;
        try {
          authData = JSON.parse(token);
          console.log("Parsed auth data:", authData);
        } catch (e) {
          console.error("Error parsing auth data:", e);
          throw new Error("Invalid authentication data. Please log in again.");
        }

        if (!authData.token) {
          throw new Error("No token found in auth data. Please log in again.");
        }

        console.log("Token found, making API calls...");

        // Get user ID from auth data
        const userId = authData.user?.id || authData.userId;
        console.log("User ID for meetings:", userId);
        console.log("User role:", authData.user?.role);
        console.log("Auth data structure:", authData);

        // Fetch all dashboard data in parallel
        console.log("Making API calls with userId:", userId);
        const [
          overviewResponse,
          activitiesResponse,
          financialResponse,
          conversionResponse,
          todaysMeetingsResponse,
          tomorrowsMeetingsResponse,
        ] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentActivities(),
          fetchFinancialSummary(),
          fetchLeadConversionRates(),
          userId
            ? meetingAPI.getMyTodaysMeetings(userId).catch((err) => {
                console.error("Error fetching today's meetings:", err);
                return { data: { data: [] } };
              })
            : Promise.resolve({ data: { data: [] } }),
          userId
            ? meetingAPI.getMyTomorrowsMeetings(userId).catch((err) => {
                console.error("Error fetching tomorrow's meetings:", err);
                return { data: { data: [] } };
              })
            : Promise.resolve({ data: { data: [] } }),
        ]);

        console.log("Dashboard API responses:", {
          overview: overviewResponse,
          activities: activitiesResponse,
          financial: financialResponse,
          conversion: conversionResponse,
          todaysMeetings: todaysMeetingsResponse,
          tomorrowsMeetings: tomorrowsMeetingsResponse,
        });

        // Process meeting data
        console.log("Today's meetings response:", todaysMeetingsResponse);
        console.log("Tomorrow's meetings response:", tomorrowsMeetingsResponse);
        console.log(
          "Today's meetings response status:",
          todaysMeetingsResponse.status
        );
        console.log(
          "Tomorrow's meetings response status:",
          tomorrowsMeetingsResponse.status
        );

        if (todaysMeetingsResponse.data?.data) {
          console.log(
            "Setting today's meetings:",
            todaysMeetingsResponse.data.data
          );
          console.log(
            "Today's meetings count:",
            todaysMeetingsResponse.data.data.length
          );
          setTodaysMeetings(todaysMeetingsResponse.data.data);
        } else {
          console.log("No today's meetings data found");
          console.log(
            "Today's meetings response structure:",
            JSON.stringify(todaysMeetingsResponse, null, 2)
          );
          setTodaysMeetings([]);
        }

        if (tomorrowsMeetingsResponse.data?.data) {
          console.log(
            "Setting tomorrow's meetings:",
            tomorrowsMeetingsResponse.data.data
          );
          console.log(
            "Tomorrow's meetings count:",
            tomorrowsMeetingsResponse.data.data.length
          );
          setTomorrowsMeetings(tomorrowsMeetingsResponse.data.data);
        } else {
          console.log("No tomorrow's meetings data found");
          console.log(
            "Tomorrow's meetings response structure:",
            JSON.stringify(tomorrowsMeetingsResponse, null, 2)
          );
          setTomorrowsMeetings([]);
        }

        // Debug role-wise customers data
        if (overviewResponse.statusCode === 200) {
          console.log(
            "Role-wise customers data:",
            overviewResponse.data.roleWiseCustomers
          );
          console.log(
            "Type of roleWiseCustomers:",
            typeof overviewResponse.data.roleWiseCustomers
          );
          console.log(
            "Keys in roleWiseCustomers:",
            Object.keys(overviewResponse.data.roleWiseCustomers || {})
          );
        }

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
          });
        }

        // Update recent activities with real data
        if (activitiesResponse.statusCode === 200) {
          const activities = activitiesResponse.data.map((activity, index) => ({
            id: index + 1,
            type: activity.type,
            message: activity.title,
            time: new Date(activity.time).toLocaleString(),
            icon:
              activity.type === "property"
                ? FaBuilding
                : activity.type === "lead"
                ? BiUserPlus
                : activity.type === "booking"
                ? MdInventory
                : FaUsers,
            color:
              activity.type === "property"
                ? "orange"
                : activity.type === "lead"
                ? "green"
                : activity.type === "booking"
                ? "blue"
                : "purple",
            status: "info",
          }));
          setRecentActivities(activities);
        }

        // Update conversion rate
        if (conversionResponse.statusCode === 200) {
          setConversionRate(
            Math.round(conversionResponse.data.conversionRate || 0)
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });

        // If it's an authentication error, show login prompt
        if (error.message.includes("token") || error.response?.status === 401) {
          setError("Please log in to view dashboard data");
          showErrorToast("Please log in to view dashboard data");
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
          pendingPayments: 0,
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
    let path = "";
    switch (type) {
      case "totalproperties":
        path = "/properties";
        break;
      case "totalleads":
        path = "/leads";
        break;
      case "totalcustomers":
        path = "/customers/profiles";
        break;
      case "totalbookings":
        path = "/bookings/booked-units";
        break;
      case "totalrevenue":
        path = "/admin/reports";
        break;
      case "pendingpayments":
        path = "/payments/due-payments";
        break;
      default:
        path = "/";
    }
    navigate(path);
  };

  const handleQuickActionClick = (type) => {
    let path = "";
    switch (type) {
      case "addlead":
        path = "/lead/add";
        break;
      case "addproperty":
        path = "/property/property-master";
        break;
      case "recordpayment":
        path = "/payments/installments";
        break;
      case "viewreports":
        path = "/admin/reports";
        break;
      default:
        path = "/";
    }
    navigate(path);
  };

  const StatCard = ({
    title,
    value,
    icon: IconComponent,
    change,
    gradient,
  }) => (
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
        style={{ height: "100%", minHeight: "200px" }}
      >
        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
          position="relative"
          h="full"
          minH="200px"
          _hover={{
            boxShadow: "xl",
            transform: "translateY(-2px)",
            bg: "gray.50",
          }}
          transition="all 0.3s ease"
          onClick={() =>
            handleStatCardClick(title.toLowerCase().replace(/\s/g, ""))
          }
          cursor="pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStatCardClick(title.toLowerCase().replace(/\s/g, ""));
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
          <CardBody
            p={{ base: 4, sm: 5, md: 6 }}
            h="full"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Flex
              justify="space-between"
              align="start"
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 3, sm: 0 }}
              flex={1}
            >
              <VStack
                align="start"
                spacing={{ base: 1, sm: 2 }}
                flex={1}
                minW={0}
              >
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  fontWeight="medium"
                  color={mutedTextColor}
                  noOfLines={1}
                >
                  {title}
                </Text>
                <Text
                  fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                  noOfLines={1}
                >
                  {value}
                </Text>
                {change && (
                  <HStack spacing={1} flexWrap="wrap">
                    <Icon
                      as={change > 0 ? FaArrowUp : FaArrowDown}
                      color={change > 0 ? "green.500" : "red.500"}
                      boxSize={{ base: 3, sm: 4 }}
                    />
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color={change > 0 ? "green.500" : "red.500"}
                      fontWeight="medium"
                    >
                      {change > 0 ? "+" : ""}
                      {change}%
                    </Text>
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color={mutedTextColor}
                      display={{ base: "none", sm: "inline" }}
                    >
                      from last month
                    </Text>
                  </HStack>
                )}
              </VStack>
              <Box
                p={{ base: 3, sm: 4 }}
                borderRadius="xl"
                bgGradient={gradient}
                boxShadow="lg"
                animation={`${pulseAnimation} 2s infinite`}
                flexShrink={0}
              >
                <Icon
                  as={IconComponent}
                  color="white"
                  boxSize={{ base: 5, sm: 6 }}
                />
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
        p={{ base: 3, sm: 4 }}
        borderRadius="lg"
        bg={activityBg}
        _hover={{
          bg: hoverBg,
          transform: "translateX(5px)",
        }}
        transition="all 0.2s ease"
        spacing={{ base: 3, sm: 4 }}
        flexWrap={{ base: "wrap", sm: "nowrap" }}
      >
        <Box
          p={{ base: 1.5, sm: 2 }}
          borderRadius="full"
          bg={`${activity.color}.100`}
          color={`${activity.color}.600`}
          flexShrink={0}
        >
          <Icon as={activity.icon} boxSize={{ base: 3, sm: 4 }} />
        </Box>
        <VStack align="start" spacing={1} flex={1} minW={0}>
          <Text
            fontSize={{ base: "xs", sm: "sm" }}
            fontWeight="medium"
            color={textColor}
            noOfLines={{ base: 2, sm: 1 }}
          >
            {activity.message}
          </Text>
          <Text
            fontSize={{ base: "2xs", sm: "xs" }}
            color={mutedTextColor}
            noOfLines={1}
          >
            {activity.time}
          </Text>
        </VStack>
        <Badge
          colorScheme={activity.status}
          variant="subtle"
          fontSize={{ base: "2xs", sm: "xs" }}
          flexShrink={0}
        >
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
        bg={useColorModeValue("gray.50", "gray.700")}
        _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
        transition="all 0.2s ease"
        cursor="pointer"
        onClick={() => navigate(`/meeting-details/${meeting._id}`)}
      >
        <Box
          p={2}
          borderRadius="full"
          bg={useColorModeValue("green.100", "green.900")}
          color={useColorModeValue("green.600", "green.300")}
        >
          <FaCalendarAlt size={12} />
        </Box>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {meeting.title}
          </Text>
          <Text fontSize="xs" color={mutedTextColor}>
            {meeting.startTime} {meeting.endTime ? `- ${meeting.endTime}` : ""}
          </Text>
          {meeting.propertyId && (
            <Text fontSize="xs" color={mutedTextColor}>
              Property: {meeting.propertyId.name}
            </Text>
          )}
        </VStack>
        <Badge
          colorScheme={
            meeting.status?.name?.toLowerCase().includes("scheduled")
              ? "blue"
              : meeting.status?.name?.toLowerCase().includes("completed")
              ? "green"
              : meeting.status?.name?.toLowerCase().includes("cancelled")
              ? "red"
              : "orange"
          }
          variant="subtle"
          fontSize="xs"
        >
          {meeting.status?.name || "Scheduled"}
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
        style={{ height: "100%" }}
      >
        <Button
          variant="outline"
          size={{ base: "sm", sm: "md", md: "lg" }}
          h="full"
          minH={{ base: "80px", sm: "100px", md: "120px" }}
          p={{ base: 3, sm: 4, md: 5 }}
          borderRadius="xl"
          borderColor={borderColor}
          bg={cardBg}
          _hover={{
            bg: `${color}.50`,
            borderColor: `${color}.300`,
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          transition="all 0.2s ease"
          onClick={() =>
            handleQuickActionClick(label.toLowerCase().replace(/\s/g, ""))
          }
          w="full"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <VStack
            spacing={{ base: 2, sm: 3 }}
            align="center"
            justify="center"
            h="full"
          >
            <Box
              p={{ base: 2, sm: 3, md: 4 }}
              borderRadius="full"
              bg={`${color}.100`}
              color={`${color}.600`}
              flexShrink={0}
            >
              <Icon as={IconComponent} boxSize={{ base: 4, sm: 5, md: 6 }} />
            </Box>
            <Text
              fontSize={{ base: "xs", sm: "sm", md: "sm" }}
              fontWeight="medium"
              color={textColor}
              textAlign="center"
              noOfLines={2}
              lineHeight="short"
            >
              {label}
            </Text>
          </VStack>
        </Button>
      </motion.div>
    </Tooltip>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box
        bg={bgColor}
        minH="100vh"
        p={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Loader size="xl" label="Loading dashboard..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" p={6}>
        <Card
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor={borderColor}
        >
          <CardBody p={8} textAlign="center">
            <Text color="red.500" fontSize="lg" mb={4}>
              {error}
            </Text>
            {error.includes("log in") ? (
              <Button colorScheme="blue" onClick={() => navigate("/login")}>
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
    <Box bg={bgColor} minH="100vh" p={{ base: 3, sm: 4, md: 6 }}>
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={{ base: 4, sm: 6, md: 8 }} align="stretch">
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
                  p={{ base: 4, sm: 6, md: 8 }}
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
                  <VStack
                    align="start"
                    spacing={{ base: 2, sm: 3 }}
                    position="relative"
                    zIndex={1}
                  >
                    <HStack
                      spacing={{ base: 2, sm: 3 }}
                      flexWrap={{ base: "wrap", sm: "nowrap" }}
                    >
                      <Box
                        p={{ base: 2, sm: 3 }}
                        bg="white"
                        borderRadius="full"
                        boxShadow="lg"
                        flexShrink={0}
                      >
                        <Icon
                          as={FaChartLine}
                          color="blue.500"
                          boxSize={{ base: 4, sm: 5, md: 6 }}
                        />
                      </Box>
                      <VStack align="start" spacing={1} minW={0} flex={1}>
                        <Heading size={{ base: "md", sm: "lg" }} color="white">
                          Dashboard
                        </Heading>
                        <Text
                          color="blue.100"
                          fontSize={{ base: "sm", sm: "md" }}
                          noOfLines={{ base: 2, sm: 1 }}
                        >
                          Welcome back! Here's what's happening with your real
                          estate business.
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </Card>
            </motion.div>

            {/* Statistics Grid */}
            <Box
              overflowX="auto"
              mb={8}
              css={{
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#a8a8a8",
                },
              }}
            >
              <Grid
                templateColumns={{
                  base: "repeat(4, 250px)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 280px)",
                  lg: "repeat(4, 300px)",
                }}
                gap={{ base: 4, sm: 5, md: 6 }}
                minW="fit-content"
              >
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
                    title="Rental Bookings"
                    value={stats.totalRentalBookings}
                    icon={FaBuilding}
                    change={5}
                    gradient="linear(to-r, teal.500, teal.600)"
                  />
                </GridItem>
                <GridItem>
                  <StatCard
                    title="Purchase Bookings"
                    value={stats.totalPurchaseBookings}
                    icon={FaDollarSign}
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
            </Box>

            {/* Role-wise Customers */}
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
                    Role-wise Customer Distribution
                  </Heading>
                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={4}
                  >
                    {Object.keys(stats.roleWiseCustomers).length > 0 ? (
                      Object.entries(stats.roleWiseCustomers).map(
                        ([role, count]) => (
                          <Box
                            key={role}
                            p={4}
                            borderRadius="lg"
                            bg={useColorModeValue("gray.50", "gray.700")}
                            border="1px"
                            borderColor={useColorModeValue(
                              "gray.200",
                              "gray.600"
                            )}
                          >
                            <VStack spacing={2}>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={textColor}
                              >
                                {count}
                              </Text>
                              <Text
                                fontSize="sm"
                                color={mutedTextColor}
                                textAlign="center"
                                textTransform="capitalize"
                              >
                                {role.replace(/([A-Z])/g, " $1").trim()}
                              </Text>
                            </VStack>
                          </Box>
                        )
                      )
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
            </motion.div>

            {/* Additional Metrics */}
            <Box
              overflowX="auto"
              mb={8}
              css={{
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#a8a8a8",
                },
              }}
            >
              <Grid
                templateColumns={{
                  base: "repeat(3, 300px)",
                  md: "repeat(3, 350px)",
                  lg: "repeat(3, 400px)",
                }}
                gap={6}
                minW="fit-content"
              >
                <GridItem>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={textColor}
                    mb={4}
                  >
                    Property Status
                  </Text>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={{ base: 3, sm: 4 }}
                    h="full"
                  >
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
                  </SimpleGrid>
                </GridItem>

                {/* Lead Analytics Section */}
                <Box>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="bold"
                    color={textColor}
                    textAlign="center"
                    mb={{ base: 3, sm: 4 }}
                  >
                    Lead Analytics
                  </Text>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={{ base: 3, sm: 4 }}
                    h="full"
                  >
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
                  </SimpleGrid>
                </Box>

                {/* Schedule Overview Section */}
                <Box>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="bold"
                    color={textColor}
                    textAlign="center"
                    mb={{ base: 3, sm: 4 }}
                  >
                    Schedule Overview
                  </Text>
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={{ base: 3, sm: 4 }}
                    h="full"
                  >
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
                  </SimpleGrid>
                </Box>
              </Grid>
            </Box>

            {/* Recent Activities and Quick Actions */}
            <Grid
              templateColumns={{ base: "1fr", md: "1fr", lg: "repeat(2, 1fr)" }}
              gap={{ base: 4, sm: 5, md: 6 }}
            >
              {/* Recent Activities */}
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <CardBody p={{ base: 4, sm: 5, md: 6 }}>
                    <HStack
                      justify="space-between"
                      mb={{ base: 4, sm: 5, md: 6 }}
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Heading
                        size={{ base: "sm", sm: "md" }}
                        color={textColor}
                      >
                        Recent Activities
                      </Heading>
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        fontSize={{ base: "xs", sm: "sm" }}
                      >
                        Live
                      </Badge>
                    </HStack>
                    <VStack spacing={{ base: 2, sm: 3 }} align="stretch">
                      {recentActivities.map((activity, index) => (
                        <ActivityItem
                          key={activity.id}
                          activity={activity}
                          index={index}
                        />
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>

              {/* My Today's Meetings */}
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <CardBody p={6}>
                    <HStack justify="space-between" align="center" mb={6}>
                      <Heading size="md" color={textColor}>
                        My Today's Meetings
                      </Heading>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => navigate("/my-meetings")}
                      >
                        <FaCalendarAlt size={14} />
                      </Button>
                    </HStack>
                    <VStack
                      spacing={2}
                      align="stretch"
                      maxH="300px"
                      overflowY="auto"
                    >
                      {console.log(
                        "Rendering today's meetings:",
                        todaysMeetings
                      )}
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
              </motion.div>

              {/* My Tomorrow's Meetings */}
              <motion.div variants={itemVariants}>
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <CardBody p={6}>
                    <HStack justify="space-between" align="center" mb={6}>
                      <Heading size="md" color={textColor}>
                        My Tomorrow's Meetings
                      </Heading>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => navigate("/my-meetings")}
                      >
                        <FaCalendarAlt size={14} />
                      </Button>
                    </HStack>
                    <VStack
                      spacing={2}
                      align="stretch"
                      maxH="300px"
                      overflowY="auto"
                    >
                      {console.log(
                        "Rendering tomorrow's meetings:",
                        tomorrowsMeetings
                      )}
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
              </motion.div>

              {/* Quick Actions - Hidden */}
              {/* <motion.div variants={itemVariants}>
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
                    <SimpleGrid 
                      columns={{ base: 2, sm: 2, md: 2, lg: 4 }} 
                      spacing={{ base: 2, sm: 3, md: 4 }}
                      minChildWidth={{ base: "120px", sm: "140px", md: "160px" }}
                    >
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
              </motion.div> */}
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
                <CardBody p={{ base: 4, sm: 5, md: 6 }}>
                  <Heading
                    size={{ base: "sm", sm: "md" }}
                    color={textColor}
                    mb={{ base: 4, sm: 5, md: 6 }}
                  >
                    Performance Overview
                  </Heading>
                  <SimpleGrid
                    columns={{ base: 1, sm: 1, md: 3 }}
                    spacing={{ base: 4, sm: 5, md: 6 }}
                  >
                    <VStack spacing={{ base: 2, sm: 3 }}>
                      <Box
                        p={{ base: 3, sm: 4 }}
                        borderRadius="full"
                        bg="green.100"
                        color="green.600"
                      >
                        <Icon
                          as={FaArrowUp}
                          boxSize={{ base: 6, sm: 7, md: 8 }}
                        />
                      </Box>
                      <VStack spacing={1}>
                        <Text
                          fontSize={{ base: "2xl", sm: "3xl" }}
                          fontWeight="bold"
                          color="green.600"
                        >
                          {conversionRate}%
                        </Text>
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color={mutedTextColor}
                          textAlign="center"
                        >
                          Lead Conversion Rate
                        </Text>
                      </VStack>
                      <Progress
                        value={conversionRate}
                        colorScheme="green"
                        size="sm"
                        w="full"
                        borderRadius="full"
                      />
                    </VStack>

                    <VStack spacing={{ base: 2, sm: 3 }}>
                      <Box
                        p={{ base: 3, sm: 4 }}
                        borderRadius="full"
                        bg="blue.100"
                        color="blue.600"
                      >
                        <Icon
                          as={FaBuilding}
                          boxSize={{ base: 6, sm: 7, md: 8 }}
                        />
                      </Box>
                      <VStack spacing={1}>
                        <Text
                          fontSize={{ base: "2xl", sm: "3xl" }}
                          fontWeight="bold"
                          color="blue.600"
                        >
                          {stats.totalProperties}
                        </Text>
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color={mutedTextColor}
                          textAlign="center"
                        >
                          Total Properties
                        </Text>
                      </VStack>
                      <Progress
                        value={Math.min(
                          (stats.totalProperties / 200) * 100,
                          100
                        )}
                        colorScheme="blue"
                        size="sm"
                        w="full"
                        borderRadius="full"
                      />
                    </VStack>

                    <VStack spacing={{ base: 2, sm: 3 }}>
                      <Box
                        p={{ base: 3, sm: 4 }}
                        borderRadius="full"
                        bg="purple.100"
                        color="purple.600"
                      >
                        <Icon
                          as={FaMoneyBillWave}
                          boxSize={{ base: 6, sm: 7, md: 8 }}
                        />
                      </Box>
                      <VStack spacing={1}>
                        <Text
                          fontSize={{ base: "2xl", sm: "3xl" }}
                          fontWeight="bold"
                          color="purple.600"
                        >
                          {formatCurrency(stats.totalRevenue)}
                        </Text>
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color={mutedTextColor}
                          textAlign="center"
                        >
                          Total Revenue
                        </Text>
                      </VStack>
                      <Progress
                        value={Math.min(
                          (stats.totalRevenue / 5000000) * 100,
                          100
                        )}
                        colorScheme="purple"
                        size="sm"
                        w="full"
                        borderRadius="full"
                      />
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
