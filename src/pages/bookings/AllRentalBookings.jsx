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
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiDownload, FiHome, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';

const AllRentalBookings = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // State
  const [rentalBookings, setRentalBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');

  // Mock data
  useEffect(() => {
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
        salespersonName: 'Sarah Wilson',
        customerPhone: '+1234567890',
        customerEmail: 'alice@example.com',
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
        salespersonName: 'Mike Davis',
        customerPhone: '+1234567891',
        customerEmail: 'bob@example.com',
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
        salespersonName: 'Lisa Johnson',
        customerPhone: '+1234567892',
        customerEmail: 'carol@example.com',
      },
    ];

    setRentalBookings(mockRentals);
    setFilteredBookings(mockRentals);
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = rentalBookings;

    if (searchTerm) {
      filtered = filtered.filter(rental =>
        rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.rentalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.status === statusFilter);
    }

    if (propertyTypeFilter !== 'all') {
      filtered = filtered.filter(rental => rental.propertyType === propertyTypeFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, propertyTypeFilter, rentalBookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'EXPIRED': return 'red';
      case 'CANCELLED': return 'gray';
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

  // Calculate stats
  const stats = {
    total: rentalBookings.length,
    active: rentalBookings.filter(r => r.status === 'ACTIVE').length,
    pending: rentalBookings.filter(r => r.status === 'PENDING').length,
    totalMonthlyRent: rentalBookings.reduce((sum, r) => sum + r.monthlyRent, 0),
    totalSecurityDeposit: rentalBookings.reduce((sum, r) => sum + r.securityDeposit, 0),
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            All Rental Bookings
          </Text>
          <Text fontSize="lg" color="gray.600">
            Manage and monitor all property rental bookings
          </Text>
        </VStack>
        
        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export
          </Button>
          <Button
            leftIcon={<FiPlus />}
            onClick={() => navigate('/rental-bookings/create')}
            colorScheme="blue"
            size="lg"
          >
            New Rental
          </Button>
        </HStack>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6} mb={8}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Rentals</StatLabel>
              <StatNumber fontSize="3xl" color="blue.600">{stats.total}</StatNumber>
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
              <StatLabel color="gray.600">Active</StatLabel>
              <StatNumber fontSize="3xl" color="green.600">{stats.active}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last month
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
                5% from last month
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
                15% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Security Deposits</StatLabel>
              <StatNumber fontSize="2xl" color="teal.600">
                {formatCurrency(stats.totalSecurityDeposit)}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                10% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by customer, rental ID, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>

            <Select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
            >
              <option value="all">All Property Types</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="LOFT">Loft</option>
              <option value="VILLA">Villa</option>
            </Select>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Rentals Table */}
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Rental ID</Th>
                  <Th>Customer</Th>
                  <Th>Property</Th>
                  <Th>Status</Th>
                  <Th>Monthly Rent</Th>
                  <Th>Lease Period</Th>
                  <Th>Next Rent Due</Th>
                  <Th>Salesperson</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookings.map((rental) => (
                  <Tr key={rental._id}>
                    <Td>
                      <Text fontWeight="semibold" color="blue.600">
                        {rental.rentalId}
                      </Text>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{rental.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">{rental.customerEmail}</Text>
                        <Text fontSize="sm" color="gray.600">{rental.customerPhone}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">{rental.propertyTitle}</Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {rental.propertyType}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(rental.status)} variant="subtle">
                        {rental.status}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="green.600">
                          {formatCurrency(rental.monthlyRent)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Deposit: {formatCurrency(rental.securityDeposit)}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">Start: {formatDate(rental.leaseStart)}</Text>
                        <Text fontSize="sm">End: {formatDate(rental.leaseEnd)}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">{formatDate(rental.nextRentDue)}</Text>
                        <Text fontSize="xs" color={getDaysUntil(rental.nextRentDue) < 7 ? 'red.500' : 'gray.500'}>
                          {getDaysUntil(rental.nextRentDue)} days left
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{rental.salespersonName}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="View Details">
                          <IconButton
                            icon={<FiEye />}
                            onClick={() => navigate(`/rental-bookings/${rental._id}`)}
                            variant="ghost"
                            colorScheme="blue"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Edit">
                          <IconButton
                            icon={<FiEdit />}
                            onClick={() => navigate(`/rental-bookings/update/${rental._id}`)}
                            variant="ghost"
                            colorScheme="green"
                            size="sm"
                          />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            icon={<FiTrash2 />}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card bg={bgColor} border="1px" borderColor={borderColor} mt={6}>
          <CardBody textAlign="center" py={12}>
            <VStack spacing={4}>
              <Text fontSize="xl" color="gray.500">
                No rental bookings found
              </Text>
              <Text color="gray.400">
                {searchTerm || statusFilter !== 'all' || propertyTypeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by creating a new rental booking'
                }
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

export default AllRentalBookings; 