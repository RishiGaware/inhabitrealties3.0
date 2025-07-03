import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, Tag, IconButton, Grid, useDisclosure } from '@chakra-ui/react';
import { FaUserPlus, FaGift, FaCoins, FaPlus } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/floatingInput/FloatingInput';

const Referrals = () => {
  const [referrals, setReferrals] = useState([
    {
      _id: '1',
      referredPerson: 'Priya Mehta',
      email: 'priya@example.com',
      phone: '9876543210',
      status: 'Pending',
      commission: '5000',
      date: '2023-12-15',
      notes: 'Interested in 2BHK apartment'
    },
    {
      _id: '2',
      referredPerson: 'Neha Singh',
      email: 'neha@example.com',
      phone: '8765432109',
      status: 'Completed',
      commission: '10000',
      date: '2023-12-10',
      notes: 'Successfully converted to customer'
    }
  ]);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [formData, setFormData] = useState({
    referredPerson: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleAddReferral = () => {
    setFormData({
      referredPerson: '',
      email: '',
      phone: '',
      notes: ''
    });
    onFormOpen();
  };

  const handleSubmit = () => {
    const newReferral = {
      ...formData,
      _id: Date.now().toString(),
      status: 'Pending',
      commission: '5000',
      date: new Date().toISOString().split('T')[0]
    };
    setReferrals([...referrals, newReferral]);
    onFormClose();
  };

  const columns = [
    { key: 'referredPerson', label: 'Referred Person' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    { key: 'commission', label: 'Commission', render: (commission) => `₹${commission}` },
    { key: 'date', label: 'Date' }
  ];

  const renderRowActions = (referral) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaUserPlus />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('View referral details:', referral._id)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(r => r.status === 'Completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'Pending').length;
  const totalCommission = referrals.reduce((sum, referral) => sum + parseInt(referral.commission), 0);
  const earnedCommission = referrals
    .filter(r => r.status === 'Completed')
    .reduce((sum, referral) => sum + parseInt(referral.commission), 0);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          My Referrals
        </Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="brand"
          onClick={handleAddReferral}
        >
          Add Referral
        </Button>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaUserPlus color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Referrals</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalReferrals}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaUserPlus color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Completed</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{completedReferrals}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaUserPlus color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingReferrals}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaGift color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Commission</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">₹{totalCommission.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      {/* Additional Summary Card */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="teal.100" borderRadius="lg">
              <FaCoins color="#14b8a6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Earned Commission</Text>
              <Text fontSize="lg" fontWeight="bold" color="teal.600">₹{earnedCommission.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="yellow.100" borderRadius="lg">
              <FaCoins color="#eab308" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending Commission</Text>
              <Text fontSize="lg" fontWeight="bold" color="yellow.600">₹{(totalCommission - earnedCommission).toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage your referrals and track commission earnings
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={referrals}
          rowActions={renderRowActions}
        />
      </CommonCard>

      {/* Add Referral Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title="Add Referral"
        onSave={handleSubmit}
      >
        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FloatingInput
            name="referredPerson"
            label="Referred Person Name"
            value={formData.referredPerson}
            onChange={(e) => setFormData({ ...formData, referredPerson: e.target.value })}
            required
          />
          <FloatingInput
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <FloatingInput
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </Box>
        <Box mt={4}>
          <FloatingInput
            name="notes"
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            as="textarea"
            rows={3}
          />
        </Box>
      </FormModal>
    </Box>
  );
};

export default Referrals; 