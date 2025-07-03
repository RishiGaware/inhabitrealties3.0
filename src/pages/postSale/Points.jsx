import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, Tag, IconButton, useDisclosure, Grid, Progress } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaCoins, FaTrophy } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import FloatingInput from '../../components/common/floatingInput/FloatingInput';
import FormModal from '../../components/common/FormModal';

const Points = () => {
  const [points, setPoints] = useState([
    {
      _id: '1',
      customerName: 'Ravi Patel',
      pointsEarned: 1500,
      pointsRedeemed: 500,
      totalPoints: 1000,
      tier: 'Gold',
      lastActivity: '2023-12-15',
      source: 'Property Purchase'
    },
    {
      _id: '2',
      customerName: 'Sneha Shah',
      pointsEarned: 800,
      pointsRedeemed: 200,
      totalPoints: 600,
      tier: 'Silver',
      lastActivity: '2023-12-10',
      source: 'Referral Bonus'
    }
  ]);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    pointsEarned: '',
    pointsRedeemed: '',
    tier: 'Bronze',
    source: ''
  });

  const handleAddNew = () => {
    setSelectedPoint(null);
    setFormData({
      customerName: '',
      pointsEarned: '',
      pointsRedeemed: '',
      tier: 'Bronze',
      source: ''
    });
    onFormOpen();
  };

  const handleEdit = (point) => {
    setSelectedPoint(point);
    setFormData(point);
    onFormOpen();
  };

  const handleDelete = (pointId) => {
    if (window.confirm('Are you sure you want to delete this points record?')) {
      setPoints(points.filter(p => p._id !== pointId));
    }
  };

  const handleSubmit = () => {
    if (selectedPoint) {
      const updatedPoint = {
        ...formData,
        _id: selectedPoint._id,
        totalPoints: parseInt(formData.pointsEarned) - parseInt(formData.pointsRedeemed),
        lastActivity: selectedPoint.lastActivity
      };
      setPoints(points.map(p => p._id === selectedPoint._id ? updatedPoint : p));
    } else {
      const newPoint = {
        ...formData,
        _id: Date.now().toString(),
        totalPoints: parseInt(formData.pointsEarned) - parseInt(formData.pointsRedeemed),
        lastActivity: new Date().toISOString().split('T')[0]
      };
      setPoints([...points, newPoint]);
    }
    onFormClose();
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Gold': return 'yellow';
      case 'Silver': return 'gray';
      case 'Bronze': return 'orange';
      default: return 'gray';
    }
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'pointsEarned', label: 'Points Earned' },
    { key: 'pointsRedeemed', label: 'Points Redeemed' },
    { key: 'totalPoints', label: 'Total Points' },
    {
      key: 'tier',
      label: 'Tier',
      render: (tier) => (
        <Tag colorScheme={getTierColor(tier)}>
          {tier}
        </Tag>
      )
    },
    { key: 'source', label: 'Source' },
    { key: 'lastActivity', label: 'Last Activity' }
  ];

  const renderRowActions = (point) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaCoins />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('View points details:', point._id)}
      />
      <IconButton
        icon={<FaEdit />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleEdit(point)}
      />
      <IconButton
        icon={<FaTrash />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(point._id)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalPointsEarned = points.reduce((sum, point) => sum + point.pointsEarned, 0);
  const totalPointsRedeemed = points.reduce((sum, point) => sum + point.pointsRedeemed, 0);
  const totalActivePoints = points.reduce((sum, point) => sum + point.totalPoints, 0);
  const goldMembers = points.filter(p => p.tier === 'Gold').length;

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Points Management
        </Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="brand"
          onClick={handleAddNew}
        >
          Add Points
        </Button>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaCoins color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Earned</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{totalPointsEarned.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaCoins color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Redeemed</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalPointsRedeemed.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaCoins color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Active Points</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">{totalActivePoints.toLocaleString()}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="yellow.100" borderRadius="lg">
              <FaTrophy color="#eab308" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Gold Members</Text>
              <Text fontSize="lg" fontWeight="bold" color="yellow.600">{goldMembers}</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage customer loyalty points and tier system
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={points}
          rowActions={renderRowActions}
        />
      </CommonCard>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title={selectedPoint ? 'Edit Points' : 'Add Points'}
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
            name="pointsEarned"
            label="Points Earned"
            type="number"
            value={formData.pointsEarned}
            onChange={(e) => setFormData({ ...formData, pointsEarned: e.target.value })}
            required
          />
          <FloatingInput
            name="pointsRedeemed"
            label="Points Redeemed"
            type="number"
            value={formData.pointsRedeemed}
            onChange={(e) => setFormData({ ...formData, pointsRedeemed: e.target.value })}
            required
          />
          <FloatingInput
            name="tier"
            label="Tier"
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            required
          />
          <FloatingInput
            name="source"
            label="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            required
          />
        </Box>
      </FormModal>
    </Box>
  );
};

export default Points; 