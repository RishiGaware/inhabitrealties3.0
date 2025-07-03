import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Tag, Text } from '@chakra-ui/react';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';

const SiteVisits = () => {
  const navigate = useNavigate();
  const [siteVisits, setSiteVisits] = useState([
    {
      _id: '1',
      customerName: 'Ravi Patel',
      propertyName: 'Rishi Villa',
      scheduledDate: '2023-12-15',
      scheduledTime: '10:00 AM',
      status: 'Scheduled',
      agent: 'John Smith',
      location: 'Ahmedabad'
    },
    {
      _id: '2',
      customerName: 'Sneha Shah',
      propertyName: 'Luxury Apartment',
      scheduledDate: '2023-12-16',
      scheduledTime: '2:00 PM',
      status: 'Completed',
      agent: 'Jane Doe',
      location: 'Mumbai'
    }
  ]);

  const handleStatusChange = (visitId, newStatus) => {
    setSiteVisits(visits => 
      visits.map(visit => 
        visit._id === visitId 
          ? { ...visit, status: newStatus }
          : visit
      )
    );
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'propertyName', label: 'Property' },
    { key: 'scheduledDate', label: 'Date' },
    { key: 'scheduledTime', label: 'Time' },
    { key: 'agent', label: 'Agent' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag 
          colorScheme={
            status === 'Completed' ? 'green' : 
            status === 'Scheduled' ? 'blue' : 
            status === 'Cancelled' ? 'red' : 'orange'
          }
        >
          {status}
        </Tag>
      )
    }
  ];

  const renderRowActions = (visit) => (
    <Flex gap={2}>
      <Button
        size="sm"
        colorScheme="green"
        onClick={() => handleStatusChange(visit._id, 'Completed')}
        isDisabled={visit.status === 'Completed'}
      >
        Complete
      </Button>
      <Button
        size="sm"
        colorScheme="red"
        variant="outline"
        onClick={() => handleStatusChange(visit._id, 'Cancelled')}
        isDisabled={visit.status === 'Cancelled'}
      >
        Cancel
      </Button>
    </Flex>
  );

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center">
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            colorScheme="gray"
            onClick={() => navigate('/customers/profiles')}
            mr={4}
          >
            Back
          </Button>
          <Heading as="h1" variant="pageTitle">
            Site Visits
          </Heading>
        </Flex>
        <Button
          leftIcon={<FaCalendar />}
          colorScheme="brand"
          onClick={() => console.log('Schedule new site visit')}
        >
          Schedule Visit
        </Button>
      </Flex>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage customer site visits and property tours
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={siteVisits}
          rowActions={renderRowActions}
        />
      </CommonCard>
    </Box>
  );
};

export default SiteVisits; 