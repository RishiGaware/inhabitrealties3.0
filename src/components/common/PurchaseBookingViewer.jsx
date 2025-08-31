import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';

const PurchaseBookingViewer = ({ 
  isOpen, 
  onClose, 
  bookingData
}) => {
  if (!isOpen || !bookingData) return null;

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
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'yellow';
      case 'REJECTED': return 'red';
      case 'COMPLETED': return 'blue';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadDocument = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "4xl" }} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="hidden">
        <ModalHeader position="relative" p={{ base: 4, md: 6 }} bg="gray.50" borderBottom="1px" borderColor="gray.200">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="gray.800">Purchase Booking Details</Text>
          <Button
            position="absolute"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            onClick={onClose}
            _hover={{ bg: 'red.50', color: 'red.600' }}
            color="gray.600"
          >
            ✕
          </Button>
        </ModalHeader>
        <ModalBody p={{ base: 3, md: 6 }} overflowY="auto" bg="gray.25">
          <VStack spacing={{ base: 3, md: 6 }} align="stretch">
            {/* Header Information */}
            <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  sm: "repeat(2, 1fr)", 
                  md: "repeat(3, 1fr)", 
                  lg: "repeat(4, 1fr)" 
                }} 
                gap={{ base: 3, md: 4 }}
              >
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Booking ID</Text>
                  <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="blue.700" noOfLines={1}>
                    {bookingData.bookingId || bookingData._id?.slice(-8) || 'N/A'}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Status</Text>
                  <Badge
                    colorScheme={getStatusColor(bookingData.bookingStatus)}
                    variant="solid"
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 2, sm: 3 }}
                    py={{ base: 1, sm: 1 }}
                    borderRadius="full"
                  >
                    {bookingData.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Created Date</Text>
                  <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="semibold" color="gray.700" noOfLines={1}>
                    {formatDate(bookingData.createdAt)}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Documents</Text>
                  <HStack spacing={2} align="center">
                    <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="semibold" color="gray.700">
                      {bookingData.documents?.length || 0}
                    </Text>
                    <Text fontSize={{ base: "xs", sm: "xs" }} color="blue.600">
                      {bookingData.documents?.length === 1 ? 'file' : 'files'}
                    </Text>
                  </HStack>
                </GridItem>
              </Grid>
            </Box>

            {/* Property & Customer Details */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="green.100" borderRadius="full">
                    <Text fontSize="lg" color="green.600">🏠</Text>
                  </Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="green.700">Property Details</Text>
                </HStack>
                <VStack spacing={{ base: 2, md: 2 }} align="start">
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="green.600" fontWeight="medium" mb={1}>Name</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={2}>{bookingData.propertyId?.name || 'N/A'}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="green.600" fontWeight="medium" mb={1}>Price</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="green.600">{formatCurrency(bookingData.propertyId?.price)}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="green.600" fontWeight="medium" mb={1}>Description</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" noOfLines={3}>{bookingData.propertyId?.description || 'No description'}</Text>
                  </Box>
                </VStack>
              </Box>

              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="purple.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="purple.100" borderRadius="full">
                    <Text fontSize="lg" color="purple.600">👤</Text>
                  </Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="purple.700">Customer Details</Text>
                </HStack>
                <VStack spacing={{ base: 2, md: 2 }} align="start">
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Name</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>
                      {bookingData.customerId ? `${bookingData.customerId.firstName || ''} ${bookingData.customerId.lastName || ''}`.trim() : 'N/A'}
                    </Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Email</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>{bookingData.customerId?.email || 'N/A'}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Phone</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" noOfLines={1}>{bookingData.customerId?.phoneNumber || 'N/A'}</Text>
                  </Box>
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Financial Details - Only show if data exists */}
            {(bookingData.totalPropertyValue || bookingData.downPayment || bookingData.loanAmount) && (
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="teal.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="teal.100" borderRadius="full">
                    <Text fontSize="lg" color="teal.600">💰</Text>
                  </Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="teal.700">Financial Details</Text>
                </HStack>
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(3, 1fr)" 
                  }} 
                  gap={{ base: 3, md: 4 }}
                >
                  {bookingData.totalPropertyValue && (
                    <GridItem>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="teal.600" fontWeight="semibold">Total Property Value</Text>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.totalPropertyValue)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.downPayment && (
                    <GridItem>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="teal.600" fontWeight="semibold">Down Payment</Text>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.downPayment)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.loanAmount && (
                    <GridItem>
                      <Text fontSize={{ base: "xs", sm: "sm" }} color="teal.600" fontWeight="semibold">Loan Amount</Text>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.loanAmount)}
                      </Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>
            )}

            {/* Payment Terms */}
            <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="indigo.100" shadow="sm">
              <HStack mb={3} align="center">
                <Box p={2} bg="indigo.100" borderRadius="full">
                  <Text fontSize="lg" color="indigo.600">📝</Text>
                </Box>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="indigo.700">Payment Terms</Text>
              </HStack>
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  md: "repeat(2, 1fr)" 
                }} 
                gap={{ base: 3, md: 4 }}
              >
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="indigo.600" fontWeight="semibold">Payment Terms</Text>
                  <Badge 
                    colorScheme="indigo" 
                    variant="solid" 
                    fontSize={{ base: "xs", sm: "sm", md: "md" }} 
                    px={{ base: 2, sm: 3 }} 
                    py={{ base: 1, sm: 1 }}
                    borderRadius="full"
                  >
                    {bookingData.paymentTerms || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="indigo.600" fontWeight="semibold">Number of Installments</Text>
                  <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="semibold">
                    {bookingData.installmentCount || '0'}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Financing Details */}
            {bookingData.isFinanced && (
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="pink.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="pink.100" borderRadius="full">
                    <Text fontSize="lg" color="pink.600">🏦</Text>
                  </Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="pink.700">Financing Details</Text>
                </HStack>
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)" 
                  }} 
                  gap={{ base: 3, md: 4 }}
                >
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="pink.600" fontWeight="semibold">Bank Name</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} noOfLines={1}>{bookingData.bankName || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="pink.600" fontWeight="semibold">Loan Tenure</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} noOfLines={1}>
                      {bookingData.loanTenure ? `${bookingData.loanTenure} months` : 'N/A'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="pink.600" fontWeight="semibold">Interest Rate</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} noOfLines={1}>
                      {bookingData.interestRate ? `${bookingData.interestRate}%` : 'N/A'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="pink.600" fontWeight="semibold">EMI Amount</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" noOfLines={1}>
                      {formatCurrency(bookingData.emiAmount)}
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            {/* Installment Schedule */}
            {bookingData.installmentSchedule && bookingData.installmentSchedule.length > 0 && (
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="yellow.100" shadow="sm">
                <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <HStack align="center">
                      <Box p={2} bg="yellow.100" borderRadius="full">
                        <Text fontSize="lg" color="yellow.600">📅</Text>
                      </Box>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="yellow.700">
                        Installment Schedule ({bookingData.installmentSchedule.length} installments)
                      </Text>
                    </HStack>
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge colorScheme="green" variant="subtle" fontSize={{ base: "xs", sm: "sm" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PAID').length} Paid
                      </Badge>
                      <Badge colorScheme="yellow" variant="subtle" fontSize={{ base: "xs", sm: "sm" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PENDING').length} Pending
                      </Badge>
                      <Badge colorScheme="red" variant="subtle" fontSize={{ base: "xs", sm: "sm" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'OVERDUE').length} Overdue
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="yellow.700" textAlign="center" fontWeight="medium">
                    Amount per installment: {formatCurrency(bookingData.installmentSchedule[0]?.amount)}
                  </Text>
                  
                  <Box 
                    maxH={{ base: "250px", sm: "300px", md: "400px" }} 
                    overflowY="auto" 
                    border="1px" 
                    borderColor="yellow.200" 
                    borderRadius="md"
                    bg="gray.25"
                  >
                    <SimpleGrid 
                      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                      spacing={{ base: 2, sm: 3 }} 
                      p={{ base: 2, sm: 3 }}
                    >
                      {bookingData.installmentSchedule.map((installment, index) => (
                        <Box 
                          key={installment._id || index} 
                          p={{ base: 2, sm: 3 }} 
                          bg={installment.status === 'PAID' ? 'green.50' : 'white'} 
                          borderRadius="lg" 
                          border="1px" 
                          borderColor={
                            installment.status === 'PAID' ? 'green.200' :
                            installment.status === 'PENDING' ? 'yellow.200' :
                            installment.status === 'OVERDUE' ? 'red.200' : 'gray.200'
                          }
                          _hover={{ 
                            transform: 'translateY(-2px)', 
                            boxShadow: 'md',
                            transition: 'all 0.2s'
                          }}
                        >
                          <VStack spacing={{ base: 1, sm: 2 }} align="start">
                            <HStack justify="space-between" w="full">
                              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" fontWeight="medium">
                                Installment {installment.installmentNumber}
                              </Text>
                              <Badge
                                colorScheme={
                                  installment.status === 'PAID' ? 'green' :
                                  installment.status === 'PENDING' ? 'yellow' :
                                  installment.status === 'OVERDUE' ? 'red' : 'gray'
                                }
                                variant="solid"
                                size={{ base: "xs", sm: "sm" }}
                                borderRadius="full"
                              >
                                {installment.status}
                              </Badge>
                            </HStack>
                            
                            <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold" color="blue.600">
                              {formatCurrency(installment.amount)}
                            </Text>
                            
                            <VStack spacing={{ base: 0.5, sm: 1 }} align="start" w="full">
                              <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                <strong>Due:</strong> {formatDate(installment.dueDate)}
                              </Text>
                              
                              {installment.status === 'PAID' && installment.paidDate && (
                                <Text fontSize={{ base: "xs", sm: "xs" }} color="green.600">
                                  <strong>Paid:</strong> {formatDate(installment.paidDate)}
                                </Text>
                              )}
                              
                              {installment.lateFees > 0 && (
                                <Text fontSize={{ base: "xs", sm: "xs" }} color="red.600">
                                  <strong>Late Fees:</strong> {formatCurrency(installment.lateFees)}
                                </Text>
                              )}
                              
                              {installment.paymentId && (
                                <Text fontSize={{ base: "xs", sm: "xs" }} color="blue.600">
                                  <strong>Payment ID:</strong> {installment.paymentId.slice(-8)}
                                </Text>
                              )}
                            </VStack>
                            
                            {installment.responsiblePersonId && (
                              <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.500">
                                <strong>Responsible:</strong> {installment.responsiblePersonId.firstName || 'N/A'}
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </Box>
            )}

            {/* Documents Section */}
            {bookingData.documents && bookingData.documents.length > 0 ? (
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <HStack align="center">
                      <Box p={2} bg="orange.100" borderRadius="full">
                        <Text fontSize="lg" color="orange.600">📎</Text>
                      </Box>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="orange.700">
                        Uploaded Documents ({bookingData.documents.length} files)
                      </Text>
                    </HStack>
                    <Badge colorScheme="orange" variant="subtle" fontSize={{ base: "xs", sm: "sm" }} borderRadius="full">
                      {bookingData.documents.length} Document{bookingData.documents.length !== 1 ? 's' : ''}
                    </Badge>
                  </HStack>
                  
                  <Box 
                    maxH={{ base: "250px", sm: "300px", md: "400px" }} 
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
                      {bookingData.documents.map((document, index) => (
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
                                <Text fontSize="lg" color="orange.600">
                                  {document.mimeType?.includes('pdf') ? '📄' : 
                                   document.mimeType?.includes('doc') ? '📝' : 
                                   document.mimeType?.includes('image') ? '🖼️' : '📎'}
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
                              <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="semibold" color="gray.800" noOfLines={2}>
                                {document.originalName}
                              </Text>
                              
                              {/* File Size */}
                              <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                <strong>Size:</strong> {formatFileSize(document.fileSize)}
                              </Text>
                              
                              {/* Upload Date */}
                              {document.uploadedAt && (
                                <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                  <strong>Uploaded:</strong> {formatDate(document.uploadedAt)}
                                </Text>
                              )}
                              
                              {/* MIME Type */}
                              <Text fontSize={{ base: "xs", sm: "xs" }} color="gray.600">
                                <strong>Type:</strong> {document.mimeType?.toUpperCase() || 'N/A'}
                              </Text>
                            </VStack>
                            
                            {/* Action Buttons */}
                            <HStack spacing={{ base: 1, sm: 2 }} justify="center">
                              <Button
                                size={{ base: "xs", sm: "sm" }}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => window.open(document.documentUrl, '_blank')}
                                leftIcon={<FiEye />}
                                _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                              >
                                View
                              </Button>
                              <Button
                                size={{ base: "xs", sm: "sm" }}
                                colorScheme="green"
                                variant="outline"
                                onClick={() => downloadDocument(document.documentUrl, document.originalName)}
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
              </Box>
            ) : (
              <Box p={{ base: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="gray.100" shadow="sm">
                <VStack spacing={{ base: 2, sm: 3 }} align="center">
                  <Box p={3} bg="gray.100" borderRadius="full">
                    <Text fontSize={{ base: "xl", sm: "2xl" }} color="gray.500">📎</Text>
                  </Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.600">
                    No Documents Uploaded
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500" textAlign="center">
                    This purchase booking doesn't have any supporting documents uploaded yet.
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default PurchaseBookingViewer; 