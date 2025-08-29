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
import { FiEdit } from 'react-icons/fi';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "4xl" }} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent mx={{ base: 2, sm: 0 }} maxH={{ base: "100vh", sm: "90vh" }} overflow="hidden">
        <ModalHeader position="relative">
          <Text>Purchase Booking Details</Text>
          <Button
            position="absolute"
            top={2}
            right={2}
            variant="ghost"
            size="sm"
            onClick={onClose}
            _hover={{ bg: 'gray.100' }}
          >
            ✕
          </Button>
        </ModalHeader>
        <ModalBody p={{ base: 4, md: 6 }} overflowY="auto">
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Header Information */}
            <Box p={{ base: 3, md: 4 }} bg="blue.50" borderRadius="md">
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Booking ID</Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.700">
                    {bookingData.bookingId || bookingData._id?.slice(-8) || 'N/A'}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Status</Text>
                  <Badge
                    colorScheme={getStatusColor(bookingData.bookingStatus)}
                    variant="solid"
                    fontSize="md"
                    px={3}
                    py={1}
                  >
                    {bookingData.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">Created Date</Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {formatDate(bookingData.createdAt)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Property & Customer Details */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
              <Box p={{ base: 3, md: 4 }} bg="green.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="green.700" mb={3}>Property Details</Text>
                <VStack spacing={2} align="start">
                  <Text><strong>Name:</strong> {bookingData.propertyId?.name || 'N/A'}</Text>
                  <Text><strong>Price:</strong> {formatCurrency(bookingData.propertyId?.price)}</Text>
                  <Text><strong>Description:</strong> {bookingData.propertyId?.description || 'No description'}</Text>
                </VStack>
              </Box>

              <Box p={{ base: 3, md: 4 }} bg="purple.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="purple.700" mb={3}>Customer Details</Text>
                <VStack spacing={2} align="start">
                  <Text><strong>Name:</strong> {bookingData.customerId ? `${bookingData.customerId.firstName || ''} ${bookingData.customerId.lastName || ''}`.trim() : 'N/A'}</Text>
                  <Text><strong>Email:</strong> {bookingData.customerId?.email || 'N/A'}</Text>
                  <Text><strong>Phone:</strong> {bookingData.customerId?.phoneNumber || 'N/A'}</Text>
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Financial Details - Only show if data exists */}
            {(bookingData.totalPropertyValue || bookingData.downPayment || bookingData.loanAmount) && (
              <Box p={{ base: 3, md: 4 }} bg="teal.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="teal.700" mb={3}>Financial Details</Text>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: 3, md: 4 }}>
                  {bookingData.totalPropertyValue && (
                    <GridItem>
                      <Text fontSize="sm" color="teal.600" fontWeight="semibold">Total Property Value</Text>
                      <Text fontSize="lg" fontWeight="bold" color="teal.700">
                        {formatCurrency(bookingData.totalPropertyValue)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.downPayment && (
                    <GridItem>
                      <Text fontSize="sm" color="teal.600" fontWeight="semibold">Down Payment</Text>
                      <Text fontSize="lg" fontWeight="bold" color="teal.700">
                        {formatCurrency(bookingData.downPayment)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.loanAmount && (
                    <GridItem>
                      <Text fontSize="sm" color="teal.600" fontWeight="semibold">Loan Amount</Text>
                      <Text fontSize="lg" fontWeight="bold" color="teal.700">
                        {formatCurrency(bookingData.loanAmount)}
                      </Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>
            )}

            {/* Payment Terms */}
            <Box p={{ base: 3, md: 4 }} bg="indigo.50" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold" color="indigo.700" mb={3}>Payment Terms</Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, md: 4 }}>
                <GridItem>
                  <Text fontSize="sm" color="indigo.600" fontWeight="semibold">Payment Terms</Text>
                  <Badge colorScheme="indigo" variant="solid" fontSize="md" px={3} py={1}>
                    {bookingData.paymentTerms || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="indigo.600" fontWeight="semibold">Number of Installments</Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {bookingData.installmentCount || '0'}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Financing Details */}
            {bookingData.isFinanced && (
              <Box p={{ base: 3, md: 4 }} bg="pink.50" borderRadius="md">
                <Text fontSize="md" fontWeight="semibold" color="pink.700" mb={3}>Financing Details</Text>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, md: 4 }}>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Bank Name</Text>
                    <Text fontSize="md">{bookingData.bankName || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Loan Tenure</Text>
                    <Text fontSize="md">{bookingData.loanTenure ? `${bookingData.loanTenure} months` : 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">Interest Rate</Text>
                    <Text fontSize="md">{bookingData.interestRate ? `${bookingData.interestRate}%` : 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" color="pink.600" fontWeight="semibold">EMI Amount</Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatCurrency(bookingData.emiAmount)}
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            {/* Installment Schedule */}
            {bookingData.installmentSchedule && bookingData.installmentSchedule.length > 0 && (
              <Box p={{ base: 3, md: 4 }} bg="yellow.50" borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="semibold" color="yellow.700">
                      📅 Installment Schedule ({bookingData.installmentSchedule.length} installments)
                    </Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="green" variant="subtle">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PAID').length} Paid
                      </Badge>
                      <Badge colorScheme="yellow" variant="subtle">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PENDING').length} Pending
                      </Badge>
                      <Badge colorScheme="red" variant="subtle">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'OVERDUE').length} Overdue
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize="sm" color="yellow.700" textAlign="center">
                    Amount per installment: {formatCurrency(bookingData.installmentSchedule[0]?.amount)}
                  </Text>
                  
                  <Box 
                    maxH={{ base: "300px", md: "400px" }} 
                    overflowY="auto" 
                    border="1px" 
                    borderColor="yellow.200" 
                    borderRadius="md"
                    bg="white"
                  >
                    <SimpleGrid 
                      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                      spacing={3} 
                      p={3}
                    >
                      {bookingData.installmentSchedule.map((installment, index) => (
                        <Box 
                          key={installment._id || index} 
                          p={3} 
                          bg={installment.status === 'PAID' ? 'green.50' : 'white'} 
                          borderRadius="md" 
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
                          <VStack spacing={2} align="start">
                            <HStack justify="space-between" w="full">
                              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                Installment {installment.installmentNumber}
                              </Text>
                              <Badge
                                colorScheme={
                                  installment.status === 'PAID' ? 'green' :
                                  installment.status === 'PENDING' ? 'yellow' :
                                  installment.status === 'OVERDUE' ? 'red' : 'gray'
                                }
                                variant="subtle"
                                size="sm"
                              >
                                {installment.status}
                              </Badge>
                            </HStack>
                            
                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                              {formatCurrency(installment.amount)}
                            </Text>
                            
                            <VStack spacing={1} align="start" w="full">
                              <Text fontSize="xs" color="gray.600">
                                <strong>Due:</strong> {formatDate(installment.dueDate)}
                              </Text>
                              
                              {installment.status === 'PAID' && installment.paidDate && (
                                <Text fontSize="xs" color="green.600">
                                  <strong>Paid:</strong> {formatDate(installment.paidDate)}
                                </Text>
                              )}
                              
                              {installment.lateFees > 0 && (
                                <Text fontSize="xs" color="red.600">
                                  <strong>Late Fees:</strong> {formatCurrency(installment.lateFees)}
                                </Text>
                              )}
                              
                              {installment.paymentId && (
                                <Text fontSize="xs" color="blue.600">
                                  <strong>Payment ID:</strong> {installment.paymentId.slice(-8)}
                                </Text>
                              )}
                            </VStack>
                            
                            {installment.responsiblePersonId && (
                              <Text fontSize="xs" color="gray.500">
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
          </VStack>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default PurchaseBookingViewer; 