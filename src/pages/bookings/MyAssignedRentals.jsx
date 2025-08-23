import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Tooltip,
  IconButton,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEye, FiEdit, FiPlus, FiCalendar, FiDollarSign, FiHome, FiUser, FiClock } from 'react-icons/fi';

const MyAssignedRentals = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data for assigned rentals
  const [assignedRentals, setAssignedRentals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    totalMonthlyRent: 0,
    totalSecurityDeposit: 0,
    monthlyTarget: 0,
  });

  useEffect(() => {
    // Mock data
    const mockRentals = [
      {
        _id: 'rental_1',
        rentalId: 'RENTAL-2024-001',
        customerName: 'Alice Johnson',
        propertyTitle: 'Modern Studio Apartment',
        propertyType: 'APARTMENT',
        status: 'ACTIVE',
        monthlyRent: 2500,
        securityDeposit: 5000,
        leaseStart: '2024-01-01',
        leaseEnd: '2024-12-31',
        nextRentDue: '2024-03-01',
        lastContact: '2024-01-25',
        priority: 'HIGH'
      },
      {
        _id: 'rental_2',
        rentalId: 'RENTAL-2024-002',
        customerName: 'Bob Smith',
        propertyTitle: 'Downtown Loft',
        propertyType: 'LOFT',
        status: 'PENDING',
        monthlyRent: 3500,
        securityDeposit: 7000,
        leaseStart: '2024-02-01',
        leaseEnd: '2025-01-31',
        nextRentDue: '2024-03-01',
        lastContact: '2024-01-28',
        priority: 'MEDIUM'
      },
      {
        _id: 'rental_3',
        rentalId: 'RENTAL-2024-003',
        customerName: 'Carol Brown',
        propertyTitle: 'Suburban House',
        propertyType: 'HOUSE',
        status: 'ACTIVE',
        monthlyRent: 4500,
        securityDeposit: 9000,
        leaseStart: '2023-06-01',
        leaseEnd: '2024-05-31',
        nextRentDue: '2024-03-01',
        lastContact: '2024-01-30',
        priority: 'LOW'
      },
      {
        _id: 'rental_4',
        rentalId: 'RENTAL-2024-004',
        customerName: 'David Wilson',
        propertyTitle: 'Luxury Penthouse',
        propertyType: 'PENTHOUSE',
        status: 'ACTIVE',
        monthlyRent: 8000,
        securityDeposit: 16000,
        leaseStart: '2023-09-01',
        leaseEnd: '2024-08-31',
        nextRentDue: '2024-03-01',
        lastContact: '2024-01-22',
        priority: 'HIGH'
      }
    ];

    setAssignedRentals(mockRentals);
    
    // Calculate stats
    const total = mockRentals.length;
    const active = mockRentals.filter(r => r.status === 'ACTIVE').length;
    const pending = mockRentals.filter(r => r.status === 'PENDING').length;
    const totalMonthlyRent = mockRentals.reduce((sum, r) => sum + r.monthlyRent, 0);
    const totalSecurityDeposit = mockRentals.reduce((sum, r) => sum + r.securityDeposit, 0);
    const monthlyTarget = 20000; // Mock target

    setStats({ total, active, pending, totalMonthlyRent, totalSecurityDeposit, monthlyTarget });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'EXPIRED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            My Assigned Rentals
          </Text>
          <Text fontSize="lg" color="gray.600">
            Manage your assigned rental properties and track performance
          </Text>
        </VStack>
        
        <Button
          leftIcon={<FiPlus />}
          onClick={() => navigate('/rental-bookings/create')}
          colorScheme="blue"
          size="lg"
          px={8}
        >
          New Rental
        </Button>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Rentals</StatLabel>
              <StatNumber fontSize="3xl" color="blue.600">{stats.total}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                15% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active</StatLabel>
              <StatNumber fontSize="3xl" color="green.600">{stats.active}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Pending</StatLabel>
              <StatNumber fontSize="3xl" color="yellow.600">{stats.pending}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                12% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Monthly Rent</StatLabel>
              <StatNumber fontSize="2xl" color="purple.600">
                {formatCurrency(stats.totalMonthlyRent)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                20% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Monthly Target Progress */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={8}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Monthly Rental Target
              </Text>
              <Text fontSize="sm" color="gray.600">
                Target: {formatCurrency(stats.monthlyTarget)}
              </Text>
            </VStack>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {Math.round((stats.totalMonthlyRent / stats.monthlyTarget) * 100)}%
            </Text>
          </Flex>
          <Progress 
            value={(stats.totalMonthlyRent / stats.monthlyTarget) * 100} 
            colorScheme="blue" 
            size="lg" 
            borderRadius="full"
          />
        </CardBody>
      </Card>

      {/* Rentals Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {assignedRentals.map((rental) => (
          <Card 
            key={rental._id} 
            bg={bgColor} 
            border="1px" 
            borderColor={borderColor}
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            transition="all 0.2s"
          >
            <CardBody>
              {/* Header */}
              <Flex justify="space-between" align="start" mb={4}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {rental.rentalId}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {rental.customerName}
                  </Text>
                </VStack>
                <HStack spacing={2}>
                  <Badge colorScheme={getStatusColor(rental.status)} variant="subtle">
                    {rental.status}
                  </Badge>
                  <Badge colorScheme={getPriorityColor(rental.priority)} variant="subtle">
                    {rental.priority}
                  </Badge>
                </HStack>
              </Flex>

              {/* Property Info */}
              <Box mb={4}>
                <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                  {rental.propertyTitle}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Lease: {formatDate(rental.leaseStart)} - {formatDate(rental.leaseEnd)}
                </Text>
              </Box>

              {/* Financial Info */}
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600">Monthly Rent</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    {formatCurrency(rental.monthlyRent)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Security Deposit</Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    {formatCurrency(rental.securityDeposit)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Next Rent Due</Text>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    {formatDate(rental.nextRentDue)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Days Until</Text>
                  <Text fontSize="lg" fontWeight="bold" color={getDaysUntil(rental.nextRentDue) < 7 ? 'red.600' : 'gray.600'}>
                    {getDaysUntil(rental.nextRentDue)} days
                  </Text>
                </Box>
              </SimpleGrid>

              {/* Last Contact */}
              <Box mb={4} p={3} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  Last Contact: {formatDate(rental.lastContact)}
                </Text>
              </Box>

              {/* Actions */}
              <HStack spacing={3} justify="center">
                <Tooltip label="View Details">
                  <IconButton
                    icon={<FiEye />}
                    onClick={() => navigate(`/rental-bookings/${rental._id}`)}
                    variant="ghost"
                    colorScheme="blue"
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="Edit Rental">
                  <IconButton
                    icon={<FiEdit />}
                    onClick={() => navigate(`/rental-bookings/update/${rental._id}`)}
                    variant="ghost"
                    colorScheme="green"
                    size="sm"
                  />
                </Tooltip>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FiCalendar />}
                >
                  Schedule Follow-up
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Empty State */}
      {assignedRentals.length === 0 && (
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={12}>
            <VStack spacing={4}>
              <Text fontSize="xl" color="gray.500">
                No assigned rentals yet
              </Text>
              <Text color="gray.400">
                Start by creating a new rental booking or wait for assignments
              </Text>
              <Button
                leftIcon={<FiPlus />}
                onClick={() => navigate('/rental-bookings/create')}
                colorScheme="blue"
              >
                Create New Rental
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default MyAssignedRentals; 