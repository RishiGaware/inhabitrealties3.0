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
} from '@chakra-ui/react';
import { FiDownload, FiEye, FiEdit } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import api from '../../services/api';

const MyAssignedRentals = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter options - dynamically generated from API data
  const filterOptions = {
    status: []
  };

  // Generate status options dynamically from the actual data
  useEffect(() => {
    if (bookings.length > 0) {
      const uniqueStatuses = [...new Set(bookings.map(booking => booking.rentalStatus))].filter(Boolean);
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
  }, [bookings]);

  // Fetch data from assigned rentals API
  useEffect(() => {
    fetchAssignedRentals();
  }, []);

  const fetchAssignedRentals = async () => {
    try {
      setIsLoading(true);
      
      // Use the assigned rentals API endpoint
      // Note: You'll need to get the current user's ID from context or auth
      const currentUserId = '68347215de3d56d44b9cbcad'; // This should come from user context
      const response = await api.get(`/rental-bookings/assigned/${currentUserId}`);
      
      // Handle the actual API response format
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error('Error fetching assigned rentals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assigned rentals",
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
        (booking.rentalId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.rentalStatus === statusFilter);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, bookings]);

  // Table columns configuration - simplified and essential only
  const columns = [
    {
      key: 'rentalId',
      label: 'Rental ID',
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
      key: 'leaseTerms',
      label: 'Lease Terms',
      render: (_, row) => {
        const getLeaseTermsColor = (terms) => {
          switch (terms) {
            case 'SHORT_TERM': return 'green';
            case 'LONG_TERM': return 'blue';
            case 'MONTH_TO_MONTH': return 'purple';
            default: return 'gray';
          }
        };

        return (
          <VStack align="start" spacing={1}>
            <Badge
              colorScheme={getLeaseTermsColor(row.leaseTerms)}
              variant="subtle"
              fontSize="xs"
            >
              {row.leaseTerms?.replace(/_/g, ' ') || 'N/A'}
            </Badge>
            {row.leaseDuration && (
              <Text color="gray.600" fontSize="xs" fontWeight="medium">
                {row.leaseDuration} months
              </Text>
            )}
          </VStack>
        );
      },
      width: "120px"
    },
    {
      key: 'rentalStatus',
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

  // Row actions - matching MyAssignedBookings style
  const renderRowActions = (booking) => (
    <HStack spacing={2}>
      <IconButton
        key="view"
        aria-label="View rental booking"
        icon={<FiEye />}
        size="sm"
        onClick={() => handleView(booking._id)}
        colorScheme="blue"
        variant="outline"
      />
      <IconButton
        key="edit"
        aria-label="Edit rental booking"
        icon={<FiEdit />}
        size="sm"
        onClick={() => handleEdit(booking._id)}
        colorScheme="brand"
        variant="outline"
      />
    </HStack>
  );

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

  // Handle view rental booking
  const handleView = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      // Navigate to view page or open modal
      navigate(`/rental-bookings/view/${id}`, { 
        state: { bookingData: booking } 
      });
    }
  };

  // Handle edit rental booking
  const handleEdit = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      // Pass the booking data directly to avoid API call
      navigate(`/rental-bookings/edit/${id}`, { 
        state: { bookingData: booking } 
      });
    }
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
        'Rental ID': booking.rentalId || booking._id?.slice(-8) || 'N/A',
        'Property': booking.propertyId?.name || 'N/A',
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Monthly Rent': `₹${parseFloat(booking.monthlyRent || 0).toLocaleString()}`,
        'Lease Terms': booking.leaseTerms || 'N/A',
        'Status': booking.rentalStatus || 'N/A'
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
      a.download = `my_assigned_rentals_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Assigned rentals exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export assigned rentals",
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
            My Assigned Rentals
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
          <Button
            leftIcon={<FiEdit />}
            onClick={() => navigate('/rental-bookings/all')}
            variant="outline"
            colorScheme="blue" 
            size="sm"
          >
            View All Rentals
          </Button>
                </HStack>
              </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed
        searchPlaceholder="Search assigned rentals..."
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
        title="Filter Assigned Rentals"
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
          emptyStateMessage={!isLoading ? "No assigned rentals match your search." : undefined}
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
    </Box>
  );
};

export default MyAssignedRentals; 