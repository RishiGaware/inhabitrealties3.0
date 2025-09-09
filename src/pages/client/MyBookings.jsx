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
import { FiDownload, FiEye, FiEdit } from 'react-icons/fi';
import { FaCalendar, FaMoneyBillWave, FaHome, FaBuilding } from 'react-icons/fa';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import CommonCard from '../../components/common/Card/CommonCard';
import Loader from '../../components/common/Loader';
import { getAllMyBookings } from '../../services/booking/myBookingsService';
import PurchaseBookingViewer from '../../components/common/PurchaseBookingViewer';
import PurchaseBookingEditForm from '../../components/common/PurchaseBookingEditForm';
import RentalBookingViewer from '../../components/common/RentalBookingViewer';
import RentalBookingEditForm from '../../components/common/RentalBookingEditForm';

const MyBookings = () => {
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
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalAmount: 0,
    purchaseCount: 0,
    rentalCount: 0
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

  // Fetch user's bookings
  const fetchMyBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await getAllMyBookings(userId);
      
      if (response.success) {
        setBookings(response.data || []);
        setFilteredBookings(response.data || []);
        
        // Calculate statistics
        const totalBookings = response.totalCount || 0;
        const confirmedBookings = response.data?.filter(b => b.status === 'CONFIRMED').length || 0;
        const pendingBookings = response.data?.filter(b => b.status === 'PENDING').length || 0;
        const totalAmount = response.data?.reduce((sum, booking) => {
          return sum + (parseInt(booking.displayAmount) || 0);
        }, 0) || 0;

        setStats({
          totalBookings,
          confirmedBookings,
          pendingBookings,
          totalAmount,
          purchaseCount: response.purchaseCount || 0,
          rentalCount: response.rentalCount || 0
        });
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: 'Failed to load your bookings. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Filter options - dynamically generated from API data
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        (booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.bookingType?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, bookings]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle filters
  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
  };

  // Handle view booking
  const handleView = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setSelectedBooking(booking);
      setIsViewerOpen(true);
    }
  };

  // Handle edit booking
  const handleEdit = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setEditingBooking(booking);
      setIsEditFormOpen(true);
    }
  };

  // Handle edit form update
  const handleEditFormUpdate = () => {
    fetchMyBookings(); // Refresh data after edit
    setIsEditFormOpen(false);
    setEditingBooking(null);
  };

  // Handle export
  const handleExport = () => {
    const csvData = filteredBookings.map((booking, index) => ({
      'S.No': index + 1,
      'Booking ID': booking.bookingId || booking._id?.slice(-8) || 'N/A',
      'Type': booking.bookingType || 'N/A',
      'Property': booking.propertyId?.name || 'N/A',
      'Customer': booking.customerId ? `${booking.customerId.firstName || ''} ${booking.customerId.lastName || ''}`.trim() : 'N/A',
      'Amount': booking.displayAmount || '0',
      'Status': booking.status || 'N/A',
      'Booking Date': booking.displayDate ? new Date(booking.displayDate).toLocaleDateString() : 'N/A',
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (value, row) => (
        <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="150px">
          {value || row._id?.slice(-8) || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'bookingType',
      label: 'Type',
      render: (value) => (
        <Flex align="center" gap={2}>
          {value === 'Purchase' ? (
            <FaBuilding color="#3b82f6" size={12} />
          ) : (
            <FaHome color="#22c55e" size={12} />
          )}
          <Badge 
            colorScheme={value === 'Purchase' ? 'blue' : 'green'} 
            variant="subtle" 
            fontSize="xs"
          >
            {value}
          </Badge>
        </Flex>
      ),
      width: "100px"
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontWeight="semibold" noOfLines={1} maxW="150px">
            {row.propertyId?.name || 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="150px">
            {row.propertyId?.propertyAddress?.city || 'N/A'}
          </Text>
        </VStack>
      ),
      width: "150px"
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
            {row.customerId ? `${row.customerId.firstName || ''} ${row.customerId.lastName || ''}`.trim() : 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="120px">
            {row.customerId?.email || 'N/A'}
          </Text>
        </VStack>
      ),
      width: "150px"
    },
    {
      key: 'totalValue',
      label: 'Amount',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.displayAmount ? parseFloat(row.displayAmount).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (value) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'CONFIRMED': return 'green';
            case 'PENDING': return 'yellow';
            case 'REJECTED': return 'red';
            case 'COMPLETED': return 'blue';
            case 'CANCELLED': return 'gray';
            default: return 'gray';
          }
        };

        return (
          <Badge
            colorScheme={getStatusColor(value)}
            variant="solid"
            fontSize="xs"
          >
            {value?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
      width: "100px"
    },
  ];

  // Row actions - matching AllPurchaseBookings style
  const renderRowActions = (booking) => (
    <HStack spacing={2}>
      <IconButton
        key="view"
        aria-label="View booking"
        icon={<FiEye />}
        size="sm"
        onClick={() => handleView(booking._id)}
        colorScheme="blue"
        variant="outline"
      />
      <IconButton
        key="edit"
        aria-label="Edit booking"
        icon={<FiEdit />}
        size="sm"
        onClick={() => handleEdit(booking._id)}
        colorScheme="brand"
        variant="outline"
      />
    </HStack>
  );

  // Show loading state
  if (isLoading) {
    return <Loader fullScreen text="Loading your bookings..." />;
  }

  // Show error state
  if (error) {
    return (
      <Box p={5}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading bookings</Text>
            <Text fontSize="sm">{error}</Text>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          My Bookings
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
      <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(6, 1fr)' }} gap={4} mb={6}>
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
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaCalendar color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{stats.pendingBookings}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaMoneyBillWave color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">₹{stats.totalAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>

        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaBuilding color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Purchase</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{stats.purchaseCount}</Text>
            </Box>
          </Flex>
        </CommonCard>

        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaHome color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Rental</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{stats.rentalCount}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Box>

      <CommonCard p={6}>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onSearchSubmit={() => {}} // No API search needed
          searchPlaceholder="Search bookings by ID, customer, property..."
          filters={{ status: statusFilter }}
          onFilterChange={handleFilterChange}
          onApplyFilters={() => {}} // No API filter needed
          onClearFilters={handleClearFilters}
          filterOptions={{
            status: {
              label: "Status",
              placeholder: "Filter by status",
              options: statusOptions
            }
          }}
          title="My Bookings"
          activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
        />
        
        {filteredBookings.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500" fontSize="lg" mb={2}>
              No bookings found
            </Text>
            <Text color="gray.400" fontSize="sm">
              {bookings.length === 0 
                ? "You don't have any property bookings yet. Contact our team to get started!"
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
        selectedBooking.bookingType === 'Purchase' ? (
          <PurchaseBookingViewer
            isOpen={isViewerOpen}
            onClose={() => {
              setIsViewerOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
          />
        ) : (
          <RentalBookingViewer
            isOpen={isViewerOpen}
            onClose={() => {
              setIsViewerOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
          />
        )
      )}

      {/* Edit Modal */}
      {editingBooking && (
        editingBooking.bookingType === 'Purchase' ? (
          <PurchaseBookingEditForm
            isOpen={isEditFormOpen}
            onClose={() => {
              setIsEditFormOpen(false);
              setEditingBooking(null);
            }}
            booking={editingBooking}
            onUpdate={handleEditFormUpdate}
          />
        ) : (
          <RentalBookingEditForm
            isOpen={isEditFormOpen}
            onClose={() => {
              setIsEditFormOpen(false);
              setEditingBooking(null);
            }}
            booking={editingBooking}
            onUpdate={handleEditFormUpdate}
          />
        )
      )}
    </Box>
  );
};

export default MyBookings; 