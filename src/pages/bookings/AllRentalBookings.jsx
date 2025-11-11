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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  SimpleGrid,
  Divider,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiEdit } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import RentalBookingViewer from '../../components/common/RentalBookingViewer';
import RentalBookingEditForm from '../../components/common/RentalBookingEditForm';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';

const AllRentalBookings = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Filter options - dynamically generated from API data
  const filterOptions = {
    status: []
  };

  // Generate status options dynamically from the actual data
  useEffect(() => {
    if (bookings.length > 0) {
      const uniqueStatuses = [...new Set(bookings.map(booking => booking.bookingStatus))].filter(Boolean);
      const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...uniqueStatuses.map(status => ({
          value: status,
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      ];
      filterOptions.status = statusOptions;
    } else {
      // Set default options when no data is available
      filterOptions.status = [
        { value: '', label: 'All Statuses' }
      ];
    }
  }, [bookings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data from real API
  useEffect(() => {
    fetchBookings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Use the configured API service
      const response = await rentalBookingService.getAllRentalBookings();
      
      // Handle the actual API response format
      if (response && response.data && Array.isArray(response.data)) {
        setBookings(response.data);
        setFilteredBookings(response.data);
      } else if (response && Array.isArray(response)) {
        // Handle case where data is directly in response
        setBookings(response);
        setFilteredBookings(response);
      } else {
        console.warn('Unexpected API response format:', response);
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rental bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        (booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.propertyAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.assignedSalespersonId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.assignedSalespersonId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.assignedSalespersonId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, bookings]);

  // Table columns configuration - matching AllPurchaseBookings design
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
      key: 'propertyName',
      label: 'Property',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontWeight="semibold" noOfLines={1} maxW="150px">
            {row.propertyId?.name || 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="150px">
            {row.propertyId?.propertyAddress?.city || 'N/A'}, {row.propertyId?.propertyAddress?.state || 'N/A'}
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
      key: 'salespersonName',
      label: 'Salesperson',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
            {row.assignedSalespersonId ? `${row.assignedSalespersonId.firstName || ''} ${row.assignedSalespersonId.lastName || ''}`.trim() : 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="120px">
            {row.assignedSalespersonId?.email || 'N/A'}
          </Text>
        </VStack>
      ),
      width: "150px"
    },
    {
      key: 'monthlyRent',
      label: 'Monthly Rent',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.monthlyRent ? parseFloat(row.monthlyRent).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'rentDueDate',
      label: 'Rent Due Date',
      render: (_, row) => {
        return (
          <VStack align="start" spacing={1}>
            <Text color="gray.700" fontWeight="semibold" fontSize="sm">
              {row.rentDueDate ? `${row.rentDueDate}th` : 'N/A'}
            </Text>
            <Text color="gray.500" fontSize="xs">
              of each month
            </Text>
          </VStack>
        );
      },
      width: "120px"
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          {row.duration || 0} months
        </Text>
      ),
      width: "100px"
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (value) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'ACTIVE': return 'green';
            case 'PENDING': return 'yellow';
            case 'EXPIRED': return 'red';
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
        onClick={() => handleView(booking)}
        colorScheme="blue"
        variant="outline"
      />
      <IconButton
        key="edit"
        aria-label="Edit booking"
        icon={<FiEdit />}
        size="sm"
        onClick={() => handleEdit(booking)}
        colorScheme="brand"
        variant="outline"
      />
    </HStack>
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  // Handle add new booking
  const handleAddNew = () => {
    navigate('/rental-bookings/create');
  };

  // Handle view booking
  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsViewerOpen(true);
  };

  // Handle edit booking
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsEditFormOpen(true);
  };


  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredBookings.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      // Create CSV content from the actual data
      const exportData = filteredBookings.map(booking => ({
        'Booking ID': booking.bookingId || booking._id?.slice(-8) || 'N/A',
        'Property': booking.propertyId?.name || 'N/A',
        'Property Location': `${booking.propertyId?.propertyAddress?.city || 'N/A'}, ${booking.propertyId?.propertyAddress?.state || 'N/A'}`,
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Customer Email': booking.customerId?.email || 'N/A',
        'Salesperson': `${booking.assignedSalespersonId?.firstName || ''} ${booking.assignedSalespersonId?.lastName || ''}`.trim() || 'N/A',
        'Monthly Rent': `₹${parseFloat(booking.monthlyRent || 0).toLocaleString()}`,
        'Security Deposit': `₹${parseFloat(booking.securityDeposit || 0).toLocaleString()}`,
        'Rent Due Date': booking.rentDueDate ? `${booking.rentDueDate}th` : 'N/A',
        'Duration': `${booking.duration || 0} months`,
        'Start Date': booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A',
        'End Date': booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A',
        'Status': booking.bookingStatus || 'N/A',
        'Created Date': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
      }));

      // Generate CSV
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rental_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Rental bookings exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export rental bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* Loader at the top, non-blocking */}
      {isLoading && <Loader size="xl" />}
      
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
            All Rental Bookings
        </Heading>
        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            onClick={() => handleExport('csv')}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export CSV
          </Button>
          <CommonAddButton onClick={handleAddNew} />
        </HStack>
      </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed
        searchPlaceholder="Search by booking ID, customer, property, salesperson..."
        filters={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}} // No API filter needed
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: "Status",
            placeholder: "Filter by status",
            options: filterOptions.status
          }
        }}
        title="Filter Rental Bookings"
        activeFiltersCount={(statusFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
      />

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredBookings.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!isLoading ? "No rental bookings found. Create your first rental booking to get started." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredBookings.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredBookings.length}
        />
      </TableContainer>

      {/* Rental Booking Viewer */}
      <RentalBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
      />

      {/* Rental Booking Edit Form */}
      <RentalBookingEditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingBooking(null);
        }}
        bookingData={editingBooking}
        onUpdate={() => {
          // Refresh the bookings list
          fetchBookings();
        }}
      />
      
    </Box>
  );
};

export default AllRentalBookings; 