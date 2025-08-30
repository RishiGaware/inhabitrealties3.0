import React, { useState, useEffect, useMemo } from 'react';
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
import api from '../../services/api';

const AssignedPaymentHistory = () => {
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

  // Filter options - dynamically generated from API data
  const filterOptions = {
    status: [],
    paymentType: []
  };

  // Generate filter options dynamically from the actual data
  useEffect(() => {
    if (payments.length > 0) {
      const uniqueStatuses = [...new Set(payments.map(payment => payment.status))].filter(Boolean);
      const uniquePaymentTypes = [...new Set(payments.map(payment => payment.paymentType))].filter(Boolean);
      
      const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...uniqueStatuses.map(status => ({
          value: status,
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      ];
      
      const paymentTypeOptions = [
        { value: '', label: 'All Payment Types' },
        ...uniquePaymentTypes.map(type => ({
          value: type,
          label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      ];
      
      filterOptions.status = statusOptions;
      filterOptions.paymentType = paymentTypeOptions;
    } else {
      // Set default options when no data is available
      filterOptions.status = [{ value: '', label: 'All Statuses' }];
      filterOptions.paymentType = [{ value: '', label: 'All Payment Types' }];
    }
  }, [payments]);

  // Dummy data for demonstration
  const dummyPayments = [
    {
      _id: '1',
      paymentId: 'PAY-2025-001',
      customerId: {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@email.com',
        phoneNumber: '+91 98765 43210'
      },
      propertyId: {
        name: 'Sunshine Apartments',
        type: 'Apartment',
        propertyAddress: {
          street: 'Sunshine Lane',
          city: 'Mumbai',
          state: 'Maharashtra'
        }
      },
      amount: 250000,
      paymentType: 'INSTALLMENT',
      status: 'PAID',
      paymentDate: '2025-01-15T10:30:00Z',
      dueDate: '2025-01-15T00:00:00Z',
      responsiblePersonId: { firstName: 'Rahul', lastName: 'Sharma' }
    },
    {
      _id: '2',
      paymentId: 'PAY-2025-002',
      customerId: {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@email.com',
        phoneNumber: '+91 98765 43211'
      },
      propertyId: {
        name: 'Green Valley Villa',
        type: 'Villa',
        propertyAddress: {
          street: 'Green Valley Road',
          city: 'Delhi',
          state: 'Delhi'
        }
      },
      amount: 500000,
      paymentType: 'DOWN_PAYMENT',
      status: 'PENDING',
      paymentDate: '2025-01-14T14:20:00Z',
      dueDate: '2025-01-20T00:00:00Z',
      responsiblePersonId: { firstName: 'Anita', lastName: 'Desai' }
    },
    {
      _id: '3',
      paymentId: 'PAY-2025-003',
      customerId: {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@email.com',
        phoneNumber: '+91 98765 43212'
      },
      propertyId: {
        name: 'Royal Heights',
        type: 'Apartment',
        propertyAddress: {
          street: 'Royal Street',
          city: 'Bangalore',
          state: 'Karnataka'
        }
      },
      amount: 750000,
      paymentType: 'FULL_PAYMENT',
      status: 'PAID',
      paymentDate: '2025-01-13T09:15:00Z',
      dueDate: '2025-01-13T00:00:00Z',
      responsiblePersonId: { firstName: 'Vikram', lastName: 'Singh' }
    },
    {
      _id: '4',
      paymentId: 'PAY-2025-004',
      customerId: {
        firstName: 'Neha',
        lastName: 'Singh',
        email: 'neha.singh@email.com',
        phoneNumber: '+91 98765 43213'
      },
      propertyId: {
        name: 'Ocean View Residency',
        type: 'Residency',
        propertyAddress: {
          street: 'Ocean Drive',
          city: 'Chennai',
          state: 'Tamil Nadu'
        }
      },
      amount: 300000,
      paymentType: 'INSTALLMENT',
      status: 'OVERDUE',
      paymentDate: null,
      dueDate: '2025-01-10T00:00:00Z',
      responsiblePersonId: { firstName: 'Priya', lastName: 'Verma' }
    },
    {
      _id: '5',
      paymentId: 'PAY-2025-005',
      customerId: {
        firstName: 'Vikram',
        lastName: 'Malhotra',
        email: 'vikram.malhotra@email.com',
        phoneNumber: '+91 98765 43214'
      },
      propertyId: {
        name: 'Skyline Towers',
        type: 'Tower',
        propertyAddress: {
          street: 'Skyline Avenue',
          city: 'Hyderabad',
          state: 'Telangana'
        }
      },
      amount: 400000,
      paymentType: 'LATE_FEE',
      status: 'PARTIAL',
      paymentDate: '2025-01-12T16:45:00Z',
      dueDate: '2025-01-15T00:00:00Z',
      responsiblePersonId: { firstName: 'Rajesh', lastName: 'Kumar' }
    }
  ];

  // Fetch data from API
  useEffect(() => {
    fetchAssignedPayments();
  }, []);

  const fetchAssignedPayments = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use dummy data for now
      setPayments(dummyPayments);
      setFilteredPayments(dummyPayments);
      
      // TODO: Uncomment when API is ready
      // const response = await api.get('/payments/assigned');
      // if (response.data && response.data.data && Array.isArray(response.data.data)) {
      //   setPayments(response.data.data);
      //   setFilteredPayments(response.data.data);
      // } else if (response.data && Array.isArray(response.data)) {
      //   setPayments(response.data);
      //   setFilteredPayments(response.data);
      // } else {
      //   setPayments([]);
      //   setFilteredPayments([]);
      // }
    } catch (error) {
      console.error('Error fetching assigned payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assigned payment history",
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

  // Filter and search functionality
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        (payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (payment.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (payment.amount?.toString().includes(searchTerm) || false) ||
        (payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (statusFilter && statusFilter !== '') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (paymentTypeFilter && paymentTypeFilter !== '') {
      filtered = filtered.filter(payment => payment.paymentType === paymentTypeFilter);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, paymentTypeFilter, payments]);

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PENDING': return 'yellow';
      case 'OVERDUE': return 'red';
      case 'PARTIAL': return 'orange';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'INSTALLMENT': return 'blue';
      case 'DOWN_PAYMENT': return 'green';
      case 'FULL_PAYMENT': return 'purple';
      case 'LATE_FEE': return 'red';
      default: return 'gray';
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'paymentId',
      label: 'Payment ID',
      render: (value, row) => (
        <Text fontWeight="semibold" color="blue.600" noOfLines={1} maxW="150px">
          {value || row._id?.slice(-8) || 'N/A'}
        </Text>
      ),
      width: "150px"
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (_, row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" color="gray.800" noOfLines={1} maxW="120px">
            {row.customerId?.firstName ? 
              `${row.customerId.firstName} ${row.customerId.lastName || ''}`.trim() : 'N/A'}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1} maxW="120px">
            {row.customerId?.email || 'N/A'}
          </Text>
        </VStack>
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
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <Text color="gray.700" fontWeight="semibold" fontSize="sm">
          {formatCurrency(value)}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'paymentType',
      label: 'Payment Type',
      render: (value) => {
        return (
          <Badge
            colorScheme={getPaymentTypeColor(value)}
            variant="subtle"
            fontSize="xs"
          >
            {value?.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
      width: "120px"
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
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
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (_, row) => (
        <Text fontSize="sm" color="gray.600">
          {row.assignedTo || row.responsiblePersonId?.firstName ? 
            `${row.responsiblePersonId.firstName || ''} ${row.responsiblePersonId.lastName || ''}`.trim() : 'N/A'}
        </Text>
      ),
      width: "120px"
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
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
    }
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
  const handleView = (payment) => {
    setSelectedPayment(payment);
    onViewerOpen();
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
        'Payment ID': payment.paymentId || payment._id?.slice(-8) || 'N/A',
        'Customer': payment.customerName || `${payment.customerId?.firstName || ''} ${payment.customerId?.lastName || ''}`.trim() || 'N/A',
        'Property': payment.propertyName || payment.propertyId?.name || 'N/A',
        'Amount': formatCurrency(payment.amount),
        'Payment Type': payment.paymentType || 'N/A',
        'Status': payment.status || 'N/A',
        'Assigned To': payment.assignedTo || `${payment.responsiblePersonId?.firstName || ''} ${payment.responsiblePersonId?.lastName || ''}`.trim() || 'N/A',
        'Payment Date': formatDate(payment.paymentDate),
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
      a.download = `assigned_payment_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: `Assigned payment history exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export assigned payment history",
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
          Assigned Payment History
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
        searchPlaceholder="Search assigned payments..."
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
            options: filterOptions.status
          },
          paymentType: {
            label: "Payment Type",
            placeholder: "Filter by payment type",
            options: filterOptions.paymentType
          }
        }}
        title="Filter Assigned Payments"
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
          emptyStateMessage={!isLoading ? "No assigned payments match your search." : undefined}
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

export default AssignedPaymentHistory;
