import React, { useState } from 'react';
import { Box, Heading, Flex, Button, Text, Tag, IconButton, Grid, useDisclosure } from '@chakra-ui/react';
import { FaDownload, FaEye, FaFileAlt, FaUpload, FaPlus } from 'react-icons/fa';
import CommonCard from '../../components/common/Card/CommonCard';
import CommonTable from '../../components/common/Table/CommonTable';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/floatingInput/FloatingInput';

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      _id: '1',
      documentName: 'Property Agreement',
      documentType: 'Legal',
      uploadDate: '2023-12-15',
      status: 'Verified',
      size: '2.5 MB',
      category: 'Purchase Documents'
    },
    {
      _id: '2',
      documentName: 'Payment Receipt',
      documentType: 'Financial',
      uploadDate: '2023-12-10',
      status: 'Pending',
      size: '1.2 MB',
      category: 'Payment Documents'
    },
    {
      _id: '3',
      documentName: 'Property Photos',
      documentType: 'Images',
      uploadDate: '2023-12-08',
      status: 'Verified',
      size: '5.8 MB',
      category: 'Property Documents'
    }
  ]);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [formData, setFormData] = useState({
    documentName: '',
    documentType: '',
    category: '',
    description: ''
  });

  const handleUpload = () => {
    setFormData({
      documentName: '',
      documentType: '',
      category: '',
      description: ''
    });
    onFormOpen();
  };

  const handleView = (document) => {
    console.log('View document:', document._id);
  };

  const handleDownload = (document) => {
    console.log('Download document:', document._id);
  };

  const handleSubmit = () => {
    const newDocument = {
      ...formData,
      _id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      size: '1.0 MB'
    };
    setDocuments([...documents, newDocument]);
    onFormClose();
  };

  const columns = [
    { key: 'documentName', label: 'Document Name' },
    { key: 'documentType', label: 'Type' },
    { key: 'category', label: 'Category' },
    { key: 'uploadDate', label: 'Upload Date' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Tag colorScheme={status === 'Verified' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    { key: 'size', label: 'Size' }
  ];

  const renderRowActions = (document) => (
    <Flex gap={2}>
      <IconButton
        icon={<FaEye />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleView(document)}
      />
      <IconButton
        icon={<FaDownload />}
        size="sm"
        variant="ghost"
        colorScheme="brand"
        onClick={() => handleDownload(document)}
      />
    </Flex>
  );

  // Calculate summary statistics
  const totalDocuments = documents.length;
  const verifiedDocuments = documents.filter(d => d.status === 'Verified').length;
  const pendingDocuments = documents.filter(d => d.status === 'Pending').length;
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    return sum + size;
  }, 0);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" variant="pageTitle">
          Documents
        </Heading>
        <Button
          leftIcon={<FaUpload />}
          colorScheme="brand"
          onClick={handleUpload}
        >
          Upload Document
        </Button>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="blue.100" borderRadius="lg">
              <FaFileAlt color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Documents</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">{totalDocuments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg">
              <FaFileAlt color="#22c55e" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Verified</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">{verifiedDocuments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="orange.100" borderRadius="lg">
              <FaFileAlt color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Pending</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.600">{pendingDocuments}</Text>
            </Box>
          </Flex>
        </CommonCard>
        
        <CommonCard p={4}>
          <Flex align="center" gap={3}>
            <Box p={2} bg="purple.100" borderRadius="lg">
              <FaFileAlt color="#8b5cf6" size={20} />
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Total Size</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">{totalSize.toFixed(1)} MB</Text>
            </Box>
          </Flex>
        </CommonCard>
      </Grid>

      <CommonCard p={6}>
        <Box mb={4}>
          <Text color="gray.600" fontSize="sm">
            Manage and view your property-related documents
          </Text>
        </Box>
        
        <CommonTable
          columns={columns}
          data={documents}
          rowActions={renderRowActions}
        />
      </CommonCard>

      {/* Upload Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title="Upload Document"
        onSave={handleSubmit}
      >
        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FloatingInput
            name="documentName"
            label="Document Name"
            value={formData.documentName}
            onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
            required
          />
          <FloatingInput
            name="documentType"
            label="Document Type"
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            required
          />
          <FloatingInput
            name="category"
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
        <Box mt={4}>
          <Button
            leftIcon={<FaPlus />}
            variant="outline"
            colorScheme="brand"
            width="full"
          >
            Choose File
          </Button>
        </Box>
      </FormModal>
    </Box>
  );
};

export default Documents; 