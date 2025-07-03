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
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { BiUserPlus } from 'react-icons/bi';
import { MdInventory } from 'react-icons/md';
import Loader from '../../../components/common/Loader';

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
    pendingPayments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

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
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          totalProperties: 156,
          totalLeads: 89,
          totalCustomers: 234,
          totalBookings: 67,
          totalRevenue: 2845000,
          pendingPayments: 12
        });

        setRecentActivities([
          {
            id: 1,
            type: 'booking',
            message: 'New booking received for Property #123',
            time: '2 minutes ago',
            icon: MdInventory,
            color: 'blue',
            status: 'success'
          },
          {
            id: 2,
            type: 'lead',
            message: 'Lead qualified: John Doe',
            time: '15 minutes ago',
            icon: BiUserPlus,
            color: 'green',
            status: 'success'
          },
          {
            id: 3,
            type: 'payment',
            message: 'Payment received: $25,000',
            time: '1 hour ago',
            icon: FaMoneyBillWave,
            color: 'green',
            status: 'success'
          },
          {
            id: 4,
            type: 'customer',
            message: 'New customer registered: Sarah Wilson',
            time: '2 hours ago',
            icon: FaUsers,
            color: 'purple',
            status: 'info'
          },
          {
            id: 5,
            type: 'property',
            message: 'Property #456 listed for sale',
            time: '3 hours ago',
            icon: FaBuilding,
            color: 'orange',
            status: 'info'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: IconComponent, change, gradient }) => (
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
        }}
        transition="all 0.3s ease"
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

  const QuickActionButton = ({ icon: IconComponent, label, color, onClick }) => (
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
        onClick={onClick}
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
    return <Loader fullScreen text="Loading dashboard..." />;
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
                        onClick={() => console.log('Add Lead clicked')}
                      />
                      <QuickActionButton
                        icon={FaBuilding}
                        label="Add Property"
                        color="green"
                        onClick={() => console.log('Add Property clicked')}
                      />
                      <QuickActionButton
                        icon={FaMoneyBillWave}
                        label="Record Payment"
                        color="purple"
                        onClick={() => console.log('Record Payment clicked')}
                      />
                      <QuickActionButton
                        icon={FaChartLine}
                        label="View Reports"
                        color="orange"
                        onClick={() => console.log('View Reports clicked')}
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
                          89%
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Lead Conversion Rate
                        </Text>
                      </VStack>
                      <Progress value={89} colorScheme="green" size="sm" w="full" borderRadius="full" />
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
                          156
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Active Properties
                        </Text>
                      </VStack>
                      <Progress value={78} colorScheme="blue" size="sm" w="full" borderRadius="full" />
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
                          $2.8M
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                          Monthly Revenue
                        </Text>
                      </VStack>
                      <Progress value={92} colorScheme="purple" size="sm" w="full" borderRadius="full" />
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