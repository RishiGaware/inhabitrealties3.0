import React, { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import CommonTable from '../../components/common/Table/CommonTable';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const mockReports = [
        { _id: '1', name: 'Monthly Sales Summary', type: 'Sales', generatedAt: '2023-10-01' },
        { _id: '2', name: 'Lead Conversion Rates', type: 'Leads', generatedAt: '2023-10-01' },
        { _id: '3', name: 'User Activity Log', type: 'Users', generatedAt: '2023-10-02' },
        { _id: '4', name: 'Property Occupancy Report', type: 'Property', generatedAt: '2023-10-03' },
      ];
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { key: 'name', label: 'Report Name' },
    { key: 'type', label: 'Report Type' },
    { key: 'generatedAt', label: 'Generated At' },
  ];

  return (
    <Box p={5}>
      <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={6}>
        Reports
      </Heading>
      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <CommonTable
          columns={columns}
          data={reports}
          isLoading={isLoading}
          emptyStateMessage="No reports found."
        />
      </Box>
    </Box>
  );
};

export default Reports; 