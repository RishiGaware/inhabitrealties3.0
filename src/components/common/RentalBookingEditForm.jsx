import React, { useState, useEffect } from 'react';
import {
  Box, Button, VStack, HStack, Text, Heading, SimpleGrid, Badge,
  Grid, GridItem, useToast, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Select, Input, Textarea, Divider, IconButton,
  Tabs, TabList, TabPanels, Tab, TabPanel, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  FormHelperText, Flex, Spinner, Tooltip,
} from '@chakra-ui/react';
import { FiSave, FiX, FiEdit, FiUpload, FiEye, FiDownload } from 'react-icons/fi';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';
import DocumentUpload from './DocumentUpload';

const RentalBookingEditForm = ({ isOpen, onClose, bookingData, onUpdate }) => {
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const [booking, setBooking] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedRentSchedule, setEditedRentSchedule] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Rent edit modal
  const { isOpen: isRentModalOpen, onOpen: onRentModalOpen, onClose: onRentModalClose } = useDisclosure();
  
  // PDF viewer modal
  const { isOpen: isPdfViewerOpen, onOpen: onPdfViewerOpen, onClose: onPdfViewerClose } = useDisclosure();
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  useEffect(() => {
    if (isOpen && bookingData) {
      setBooking(bookingData);
      setEditedRentSchedule(bookingData.rentSchedule || []);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'EXPIRED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const getRentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PENDING': return 'yellow';
      case 'OVERDUE': return 'red';
      case 'LATE': return 'orange';
      default: return 'gray';
    }
  };


  const openRentEditModal = (rent) => {
    setSelectedRent(rent);
    onRentModalOpen();
  };

  const closeRentEditModal = () => {
    setSelectedRent(null);
    onRentModalClose();
  };

  const saveRentChanges = () => {
    if (selectedRent) {
      setEditedRentSchedule(prev => 
        prev.map(rent => 
          rent.month === selectedRent.month 
            ? { ...selectedRent, updatedAt: new Date() }
            : rent
        )
      );
      setHasChanges(true);
    }
    closeRentEditModal();
  };

  const handleSave = async () => {
    if (!booking) return;

    setIsSaving(true);
    try {
      const updateData = {
        rentSchedule: editedRentSchedule,
        updatedAt: new Date()
      };

      await rentalBookingService.updateRentalBooking(booking._id, updateData);
      
      toast({
        title: 'Rental booking updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onUpdate) {
        onUpdate();
      }
      
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Error updating rental booking:', error);
      toast({
        title: 'Error updating rental booking',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setEditedRentSchedule(booking?.rentSchedule || []);
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const openPdfViewer = (url, title) => {
    setPdfUrl(url);
    setPdfTitle(title);
    onPdfViewerOpen();
  };

  const downloadDocument = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !booking) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel} size={{ base: "full", sm: "4xl", md: "5xl", lg: "6xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          mx={{ base: 0, sm: 2, md: 4 }} 
          my={{ base: 0, sm: 4, md: 8 }}
          maxH={{ base: "100vh", sm: "95vh", md: "90vh" }} 
          maxW={{ base: "100vw", sm: "95vw", md: "90vw", lg: "85vw" }}
          overflow="hidden"
          borderRadius={{ base: "0", sm: "lg", md: "xl" }}
        >
          <ModalHeader 
            position="relative" 
            p={{ base: 3, sm: 4, md: 6 }} 
            bg="gray.50" 
            borderBottom="1px" 
            borderColor="gray.200"
            borderRadius={{ base: "0", sm: "lg", md: "xl" }}
            borderRadiusBottom="0"
          >
            <HStack>
              <FiEdit />
              <Text 
                fontSize={{ base: "md", sm: "lg", md: "xl" }} 
                fontWeight="bold" 
                color="gray.800"
                pr={{ base: 8, sm: 10 }}
                noOfLines={1}
              >
                Edit Rental Booking - {booking.bookingId}
              </Text>
            </HStack>
            <Button
              position="absolute"
              top={{ base: 2, sm: 3, md: 4 }}
              right={{ base: 2, sm: 3, md: 4 }}
              variant="ghost"
              size={{ base: "xs", sm: "sm", md: "md" }}
              onClick={handleCancel}
              _hover={{ bg: 'red.50', color: 'red.600' }}
              color="gray.600"
              minW="auto"
              p={{ base: 1, sm: 2 }}
            >
              ✕
            </Button>
          </ModalHeader>

          <ModalBody 
            p={{ base: 2, sm: 3, md: 6 }} 
            overflowY="auto" 
            bg="gray.25"
            maxH={{ base: "calc(100vh - 120px)", sm: "calc(95vh - 120px)", md: "calc(90vh - 120px)" }}
          >
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
              <TabList 
                flexWrap="wrap"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
              >
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }}>Rent Schedule</Tab>
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }}>Booking Details</Tab>
                <Tab fontSize={{ base: "xs", sm: "sm", md: "md" }}>Documents</Tab>
              </TabList>

              <TabPanels>
                {/* Rent Schedule Tab */}
                <TabPanel p={0} pt={4}>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="yellow.100" shadow="sm">
                      <VStack spacing={{ base: 3, sm: 4 }} align="stretch" mb={4}>
                        <HStack justify="space-between" align="center" flexWrap="wrap">
                          <HStack flexWrap="wrap" spacing={2}>
                            <Text 
                              fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} 
                              fontWeight="semibold" 
                              color="yellow.700"
                            >
                              Rent Schedule Management
                            </Text>
                            <Badge 
                              colorScheme="yellow" 
                              variant="subtle"
                              fontSize={{ base: "2xs", sm: "xs" }}
                              px={{ base: 1, sm: 2 }}
                              py={{ base: 0.5, sm: 1 }}
                            >
                              {editedRentSchedule.length} months
                            </Badge>
                          </HStack>
                        </HStack>
                        <HStack 
                          spacing={{ base: 1, sm: 2 }} 
                          flexWrap="wrap" 
                          justify={{ base: "center", sm: "flex-start" }}
                        >
                          <Badge 
                            colorScheme="green" 
                            variant="subtle"
                            fontSize={{ base: "2xs", sm: "xs" }}
                            px={{ base: 1, sm: 2 }}
                            py={{ base: 0.5, sm: 1 }}
                          >
                            {editedRentSchedule.filter(rent => rent.status === 'PAID').length} Paid
                          </Badge>
                          <Badge 
                            colorScheme="yellow" 
                            variant="subtle"
                            fontSize={{ base: "2xs", sm: "xs" }}
                            px={{ base: 1, sm: 2 }}
                            py={{ base: 0.5, sm: 1 }}
                          >
                            {editedRentSchedule.filter(rent => rent.status === 'PENDING').length} Pending
                          </Badge>
                          <Badge 
                            colorScheme="red" 
                            variant="subtle"
                            fontSize={{ base: "2xs", sm: "xs" }}
                            px={{ base: 1, sm: 2 }}
                            py={{ base: 0.5, sm: 1 }}
                          >
                            {editedRentSchedule.filter(rent => rent.status === 'OVERDUE').length} Overdue
                          </Badge>
                        </HStack>
                      </VStack>

                      <Box 
                        maxH={{ base: "calc(100vh - 400px)", sm: "300px", md: "350px", lg: "400px" }} 
                        minH={{ base: "300px", sm: "250px" }}
                        overflowY="auto" 
                        border="1px" 
                        borderColor="gray.200" 
                        borderRadius="md"
                        bg="gray.50"
                        p={{ base: 1, sm: 2 }}
                      >
                        <SimpleGrid 
                          columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                          spacing={{ base: 1.5, sm: 2, md: 3, lg: 4 }}
                        >
                          {editedRentSchedule.map((rent, index) => (
                            <Box 
                              key={rent._id || index}
                              p={{ base: 1.5, sm: 2.5, md: 3, lg: 4 }} 
                              bg={rent.status === 'PAID' ? 'green.50' : 'white'} 
                              borderRadius="lg" 
                              border="1px" 
                              borderColor={
                                rent.status === 'PAID' ? 'green.200' :
                                rent.status === 'PENDING' ? 'yellow.200' :
                                rent.status === 'OVERDUE' ? 'red.200' : 'gray.200'
                              }
                              _hover={{ 
                                transform: 'translateY(-2px)', 
                                boxShadow: 'md',
                                transition: 'all 0.2s'
                              }}
                              minH={{ base: "120px", sm: "140px", md: "160px", lg: "180px" }}
                            >
                              <VStack spacing={{ base: 1.5, sm: 2, md: 3 }} align="stretch" h="full">
                                <HStack justify="space-between" align="center" flexWrap="wrap">
                                  <Text 
                                    fontSize={{ base: "2xs", sm: "xs", md: "sm" }} 
                                    fontWeight="semibold" 
                                    color="gray.700"
                                    noOfLines={1}
                                  >
                                    Month {rent.monthNumber}
                                  </Text>
                                  <Badge
                                    colorScheme={getRentStatusColor(rent.status)}
                                    variant="solid"
                                    size={{ base: "xs", sm: "sm" }}
                                    fontSize={{ base: "2xs", sm: "xs" }}
                                    px={{ base: 1, sm: 2 }}
                                    py={{ base: 0.5, sm: 1 }}
                                  >
                                    {rent.status}
                                  </Badge>
                                </HStack>

                                <Text 
                                  fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }} 
                                  fontWeight="bold" 
                                  color="blue.600"
                                  noOfLines={1}
                                >
                                  {formatCurrency(rent.amount)}
                                </Text>

                                <VStack spacing={1} align="start" flex="1">
                                  <Text 
                                    fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} 
                                    color="gray.600"
                                    noOfLines={1}
                                  >
                                    <strong>Due:</strong> {formatDate(rent.dueDate)}
                                  </Text>
                                  
                                  {rent.status === 'PAID' && rent.paidDate && (
                                    <Text 
                                      fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} 
                                      color="green.600"
                                      noOfLines={1}
                                    >
                                      <strong>Paid:</strong> {formatDate(rent.paidDate)}
                                    </Text>
                                  )}
                                  
                                  {rent.lateFees > 0 && (
                                    <Text 
                                      fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} 
                                      color="red.600"
                                      noOfLines={1}
                                    >
                                      <strong>Late Fees:</strong> {formatCurrency(rent.lateFees)}
                                    </Text>
                                  )}
                                </VStack>

                                <Button
                                  size={{ base: "xs", sm: "sm" }}
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => openRentEditModal(rent)}
                                  leftIcon={<FiEdit />}
                                  w="full"
                                  fontSize={{ base: "2xs", sm: "xs" }}
                                  h={{ base: "28px", sm: "32px" }}
                                >
                                  Edit
                                </Button>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Booking Details Tab */}
                <TabPanel p={0} pt={4}>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
                      <Text fontSize="lg" fontWeight="semibold" color="blue.700" mb={4}>
                        Basic Information
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold">Booking ID</Text>
                          <Text fontSize="md" fontWeight="bold" color="blue.700">{booking.bookingId}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold">Status</Text>
                          <Badge colorScheme={getStatusColor(booking.bookingStatus)} variant="solid">
                            {booking.bookingStatus}
                          </Badge>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold">Duration</Text>
                          <Text fontSize="md">{booking.duration} months</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold">Rent Due Date</Text>
                          <Text fontSize="md">{booking.rentDueDate}th of each month</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                      <Text fontSize="lg" fontWeight="semibold" color="green.700" mb={4}>
                        Financial Details
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="green.600" fontWeight="semibold">Monthly Rent</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.700">{formatCurrency(booking.monthlyRent)}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="green.600" fontWeight="semibold">Security Deposit</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.700">{formatCurrency(booking.securityDeposit)}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="green.600" fontWeight="semibold">Maintenance Charges</Text>
                          <Text fontSize="md">{formatCurrency(booking.maintenanceCharges)}/month</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="green.600" fontWeight="semibold">Advance Rent</Text>
                          <Text fontSize="md">{booking.advanceRent} months</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel p={0} pt={4}>
                  <VStack spacing={4} align="stretch">
                    {booking.documents && booking.documents.length > 0 ? (
                      <Box p={4} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                        <Text fontSize="lg" fontWeight="semibold" color="orange.700" mb={4}>
                          Uploaded Documents ({booking.documents.length} files)
                        </Text>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          {booking.documents.map((document, index) => (
                            <Box 
                              key={document._id || index}
                              p={4} 
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
                              <VStack spacing={3} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="lg" color="orange.600">
                                    {document.mimeType?.includes('pdf') ? '📄' : '📎'}
                                  </Text>
                                  <Badge colorScheme="orange" variant="subtle" size="sm">
                                    {document.documentType?.replace(/_/g, ' ')}
                                  </Badge>
                                </HStack>
                                
                                <Text fontSize="sm" fontWeight="semibold" color="gray.800" noOfLines={2}>
                                  {document.originalName}
                                </Text>
                                
                                <HStack spacing={2} justify="center">
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => openPdfViewer(document.documentUrl, document.originalName)}
                                    leftIcon={<FiEye />}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    variant="outline"
                                    onClick={() => downloadDocument(document.documentUrl, document.originalName)}
                                    leftIcon={<FiDownload />}
                                  >
                                    Download
                                  </Button>
                                </HStack>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    ) : (
                      <Box p={8} bg="white" borderRadius="lg" border="1px" borderColor="gray.100" shadow="sm" textAlign="center">
                        <Text fontSize="xl" color="gray.500" mb={2}>📎</Text>
                        <Text fontSize="md" fontWeight="semibold" color="gray.600">No Documents Uploaded</Text>
                        <Text fontSize="sm" color="gray.500">This rental booking doesn't have any supporting documents.</Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200" p={{ base: 4, md: 6 }}>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isSaving}
                loadingText="Saving..."
                leftIcon={<FiSave />}
                isDisabled={!hasChanges}
              >
                Save Changes
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rent Edit Modal */}
      <Modal isOpen={isRentModalOpen} onClose={closeRentEditModal} size={{ base: "sm", sm: "md", md: "lg" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 2, sm: 0 }}>
          <ModalHeader fontSize={{ base: "sm", sm: "md" }}>Edit Rent Payment - Month {selectedRent?.monthNumber}</ModalHeader>
          <ModalBody p={{ base: 3, sm: 4 }}>
            {selectedRent && (
              <VStack spacing={{ base: 3, sm: 4 }}>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", sm: "md" }}>Status</FormLabel>
                  <Select
                    value={selectedRent.status}
                    onChange={(e) => setSelectedRent({...selectedRent, status: e.target.value})}
                    size={{ base: "sm", sm: "md" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="LATE">Late</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: "sm", sm: "md" }}>Paid Date</FormLabel>
                  <Input
                    type="date"
                    value={selectedRent.paidDate ? new Date(selectedRent.paidDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedRent({...selectedRent, paidDate: e.target.value ? new Date(e.target.value) : null})}
                    size={{ base: "sm", sm: "md" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={{ base: "sm", sm: "md" }}>Late Fees</FormLabel>
                  <NumberInput
                    value={selectedRent.lateFees}
                    onChange={(value) => setSelectedRent({...selectedRent, lateFees: parseFloat(value) || 0})}
                    min={0}
                    size={{ base: "sm", sm: "md" }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter p={{ base: 3, sm: 4 }}>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={closeRentEditModal}
              size={{ base: "sm", sm: "md" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={saveRentChanges}
              size={{ base: "sm", sm: "md" }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal isOpen={isPdfViewerOpen} onClose={onPdfViewerClose} size={{ base: "full", sm: "4xl", md: "5xl", lg: "6xl" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          mx={{ base: 0, sm: 2, md: 4 }} 
          my={{ base: 0, sm: 4, md: 8 }}
          maxH={{ base: "100vh", sm: "95vh", md: "90vh" }} 
          maxW={{ base: "100vw", sm: "95vw", md: "90vw", lg: "85vw" }}
          borderRadius={{ base: "0", sm: "lg", md: "xl" }}
        >
          <ModalHeader 
            fontSize={{ base: "sm", sm: "md" }}
            pr={{ base: 8, sm: 10 }}
            noOfLines={1}
          >
            {pdfTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box h={{ base: "calc(100vh - 120px)", sm: "calc(95vh - 120px)", md: "calc(90vh - 120px)" }}>
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title={pdfTitle}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RentalBookingEditForm;
