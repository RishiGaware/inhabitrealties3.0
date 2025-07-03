import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, Tag, IconButton, useDisclosure } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUserPlus } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import FloatingInput from '../../components/common/floatingInput/FloatingInput';
import FormModal from '../../components/common/FormModal';

const Referrals = () => {
  const [referrals, setReferrals] = useState([
    {
      _id: '1',
      customerName: 'Ravi Patel',
      referredBy: 'Sneha Shah',
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
      customerName: 'Amit Kumar',
      referredBy: 'Ravi Patel',
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
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    referredBy: '',
    referredPerson: '',
    email: '',
    phone: '',
    status: 'Pending',
    commission: '',
    notes: ''
  });

  const handleAddNew = () => {
    setSelectedReferral(null);
    setFormData({
      customerName: '',
      referredBy: '',
      referredPerson: '',
      email: '',
      phone: '',
      status: 'Pending',
      commission: '',
      notes: ''
    });
    onFormOpen();
  };

  const handleEdit = (referral) => {
    setSelectedReferral(referral);
    setFormData(referral);
    onFormOpen();
  };

  const handleDelete = (referralId) => {
    if (window.confirm('Are you sure you want to delete this referral?')) {
      setReferrals(referrals.filter(r => r._id !== referralId));
    }
  };

  const handleSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.map(r => 
        r._id === selectedReferral._id ? { ...formData, _id: r._id, date: r.date } : r
      ));
    } else {
      const newReferral = {
        ...formData,
        _id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setReferrals([...referrals, newReferral]);
    }
    onFormClose();
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'referredBy', label: 'Referred By' },
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
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('View referral:', referral._id)}
      />
      <IconButton
        icon={<FaEdit />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleEdit(referral)}
      />
      <IconButton
        icon={<FaTrash />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(referral._id)}
      />
    </Flex>
  );

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Referrals
        </Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="brand"
          onClick={handleAddNew}
        >
          Add Referral
        </Button>
      </Flex>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage customer referrals and track commission earnings
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={referrals}
          rowActions={renderRowActions}
        />
      </CommonCard>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title={selectedReferral ? 'Edit Referral' : 'Add Referral'}
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
            name="referredBy"
            label="Referred By"
            value={formData.referredBy}
            onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
            required
          />
          <FloatingInput
            name="referredPerson"
            label="Referred Person"
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
          <FloatingInput
            name="commission"
            label="Commission Amount"
            value={formData.commission}
            onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
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