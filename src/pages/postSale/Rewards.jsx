import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, Tag, IconButton, useDisclosure, Grid } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaGift, FaStar } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import FloatingInput from '../../components/common/floatingInput/FloatingInput';
import FormModal from '../../components/common/FormModal';

const Rewards = () => {
  const [rewards, setRewards] = useState([
    {
      _id: '1',
      customerName: 'Ravi Patel',
      rewardType: 'Cash Back',
      amount: '5000',
      status: 'Earned',
      date: '2023-12-15',
      expiryDate: '2024-03-15',
      description: 'Referral bonus for successful property sale'
    },
    {
      _id: '2',
      customerName: 'Sneha Shah',
      rewardType: 'Gift Card',
      amount: '2000',
      status: 'Redeemed',
      date: '2023-12-10',
      expiryDate: '2024-02-10',
      description: 'Loyalty reward for repeat customer'
    }
  ]);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [selectedReward, setSelectedReward] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    rewardType: '',
    amount: '',
    status: 'Earned',
    description: '',
    expiryDate: ''
  });

  const handleAddNew = () => {
    setSelectedReward(null);
    setFormData({
      customerName: '',
      rewardType: '',
      amount: '',
      status: 'Earned',
      description: '',
      expiryDate: ''
    });
    onFormOpen();
  };

  const handleEdit = (reward) => {
    setSelectedReward(reward);
    setFormData(reward);
    onFormOpen();
  };

  const handleDelete = (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      setRewards(rewards.filter(r => r._id !== rewardId));
    }
  };

  const handleSubmit = () => {
    if (selectedReward) {
      setRewards(rewards.map(r => 
        r._id === selectedReward._id ? { ...formData, _id: r._id, date: r.date } : r
      ));
    } else {
      const newReward = {
        ...formData,
        _id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setRewards([...rewards, newReward]);
    }
    onFormClose();
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'rewardType', label: 'Reward Type' },
    { key: 'amount', label: 'Amount', render: (amount) => `₹${amount}` },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Earned' ? 'green' : status === 'Redeemed' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      )
    },
    { key: 'date', label: 'Earned Date' },
    { key: 'expiryDate', label: 'Expiry Date' }
  ];

  const renderRowActions = (reward) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaGift />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('Redeem reward:', reward._id)}
      />
      <IconButton
        icon={<FaEdit />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleEdit(reward)}
      />
      <IconButton
        icon={<FaTrash />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(reward._id)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalEarned = rewards.reduce((sum, reward) => sum + parseInt(reward.amount), 0);
  const totalRedeemed = rewards.filter(r => r.status === 'Redeemed').reduce((sum, reward) => sum + parseInt(reward.amount), 0);
  const pendingRewards = rewards.filter(r => r.status === 'Earned').length;

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Rewards
        </Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="brand"
          onClick={handleAddNew}
        >
          Add Reward
        </Button>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaStar color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Earned</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">₹{totalEarned.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaGift color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Redeemed</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">₹{totalRedeemed.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaStar color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending Rewards</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingRewards}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage customer rewards and loyalty programs
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={rewards}
          rowActions={renderRowActions}
        />
      </CommonCard>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title={selectedReward ? 'Edit Reward' : 'Add Reward'}
        onSave={handleSubmit}
      >
        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FloatingInput
            name="customerName"
            label="Customer Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
          <FloatingInput
            name="rewardType"
            label="Reward Type"
            value={formData.rewardType}
            onChange={(e) => setFormData({ ...formData, rewardType: e.target.value })}
            required
          />
          <FloatingInput
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <FloatingInput
            name="expiryDate"
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
        </Box>
        <Box mt={4}>
          <FloatingInput
            name="description"
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            as="textarea"
            rows={3}
          />
        </Box>
      </FormModal>
    </Box>
  );
};

export default Rewards; 