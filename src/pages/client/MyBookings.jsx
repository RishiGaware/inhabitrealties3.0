import React, { useState } from 'react';
import { Box, Heading, Flex, Text, Tag, IconButton, Grid } from '@chakra-ui/react';
import { FaEye, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';

const MyBookings = () => {
  const [bookings] = useState([
    {
      _id: '1',
      propertyName: 'Sunset Heights - 2BHK',
      propertyType: 'Apartment',
      location: 'Mumbai, Maharashtra',
      bookingDate: '2023-12-15',
      visitDate: '2023-12-20',
      status: 'Confirmed',
      amount: '50000',
      agent: 'Ravi Kumar',
      notes: 'Site visit scheduled for 2 PM'
    },
    {
      _id: '2',
      propertyName: 'Green Valley Villa',
      propertyType: 'Villa',
      location: 'Pune, Maharashtra',
      bookingDate: '2023-12-10',
      visitDate: '2023-12-18',
      status: 'Pending',
      amount: '75000',
      agent: 'Sneha Patel',
      notes: 'Awaiting confirmation from seller'
    }
  ]);

  const handleViewDetails = (booking) => {
    console.log('View booking details:', booking._id);
  };

  const columns = [
    { key: 'propertyName', label: 'Property Name' },
    { key: 'propertyType', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'bookingDate', label: 'Booking Date' },
    { key: 'visitDate', label: 'Visit Date' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Confirmed' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    { key: 'amount', label: 'Amount', render: (amount) => `₹${amount}` },
    { key: 'agent', label: 'Agent' }
  ];

  const renderRowActions = (booking) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleViewDetails(booking)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const totalAmount = bookings.reduce((sum, booking) => sum + parseInt(booking.amount), 0);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          My Bookings
        </Heading>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaCalendar color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Bookings</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalBookings}</Text>
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
              <Text fontSize="lg" fontWeight="bold" color="green.600">{confirmedBookings}</Text>
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
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingBookings}</Text>
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
              <Text fontSize="lg" fontWeight="bold" color="purple.600">₹{totalAmount.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            View and manage your property bookings and site visits
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={bookings}
          rowActions={renderRowActions}
        />
      </CommonCard>
    </Box>
  );
};

export default MyBookings; 