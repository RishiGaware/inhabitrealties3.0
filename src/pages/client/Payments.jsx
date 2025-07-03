import React, { useState } from 'react';
import { Box, Heading, Flex, Text, Tag, IconButton, Grid } from '@chakra-ui/react';
import { FaEye, FaMoneyBillWave, FaCreditCard, FaReceipt } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';

const Payments = () => {
  const [payments] = useState([
    {
      _id: '1',
      propertyName: 'Sunset Heights - 2BHK',
      paymentType: 'Booking Amount',
      amount: '50000',
      status: 'Completed',
      date: '2023-12-15',
      method: 'Online Transfer',
      transactionId: 'TXN123456'
    },
    {
      _id: '2',
      propertyName: 'Green Valley Villa',
      paymentType: 'Down Payment',
      amount: '200000',
      status: 'Pending',
      date: '2023-12-20',
      method: 'Cheque',
      transactionId: 'TXN123457'
    },
    {
      _id: '3',
      propertyName: 'Sunset Heights - 2BHK',
      paymentType: 'Installment',
      amount: '75000',
      status: 'Completed',
      date: '2023-12-10',
      method: 'Credit Card',
      transactionId: 'TXN123458'
    }
  ]);

  const handleViewDetails = (payment) => {
    console.log('View payment details:', payment._id);
  };

  const columns = [
    { key: 'propertyName', label: 'Property' },
    { key: 'paymentType', label: 'Payment Type' },
    { key: 'amount', label: 'Amount', render: (amount) => `₹${amount}` },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    { key: 'date', label: 'Date' },
    { key: 'method', label: 'Payment Method' },
    { key: 'transactionId', label: 'Transaction ID' }
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
      <IconButton
        icon={<FaReceipt />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('Download receipt:', payment._id)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const totalAmount = payments.reduce((sum, payment) => sum + parseInt(payment.amount), 0);
  const completedAmount = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, payment) => sum + parseInt(payment.amount), 0);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Payments
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
              <FaMoneyBillWave color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Completed</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{completedPayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaMoneyBillWave color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingPayments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaCreditCard color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">₹{totalAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      {/* Additional Summary Card */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="teal.100" borderRadius="lg">
              <FaMoneyBillWave color="#14b8a6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Completed Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="teal.600">₹{completedAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="red.100" borderRadius="lg">
              <FaMoneyBillWave color="#ef4444" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending Amount</Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">₹{(totalAmount - completedAmount).toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            View and track your property payment history
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

export default Payments; 