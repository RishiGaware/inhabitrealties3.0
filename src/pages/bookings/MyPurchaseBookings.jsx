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
import PurchaseBookingViewer from '../../components/common/PurchaseBookingViewer';
import { getPropertyById } from '../../services/propertyService';
import PurchaseBookingEditForm from '../../components/common/PurchaseBookingEditForm';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';

const MyPurchaseBookings = () => {
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

  // Fetch user's purchase bookings
  const fetchMyPurchaseBookings = async () => {
    try {
      setIsLoading(true);

      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await purchaseBookingService.getMyPurchaseBookings(userId);

      // Normalize response similar to AllPurchaseBookings
      let raw = [];
      if (response && response.data && Array.isArray(response.data)) {
        raw = response.data;
      } else if (response && Array.isArray(response)) {
        raw = response;
      } else {
        console.warn('Unexpected API response format (my bookings):', response);
        raw = [];
      }

      // Enrich bookings: fetch property details by propertyId when missing
      const needPopulate = raw.some(b => !b?.propertyId?.name);
      let enriched = raw;
      if (needPopulate) {
        const populated = await Promise.all(raw.map(async (b) => {
          try {
            if (b && (!b.propertyId?.name) && b.propertyId) {
              const property = await getPropertyById(b.propertyId?._id || b.propertyId);
              const propData = property?.data || property;
              return { ...b, propertyId: propData || b.propertyId };
            }
            return b;
          } catch {
            return b;
          }
        }));
        enriched = populated;
      }

      setBookings(enriched);
      setFilteredBookings(enriched);
    } catch (error) {
      console.error('Error fetching purchase bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch my purchase bookings',
        status: 'error',
      });
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPurchaseBookings();
  }, []);

  // Filter options - dynamically generated like AllPurchaseBookings
  const filterOptions = {
    status: []
  };

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
      filterOptions.status = [
        { value: '', label: 'All Statuses' }
      ];
    }
  }, [bookings]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        (booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.customerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

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

  // Handle filters
  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  // Handle export (CSV like AllPurchaseBookings)
  const handleExport = async () => {
    try {
      const exportData = filteredBookings.map(booking => ({
        'Booking ID': booking.bookingId || booking._id?.slice(-8) || 'N/A',
        'Property': booking.propertyId?.name || 'N/A',
        'Customer': `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim() || 'N/A',
        'Total Value': `₹${parseFloat(booking.totalPropertyValue || 0).toLocaleString()}`,
        'Payment Terms': booking.paymentTerms || 'N/A',
        'Status': booking.bookingStatus || 'N/A'
      }));

      if (exportData.length === 0) {
        toast({ title: 'No data to export', status: 'info' });
        return;
      }

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_purchase_bookings_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: 'Export successful', status: 'success' });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: 'Export failed', status: 'error' });
    }
  };

  // Handle view booking
  const handleView = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (!booking) return;
    (async () => {
      try {
        // Always fetch full booking to ensure installmentSchedule and all details
        const full = await purchaseBookingService.getPurchaseBookingById(id);
        const fullData = full?.data || full;
        // If schedule is missing, fetch from schedule endpoint
        let installmentSchedule = fullData?.installmentSchedule;
        if (!Array.isArray(installmentSchedule) || installmentSchedule.length === 0) {
          try {
            const scheduleRes = await purchaseBookingService.getInstallmentSchedule(id);
            installmentSchedule = scheduleRes?.data || scheduleRes || [];
          } catch {}
        }
        // Ensure property details populated
        let propertyData = booking.propertyId;
        if (!propertyData?.name && (booking.propertyId || fullData?.propertyId)) {
          try {
            const prop = await getPropertyById(booking.propertyId?._id || booking.propertyId || fullData.propertyId);
            propertyData = prop?.data || prop || propertyData;
          } catch {}
        }
        setSelectedBooking({ ...booking, ...fullData, installmentSchedule, propertyId: propertyData });
        setIsViewerOpen(true);
      } catch {
        // Fallback: at least open with what we have
        setSelectedBooking(booking);
        setIsViewerOpen(true);
      }
    })();
  };

  // Handle edit booking
  const handleEdit = (id) => {
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setEditingBooking(booking);
      setIsEditFormOpen(true);
    }
  };

  const handleEditFormUpdate = () => {
    fetchMyPurchaseBookings();
    setIsEditFormOpen(false);
    setEditingBooking(null);
  };

  // Table columns
  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (value, row) => (
        <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="150px">
          {row.bookingId || row._id?.slice(-8) || 'N/A'}
        </Text>
      ),
      width: '150px'
    },
    {
      key: 'propertyName',
      label: 'Property',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontWeight="semibold" noOfLines={1} maxW="150px">
            {row.propertyId?.name || row.propertyName || 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="150px">
            {row.propertyId?.propertyAddress?.city || row.propertyLocation || 'N/A'}
          </Text>
        </VStack>
      ),
      width: '150px'
    },
    // Customer column removed as requested
    {
      key: 'totalValue',
      label: 'Total Value',
      render: (_, row) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          ₹{row.totalPropertyValue ? parseFloat(row.totalPropertyValue).toLocaleString() : '0'}
        </Text>
      ),
      width: '120px'
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
      width: '120px'
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      render: (value, row) => {
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
          <Badge colorScheme={getStatusColor(row.bookingStatus)} variant="solid" fontSize="xs">
            {row.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
      width: '100px'
    },
  ];

  // Row actions - view and edit
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
    </HStack>
  );

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {isLoading && <Loader size="xl" />}

      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          My Purchase Bookings
        </Heading>
        <HStack spacing={3}>
          <Button
            leftIcon={<FiDownload />}
            onClick={handleExport}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export CSV
          </Button>
        </HStack>
      </Flex>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}}
        searchPlaceholder="Search bookings..."
        filters={{ status: statusFilter }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}}
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: 'Status',
            placeholder: 'Filter by status',
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
          emptyStateMessage={!isLoading ? 'No purchase bookings match your search.' : undefined}
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

      <PurchaseBookingViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedBooking(null);
        }}
        bookingData={selectedBooking}
        hideCustomerDetails
      />

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

export default MyPurchaseBookings;
