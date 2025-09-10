import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Badge,
  useToast,
  IconButton,
  Heading,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiDownload, FiEye } from 'react-icons/fi';
import { FaCalendar, FaMoneyBillWave, FaHome, FaBuilding } from 'react-icons/fa';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import CommonCard from '../../components/common/Card/CommonCard';
import Loader from '../../components/common/Loader';
import { getAllMyBookings } from '../../services/booking/myBookingsService';
import RentalBookingViewer from '../../components/common/RentalBookingViewer';

const MyRentalBookings = () => {
  const navigate = useNavigate();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRent: 0,
  });

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        return parsedAuth.data?._id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Fetch user's rental bookings
  const fetchMyRentalBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await getAllMyBookings(userId);
      
      if (response.success) {
        // Filter only rental bookings
        const rentalBookings = response.data?.filter(booking => booking.type === 'rental') || [];
        setBookings(rentalBookings);
        setFilteredBookings(rentalBookings);
        
        // Calculate statistics
        const totalBookings = rentalBookings.length;
        const confirmedBookings = rentalBookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
        const pendingBookings = rentalBookings.filter(b => b.bookingStatus === 'PENDING').length;
        const totalRent = rentalBookings.reduce((sum, booking) => {
          return sum + (parseInt(booking.monthlyRent) || 0);
        }, 0);

        setStats({
          totalBookings,
          confirmedBookings,
          pendingBookings,
          totalRent,
        });
      } else {
        throw new Error('Failed to fetch rental bookings');
      }
    } catch (error) {
      console.error('Error fetching rental bookings:', error);
      setError(error.message);
      toast.error(error.message)
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentalBookings();
  }, []);

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, bookings]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  // Handle export
  const handleExport = () => {
    // Export functionality can be implemented here
    toast({
      title: 'Export',
      description: 'Export functionality will be implemented soon.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle view booking
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsViewerOpen(true);
  };

  // Table columns
  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (booking) => (
        <Text fontWeight="medium" color="blue.600">
          {booking.bookingId}
        </Text>
      ),
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (booking) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">{booking.propertyName}</Text>
          <Text fontSize="sm" color="gray.500">{booking.propertyLocation}</Text>
        </VStack>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (booking) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">{booking.customerName}</Text>
          <Text fontSize="sm" color="gray.500">{booking.customerPhone}</Text>
        </VStack>
      ),
    },
    {
      key: 'monthlyRent',
      label: 'Monthly Rent',
      render: (booking) => (
        <Text fontWeight="medium" color="green.600">
          ₹{parseInt(booking.monthlyRent).toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'securityDeposit',
      label: 'Security Deposit',
      render: (booking) => (
        <Text fontWeight="medium">
          ₹{parseInt(booking.securityDeposit || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (booking) => (
        <Text fontSize="sm">
          {booking.duration} months
        </Text>
      ),
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (booking) => {
        const statusColors = {
          'CONFIRMED': 'green',
          'PENDING': 'yellow',
          'CANCELLED': 'red',
          'COMPLETED': 'blue',
        };
        return (
          <Badge colorScheme={statusColors[booking.bookingStatus] || 'gray'}>
            {booking.bookingStatus}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Booking Date',
      render: (booking) => (
        <Text fontSize="sm">
          {new Date(booking.createdAt).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  // Row actions (view only)
  const renderRowActions = (booking) => (
    <HStack spacing={2}>
      <IconButton
        icon={<FiEye />}
        size="sm"
        variant="ghost"
        colorScheme="blue"
        onClick={() => handleViewBooking(booking)}
        aria-label="View booking"
      />
    </HStack>
  );

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          My Rental Bookings
        </Heading>
        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            onClick={handleExport}
            size="sm"
            variant="outline"
            colorScheme="blue"
          >
            Export CSV
          </Button>
        </HStack>
      </Flex>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaCalendar color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Bookings</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{stats.totalBookings}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaCalendar color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Confirmed</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{stats.confirmedBookings}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="yellow.100" borderRadius="lg">
              <FaCalendar color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="yellow.600">{stats.pendingBookings}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaMoneyBillWave color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Monthly Rent</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">
                ₹{stats.totalRent.toLocaleString()}
              </Text>
            </Box>
          </Flex>
        </CommonCard>
      </Box>

      <CommonCard p={6}>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onSearchSubmit={() => {}}
          searchPlaceholder="Search bookings by ID, customer, property..."
          filters={{ status: statusFilter }}
          onFilterChange={handleFilterChange}
          onApplyFilters={() => {}}
          onClearFilters={handleClearFilters}
          filterOptions={{
            status: {
              label: "Status",
              placeholder: "Filter by status",
              options: statusOptions
            }
          }}
          title="My Rental Bookings"
          activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
        />
        
        {filteredBookings.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500" fontSize="lg" mb={2}>
              No rental bookings found
            </Text>
            <Text color="gray.400" fontSize="sm">
              {bookings.length === 0 
                ? "You don't have any rental bookings yet."
                : "No bookings match your current search criteria."
              }
            </Text>
          </Box>
        ) : (
          <TableContainer>
            <CommonTable
              columns={columns}
              data={filteredBookings}
              rowActions={renderRowActions}
            />
            <CommonPagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBookings.length / pageSize)}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredBookings.length}
            />
          </TableContainer>
        )}
      </CommonCard>

      {/* View Modal */}
      {selectedBooking && (
        <RentalBookingViewer
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          isViewOnly={true}
        />
      )}
    </Box>
  );
};

export default MyRentalBookings;
