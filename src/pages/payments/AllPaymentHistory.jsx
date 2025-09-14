import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Flex,
  Heading,
  useToast,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import CommonTable from '../../components/common/Table/CommonTable';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import TableContainer from '../../components/common/Table/TableContainer';
import SearchAndFilter from '../../components/common/SearchAndFilter';
import Loader from '../../components/common/Loader';
import PaymentViewerModal from '../../components/common/PaymentViewerModal';
import api, { purchaseBookingAPI, rentalBookingAPI } from '../../services/api';

const AllPaymentHistory = () => {
  const toast = useToast();
  const { isOpen: isViewerOpen, onOpen: onViewerOpen, onClose: onViewerClose } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // State management
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');

  // Filter options are computed inline in the SearchAndFilter props from payments

  // Fetch data from API
  useEffect(() => {
    const run = async () => {
    try {
      setIsLoading(true);
        const res = await api.get('/payment-history/all');
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setPayments(data);
        setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment history",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setIsLoading(false);
    }
  };
    run();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        (payment.receiptNumber?.toLowerCase().includes(term) || false) ||
        (payment.transactionNumber?.toLowerCase().includes(term) || false) ||
        (payment.paymentType?.toLowerCase().includes(term) || false) ||
        (payment.paymentStatus?.toLowerCase().includes(term) || false) ||
        (payment.bookingType?.toLowerCase().includes(term) || false) ||
        (payment.amount?.toString().includes(searchTerm) || false) ||
        (payment.totalAmount?.toString().includes(searchTerm) || false) ||
        (payment._id?.toLowerCase().includes(term) || false)
      );
    }

    if (statusFilter && statusFilter !== '') {
      filtered = filtered.filter(payment => payment.paymentStatus === statusFilter);
    }

    if (paymentTypeFilter && paymentTypeFilter !== '') {
      filtered = filtered.filter(payment => payment.paymentType === paymentTypeFilter);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, paymentTypeFilter, payments]);

  // Helper functions
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'FAILED': return 'red';
      case 'REFUNDED': return 'purple';
      default: return 'gray';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'INSTALLMENT': return 'blue';
      case 'DOWN_PAYMENT': return 'green';
      case 'FULL_PAYMENT': return 'purple';
      case 'ADVANCE': return 'teal';
      case 'RENT': return 'cyan';
      case 'SECURITY_DEPOSIT': return 'orange';
      case 'MAINTENANCE': return 'pink';
      default: return 'gray';
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'paymentId',
      label: 'Payment',
      render: (_, row) => (
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="170px">
            {row.receiptNumber || row.transactionNumber || row._id?.slice(-8) || 'N/A'}
          </Text>
          <Text fontSize="xs" color="gray.500">Txn</Text>
        </VStack>
      ),
      width: "180px"
    },
    {
      key: 'bookingType',
      label: 'Booking Type',
      render: (value, row) => (
        <Badge colorScheme={row.bookingType === 'RENTAL' ? 'cyan' : 'purple'} variant="subtle" fontSize="xs">
          {row.bookingType || 'N/A'}
        </Badge>
      ),
      width: "120px"
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value, row) => (
        <VStack align="start" spacing={0}>
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
            {formatCurrency(row.totalAmount ?? row.amount)}
        </Text>
          {!!row.taxAmount && <Text fontSize="xs" color="gray.500">Tax: {formatCurrency(row.taxAmount)}</Text>}
        </VStack>
      ),
      width: "140px"
    },
    {
      key: 'paymentType',
      label: 'Payment Type',
      render: (value) => (
        <Badge colorScheme={getPaymentTypeColor(value)} variant="subtle" fontSize="xs">
            {value?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
      ),
      width: "140px"
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (value) => (
        <Badge colorScheme={getStatusColor(value)} variant="solid" fontSize="xs">
            {value?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
      ),
      width: "110px"
    },
    {
      key: 'paidDate',
      label: 'Paid Date',
      render: (value) => (
        <Text fontSize="sm" color="gray.600">
          {formatDate(value)}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => (
        <Text fontSize="sm" color="gray.600">
          {formatDate(value)}
        </Text>
      ),
      width: "120px"
    },
  ];

  // Row actions - only view button
  const renderRowActions = (payment) => (
    <HStack spacing={2}>
      <IconButton
        key="view"
        aria-label="View payment details"
        icon={<FiEye />}
        size="sm"
        onClick={() => handleView(payment)}
        colorScheme="blue"
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
    } else if (key === 'paymentType') {
      setPaymentTypeFilter(value);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setPaymentTypeFilter('');
    setSearchTerm('');
  };

  // Handle view payment
  const handleView = async (payment) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/payment-history/${payment._id}`);
      const detailed = res?.data?.data || payment;

      // Try to fetch related booking by bookingId if available
      let bookingDetails = null;
      const bookingId = detailed.bookingId;
      const bookingType = detailed.bookingType;
      try {
        if (bookingId && bookingType === 'PURCHASE') {
          const b = await purchaseBookingAPI.getById(bookingId);
          bookingDetails = b?.data?.data || null;
        } else if (bookingId && bookingType === 'RENTAL') {
          const b = await rentalBookingAPI.getById(bookingId);
          bookingDetails = b?.data?.data || null;
        }
      } catch {
        // booking fetch is optional; ignore errors
      }

      const enriched = bookingDetails ? { ...detailed, bookingDetails } : detailed;
      setSelectedPayment(enriched);
      onViewerOpen();
    } catch (error) {
      console.error('Failed to fetch payment details', error);
      toast({
        title: "Failed to fetch payment details",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });
      // Fallback to showing the row if detail fetch fails
    setSelectedPayment(payment);
    onViewerOpen();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredPayments.length / pageSize)) {
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
      const exportData = filteredPayments.map(payment => ({
        'Payment ID': payment.receiptNumber || payment.transactionNumber || payment._id?.slice(-8) || 'N/A',
        'Booking Type': payment.bookingType || 'N/A',
        'Amount': formatCurrency(payment.totalAmount ?? payment.amount),
        'Payment Type': payment.paymentType || 'N/A',
        'Status': payment.paymentStatus || 'N/A',
        'Paid Date': formatDate(payment.paidDate),
        'Due Date': formatDate(payment.dueDate)
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
      a.download = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Payment history exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export payment history",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* Loader at the top, non-blocking */}
      {isLoading && <Loader size="xl" />}
      
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 0 }}>
        <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
          All Payment History
        </Heading>
        <HStack spacing={3}>
          <IconButton
            aria-label="Export CSV"
            icon={<Text fontSize="sm">📊</Text>}
            onClick={() => handleExport('csv')}
            variant="outline"
            colorScheme="green"
            size="sm"
          >
            Export CSV
          </IconButton>
        </HStack>
      </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {}} // No API search needed
        searchPlaceholder="Search by receipt/txn, type, status..."
        filters={{ 
          status: statusFilter, 
          paymentType: paymentTypeFilter 
        }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {}} // No API filter needed
        onClearFilters={handleClearFilters}
        filterOptions={{
          status: {
            label: "Status",
            placeholder: "Filter by status",
            options: [{ value: '', label: 'All Statuses' }, ...[...new Set(payments.map(p => p.paymentStatus).filter(Boolean))].map(s => ({ value: s, label: s.replace(/_/g, ' ') }))],
          },
          paymentType: {
            label: "Payment Type",
            placeholder: "Filter by payment type",
            options: [{ value: '', label: 'All Payment Types' }, ...[...new Set(payments.map(p => p.paymentType).filter(Boolean))].map(t => ({ value: t, label: t.replace(/_/g, ' ') }))],
          }
        }}
        title="Filter Payments"
        activeFiltersCount={(statusFilter ? 1 : 0) + (paymentTypeFilter ? 1 : 0) + (searchTerm ? 1 : 0)}
      />

      <TableContainer>
        <CommonTable
          columns={columns}
          data={filteredPayments.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          rowActions={renderRowActions}
          emptyStateMessage={!isLoading ? "No payments match your search." : undefined}
        />
        <CommonPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPayments.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredPayments.length}
        />
      </TableContainer>

      {/* Payment Viewer Modal */}
      <PaymentViewerModal
        isOpen={isViewerOpen}
        onClose={onViewerClose}
        payment={selectedPayment}
      />
    </Box>
  );
};

export default AllPaymentHistory;
