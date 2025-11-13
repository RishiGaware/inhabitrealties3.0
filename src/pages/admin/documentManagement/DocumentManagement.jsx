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
import { FaEye, FaDownload, FaTrash, FaUpload, FaFilter, FaFile, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel } from 'react-icons/fa';
import CommonPagination from '../../../components/common/pagination/CommonPagination';
import FormModal from '../../../components/common/FormModal';
import FloatingInput from '../../../components/common/FloatingInput';
import SearchableSelect from '../../../components/common/SearchableSelect';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import DocumentUpload from '../../../components/common/DocumentUpload';
import { useDocumentContext } from '../../../context/DocumentContext';
import { useDocumentTypeContext } from '../../../context/DocumentTypeContext';
import { useUserContext } from '../../../context/UserContext';
import Loader from '../../../components/common/Loader';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';

const DocumentManagement = () => {
  const toast = useToast();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default to 5 documents per page
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Color mode values
  const cardGradientBg = useColorModeValue('gray.50', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const fileNameColor = useColorModeValue('gray.800', 'white');
  const docTypeColor = useColorModeValue('purple.600', 'purple.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');
  const modalHeaderBg = useColorModeValue('#f8fafc', 'gray.800');
  const modalHeaderColor = useColorModeValue('purple.700', 'purple.200');
  const modalBodyBg = useColorModeValue('white', 'gray.900');
  const modalIconBg = useColorModeValue('purple.50', 'purple.900');
  const modalIconColor = useColorModeValue('purple.600', 'purple.200');
  const modalIconBorder = useColorModeValue('purple.200', 'purple.700');
  const modalLabelColor = useColorModeValue('gray.600', 'gray.300');
  const modalValueColor = useColorModeValue('gray.800', 'white');
  const fileCardBg = useColorModeValue('gray.50', 'gray.800');
  const fileCardBorder = useColorModeValue('gray.200', 'gray.700');
  const fileIconBg = useColorModeValue('purple.50', 'purple.900');
  const fileIconColor = useColorModeValue('purple.600', 'purple.200');
  const fileIconBorder = useColorModeValue('purple.200', 'purple.700');
  const fileNameTextColor = useColorModeValue('gray.800', 'white');
  const fileMetaTextColor = useColorModeValue('gray.600', 'gray.300');

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
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDocumentTypeLabel(doc.documentTypeId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserLabel(doc.userId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (userFilter) {
      filtered = filtered.filter(doc => doc.userId === userFilter);
    }
    if (documentTypeFilter) {
      filtered = filtered.filter(doc => doc.documentTypeId === documentTypeFilter);
    }
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, searchTerm, userFilter, documentTypeFilter, documentTypeOptions, userOptions]);

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
    const totalPages = Math.ceil(filteredDocuments.length / pageSize);
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => { 
    setPageSize(newSize);
    setCurrentPage(1);
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

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
    // Set the first file as uploadedFile for backward compatibility
    if (files.length > 0) {
      setUploadedFile(files[0].file);
      if (errors.file) {
        setErrors({ ...errors, file: '' });
      }
    } else {
      setUploadedFile(null);
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
    if ((!uploadedFile && uploadedFiles.length === 0) && !selectedDocument) {
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
    setUploadedFiles([]);
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
    setUploadedFiles([]);
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
    if (documentToDelete && !isApiCallInProgress && !isDeleteLoading) {
      setIsApiCallInProgress(true);
      setIsDeleteLoading(true);
      try {
        await removeDocument(documentToDelete._id);
        onDeleteClose();
        setDocumentToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsApiCallInProgress(false);
        setIsDeleteLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isApiCallInProgress || isSubmitting) {
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('documentTypeId', formData.documentTypeId);
      
      // Use uploadedFile if available, otherwise use first file from uploadedFiles
      const fileToUpload = uploadedFile || (uploadedFiles.length > 0 ? uploadedFiles[0].file : null);
      if (fileToUpload) {
        formDataToSend.append('document', fileToUpload);
      }

      if (selectedDocument) {
        await updateDocument(selectedDocument._id, formDataToSend);
      } else {
        await addDocument(formDataToSend);
      }
      
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
      setSelectedDocument(null);
      setFormData({});
      setUploadedFile(null);
      setUploadedFiles([]);
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
      uploadedFile !== null ||
      uploadedFiles.length > 0
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
    const iconBgColor =
      iconColor === 'red.500'
        ? 'red.50'
        : iconColor === 'green.500' || iconColor === 'green.600'
        ? 'green.50'
        : iconColor === 'blue.500'
        ? 'blue.50'
        : 'gray.100';

    return (
      <Card
        key={document._id}
        bg={cardGradientBg}
        border="1px"
        borderColor={cardBorderColor}
        borderRadius="2xl"
        boxShadow="0 2px 8px 0 rgba(60,72,88,0.08)"
        _hover={{
          boxShadow: '0 8px 24px 0 rgba(60,72,88,0.16)',
          borderColor: 'purple.400',
          transform: 'translateY(-4px) scale(1.03)',
          transition: 'all 0.2s',
        }}
        transition="all 0.2s"
        overflow="hidden"
        position="relative"
        maxW={{ base: '100%', sm: '220px', md: '240px', lg: '260px' }}
        minH={{ base: '140px', sm: '160px', md: '180px' }}
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex align="flex-start" justify="space-between" mb={2}>
          <Box
            p={2}
            borderRadius="full"
            bg={iconBgColor}
            color={iconColor}
            border="1.5px solid"
            borderColor={iconColor}
            minW="40px"
            minH="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 1px 4px 0 rgba(60,72,88,0.10)"
            mr={2}
          >
            <FileIconComponent size={20} />
          </Box>
          <Badge
            colorScheme={document.published ? 'green' : 'red'}
            fontSize="2xs"
            borderRadius="full"
            px={2}
            py={0.5}
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wide"
            boxShadow="0 1px 4px 0 rgba(60,72,88,0.10)"
            alignSelf="flex-start"
          >
            {document.published ? 'Active' : 'Inactive'}
          </Badge>
        </Flex>
        <Box flex={1} minW={0} mb={1}>
          <Text
            fontWeight="bold"
            fontSize={{ base: 'sm', md: 'md' }}
            noOfLines={1}
            color={fileNameColor}
            mb={0.5}
            letterSpacing="tight"
          >
            {document.fileName}
          </Text>
          <Text
            fontSize="2xs"
            color={docTypeColor}
            textTransform="uppercase"
            letterSpacing="widest"
            fontWeight="semibold"
            noOfLines={1}
            mb={0.5}
            lineHeight={1.1}
          >
            {getDocumentTypeLabel(document.documentTypeId)}
          </Text>
          <Text fontSize="2xs" color={textColor} noOfLines={1} mb={0.5} lineHeight={1.1} fontWeight="normal">
            <strong>User:</strong> {getUserLabel(document.userId)}
          </Text>
          <HStack spacing={2} fontSize="2xs" color={textColor} mt={1}>
            <HStack spacing={1}>
              <FaFile size={10} />
              <Text fontWeight="medium" noOfLines={1} fontSize="2xs" color={textColor} opacity={0.8}>
                {formatFileSize(document.size)}
              </Text>
            </HStack>
            <HStack spacing={1}>
              <CalendarIcon boxSize={3} />
              <Text fontWeight="medium" noOfLines={1} fontSize="2xs" color={textColor} opacity={0.8}>
                {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </HStack>
          </HStack>
        </Box>
        <Divider borderColor={dividerColor} my={2} />
        <HStack spacing={2} w="full" justify="center">
          <Tooltip label="View Details" placement="top">
            <IconButton
              icon={<FaEye />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={(e) => {
                e.stopPropagation();
                handleView(document);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(document);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(document);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(document);
              }}
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
          Document Management
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onSearchSubmit={() => {
          // Reset to first page when search is submitted
          setCurrentPage(1);
        }}
        searchPlaceholder="Search documents..."
        filters={{ user: userFilter, documentType: documentTypeFilter }}
        onFilterChange={(key, value) => {
          if (key === 'user') {
            setUserFilter(value);
          } else if (key === 'documentType') {
            setDocumentTypeFilter(value);
          }
        }}
        onApplyFilters={() => {
          // Reset to first page when filters are applied
          setCurrentPage(1);
        }}
        onClearFilters={() => {
          setUserFilter('');
          setDocumentTypeFilter('');
          setSearchTerm('');
          // Reset to first page when filters are cleared
          setCurrentPage(1);
        }}
        filterOptions={{
          user: {
            label: "User",
            placeholder: "Filter by user",
            options: userOptions
          },
          documentType: {
            label: "Document Type",
            placeholder: "Filter by type",
            options: documentTypeOptions
          }
        }}
        title="Filter Documents"
        activeFiltersCount={(userFilter ? 1 : 0) + (documentTypeFilter ? 1 : 0)}
      />
      
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
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 3, sm: 4, md: 5, lg: 6 }}>
            {(() => {
              const startIndex = (currentPage - 1) * pageSize;
              const endIndex = currentPage * pageSize;
              const documentsToShow = filteredDocuments.slice(startIndex, endIndex);
             
              return documentsToShow.map(renderDocumentCard);
            })()}
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
          setUploadedFiles([]);
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
              files={uploadedFiles}
              onFilesChange={handleFilesChange}
              maxFiles={1}
              maxFileSize={10 * 1024 * 1024} // 10MB
              allowedTypes={['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']}
              isDisabled={isSubmitting}
              title="Add New Document"
              description="Upload supporting documents"
            />
            {errors.file && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.file}
              </Text>
            )}
            {selectedDocument && selectedDocument.fileName && uploadedFiles.length === 0 && (
              <Box
                mt={3}
                p={3}
                borderRadius="lg"
                bg={fileCardBg}
                border="1px solid"
                borderColor={fileCardBorder}
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Box
                  p={2}
                  borderRadius="full"
                  bg={fileIconBg}
                  color={fileIconColor}
                  border="1.5px solid"
                  borderColor={fileIconBorder}
                  minW="40px"
                  minH="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaFile size={20} />
                </Box>
                <Box flex={1} minW={0}>
                  <Text fontWeight="bold" fontSize="sm" color={fileNameTextColor} noOfLines={1}>
                    {selectedDocument.fileName}
                  </Text>
                  <Text fontSize="xs" color={fileMetaTextColor}>
                    {selectedDocument.size
                      ? `${(selectedDocument.size / 1024).toFixed(2)} KB`
                      : ''}
                    {' '}
                    {selectedDocument.mimeType || 'N/A'}
                  </Text>
                </Box>
              </Box>
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
        isLoading={isDeleteLoading}
        loadingText="Deleting..."
      />

      {/* Document View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent
          borderRadius="2xl"
          boxShadow="0 8px 32px 0 rgba(60,72,88,0.18)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          maxW="480px"
          m="auto"
        >
          <ModalHeader fontWeight="bold" fontSize="2xl" color={modalHeaderColor} bg={modalHeaderBg} borderTopRadius="2xl">Document Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} bg={modalBodyBg} borderBottomRadius="2xl" display="flex" alignItems="center" justifyContent="center" minH="400px">
            {documentToView && (
              <VStack spacing={6} align="stretch" px={{ base: 0, md: 4 }} w="100%" justify="center">
                <Flex align="center" justify="flex-start" mb={2}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={modalIconBg}
                    color={modalIconColor}
                    border="1.5px solid"
                    borderColor={modalIconBorder}
                    minW="56px"
                    minH="56px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 1px 8px 0 rgba(60,72,88,0.10)"
                    mr={4}
                  >
                    <FaFile size={32} />
                  </Box>
                  <Box flex={1} minW={0}>
                    <Text fontWeight="bold" fontSize="xl" color={fileNameColor} noOfLines={1} mb={1}>
                      {documentToView.fileName}
                    </Text>
                    <Text fontSize="sm" color={modalHeaderColor} textTransform="uppercase" letterSpacing="wider" fontWeight="semibold" noOfLines={1}>
                      {getDocumentTypeLabel(documentToView.documentTypeId)}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={documentToView.published ? 'green' : 'red'}
                    fontSize="sm"
                    borderRadius="full"
                    px={4}
                    py={1}
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    boxShadow="0 1px 4px 0 rgba(60,72,88,0.10)"
                    alignSelf="flex-start"
                  >
                    {documentToView.published ? 'Active' : 'Inactive'}
                  </Badge>
                </Flex>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" color={modalLabelColor}>User</Text>
                    <Text color={modalValueColor}>{getUserLabel(documentToView.userId)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color={modalLabelColor}>File Size</Text>
                    <Text color={modalValueColor}>{formatFileSize(documentToView.size)}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color={modalLabelColor}>File Type</Text>
                    <Text color={modalValueColor}>{documentToView.mimeType || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color={modalLabelColor}>Uploaded On</Text>
                    <Text color={modalValueColor}>{documentToView.createdAt ? new Date(documentToView.createdAt).toLocaleString() : 'N/A'}</Text>
                  </Box>
                </SimpleGrid>
                <HStack spacing={4} pt={2} justify="center">
                  <Button
                    leftIcon={<FaDownload />}
                    colorScheme="brand"
                    variant="solid"
                    borderRadius="lg"
                    size="md"
                    fontWeight="bold"
                    onClick={() => handleDownload(documentToView)}
                  >
                    Download
                  </Button>
                  <Button
                    leftIcon={<EditIcon />}
                    variant="outline"
                    colorScheme="purple"
                    borderRadius="lg"
                    size="md"
                    fontWeight="bold"
                    onClick={() => {
                      onViewClose();
                      handleEdit(documentToView);
                    }}
                    _hover={{
                      bg: 'purple.50',
                      borderColor: 'purple.400',
                      color: 'purple.700',
                    }}
                    _active={{
                      bg: 'purple.100',
                      borderColor: 'purple.600',
                      color: 'purple.800',
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

export default DocumentManagement; 