import React, { useState } from 'react';
import { Box, Heading, Flex, Text, Tag, IconButton, Grid } from '@chakra-ui/react';
import { FaEye, FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';

const PaymentStatus = () => {
  const [payments] = useState([
    {
      _id: '1',
      bookingId: 'BK001',
      customerName: 'Ravi Patel',
      propertyName: 'Sunset Heights - 2BHK',
      amount: '50000',
      status: 'Paid',
      dueDate: '2023-12-20',
      paymentDate: '2023-12-15',
      method: 'Online Transfer'
    },
    {
      _id: '2',
      bookingId: 'BK002',
      customerName: 'Sneha Shah',
      propertyName: 'Green Valley Villa',
      amount: '75000',
      status: 'Pending',
      dueDate: '2023-12-25',
      paymentDate: null,
      method: 'Cheque'
    },
    {
      _id: '3',
      bookingId: 'BK003',
      customerName: 'Amit Kumar',
      propertyName: 'Royal Apartments',
      amount: '100000',
      status: 'Overdue',
      dueDate: '2023-12-10',
      paymentDate: null,
      method: 'Bank Transfer'
    }
  ]);

  const handleViewDetails = (payment) => {
    console.log('View payment details:', payment._id);
  };

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'propertyName', label: 'Property' },
    { key: 'amount', label: 'Amount', render: (amount) => `₹${amount}` },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'paymentDate', label: 'Payment Date', render: (date) => date || '-' },
    { key: 'method', label: 'Payment Method' }
  ];

  const renderRowActions = (payment) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleViewDetails(payment)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'Paid').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const overduePayments = payments.filter(p => p.status === 'Overdue').length;
  const totalAmount = payments.reduce((sum, payment) => sum + parseInt(payment.amount), 0);
  const paidAmount = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, payment) => sum + parseInt(payment.amount), 0);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Payment Status
        </Heading>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaMoneyBillWave color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Payments</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalPayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaCheckCircle color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Paid</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{paidPayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaClock color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingPayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="red.100" borderRadius="lg">
              <FaClock color="#ef4444" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Overdue</Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">{overduePayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      {/* Additional Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaMoneyBillWave color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">₹{totalAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="teal.100" borderRadius="lg">
              <FaMoneyBillWave color="#14b8a6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Paid Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="teal.600">₹{paidAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Track payment status for all property bookings
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={payments}
          rowActions={renderRowActions}
        />
      </CommonCard>
    </Box>
  );
};

export default PaymentStatus; 