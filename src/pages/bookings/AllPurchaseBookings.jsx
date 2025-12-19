import React, { useState, useEffect, useCallback, useRef } from 'react';
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

import PurchaseBookingViewer from '../../components/common/PurchaseBookingViewer';
import PurchaseBookingEditForm from '../../components/common/PurchaseBookingEditForm';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';
import { useDemo } from '../../context/DemoContext';
import { demoPurchaseBookings } from '../../data/demoData';

const AllPurchaseBookings = () => {
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
  const { isDemoMode } = useDemo();
  
  // Ref to track initial mount
  const isInitialMount = useRef(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  // Fetch data from real API with search and filter parameters
  const fetchBookings = useCallback(async (search = '', status = '') => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        setBookings(demoPurchaseBookings);
        setFilteredBookings(demoPurchaseBookings);
        setIsLoading(false);
        return;
      }
      
      // Build query parameters
      const params = {};
      if (search && search.trim()) {
        params.search = search.trim();
      }
      if (status && status !== 'all' && status.trim() !== '') {
        params.status = status;
      }
      
      // Use the configured API service with search and filter params
      const response = await purchaseBookingService.getAllPurchaseBookings(params);
      
      // Handle the actual API response format
      if (response && response.data && Array.isArray(response.data)) {
        setBookings(response.data);
        setFilteredBookings(response.data);
      } else if (response && Array.isArray(response)) {
        // Handle case where data is directly in response
        setBookings(response);
        setFilteredBookings(response);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to fetch purchase bookings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial fetch on mount only
  useEffect(() => {
    fetchBookings('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search/filter effect - only runs when searchTerm or statusFilter changes
  useEffect(() => {
    // Skip if this is the initial mount (handled by the effect above)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Debounced fetch when search or filter changes
    const timeoutId = setTimeout(() => {
      fetchBookings(searchTerm, statusFilter);
      setCurrentPage(1); // Reset to first page when filtering
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  // Table columns configuration - simplified and essential only
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
      label: 'Total Value',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.totalPropertyValue ? parseFloat(row.totalPropertyValue).toLocaleString() : '0'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (_, row) => {
        const getPaymentTermsColor = (terms) => {
          switch (terms) {
            case 'FULL_PAYMENT': return 'green';
            case 'INSTALLMENTS': return 'blue';
            case 'MILESTONE': return 'purple';
            default: return 'gray';
          }
        };

        return (
          <VStack align="start" spacing={1}>
            <Badge
              colorScheme={getPaymentTermsColor(row.paymentTerms)}
              variant="subtle"
              fontSize="xs"
            >
              {row.paymentTerms?.replace(/_/g, ' ') || 'N/A'}
            </Badge>
            {row.paymentTerms === 'INSTALLMENTS' && row.installmentCount && (
              <Text color="gray.600" fontSize="xs" fontWeight="medium">
                {row.installmentCount} installments
              </Text>
            )}
          </VStack>
        );
      },
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

  // Row actions - matching UserManagement style
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
    if (isDemoMode) {
      toast({
        title: "Not allowed",
        description: "Not allowed in demo version",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate('/purchase-bookings/create');
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
    if (isDemoMode) {
      toast({
        title: "Not allowed",
        description: "Not allowed in demo version",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setEditingBooking(booking);
      setIsEditFormOpen(true);
    } else {
      console.error('Booking not found for ID:', id);
    }
  };

  // Handle edit form update
  const handleEditFormUpdate = () => {
    // Refresh the bookings data after update
    fetchBookings();
    setIsEditFormOpen(false);
    setEditingBooking(null);
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
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Total Value': `₹${parseFloat(booking.totalPropertyValue || 0).toLocaleString()}`,
        'Payment Terms': booking.paymentTerms || 'N/A',
        'Status': booking.bookingStatus || 'N/A'
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
      a.download = `purchase_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Purchase bookings exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export purchase bookings",
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
          All Purchase Bookings
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
        onSearchSubmit={() => fetchBookings(searchTerm, statusFilter)} // Trigger API search
        searchPlaceholder="Search bookings..."
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
        title="Filter Bookings"
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
          emptyStateMessage={!isLoading ? "No purchase bookings match your search." : undefined}
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





      {/* Purchase Booking Viewer */}
      <PurchaseBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
      />

      {/* Purchase Booking Edit Form */}
      <PurchaseBookingEditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingBooking(null);
        }}
        bookingData={editingBooking}
        onUpdate={handleEditFormUpdate}
      />
      
      
    </Box>
  );
};

export default AllPurchaseBookings; 