import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, IconButton } from '@chakra-ui/react';
import { FaArrowLeft, FaDownload, FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([
    {
      _id: '1',
      customerName: 'Ravi Patel',
      documentType: 'Aadhar Card',
      fileName: 'aadhar_card.pdf',
      uploadedOn: '2023-01-15',
      status: 'Verified'
    },
    {
      _id: '2',
      customerName: 'Sneha Shah',
      documentType: 'PAN Card',
      fileName: 'pan_card.pdf',
      uploadedOn: '2023-02-20',
      status: 'Pending'
    }
  ]);

  const handleDelete = (documentId) => {
    setDocuments(documents.filter(doc => doc._id !== documentId));
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'documentType', label: 'Document Type' },
    { key: 'fileName', label: 'File Name' },
    { key: 'uploadedOn', label: 'Uploaded On' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Box
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="medium"
          bg={status === 'Verified' ? 'green.100' : 'orange.100'}
          color={status === 'Verified' ? 'green.800' : 'orange.800'}
        >
          {status}
        </Box>
      )
    }
  ];

  const renderRowActions = (document) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('View document:', document.fileName)}
      />
      <IconButton
        icon={<FaDownload />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => console.log('Download document:', document.fileName)}
      />
      <IconButton
        icon={<FaTrash />}
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => handleDelete(document._id)}
      />
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
            Customer Documents
          </Heading>
        </Flex>
        <Button
          leftIcon={<FaUpload />}
          colorScheme="brand"
          onClick={() => console.log('Upload new document')}
        >
          Upload Document
        </Button>
      </Flex>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage customer documents and verification status
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={documents}
          rowActions={renderRowActions}
        />
      </CommonCard>
    </Box>
  );
};

export default Documents; 