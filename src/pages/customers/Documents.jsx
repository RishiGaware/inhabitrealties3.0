import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  useDisclosure,
  FormControl,
  VStack,
  HStack,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Flex,
  Heading,
  Select,
  useToast,
  Badge,
  Link,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Stack,
  Divider,
  Tooltip,
  useColorModeValue,
  FormLabel,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon, AddIcon, ViewIcon, DownloadIcon, CalendarIcon } from '@chakra-ui/icons';
import { FaEye, FaDownload, FaTrash, FaUpload, FaFile, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel } from 'react-icons/fa';
import CommonPagination from '../../components/common/pagination/CommonPagination';
import FormModal from '../../components/common/FormModal';
import FloatingInput from '../../components/common/FloatingInput';
import SearchableSelect from '../../components/common/SearchableSelect';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import DocumentUpload from '../../components/common/DocumentUpload';
import { useDocumentContext } from '../../context/DocumentContext';
import { useDocumentTypeContext } from '../../context/DocumentTypeContext';
import { useUserContext } from '../../context/UserContext';
import Loader from '../../components/common/Loader';
import CommonAddButton from '../../components/common/Button/CommonAddButton';

const Documents = () => {
  const toast = useToast();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Changed to 12 for cards (3x4 grid)
  const [searchTerm, setSearchTerm] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documentToView, setDocumentToView] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const iconBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const previewBorder = useColorModeValue('gray.200', 'gray.600');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');

  // Get contexts
  const documentContext = useDocumentContext();
  const documentTypeContext = useDocumentTypeContext();
  const userContext = useUserContext();
  const { documents, getAllDocuments, addDocument, updateDocument, removeDocument, loading } = documentContext;
  const { documentTypes, getAllDocumentTypes } = documentTypeContext;
  const { users, getAllUsers } = userContext;

  // Convert document types to options for dropdown
  const documentTypeOptions = useMemo(() => {
    return documentTypes.map(type => ({
      value: type._id,
      label: type.name
    }));
  }, [documentTypes]);

  // Convert users to options for dropdown
  const userOptions = useMemo(() => {
    return users.map(user => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName} (${user.email})`
    }));
  }, [users]);

  // Helper function to get document type label from value
  const getDocumentTypeLabel = (documentTypeId) => {
    const documentType = documentTypeOptions.find(t => t.value === documentTypeId);
    return documentType ? documentType.label : documentTypeId;
  };

  // Helper function to get user label from value
  const getUserLabel = (userId) => {
    const user = userOptions.find(u => u.value === userId);
    return user ? user.label : userId;
  };

  // Memoize filtered documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(doc => doc.published === true);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(doc => doc.published === false);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDocumentTypeLabel(doc.documentTypeId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserLabel(doc.userId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by document type
    if (documentTypeFilter) {
      filtered = filtered.filter(doc => doc.documentTypeId === documentTypeFilter);
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(doc => doc.published === (statusFilter === 'active'));
    }
    
    return filtered;
  }, [documents, searchTerm, documentTypeFilter, statusFilter, documentTypeOptions, userOptions, activeTab]);

  useEffect(() => {
    getAllDocuments();
    getAllDocumentTypes();
    getAllUsers();
  }, [getAllDocuments, getAllDocumentTypes, getAllUsers]);

  // Reset page when filtered results change
  useEffect(() => {
    const maxPage = Math.ceil(filteredDocuments.length / pageSize);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(1);
    }
  }, [filteredDocuments.length, pageSize, currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredDocuments.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDocumentTypeChange = (value) => {
    setFormData({ ...formData, documentTypeId: value });
    if (errors.documentTypeId) {
      setErrors({ ...errors, documentTypeId: '' });
    }
  };

  const handleUserChange = (value) => {
    setFormData({ ...formData, userId: value });
    if (errors.userId) {
      setErrors({ ...errors, userId: '' });
    }
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    if (errors.file) {
      setErrors({ ...errors, file: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }
    if (!formData.documentTypeId) {
      newErrors.documentTypeId = 'Document type is required';
    }
    if (!uploadedFile && !selectedDocument) {
      newErrors.file = 'Document file is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setSelectedDocument(null);
    setFormData({
      userId: '',
      documentTypeId: '',
    });
    setOriginalFormData(null);
    setErrors({});
    setUploadedFile(null);
    onOpen();
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    const data = {
      userId: document.userId || '',
      documentTypeId: document.documentTypeId || '',
    };
    setFormData(data);
    setOriginalFormData(data);
    setErrors({});
    setUploadedFile(null);
    onOpen();
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    onDeleteOpen();
  };

  const handleView = (document) => {
    setDocumentToView(document);
    onViewOpen();
  };

  const handleDownload = (document) => {
    if (document.originalUrl) {
      window.open(document.originalUrl, '_blank');
    } else {
      toast({
        title: 'Download Error',
        description: 'Download URL not available',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (documentToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        await removeDocument(documentToDelete._id);
        onDeleteClose();
        setDocumentToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('documentTypeId', formData.documentTypeId);
      
      if (uploadedFile) {
        formDataToSend.append('document', uploadedFile);
      }

      if (selectedDocument) {
        console.log('Editing document:', selectedDocument._id, 'with data:', formData);
        await updateDocument(selectedDocument._id, formDataToSend);
      } else {
        console.log('Adding new document with data:', formData);
        await addDocument(formDataToSend);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedDocument(null);
      setFormData({});
      setUploadedFile(null);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
    }
  };

  const isFormChanged = () => {
    if (!selectedDocument || !originalFormData) return true;
    return (
      formData.userId !== originalFormData.userId ||
      formData.documentTypeId !== originalFormData.documentTypeId ||
      uploadedFile !== null
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return FaFile;
    if (mimeType.includes('pdf')) return FaFilePdf;
    if (mimeType.includes('image')) return FaFileImage;
    if (mimeType.includes('word') || mimeType.includes('doc')) return FaFileWord;
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return FaFileExcel;
    return FaFile;
  };

  const getFileIconColor = (mimeType) => {
    if (!mimeType) return 'gray.400';
    if (mimeType.includes('pdf')) return 'red.500';
    if (mimeType.includes('image')) return 'green.500';
    if (mimeType.includes('word') || mimeType.includes('doc')) return 'blue.500';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'green.600';
    return 'gray.400';
  };

  const renderDocumentCard = (document) => {
    const FileIconComponent = getFileIcon(document.mimeType);
    const iconColor = getFileIconColor(document.mimeType);

    return (
      <Card
        key={document._id}
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        _hover={{ 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-4px)',
          borderColor: 'brand.200'
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        overflow="hidden"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bg: document.published ? 'green.400' : 'red.400',
          opacity: 0.8
        }}
      >
        <CardHeader pb={3} pt={4}>
          <Flex align="center" justify="space-between">
            <HStack spacing={3} flex={1}>
              <Box
                p={3}
                borderRadius="xl"
                bg={`${iconColor}15`}
                color={iconColor}
                border="1px"
                borderColor={`${iconColor}30`}
                _groupHover={{
                  bg: `${iconColor}25`,
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s"
              >
                <FileIconComponent size={24} />
              </Box>
              <Box flex={1} minW={0}>
                <Text 
                  fontWeight="bold" 
                  fontSize="sm" 
                  noOfLines={1}
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {document.fileName}
                </Text>
                <Text 
                  fontSize="xs" 
                  color={textColor}
                  mt={1}
                >
                  {getDocumentTypeLabel(document.documentTypeId)}
                </Text>
              </Box>
            </HStack>
            <Badge
              colorScheme={document.published ? 'green' : 'red'}
              fontSize="xs"
              borderRadius="full"
              px={3}
              py={1}
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {document.published ? 'Active' : 'Inactive'}
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody pt={0} pb={3}>
          <VStack spacing={3} align="stretch">
            <Text fontSize="xs" color={textColor} noOfLines={1}>
              <strong>User:</strong> {getUserLabel(document.userId)}
            </Text>
            
            <HStack spacing={4} fontSize="xs" color={textColor} justify="space-between">
              <HStack spacing={2}>
                <Box
                  p={1.5}
                  borderRadius="md"
                  bg={iconBg}
                  color={iconColor}
                >
                  <FaFile size={10} />
                </Box>
                <Text fontWeight="medium">{formatFileSize(document.size)}</Text>
              </HStack>
              <HStack spacing={2}>
                <Box
                  p={1.5}
                  borderRadius="md"
                  bg={iconBg}
                  color={iconColor}
                >
                  <CalendarIcon size={10} />
                </Box>
                <Text fontWeight="medium">
                  {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </HStack>
            </HStack>

            {document.displayUrl && (
              <Box
                borderRadius="lg"
                overflow="hidden"
                bg="gray.100"
                h="140px"
                position="relative"
                border="1px"
                borderColor={previewBorder}
                _hover={{
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s'
                }}
              >
                <Image
                  src={document.displayUrl}
                  alt={document.fileName}
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/300x200?text=No+Preview"
                />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  bg="black"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  opacity={0.8}
                >
                  Preview
                </Box>
              </Box>
            )}
          </VStack>
        </CardBody>

        <Divider borderColor={dividerColor} />

        <CardFooter pt={3} pb={4}>
          <HStack spacing={3} w="full" justify="center">
            <Tooltip label="View Details" placement="top">
              <IconButton
                icon={<FaEye />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() => handleView(document)}
                aria-label="View document"
                _hover={{
                  bg: 'blue.50',
                  color: 'blue.600',
                  transform: 'scale(1.1)'
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Tooltip label="Download" placement="top">
              <IconButton
                icon={<FaDownload />}
                size="sm"
                variant="ghost"
                colorScheme="green"
                onClick={() => handleDownload(document)}
                aria-label="Download document"
                _hover={{
                  bg: 'green.50',
                  color: 'green.600',
                  transform: 'scale(1.1)'
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Tooltip label="Edit" placement="top">
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="brand"
                onClick={() => handleEdit(document)}
                aria-label="Edit document"
                _hover={{
                  bg: 'brand.50',
                  color: 'brand.600',
                  transform: 'scale(1.1)'
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Tooltip label="Delete" placement="top">
              <IconButton
                icon={<FaTrash />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDelete(document)}
                aria-label="Delete document"
                _hover={{
                  bg: 'red.50',
                  color: 'red.600',
                  transform: 'scale(1.1)'
                }}
                transition="all 0.2s"
              />
            </Tooltip>
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Box p={5}>
      {loading && (
        <Loader size="xl" />
      )}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Documents
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      <Box mb={6}>
        
        
        <HStack spacing={4} mb={4}>
          <Box maxW="400px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </Box>
          
          <Box minW="200px">
            <Select
              placeholder="Filter by document type"
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
            >
              {documentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>

          <Box minW="150px">
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Box>
        </HStack>
      </Box>
      
      {/* Document Cards Grid */}
      <Box mb={6}>
        {filteredDocuments.length === 0 && !loading ? (
          <Box textAlign="center" py={10}>
            <FaFile size={48} color="gray.300" />
            <Text mt={4} color="gray.500" fontSize="lg">
              No documents found
            </Text>
            <Text color="gray.400" fontSize="sm">
              Try adjusting your search or filters
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {filteredDocuments
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map(renderDocumentCard)}
          </SimpleGrid>
        )}
      </Box>

      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <Box mt={6}>
          <CommonPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredDocuments.length / pageSize)}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={filteredDocuments.length}
          />
        </Box>
      )}

      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedDocument(null);
          setFormData({
            userId: '',
            documentTypeId: '',
          });
          setOriginalFormData(null);
          setErrors({});
          setUploadedFile(null);
        }}
        title={selectedDocument ? 'Edit Document' : 'Add New Document'}
        onSave={handleFormSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={selectedDocument ? 'Update' : 'Save'}
        loadingText={selectedDocument ? 'Updating...' : 'Saving...'}
        isDisabled={selectedDocument ? !isFormChanged() : false}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.userId}>
            <SearchableSelect
              options={userOptions}
              value={formData.userId || ''}
              onChange={handleUserChange}
              placeholder="Select user"
              searchPlaceholder="Search users..."
              label="User"
              error={errors.userId}
              isRequired={true}
            />
          </FormControl>
          
          <FormControl isInvalid={!!errors.documentTypeId}>
            <SearchableSelect
              options={documentTypeOptions}
              value={formData.documentTypeId || ''}
              onChange={handleDocumentTypeChange}
              placeholder="Select document type"
              searchPlaceholder="Search document types..."
              label="Document Type"
              error={errors.documentTypeId}
              isRequired={true}
            />
          </FormControl>
          
          <FormControl isInvalid={!!errors.file}>
            <FormLabel>Document File</FormLabel>
            <DocumentUpload
              onFileSelect={handleFileUpload}
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
              maxFileSize={10 * 1024 * 1024} // 10MB
            />
            {errors.file && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.file}
              </Text>
            )}
          </FormControl>
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete the document "${documentToDelete?.fileName}"?`}
      />

      {/* Document View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Document Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {documentToView && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">File Name:</Text>
                  <Text>{documentToView.fileName}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">User:</Text>
                  <Text>{getUserLabel(documentToView.userId)}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Document Type:</Text>
                  <Text>{getDocumentTypeLabel(documentToView.documentTypeId)}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">File Size:</Text>
                  <Text>{formatFileSize(documentToView.size)}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">File Type:</Text>
                  <Text>{documentToView.mimeType || 'N/A'}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Uploaded On:</Text>
                  <Text>{documentToView.createdAt ? new Date(documentToView.createdAt).toLocaleString() : 'N/A'}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={documentToView.published ? 'green' : 'red'}>
                    {documentToView.published ? 'Active' : 'Inactive'}
                  </Badge>
                </Box>
                
                {documentToView.displayUrl && (
                  <Box>
                    <Text fontWeight="bold">Preview:</Text>
                    <Image 
                      src={documentToView.displayUrl} 
                      alt={documentToView.fileName}
                      maxH="300px"
                      objectFit="contain"
                      fallbackSrc="https://via.placeholder.com/300x200?text=No+Preview"
                    />
                  </Box>
                )}
                
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FaDownload />}
                    colorScheme="brand"
                    onClick={() => handleDownload(documentToView)}
                  >
                    Download
                  </Button>
                  <Button
                    leftIcon={<EditIcon />}
                    variant="outline"
                    onClick={() => {
                      onViewClose();
                      handleEdit(documentToView);
                    }}
                  >
                    Edit
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Documents; 