import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, VStack, HStack, Text, Heading, SimpleGrid, Badge,
  Grid, GridItem, useToast, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl,
  FormLabel, Select, Input, Textarea, Divider, IconButton,
  Tabs, TabList, TabPanels, Tab, TabPanel, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  FormHelperText, Flex, Spinner, Tooltip,
} from '@chakra-ui/react';
import { FiSave, FiX, FiEdit, FiUpload, FiEye, FiDownload } from 'react-icons/fi';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';
import DocumentUpload from './DocumentUpload';
import { useAuth } from '../../context/AuthContext';
import PropertyPreview from '../../pages/property/propertyMaster/PropertyPreview';

const PurchaseBookingEditForm = ({ isOpen, onClose, bookingData, onUpdate, isReadOnly = false }) => {
  // Expected installment data structure with documents:
  // installment: {
  //   installmentNumber: 1,
  //   amount: 12000,
  //   dueDate: "2025-01-15",
  //   status: "PENDING",
  //   documents: [
  //     {
  //       documentUrl: "https://res.cloudinary.com/doaqk3uzf/image/upload/v1/insightwaveit/purchase_booking_docs/PURC2025-08-31-be83ecd5-9b91-43b2-9e9b-9d9fe4d6bed8/1756663235565_cpwupcuuz1i?_a=BAMAK+fi0",
  //       originalName: "payment_proof.pdf",
  //       mimeType: "application/pdf",
  //       documentType: "INSTALLMENT_PROOF"
  //     }
  //   ]
  // }
  const navigate = useNavigate();
  const { getUserRoleName } = useAuth();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  
  // Check if user is admin
  const isAdmin = getUserRoleName()?.toUpperCase() === 'ADMIN';
  const [booking, setBooking] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedInstallments, setEditedInstallments] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen: isPropertyPreviewOpen, onOpen: onPropertyPreviewOpen, onClose: onPropertyPreviewClose } = useDisclosure();
  const fileInputRef = useRef(null);
  
  // Installment edit modal
  const { isOpen: isInstallmentModalOpen, onOpen: onInstallmentModalOpen, onClose: onInstallmentModalClose } = useDisclosure();
  
  // PDF viewer modal
  const { isOpen: isPdfViewerOpen, onOpen: onPdfViewerOpen, onClose: onPdfViewerClose } = useDisclosure();
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  useEffect(() => {
    if (isOpen && bookingData) {
      setBooking(bookingData);
      setEditedInstallments(bookingData.installmentSchedule || []);
    }
  }, [isOpen, bookingData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentDisplayName = (document) => {
    // Check document type first (most reliable)
    const docType = document.documentType?.toUpperCase() || '';
    const originalName = document.originalName?.toLowerCase() || '';
    
    // Map specific document types to clear names
    if (docType === 'AADHAR_CARD' || docType === 'AADHAR_FRONT' || docType === 'AADHAR_BACK' || 
        (docType.includes('ID_PROOF') && originalName.includes('aadhar'))) {
      return 'Aadhar Card';
    }
    if (docType === 'PAN_CARD' || (docType.includes('ID_PROOF') && originalName.includes('pan'))) {
      return 'PAN Card';
    }
    if (docType === 'TRANSACTION_DOCUMENT' || docType.includes('TRANSACTION') || docType.includes('CHEQUE') || 
        originalName.includes('transaction') || originalName.includes('cheque')) {
      return 'Transaction / Cheque Document';
    }
    if (docType.includes('BANK_STATEMENT') || originalName.includes('bank') || originalName.includes('statement')) {
      return 'Bank Statement';
    }
    if (docType.includes('INSTALLMENT_PROOF') || originalName.includes('installment') || originalName.includes('proof')) {
      return 'Installment Proof';
    }
    if (docType.includes('PAYMENT_RECEIPT') || originalName.includes('payment') || originalName.includes('receipt')) {
      return 'Payment Receipt';
    }
    // Generic ID Proof - try to identify from filename
    if (docType.includes('ID_PROOF')) {
      if (originalName.includes('aadhar')) {
        return 'Aadhar Card';
      }
      if (originalName.includes('pan')) {
        return 'PAN Card';
      }
      return 'ID Proof Document';
    }
    
    // Fallback to original name or document type
    return document.originalName || document.documentType?.replace(/_/g, ' ') || 'Document';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'yellow';
      case 'REJECTED': return 'red';
      case 'COMPLETED': return 'blue';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const handleInstallmentStatusChange = (installmentNumber, newStatus) => {
    setEditedInstallments(prev => 
      prev.map(inst => 
        inst.installmentNumber === installmentNumber 
          ? { ...inst, status: newStatus, updatedAt: new Date() }
          : inst
      )
    );
    setHasChanges(true);
  };

  const handleLateFeesChange = (installmentNumber, lateFees) => {
    setEditedInstallments(prev => 
      prev.map(inst => 
        inst.installmentNumber === installmentNumber 
          ? { ...inst, lateFees: parseFloat(lateFees) || 0, updatedAt: new Date() }
          : inst
      )
    );
    setHasChanges(true);
  };

  const handleNotesChange = (installmentNumber, notes) => {
    setEditedInstallments(prev => 
      prev.map(inst => 
        inst.installmentNumber === installmentNumber 
          ? { ...inst, notes: notes, updatedAt: new Date() }
          : inst
      )
    );
    setHasChanges(true);
  };

  const handleEditInstallment = (installment) => {
    setSelectedInstallment(installment);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onInstallmentModalOpen();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF files are allowed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} selected for upload`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !selectedInstallment || !booking) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a new File object with installment number in the name
      const installmentNumber = selectedInstallment.installmentNumber;
      const fileExtension = selectedFile.name.split('.').pop();
      const baseFileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      const newFileName = `Installment_${installmentNumber}_${baseFileName}.${fileExtension}`;
      
      // Create a new File object with the updated name
      const renamedFile = new File([selectedFile], newFileName, {
        type: selectedFile.type,
        lastModified: selectedFile.lastModified
      });
      
      // Check if there's an existing proof document for this installment
      const existingDoc = booking?.documents?.find(doc => {
        if (doc.documentType !== 'INSTALLMENT_PROOF') return false;
        const fileName = doc.originalName?.toLowerCase() || '';
        return fileName.includes(`installment_${installmentNumber}`) || 
               fileName.includes(`installment${installmentNumber}`) ||
               fileName.match(new RegExp(`installment[_-]?${installmentNumber}`, 'i'));
      });

      let response;
      let updatedBooking;

      if (existingDoc && existingDoc._id) {
        // Update existing document
        const formData = new FormData();
        formData.append('document', renamedFile);
        formData.append('documentType', 'INSTALLMENT_PROOF');

        response = await purchaseBookingService.updateDocumentInPurchaseBooking(
          booking.bookingId || booking._id,
          existingDoc._id,
          formData
        );

        // Backend returns { message, data: updatedBooking }
        updatedBooking = response?.data || response;
      } else {
        // Add new document
        const formData = new FormData();
        formData.append('documents', renamedFile);
        formData.append('documentType', 'INSTALLMENT_PROOF');

        response = await purchaseBookingService.addDocumentsToPurchaseBooking(
          booking.bookingId || booking._id,
          formData
        );

        // Backend returns { message, count, data: updatedBooking }
        updatedBooking = response?.data || response;
      }

      const newDocuments = updatedBooking?.documents || [];

      if (newDocuments.length > 0 || response) {
        // Update booking state with all documents from the response
        setBooking(prev => ({
          ...prev,
          documents: newDocuments.length > 0 ? newDocuments : prev.documents
        }));

        setHasChanges(true);
        setSelectedFile(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast({
          title: "Success",
          description: existingDoc 
            ? "Installment proof document updated successfully" 
            : "Installment proof document uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || error.message || "Failed to upload document",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewPdf = (url, title) => {
    setPdfUrl(url);
    setPdfTitle(title);
    onPdfViewerOpen();
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      
      // Update installment statuses individually
      for (const installment of editedInstallments) {
        if (installment.status !== (booking.installmentSchedule || []).find(
          orig => orig.installmentNumber === installment.installmentNumber
        )?.status) {
          
          await purchaseBookingService.updateInstallmentStatus(
            booking.bookingId || booking._id,
            {
              installmentNumber: installment.installmentNumber,
              status: installment.status,
              lateFees: installment.lateFees || 0
            }
          );
        }
      }

      // Update main booking data
      const updateData = {
        ...booking,
        installmentSchedule: editedInstallments,
        updatedAt: new Date().toISOString()
      };

      await purchaseBookingService.updatePurchaseBooking(
        booking.bookingId || booking._id,
        updateData
      );
      
      toast({
        title: "Success",
        description: "Purchase booking updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setHasChanges(false);
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update purchase booking",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedInstallments(booking?.installmentSchedule || []);
    setHasChanges(false);
    onClose();
  };

  if (!booking) {
    return null;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={isReadOnly ? onClose : handleCancel} size={{ base: "full", sm: "4xl", md: "5xl", lg: "6xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="visible">
          <ModalHeader position="relative" p={{ base: 3, sm: 4, md: 6 }} bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <VStack align="start" spacing={{ base: 1, sm: 2 }} w="full">
<Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
                {isReadOnly ? 'View Purchase Booking' : 'Edit Purchase Booking'}
        </Heading>
              <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.600">Booking ID: {booking.bookingId || booking._id?.slice(-8)}</Text>
            </VStack>
            <HStack spacing={2} position="absolute" top={{ base: 2, sm: 3, md: 4 }} right={{ base: 2, sm: 3, md: 4 }}>
              {isAdmin && !isReadOnly && (
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="blue"
                  size={{ base: "xs", sm: "sm", md: "md" }}
                  onClick={() => {
                    onClose();
                    // Navigate to create form with booking data for editing
                    navigate('/purchase-bookings/create', {
                      state: {
                        editMode: true,
                        bookingData: booking
                      }
                    });
                  }}
                  _hover={{ bg: 'blue.600' }}
                >
                  Edit Form
                </Button>
              )}
              <Button 
                variant="ghost" 
                size={{ base: "sm", sm: "md", md: "lg" }} 
                onClick={isReadOnly ? onClose : handleCancel} 
                _hover={{ bg: 'red.50', color: 'red.600' }} 
                color="gray.600"
              >
                ✕
              </Button>
            </HStack>
          </ModalHeader>

          <ModalBody p={{ base: 2, sm: 3, md: 4, lg: 6 }} overflowY="auto" bg="gray.25">
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
              <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap" css={{
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-blue-300)', borderRadius: '2px' }
              }}>
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }} px={{ base: 2, sm: 3, md: 4 }} py={{ base: 2, sm: 3 }}>Basic Details</Tab>
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }} px={{ base: 2, sm: 3, md: 4 }} py={{ base: 2, sm: 3 }}>Installment Schedule</Tab>
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }} px={{ base: 2, sm: 3, md: 4 }} py={{ base: 2, sm: 3 }}>Documents</Tab>
              </TabList>

              <TabPanels>
                {/* Basic Details Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {/* Booking Overview */}
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
                      <HStack mb={3} align="center">
                        <Box p={2} bg="blue.100" borderRadius="full"><Text fontSize="lg" color="blue.600">📋</Text></Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.700">Booking Overview</Text>
                      </HStack>
                      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
                        <GridItem>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold" mb={1}>Booking ID</Text>
                          <Text fontSize="lg" fontWeight="bold" color="blue.700" noOfLines={1}>{booking.bookingId || booking._id?.slice(-8) || 'N/A'}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold" mb={1}>Status</Text>
                          <Badge colorScheme={getStatusColor(booking.bookingStatus)} variant="solid" fontSize="md" px={3} py={1} borderRadius="full">{booking.bookingStatus?.replace(/_/g, ' ') || 'N/A'}</Badge>
                        </GridItem>
                        <GridItem>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold" mb={1}>Created Date</Text>
                          <Text fontSize="md" fontWeight="semibold" color="gray.700">{formatDate(booking.createdAt)}</Text>
                        </GridItem>
                        <GridItem>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold" mb={1}>Documents</Text>
                          <HStack spacing={2} align="center">
                            <Text fontSize="md" fontWeight="semibold" color="gray.700">{booking.documents?.length || 0}</Text>
                            <Text fontSize="xs" color="blue.600">{booking.documents?.length === 1 ? 'file' : 'files'}</Text>
                          </HStack>
                        </GridItem>
                      </Grid>
                    </Box>

                    {/* Property Booking Form Details */}
                    {(booking.developer || booking.channelPartnerName || booking.projectName || booking.location || booking.tcfNumber) && (
                      <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
                        <HStack mb={3} align="center">
                          <Box p={2} bg="blue.100" borderRadius="full"><Text fontSize="lg" color="blue.600">📋</Text></Box>
                          <Text fontSize="md" fontWeight="semibold" color="blue.700">Property Booking Form</Text>
                        </HStack>
                        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                          {booking.developer && (
                            <GridItem>
                              <Text fontSize="sm" color="blue.600" fontWeight="medium" mb={1}>Developer</Text>
                              <Text fontSize="md" color="gray.800">{booking.developer}</Text>
                            </GridItem>
                          )}
                          {booking.channelPartnerName && (
                            <GridItem>
                              <Text fontSize="sm" color="blue.600" fontWeight="medium" mb={1}>Channel Partner Name</Text>
                              <Text fontSize="md" color="gray.800">{booking.channelPartnerName}</Text>
                            </GridItem>
                          )}
                          {booking.projectName && (
                            <GridItem>
                              <Text fontSize="sm" color="blue.600" fontWeight="medium" mb={1}>Project Name</Text>
                              <Text fontSize="md" color="gray.800">{booking.projectName}</Text>
                            </GridItem>
                          )}
                          {booking.location && (
                            <GridItem>
                              <Text fontSize="sm" color="blue.600" fontWeight="medium" mb={1}>Location</Text>
                              <Text fontSize="md" color="gray.800">{booking.location}</Text>
                            </GridItem>
                          )}
                          {booking.tcfNumber && (
                            <GridItem>
                              <Text fontSize="sm" color="blue.600" fontWeight="medium" mb={1}>TCF Number</Text>
                              <Text fontSize="md" color="gray.800">{booking.tcfNumber}</Text>
                            </GridItem>
                          )}
                        </Grid>
                      </Box>
                    )}

                    {/* Property Details - Comprehensive */}
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                      <HStack mb={3} align="center" justify="space-between">
                        <HStack>
                          <Box p={2} bg="green.100" borderRadius="full"><Text fontSize="lg" color="green.600">🏠</Text></Box>
                          <Text fontSize="md" fontWeight="semibold" color="green.700">Property Details</Text>
                        </HStack>
                        {booking.propertyId && (
                          <Button
                            leftIcon={<FiEye />}
                            size="sm"
                            colorScheme="green"
                            variant="outline"
                            onClick={onPropertyPreviewOpen}
                            _hover={{ bg: "green.100" }}
                          >
                            View Property
                          </Button>
                        )}
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        {/* Basic Property Info */}
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Property Name</Text>
                            <Text fontSize="md" fontWeight="bold" color="green.700">{booking.propertyId?.name || 'N/A'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Property Type</Text>
                            <Text fontSize="md" color="gray.700">
                              {booking.propertyId?.propertyTypeId?.typeName || 
                               booking.propertyId?.propertyTypeId?.name || 
                               (typeof booking.propertyId?.propertyTypeId === 'string' ? booking.propertyId.propertyTypeId : 'N/A')}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Status</Text>
                            <Badge colorScheme="green" variant="subtle" fontSize="sm">{booking.propertyId?.propertyStatus || 'N/A'}</Badge>
                          </Box>
                        </SimpleGrid>

                        {/* Property Description */}
                        {booking.propertyId?.description && (
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Description</Text>
                            <Text fontSize="md" color="gray.700" noOfLines={2}>{booking.propertyId.description}</Text>
                          </Box>
                        )}

                        {/* Property Address */}
                        {booking.propertyId?.propertyAddress && (
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={2}>Address</Text>
                            <VStack spacing={1} align="start" p={3} bg="gray.50" borderRadius="md">
                              <Text fontSize="sm" color="gray.700">
                                <strong>Street:</strong> {booking.propertyId.propertyAddress.street || 'N/A'}
                              </Text>
                              <Text fontSize="sm" color="gray.700">
                                <strong>Area:</strong> {booking.propertyId.propertyAddress.area || 'N/A'}
                              </Text>
                              <Text fontSize="sm" color="gray.700">
                                <strong>City:</strong> {booking.propertyId.propertyAddress.city || 'N/A'}
                              </Text>
                              <Text fontSize="sm" color="gray.700">
                                <strong>State:</strong> {booking.propertyId.propertyAddress.state || 'N/A'}
                              </Text>
                              <Text fontSize="sm" color="gray.700">
                                <strong>PIN:</strong> {booking.propertyId.propertyAddress.zipOrPinCode || 'N/A'}
                              </Text>
                              <Text fontSize="sm" color="gray.700">
                                <strong>Country:</strong> {booking.propertyId.propertyAddress.country || 'N/A'}
                              </Text>
                            </VStack>
                          </Box>
                        )}

                        {/* Property Features */}
                        {booking.propertyId?.features && (
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={2}>Features</Text>
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                              <Box p={2} bg="gray.50" borderRadius="md">
                                <Text fontSize="xs" color="gray.600" fontWeight="medium">Bedrooms</Text>
                                <Text fontSize="md" fontWeight="bold" color="green.600">{booking.propertyId.features.bedRooms || 'N/A'}</Text>
                              </Box>
                              <Box p={2} bg="gray.50" borderRadius="md">
                                <Text fontSize="xs" color="gray.600" fontWeight="medium">Bathrooms</Text>
                                <Text fontSize="md" fontWeight="bold" color="green.600">{booking.propertyId.features.bathRooms || 'N/A'}</Text>
                              </Box>
                              <Box p={2} bg="gray.50" borderRadius="md">
                                <Text fontSize="xs" color="gray.600" fontWeight="medium">Area (sq ft)</Text>
                                <Text fontSize="md" fontWeight="bold" color="green.600">{booking.propertyId.features.areaInSquarFoot?.toLocaleString() || 'N/A'}</Text>
                              </Box>
                            </SimpleGrid>
                            
                            {/* Amenities */}
                            {booking.propertyId.features.amenities && booking.propertyId.features.amenities.length > 0 && (
                              <Box mt={3}>
                                <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={2}>Amenities</Text>
                                <HStack spacing={2} flexWrap="wrap">
                                  {booking.propertyId.features.amenities.map((amenity, index) => (
                                    <Badge key={index} colorScheme="green" variant="subtle" fontSize="xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </HStack>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Property Price & Listing Info */}
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Price</Text>
                            <Text fontSize="lg" fontWeight="bold" color="green.700">{formatCurrency(booking.propertyId?.price)}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Listed Date</Text>
                            <Text fontSize="md" color="gray.700">{formatDate(booking.propertyId?.listedDate)}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Created Date</Text>
                            <Text fontSize="md" color="gray.700">{formatDate(booking.propertyId?.createdAt)}</Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </Box>

                    {/* Customer Details - Comprehensive */}
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="purple.100" shadow="sm">
                      <HStack mb={3} align="center">
                        <Box p={2} bg="purple.100" borderRadius="full"><Text fontSize="lg" color="purple.600">👤</Text></Box>
                        <Text fontSize="md" fontWeight="semibold" color="purple.700">Customer Details</Text>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="purple.600" fontWeight="medium" mb={1}>Full Name</Text>
                            <Text fontSize="md" fontWeight="bold" color="purple.700">
                              {booking.customerId ? `${booking.customerId.firstName || ''} ${booking.customerId.lastName || ''}`.trim() : 'N/A'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="purple.600" fontWeight="medium" mb={1}>Email</Text>
                            <Text fontSize="md" color="gray.700">{booking.customerId?.email || 'N/A'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="purple.600" fontWeight="medium" mb={1}>Phone</Text>
                            <Text fontSize="md" color="gray.700">{booking.customerId?.phoneNumber || 'N/A'}</Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </Box>

                    {/* Buyer Details Section */}
                    {(booking.buyerFullName || booking.buyerAddress || booking.buyerCityPin || booking.buyerMobileNo || booking.buyerEmailId || booking.buyerAadharNo || booking.buyerPanNo) && (
                      <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                        <HStack mb={3} align="center">
                          <Box p={2} bg="green.100" borderRadius="full"><Text fontSize="lg" color="green.600">🧾</Text></Box>
                          <Text fontSize="md" fontWeight="semibold" color="green.700">Buyer Details</Text>
                        </HStack>
                        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                          {booking.buyerFullName && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Full Name</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerFullName}</Text>
                            </GridItem>
                          )}
                          {booking.buyerAddress && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Address</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerAddress}</Text>
                            </GridItem>
                          )}
                          {booking.buyerCityPin && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>City / PIN</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerCityPin}</Text>
                            </GridItem>
                          )}
                          {booking.buyerMobileNo && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Mobile No.</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerMobileNo}</Text>
                            </GridItem>
                          )}
                          {booking.buyerEmailId && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Email ID</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerEmailId}</Text>
                            </GridItem>
                          )}
                          {booking.buyerAadharNo && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>Aadhar No.</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerAadharNo}</Text>
                            </GridItem>
                          )}
                          {booking.buyerPanNo && (
                            <GridItem>
                              <Text fontSize="sm" color="green.600" fontWeight="medium" mb={1}>PAN No.</Text>
                              <Text fontSize="md" color="gray.800">{booking.buyerPanNo}</Text>
                            </GridItem>
                          )}
                        </Grid>
                      </Box>
                    )}

                    {/* Property Details - Merged Building/Apartment and Additional Details */}
                    {/* Always show this section if booking exists */}
                    {booking && (
                      <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                        <HStack mb={3} align="center" justify="space-between">
                          <HStack>
                            <Box p={2} bg="orange.100" borderRadius="full"><Text fontSize="lg" color="orange.600">🏢</Text></Box>
                            <Text fontSize="md" fontWeight="semibold" color="orange.700">Property Details</Text>
                          </HStack>
                          {booking.propertyId && (
                            <Button
                              leftIcon={<FiEye />}
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={onPropertyPreviewOpen}
                              _hover={{ bg: "blue.50" }}
                            >
                              View Property
                            </Button>
                          )}
                        </HStack>
                        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Flat / Plot No.</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.flatNo ? "medium" : "normal"}>
                              {booking.flatNo || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Tower / Wing</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.towerWing ? "medium" : "normal"}>
                              {booking.towerWing || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Floor</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.floorNo ? "medium" : "normal"}>
                              {booking.floorNo || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Number of Balconies</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.balconies ? "medium" : "normal"}>
                              {booking.balconies || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Type</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={(booking.propertyType || booking.propertyTypeOther) ? "medium" : "normal"}>
                              {booking.propertyType === "Other" ? (booking.propertyTypeOther || 'N/A') : (booking.propertyType || 'N/A')}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Carpet Area (sq.ft / sq.yd)</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.carpetArea ? "medium" : "normal"}>
                              {booking.carpetArea || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Facing</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.facing ? "medium" : "normal"}>
                              {booking.facing || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Parking No.</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.parkingNo ? "medium" : "normal"}>
                              {booking.parkingNo || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem colSpan={{ base: 1, sm: 2 }}>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Special Flat / Corner / Garden View / Amenities</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.specialFeatures ? "medium" : "normal"}>
                              {booking.specialFeatures || 'N/A'}
                            </Text>
                          </GridItem>
                          <GridItem colSpan={{ base: 1, sm: 2 }}>
                            <Text fontSize="sm" color="orange.600" fontWeight="medium" mb={1}>Other Details</Text>
                            <Text fontSize="md" color="gray.800" fontWeight={booking.otherDetails ? "medium" : "normal"}>
                              {booking.otherDetails || 'N/A'}
                            </Text>
                          </GridItem>
                        </Grid>
                      </Box>
                    )}

                    {/* Salesperson Details - Comprehensive */}
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="teal.100" shadow="sm">
                      <HStack mb={3} align="center">
                        <Box p={2} bg="teal.100" borderRadius="full"><Text fontSize="lg" color="teal.600">👨‍💼</Text></Box>
                        <Text fontSize="md" fontWeight="semibold" color="teal.700">Assigned Salesperson</Text>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="teal.600" fontWeight="medium" mb={1}>Full Name</Text>
                            <Text fontSize="md" fontWeight="bold" color="teal.700">
                              {booking.assignedSalespersonId ? `${booking.assignedSalespersonId.firstName || ''} ${booking.assignedSalespersonId.lastName || ''}`.trim() : 'N/A'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="teal.600" fontWeight="medium" mb={1}>Email</Text>
                            <Text fontSize="md" color="gray.700">{booking.assignedSalespersonId?.email || 'N/A'}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="teal.600" fontWeight="medium" mb={1}>Phone</Text>
                            <Text fontSize="md" color="gray.700">{booking.assignedSalespersonId?.phoneNumber || 'N/A'}</Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </Box>

                    {/* Financial Details - Enhanced */}
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                      <HStack mb={3} align="center">
                        <Box p={2} bg="orange.100" borderRadius="full"><Text fontSize="lg" color="orange.600">💰</Text></Box>
                        <Text fontSize="md" fontWeight="semibold" color="orange.700">Financial Details</Text>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Total Cost</Text>
                            <Text fontSize="lg" fontWeight="bold" color="orange.700">{formatCurrency(booking.totalPropertyValue)}</Text>
                          </GridItem>
                          {booking.bookingAmount && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Booking Amount</Text>
                              <Text fontSize="lg" fontWeight="bold" color="orange.700">{formatCurrency(booking.bookingAmount)}</Text>
                            </GridItem>
                          )}
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Down Payment</Text>
                            <Text fontSize="lg" fontWeight="bold" color="orange.700">{formatCurrency(booking.downPayment)}</Text>
                          </GridItem>
                          {booking.paymentMode && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Payment Mode</Text>
                              <Badge colorScheme="orange" variant="subtle" fontSize="md" px={3} py={1}>
                                {booking.paymentMode}
                              </Badge>
                            </GridItem>
                          )}
                          {booking.financeMode && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Finance Mode</Text>
                              <Text fontSize="md" color="gray.800">{booking.financeMode}</Text>
                            </GridItem>
                          )}
                          {booking.totalEmi && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Total EMI</Text>
                              <Text fontSize="lg" fontWeight="bold" color="orange.700">{formatCurrency(booking.totalEmi)}</Text>
                            </GridItem>
                          )}
                          {booking.transactionChequeNo && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Transaction / Cheque No.</Text>
                              <Text fontSize="md" color="gray.800">{booking.transactionChequeNo}</Text>
                            </GridItem>
                          )}
                          {booking.bookingDate && (
                            <GridItem>
                              <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Booking Date</Text>
                              <Text fontSize="md" color="gray.800">{formatDate(booking.bookingDate)}</Text>
                            </GridItem>
                          )}
                          {booking.loanAmount && (
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Loan Amount</Text>
                            <Text fontSize="lg" fontWeight="bold" color="orange.700">{formatCurrency(booking.loanAmount)}</Text>
                          </GridItem>
                          )}
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Payment Terms</Text>
                            <Badge colorScheme="orange" variant="subtle" fontSize="md" px={3} py={1}>
                              {booking.paymentTerms?.replace(/_/g, ' ') || 'N/A'}
                            </Badge>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Installment Count</Text>
                            <Text fontSize="md" fontWeight="bold" color="orange.700">{booking.installmentCount || 'N/A'}</Text>
                          </GridItem>
                          <GridItem>
                            <Text fontSize="sm" color="orange.600" fontWeight="semibold" mb={1}>Financing</Text>
                            <Badge colorScheme={booking.isFinanced ? "green" : "gray"} variant="subtle" fontSize="md" px={3} py={1}>
                              {booking.isFinanced ? 'FINANCED' : 'NOT FINANCED'}
                            </Badge>
                          </GridItem>
                        </SimpleGrid>

                        {/* Financing Details (if applicable) */}
                        {booking.isFinanced && (
                          <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                            <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>Financing Information</Text>
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                              <Box>
                                <Text fontSize="xs" color="blue.600" fontWeight="medium">Bank Name</Text>
                                <Text fontSize="sm" color="blue.700">{booking.bankName || 'N/A'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="blue.600" fontWeight="medium">Loan Tenure (months)</Text>
                                <Text fontSize="sm" color="blue.700">{booking.loanTenure || 'N/A'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="blue.600" fontWeight="medium">Interest Rate (%)</Text>
                                <Text fontSize="sm" color="blue.700">{booking.interestRate || 'N/A'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="blue.600" fontWeight="medium">EMI Amount</Text>
                                <Text fontSize="sm" color="blue.700">{formatCurrency(booking.emiAmount)}</Text>
                              </Box>
                            </SimpleGrid>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Installment Schedule Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {editedInstallments && editedInstallments.length > 0 ? (
                      <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="yellow.100" shadow="sm">
                        <HStack mb={4} align="center" justify="space-between">
                          <HStack align="center">
                            <Box p={2} bg="yellow.100" borderRadius="full"><Text fontSize="lg" color="yellow.600">📅</Text></Box>
                            <Text fontSize="md" fontWeight="semibold" color="yellow.700">Installment Schedule ({editedInstallments.length} installments)</Text>
                          </HStack>
                          <HStack spacing={2}>
                            <Badge colorScheme="green" variant="subtle" fontSize="sm">{editedInstallments.filter(inst => inst.status === 'PAID').length} Paid</Badge>
                            <Badge colorScheme="yellow" variant="subtle" fontSize="sm">{editedInstallments.filter(inst => inst.status === 'PENDING').length} Pending</Badge>
                            <Badge colorScheme="red" variant="subtle" fontSize="sm">{editedInstallments.filter(inst => inst.status === 'OVERDUE').length} Overdue</Badge>
                          </HStack>
                        </HStack>

                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 2, sm: 3, md: 4 }}>
                          {editedInstallments.map((installment, index) => (
                            <Box key={installment._id || index} p={{ base: 2, sm: 3 }} bg={installment.status === 'PAID' ? 'green.50' : 'white'} borderRadius="md" border="1px" borderColor={installment.status === 'PAID' ? 'green.200' : installment.status === 'PENDING' ? 'yellow.200' : installment.status === 'OVERDUE' ? 'red.200' : 'gray.200'} _hover={{ transform: 'translateY(-2px)', boxShadow: 'md', transition: 'all 0.2s' }}>
                              <VStack spacing={{ base: 1.5, sm: 2 }} align="stretch">
                                <HStack justify="space-between" w="full">
                                  <HStack spacing={2}>
                                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="medium">Installment {installment.installmentNumber}</Text>
                                    {/* Document indicator - Only show INSTALLMENT_PROOF documents for this specific installment */}
                                    {(() => {
                                      const installmentNumber = installment.installmentNumber;
                                      const installmentDocs = booking?.documents?.filter(doc => {
                                        if (doc.documentType !== 'INSTALLMENT_PROOF') return false;
                                        // Check if filename contains the installment number
                                        const fileName = doc.originalName?.toLowerCase() || '';
                                        return fileName.includes(`installment_${installmentNumber}`) || 
                                               fileName.includes(`installment${installmentNumber}`) ||
                                               fileName.match(new RegExp(`installment[_-]?${installmentNumber}`, 'i'));
                                      }) || [];
                                      return installmentDocs.length > 0 ? (
                                        <Tooltip label={`${installmentDocs.length} proof document(s) for Installment ${installmentNumber}`} placement="top">
                                          <Badge colorScheme="blue" variant="subtle" fontSize={{ base: "2xs", sm: "xs" }} borderRadius="full" cursor="pointer">
                                            📄 {installmentDocs.length}
                                        </Badge>
                                      </Tooltip>
                                      ) : null;
                                    })()}
                                  </HStack>
                                  <Badge colorScheme={installment.status === 'PAID' ? 'green' : installment.status === 'PENDING' ? 'yellow' : installment.status === 'OVERDUE' ? 'red' : 'gray'} variant="solid" fontSize={{ base: "2xs", sm: "xs" }} borderRadius="full">{installment.status}</Badge>
                                </HStack>
                                
                                <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="blue.600">{formatCurrency(installment.amount)}</Text>
                                
                                <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.600" textAlign="center">
                                  <strong>Due:</strong> {formatDate(installment.dueDate)}
                                </Text>

                                <HStack spacing={2} justify="center">
                                  {!isReadOnly && (
                                  <IconButton 
                                      size={{ base: "xs", sm: "sm" }}
                                    colorScheme="blue" 
                                    variant="outline" 
                                    icon={<FiEdit />} 
                                    onClick={() => handleEditInstallment(installment)} 
                                    aria-label="Edit installment" 
                                  />
                                  )}
                                  {/* Show view button only if installment has INSTALLMENT_PROOF documents for this specific installment */}
                                  {(() => {
                                    const installmentNumber = installment.installmentNumber;
                                    const installmentDocs = booking?.documents?.filter(doc => {
                                      if (doc.documentType !== 'INSTALLMENT_PROOF') return false;
                                      // Check if filename contains the installment number
                                      const fileName = doc.originalName?.toLowerCase() || '';
                                      return fileName.includes(`installment_${installmentNumber}`) || 
                                             fileName.includes(`installment${installmentNumber}`) ||
                                             fileName.match(new RegExp(`installment[_-]?${installmentNumber}`, 'i'));
                                    }) || [];
                                    return installmentDocs.length > 0 ? (
                                    <IconButton 
                                        size={{ base: "xs", sm: "sm" }}
                                      colorScheme="purple" 
                                      variant="outline" 
                                      icon={<FiEye />} 
                                      onClick={() => {
                                          const pdfDoc = installmentDocs.find(doc => 
                                          doc.mimeType?.includes('pdf') || 
                                            doc.originalName?.toLowerCase().includes('.pdf') ||
                                            doc.documentUrl?.includes('.pdf')
                                          ) || installmentDocs[0];
                                        if (pdfDoc?.documentUrl) {
                                            handleViewPdf(pdfDoc.documentUrl, `Installment ${installmentNumber} - ${pdfDoc.originalName || 'Document'}`);
                                        }
                                      }} 
                                        aria-label={`View Installment ${installmentNumber} documents`}
                                    />
                                    ) : null;
                                  })()}
                                </HStack>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    ) : (
                      <Box p={8} bg="white" borderRadius="lg" border="1px" borderColor="gray.200" textAlign="center">
                        <Text fontSize="lg" color="gray.500">No installment schedule available</Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                      <HStack mb={4} align="center" justify="space-between">
                        <HStack align="center">
                          <Box p={2} bg="orange.100" borderRadius="full"><Text fontSize="lg" color="orange.600">📎</Text></Box>
                          <Text fontSize="md" fontWeight="semibold" color="orange.700">Booking Documents</Text>
                        </HStack>
                        <Badge colorScheme="orange" variant="subtle" fontSize={{ base: "xs", sm: "sm" }} borderRadius="full">
                          {booking.documents?.length || 0} Document{booking.documents?.length !== 1 ? 's' : ''}
                        </Badge>
                      </HStack>
                      
                      {booking.documents && booking.documents.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                            <Text fontSize={{ base: "sm", md: "md" }} color="orange.700" fontWeight="medium">
                              Uploaded Documents ({booking.documents.length} files)
                            </Text>
                            {!isReadOnly && (
                            <Button
                              size={{ base: "sm", md: "md" }}
                              colorScheme="blue"
                              variant="outline"
                              leftIcon={<FiUpload />}
                              onClick={() => {}}
                            >
                              Upload More
                            </Button>
                            )}
                          </HStack>
                          
                          <Box 
                            maxH={{ base: "300px", sm: "400px", md: "500px" }} 
                            overflowY="auto" 
                            border="1px" 
                            borderColor="orange.200" 
                            borderRadius="md"
                            bg="gray.25"
                          >
                            <SimpleGrid 
                              columns={{ base: 1, sm: 2, md: 3 }} 
                              spacing={{ base: 2, sm: 3 }} 
                              p={{ base: 2, sm: 3 }}
                            >
                              {booking.documents.map((document, index) => (
                                <Box 
                                  key={document._id || index} 
                                  p={{ base: 2, sm: 3 }} 
                                  bg="white" 
                                  borderRadius="lg" 
                                  border="1px" 
                                  borderColor="orange.200"
                                  _hover={{ 
                                    transform: 'translateY(-2px)', 
                                    boxShadow: 'md',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <VStack spacing={{ base: 2, sm: 3 }} align="stretch">
                                    {/* Document Icon and Type */}
                                    <HStack justify="space-between" align="center">
                                      <Box p={2} bg="orange.100" borderRadius="full">
                                        <Text fontSize={{ base: "lg", sm: "xl" }} color="orange.600">
                                          {(document.mimeType?.includes('pdf') || document.originalName?.toLowerCase().includes('.pdf')) ? '📄' : 
                                           (document.mimeType?.includes('doc') || document.originalName?.toLowerCase().includes('.doc')) ? '📝' : 
                                           (document.mimeType?.includes('image') || document.originalName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) ? '🖼️' : '📎'}
                                        </Text>
                                      </Box>
                                      <Badge
                                        colorScheme="orange"
                                        variant="subtle"
                                        size={{ base: "xs", sm: "sm" }}
                                        borderRadius="full"
                                      >
                                        {document.documentType?.replace(/_/g, ' ') || 'OTHER'}
                                      </Badge>
                                    </HStack>
                                    
                                    {/* Document Name */}
                                    <VStack spacing={{ base: 1, sm: 1 }} align="start" w="full">
                                      <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold" color="blue.700" noOfLines={2}>
                                        {getDocumentDisplayName(document)}
                                      </Text>
                                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.500" fontStyle="italic" noOfLines={1}>
                                        {document.originalName}
                                      </Text>
                                      
                                      {/* File Size */}
                                      <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                        <strong>Size:</strong> {document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                                      </Text>
                                      
                                      {/* Upload Date */}
                                      {document.uploadedAt && (
                                        <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                          <strong>Uploaded:</strong> {formatDate(document.uploadedAt)}
                                        </Text>
                                      )}
                                    </VStack>
                                    
                                    {/* Action Buttons */}
                                    <HStack spacing={{ base: 1, sm: 2 }} justify="center">
                                      <Button
                                        size={{ base: "xs", sm: "sm" }}
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={() => {
                                          if (document.mimeType?.includes('pdf') || document.originalName?.toLowerCase().includes('.pdf')) {
                                            handleViewPdf(document.documentUrl, document.originalName || 'Document');
                                          } else {
                                            window.open(document.documentUrl, '_blank');
                                          }
                                        }}
                                        leftIcon={<FiEye />}
                                        _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                      >
                                        {(document.mimeType?.includes('pdf') || document.originalName?.toLowerCase().includes('.pdf')) ? 'View PDF' : 'View'}
                                      </Button>
                                      <Button
                                        size={{ base: "xs", sm: "sm" }}
                                        colorScheme="green"
                                        variant="outline"
                                        onClick={() => {
                                          const link = document.createElement('a');
                                          link.href = document.documentUrl;
                                          link.download = document.originalName;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }}
                                        leftIcon={<FiDownload />}
                                        _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                                      >
                                        Download
                                      </Button>
                                    </HStack>
                                  </VStack>
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        </VStack>
                      ) : (
                        <Box p={6} bg="gray.50" borderRadius="md" textAlign="center">
                          <VStack spacing={3} align="center">
                            <Box p={3} bg="gray.100" borderRadius="full">
                              <Text fontSize={{ base: "xl", sm: "2xl" }} color="gray.500">📎</Text>
                            </Box>
                            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.600">
                              No Documents Uploaded
                            </Text>
                            <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500" textAlign="center">
                              This purchase booking doesn't have any supporting documents yet.
                            </Text>
                            <Button
                              size={{ base: "sm", md: "md" }}
                              colorScheme="blue"
                              variant="outline"
                              leftIcon={<FiUpload />}
                              onClick={() => {}}
                            >
                              Upload First Document
                            </Button>
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          {/* Form Footer - Standard pattern like other forms */}
          {!isReadOnly && (
          <Box
            mt={{ base: 6, md: 8 }}
            p={{ base: 4, md: 6 }}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            shadow="sm"
          >
            <Flex justify="flex-end" align="center" gap={3}>
              <Button 
                variant="ghost" 
                onClick={handleCancel}
                disabled={isSaving}
                size="md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave} 
                colorScheme="brand"
                isLoading={isSaving} 
                loadingText="Updating..."
                isDisabled={!hasChanges}
                size="md"
              >
                Update Booking
              </Button>
            </Flex>
          </Box>
          )}
          {isReadOnly && (
            <Box
              mt={{ base: 6, md: 8 }}
              p={{ base: 4, md: 6 }}
              bg="white"
              borderTop="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              shadow="sm"
            >
              <Flex justify="flex-end" align="center" gap={3}>
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  size="md"
                >
                  Close
                </Button>
              </Flex>
            </Box>
          )}
        </ModalContent>
      </Modal>

      {/* Installment Edit Modal */}
      <Modal isOpen={isInstallmentModalOpen} onClose={onInstallmentModalClose} size={{ base: "full", sm: "full", md: "4xl", lg: "5xl" }} isCentered={{ base: false, md: true }}>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          mx={{ base: 0, sm: 0 }} 
          my={{ base: 0, sm: 0 }}
          maxH={{ base: "100vh", sm: "90vh" }}
          borderRadius={{ base: 0, sm: "md" }}
        >
          <ModalHeader position="relative" p={{ base: 2, sm: 3 }} bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <VStack align="start" spacing={1} w="full">
              <Heading size={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">
                Edit Installment {selectedInstallment?.installmentNumber}
              </Heading>
              <Text fontSize={{ base: "2xs", sm: "xs" }} color="gray.600">
                Amount: {selectedInstallment ? formatCurrency(selectedInstallment.amount) : 'N/A'}
              </Text>
            </VStack>
            <IconButton
              position="absolute"
              top={{ base: 1, sm: 2 }}
              right={{ base: 1, sm: 2 }}
              variant="ghost"
              size={{ base: "xs", sm: "sm" }}
              icon={<FiX />}
              onClick={onInstallmentModalClose}
              _hover={{ bg: 'red.50', color: 'red.600' }}
              color="gray.600"
              aria-label="Close"
            />
          </ModalHeader>
          
          <ModalBody p={0} bg="gray.25">
            <Box
              p={{ base: 2, sm: 2.5 }}
              maxH={{ base: "calc(100vh - 100px)", sm: "calc(90vh - 100px)", md: "60vh" }}
              minH={{ base: "calc(100vh - 100px)", sm: "calc(90vh - 100px)", md: "60vh" }}
              overflowY="auto"
              overflowX="hidden"
              data-modal-body
              position="relative"
              onWheel={(e) => {
                e.stopPropagation();
                const target = e.currentTarget;
                const delta = e.deltaY;
                target.scrollTop += delta;
              }}
              css={{
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '3px' },
                '&::-webkit-scrollbar-thumb': { 
                  background: '#3b82f6', 
                  borderRadius: '3px',
                  border: '1px solid #f1f5f9'
                },
                '&::-webkit-scrollbar-thumb:hover': { background: '#2563eb' },
                'scrollbar-width': 'thin',
                'scrollbar-color': '#3b82f6 #f1f5f9',
                'overscroll-behavior': 'contain',
                'touch-action': 'pan-y'
              }}
            >
            {selectedInstallment && (
              <VStack spacing={{ base: 2, sm: 3 }} align="stretch">

                {/* Installment Details */}
                <Box p={{ base: 2, sm: 2.5 }} bg="white" borderRadius="md" border="1px" borderColor="blue.100" shadow="sm">
                  <HStack mb={2} align="center">
                    <Box p={1} bg="blue.100" borderRadius="full">
                      <Text fontSize={{ base: "sm", sm: "md" }} color="blue.600">📅</Text>
                    </Box>
                    <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="semibold" color="blue.700">
                      Installment {selectedInstallment.installmentNumber} Details
                    </Text>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 2, sm: 3 }}>
                    <Box>
                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="blue.600" fontWeight="medium" mb={1}>Amount</Text>
                      <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="blue.700">
                        {formatCurrency(selectedInstallment.amount)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize={{ base: "2xs", sm: "xs" }} color="blue.600" fontWeight="medium" mb={1}>Due Date</Text>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700">
                        {formatDate(selectedInstallment.dueDate)}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Edit Form */}
                <Box p={{ base: 2, sm: 2.5 }} bg="white" borderRadius="md" border="1px" borderColor="green.100" shadow="sm">
                  <HStack mb={2} align="center">
                    <Box p={1} bg="green.100" borderRadius="full">
                      <Text fontSize={{ base: "sm", sm: "md" }} color="green.600">✏️</Text>
                    </Box>
                    <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="semibold" color="green.700">
                      Edit Details
                    </Text>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 2, sm: 3 }}>
                    <FormControl>
                      <FormLabel fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium">Status</FormLabel>
                      <Select 
                        value={selectedInstallment.status} 
                        onChange={(e) => handleInstallmentStatusChange(selectedInstallment.installmentNumber, e.target.value)}
                        size={{ base: "sm", sm: "sm" }}
                        fontSize={{ base: "xs", sm: "sm" }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="LATE">Late</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium">Late Fees</FormLabel>
                      <NumberInput 
                        value={selectedInstallment.lateFees || 0} 
                        onChange={(value) => handleLateFeesChange(selectedInstallment.installmentNumber, value)} 
                        min={0}
                        size={{ base: "sm", sm: "sm" }}
                      >
                        <NumberInputField placeholder="Enter late fees" fontSize={{ base: "xs", sm: "sm" }} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl mt={3}>
                    <FormLabel fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium">Notes</FormLabel>
                    <Textarea 
                      value={selectedInstallment.notes || ''} 
                      onChange={(e) => handleNotesChange(selectedInstallment.installmentNumber, e.target.value)} 
                      placeholder="Add notes about this installment" 
                      rows={2}
                      size={{ base: "sm", sm: "sm" }}
                      fontSize={{ base: "xs", sm: "sm" }}
                    />
                  </FormControl>
                </Box>

                {/* Document Upload Section */}
                <Box p={{ base: 2, sm: 2.5 }} bg="white" borderRadius="md" border="1px" borderColor="orange.200" shadow="sm">
                  <HStack mb={2} align="center">
                    <Box p={1} bg="orange.100" borderRadius="full">
                      <Text fontSize={{ base: "sm", sm: "md" }} color="orange.600">📎</Text>
                      </Box>
                    <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="semibold" color="orange.700">
                      Upload Proof Documents
                      </Text>
                  </HStack>
                  
                  <VStack spacing={2} align="stretch">
                    {/* File Upload */}
                    <FormControl>
                      <FormLabel fontSize={{ base: "2xs", sm: "xs" }} fontWeight="medium">Select PDF File</FormLabel>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        isDisabled={isUploading}
                        size={{ base: "sm", sm: "sm" }}
                        border="1px dashed"
                        borderColor="orange.300"
                        borderRadius="md"
                        bg="orange.50"
                        _hover={{ borderColor: "orange.400", bg: "orange.100" }}
                        _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px var(--chakra-colors-orange-500)" }}
                        cursor="pointer"
                        fontSize={{ base: "xs", sm: "sm" }}
                        h="auto"
                        py={1}
                      />
                      <FormHelperText fontSize={{ base: "2xs", sm: "xs" }} color="gray.500" mt={1}>
                        PDF files only (Max 10MB)
                      </FormHelperText>
                      {selectedFile && (
                        <Text fontSize={{ base: "2xs", sm: "xs" }} color="green.600" mt={1} fontWeight="medium">
                          Selected: {selectedFile.name}
                        </Text>
                      )}
                    </FormControl>

                    {/* Upload Button */}
                    <Button
                      size={{ base: "sm", sm: "sm" }}
                      colorScheme="green"
                      variant="solid"
                      leftIcon={<FiUpload />}
                      onClick={handleUploadDocument}
                      isLoading={isUploading}
                      loadingText="Uploading..."
                      isDisabled={!selectedFile || isUploading}
                      w="full"
                      fontSize={{ base: "xs", sm: "sm" }}
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    >
                      Upload Proof Document
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            )}
            </Box>
          </ModalBody>

          <ModalFooter p={{ base: 2, sm: 2.5 }} bg="gray.50" borderTop="1px" borderColor="gray.200">
            <HStack spacing={2} w="full" justify="flex-end">
              <Button 
                variant="ghost" 
                onClick={onInstallmentModalClose}
                size={{ base: "xs", sm: "sm" }}
                fontSize={{ base: "xs", sm: "sm" }}
              >
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal isOpen={isPdfViewerOpen} onClose={onPdfViewerClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
        <ModalContent maxH="90vh" borderRadius="lg">
          <ModalHeader bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold" color="gray.800" noOfLines={1}>
                {pdfTitle}
              </Text>
              <IconButton
                size="sm"
                colorScheme="gray"
                variant="ghost"
                icon={<FiX />}
                onClick={onPdfViewerClose}
                aria-label="Close PDF viewer"
              />
            </HStack>
          </ModalHeader>
          
          <ModalBody p={0} bg="gray.100">
            <Box w="full" h="70vh" position="relative">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: '0 0 8px 8px' }}
                  title={pdfTitle}
                />
              ) : (
                <VStack spacing={4} align="center" justify="center" h="full">
                  <Text fontSize="lg" color="gray.500">Loading PDF...</Text>
                  <Spinner size="lg" color="blue.500" />
                </VStack>
              )}
            </Box>
          </ModalBody>
          
          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200" justifyContent="space-between">
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = pdfTitle;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download PDF
            </Button>
            <Button
              size="sm"
              colorScheme="gray"
              variant="outline"
              onClick={onPdfViewerClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Property Preview Modal */}
      {booking?.propertyId && (
        <PropertyPreview
          isOpen={isPropertyPreviewOpen}
          onClose={onPropertyPreviewClose}
          property={booking.propertyId}
          isViewOnly={true}
        />
      )}
    </>
  );
};

export default PurchaseBookingEditForm;
