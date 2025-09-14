import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  SimpleGrid,
  Grid,
  GridItem,
  Divider,
  IconButton,
  useToast,
  Image,
  Link,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { FiX, FiDownload, FiEye, FiFile, FiImage, FiFileText } from 'react-icons/fi';

const PaymentViewerModal = ({ isOpen, onClose, payment }) => {
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  if (!payment) return null;

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'FAILED': return 'red';
      case 'REFUNDED': return 'purple';
      default: return 'gray';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'INSTALLMENT': return 'blue';
      case 'DOWN_PAYMENT': return 'green';
      case 'FULL_PAYMENT': return 'purple';
      case 'LATE_FEE': return 'red';
      default: return 'gray';
    }
  };

  const handleFileDownload = async (file) => {
    try {
      setIsLoadingFile(true);
      // Simulate file download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Download Started",
        description: `Downloading ${file.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch {
      toast({
        title: "Download Failed",
        description: "Failed to download file",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Removed file preview logic tied to dummy attachments

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FiFileText />;
    if (fileType.includes('image')) return <FiImage />;
    return <FiFile />;
  };

  const getFileTypeColor = (fileType) => {
    if (fileType.includes('pdf')) return 'red';
    if (fileType.includes('image')) return 'green';
    return 'blue';
  };

  // Removed dummy attachment placeholders

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl", md: "4xl", lg: "6xl" }} isCentered>
        <ModalOverlay />
        <ModalContent 
          maxW={{ base: "100vw", sm: "95vw", md: "90vw", lg: "90vw" }} 
          maxH={{ base: "100vh", sm: "95vh", md: "90vh", lg: "90vh" }} 
          overflow="hidden"
          mx={{ base: 0, sm: 2, md: 4 }}
          my={{ base: 0, sm: 2, md: 4 }}
          borderRadius={{ base: 0, sm: "lg" }}
        >
          <ModalHeader 
            bg="white" 
            borderBottom="1px solid" 
            borderColor="gray.200" 
            position="relative" 
            pr={{ base: "10", sm: "12" }}
            py={{ base: 3, sm: 4, md: 5 }}
          >
            <Flex align="center" gap={{ base: 2, sm: 3 }} direction={{ base: "column", sm: "row" }}>
              <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" color="gray.800" textAlign={{ base: "center", sm: "left" }}>
                Payment Details
              </Text>
              <Badge colorScheme={getStatusColor(payment.paymentStatus)} variant="solid" fontSize={{ base: "xs", sm: "sm" }}>
                {payment.paymentStatus?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </Flex>
            <IconButton
              aria-label="Close modal"
              icon={<FiX />}
              size={{ base: "sm", sm: "sm" }}
              variant="ghost"
              position="absolute"
              right={{ base: "2", sm: "4" }}
              top="50%"
              transform="translateY(-50%)"
              onClick={onClose}
              _hover={{ bg: "gray.100" }}
            />
          </ModalHeader>

          <ModalBody flex="1" overflowY="auto" px={{ base: 3, sm: 4, md: 6 }} py={{ base: 3, sm: 4, md: 6 }} minH={0}>
            <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="stretch">
              {/* Payment Summary */}
              <Box p={{ base: 3, sm: 4 }} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                <Heading size={{ base: "sm", sm: "md" }} mb={{ base: 3, sm: 4 }} color="gray.800">Payment Summary</Heading>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={{ base: 3, sm: 4 }}>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Receipt / Txn</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="bold" color="gray.800">
                      {payment.receiptNumber || payment.transactionNumber || payment._id?.slice(-8) || 'N/A'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Total Amount</Text>
                    <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold" color="blue.600">
                      {formatCurrency(payment.totalAmount ?? payment.amount)}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Payment Type</Text>
                    <Badge colorScheme={getPaymentTypeColor(payment.paymentType)} variant="subtle" fontSize={{ base: "xs", sm: "sm" }}>
                      {payment.paymentType?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Payment Method</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">{payment.paymentMode || payment.paymentMethod || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Paid Date</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">{formatDate(payment.paidDate)}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Due Date</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">{formatDate(payment.dueDate)}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Status</Text>
                    <Badge colorScheme={getStatusColor(payment.paymentStatus)} variant="solid" fontSize={{ base: "xs", sm: "sm" }}>
                      {payment.paymentStatus?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  </GridItem>
                  {!!payment.taxAmount && (
                    <GridItem>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Tax</Text>
                      <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">{formatCurrency(payment.taxAmount)}</Text>
                    </GridItem>
                  )}
                  {!!payment.currency && (
                    <GridItem>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Currency</Text>
                      <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">{payment.currency}</Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>

              {/* Customer & Property Details from bookingDetails if present */}
              {payment.bookingDetails && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, sm: 5, md: 6 }}>
                  <Box p={{ base: 3, sm: 4 }} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                    <Heading size={{ base: "sm", sm: "md" }} mb={{ base: 3, sm: 4 }} color="gray.800">Customer Details</Heading>
                    <VStack spacing={{ base: 2, sm: 3 }} align="start">
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Name</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.customerId ? `${payment.bookingDetails.customerId.firstName || ''} ${payment.bookingDetails.customerId.lastName || ''}`.trim() : 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Email</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.customerId?.email || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Phone</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.customerId?.phoneNumber || 'N/A'}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>

                  <Box p={{ base: 3, sm: 4 }} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                    <Heading size={{ base: "sm", sm: "md" }} mb={{ base: 3, sm: 4 }} color="gray.800">Property Details</Heading>
                    <VStack spacing={{ base: 2, sm: 3 }} align="start">
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Name</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.propertyId?.name || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Address</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.propertyId?.propertyAddress ? `${payment.bookingDetails.propertyId.propertyAddress.street || ''}, ${payment.bookingDetails.propertyId.propertyAddress.city || ''}, ${payment.bookingDetails.propertyId.propertyAddress.state || ''}` : 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Type</Text>
                        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                          {payment.bookingDetails.propertyId?.type || 'N/A'}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </SimpleGrid>
              )}

              {/* People */}
              <Box p={{ base: 3, sm: 4 }} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                <Heading size={{ base: "sm", sm: "md" }} mb={{ base: 3, sm: 4 }} color="gray.800">People</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, sm: 6 }}>
                  <Box>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Responsible Person</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                      {payment.responsiblePersonId ? `${payment.responsiblePersonId.firstName || ''} ${payment.responsiblePersonId.lastName || ''}`.trim() : 'N/A'}
                    </Text>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600">{payment.responsiblePersonId?.email || ''}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="semibold">Recorded By</Text>
                    <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
                      {payment.recordedByUserId ? `${payment.recordedByUserId.firstName || ''} ${payment.recordedByUserId.lastName || ''}`.trim() : 'N/A'}
                    </Text>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600">{payment.recordedByUserId?.email || ''}</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Removed dummy Payment Proof Files and Initial Documents sections to reflect actual API-driven UI */}
            </VStack>
          </ModalBody>

          <ModalFooter bg="white" borderTop="1px solid" borderColor="gray.200" px={{ base: 3, sm: 4, md: 6 }} py={{ base: 3, sm: 4 }}>
            <Button variant="ghost" onClick={onClose} size={{ base: "sm", sm: "md" }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* File Viewer Modal */}
      {selectedFile && (
        <Modal isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} size={{ base: "full", sm: "xl", md: "3xl", lg: "4xl" }} isCentered>
          <ModalOverlay />
          <ModalContent 
            maxW={{ base: "100vw", sm: "95vw", md: "80vw" }} 
            maxH={{ base: "100vh", sm: "95vh", md: "80vh" }} 
            overflow="hidden"
            mx={{ base: 0, sm: 2, md: 4 }}
            my={{ base: 0, sm: 2, md: 4 }}
            borderRadius={{ base: 0, sm: "lg" }}
          >
            <ModalHeader 
              bg="white" 
              borderBottom="1px solid" 
              borderColor="gray.200" 
              position="relative" 
              pr={{ base: "10", sm: "12" }}
              py={{ base: 3, sm: 4 }}
            >
              <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold" color="gray.800">
                {selectedFile.name}
              </Text>
              <IconButton
                aria-label="Close modal"
                icon={<FiX />}
                size={{ base: "sm", sm: "sm" }}
                variant="ghost"
                position="absolute"
                right={{ base: "2", sm: "4" }}
                top="50%"
                transform="translateY(-50%)"
                onClick={() => setSelectedFile(null)}
                _hover={{ bg: "gray.100" }}
              />
            </ModalHeader>
            <ModalBody flex="1" overflowY="auto" px={{ base: 3, sm: 4, md: 6 }} py={{ base: 3, sm: 4, md: 6 }} minH={0}>
              <Box textAlign="center" py={{ base: 4, sm: 6, md: 8 }}>
                <Box
                  p={{ base: 4, sm: 6, md: 8 }}
                  bg="gray.100"
                  borderRadius="lg"
                  display="inline-block"
                  mb={{ base: 3, sm: 4 }}
                >
                  <Box
                    p={{ base: 2, sm: 3, md: 4 }}
                    bg={`${getFileTypeColor(selectedFile.type)}.100`}
                    borderRadius="full"
                    color={`${getFileTypeColor(selectedFile.type)}.600`}
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                    display="inline-block"
                  >
                    {getFileIcon(selectedFile.type)}
                  </Box>
                </Box>
                <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="semibold" color="gray.800" mb={2}>
                  {selectedFile.name}
                </Text>
                <Text fontSize={{ base: "sm", sm: "md" }} color="gray.600" mb={{ base: 3, sm: 4 }}>
                  {selectedFile.size} • {formatDate(selectedFile.uploadedAt)}
                </Text>
                <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                  File preview not available. Please download to view.
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter bg="white" borderTop="1px solid" borderColor="gray.200" px={{ base: 3, sm: 4, md: 6 }} py={{ base: 3, sm: 4 }}>
              <Button
                leftIcon={isLoadingFile ? <Spinner size="sm" /> : <FiDownload />}
                colorScheme="green"
                onClick={() => handleFileDownload(selectedFile)}
                isLoading={isLoadingFile}
                mr={{ base: 2, sm: 3 }}
                size={{ base: "sm", sm: "md" }}
              >
                Download
              </Button>
              <Button variant="ghost" onClick={() => setSelectedFile(null)} size={{ base: "sm", sm: "md" }}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PaymentViewerModal;
