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
  useDisclosure,
} from '@chakra-ui/react';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';
import PropertyPreview from '../../pages/property/propertyMaster/PropertyPreview';

const PurchaseBookingViewer = ({ 
  isOpen, 
  onClose, 
  bookingData,
  hideCustomerDetails = false,
}) => {
  const { isOpen: isPropertyPreviewOpen, onOpen: onPropertyPreviewOpen, onClose: onPropertyPreviewClose } = useDisclosure();
  
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

  const downloadDocument = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "4xl", md: "5xl", lg: "6xl" }} isCentered>
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
        >
          <Text 
            fontSize={{ base: "md", sm: "lg", md: "xl", lg: "2xl" }} 
            fontWeight="bold" 
            color="gray.800"
          >
            Purchase Booking Details
          </Text>
          <Button
            position="absolute"
            top={{ base: 2, sm: 3, md: 4 }}
            right={{ base: 2, sm: 3, md: 4 }}
            variant="ghost"
            size={{ base: "xs", sm: "sm", md: "md" }}
            onClick={onClose}
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
          onWheel={(e) => {
            // If PropertyPreview is open, prevent parent modal from scrolling
            if (isPropertyPreviewOpen) {
              e.stopPropagation();
            }
          }}
          onTouchMove={(e) => {
            // If PropertyPreview is open, prevent parent modal from scrolling
            if (isPropertyPreviewOpen) {
              e.stopPropagation();
            }
          }}
          maxH={{ base: "calc(100vh - 120px)", sm: "calc(95vh - 120px)", md: "calc(90vh - 120px)" }}
        >
          <VStack spacing={{ base: 3, md: 6 }} align="stretch">
            {/* Header Information */}
            <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  sm: "repeat(2, 1fr)", 
                  md: "repeat(3, 1fr)", 
                  lg: "repeat(4, 1fr)" 
                }} 
                gap={{ base: 2, sm: 3, md: 4 }}
              >
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Booking ID</Text>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="blue.700" noOfLines={1}>
                    {bookingData.bookingId || bookingData._id?.slice(-8) || 'N/A'}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Status</Text>
                  <Badge
                    colorScheme={getStatusColor(bookingData.bookingStatus)}
                    variant="solid"
                    fontSize={{ base: "3xs", sm: "2xs", md: "xs", lg: "sm" }}
                    px={{ base: 1, sm: 2, md: 3 }}
                    py={{ base: 0.5, sm: 1 }}
                    borderRadius="full"
                  >
                    {bookingData.bookingStatus?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Created Date</Text>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="gray.700" noOfLines={1}>
                    {formatDate(bookingData.createdAt)}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="semibold" mb={1}>Documents</Text>
                  <HStack spacing={2} align="center">
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="gray.700">
                      {bookingData.documents?.length || 0}
                    </Text>
                    <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="blue.600">
                      {bookingData.documents?.length === 1 ? 'file' : 'files'}
                    </Text>
                  </HStack>
                </GridItem>
              </Grid>
            </Box>

            {/* Property Booking Form Details */}
            {(bookingData.developer || bookingData.channelPartnerName || bookingData.projectName || bookingData.location || bookingData.tcfNumber) && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="blue.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="blue.100" borderRadius="full">
                    <Text fontSize={{ base: "md", sm: "lg" }} color="blue.600">📋</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="blue.700">Property Booking Form</Text>
                </HStack>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 2, sm: 3, md: 4 }}>
                  {bookingData.developer && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="medium" mb={1}>Developer</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.developer}</Text>
                    </GridItem>
                  )}
                  {bookingData.channelPartnerName && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="medium" mb={1}>Channel Partner Name</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.channelPartnerName}</Text>
                    </GridItem>
                  )}
                  {bookingData.projectName && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="medium" mb={1}>Project Name</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.projectName}</Text>
                    </GridItem>
                  )}
                  {bookingData.location && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="medium" mb={1}>Location</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.location}</Text>
                    </GridItem>
                  )}
                  {bookingData.tcfNumber && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="blue.600" fontWeight="medium" mb={1}>TCF Number</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.tcfNumber}</Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>
            )}

            {/* Property & Customer Details */}
            <SimpleGrid columns={{ base: 1, md: hideCustomerDetails ? 1 : 2 }} spacing={{ base: 2, sm: 3, md: 4 }}>
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                <HStack mb={3} align="center" justify="space-between">
                  <HStack>
                    <Box p={2} bg="green.100" borderRadius="full">
                      <Text fontSize={{ base: "md", sm: "lg" }} color="green.600">🏠</Text>
                    </Box>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="green.700">Property Details</Text>
                  </HStack>
                  {bookingData.propertyId && (
                    <Button
                      leftIcon={<FiEye />}
                      size={{ base: "xs", sm: "sm" }}
                      colorScheme="green"
                      variant="outline"
                      onClick={onPropertyPreviewOpen}
                      _hover={{ bg: "green.100" }}
                      fontSize={{ base: "xs", sm: "sm" }}
                    >
                      View Property
                    </Button>
                  )}
                </HStack>
                <VStack spacing={{ base: 2, md: 2 }} align="start">
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Name</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color="gray.800" noOfLines={2}>{bookingData.propertyId?.name || 'N/A'}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Price</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="green.600">{formatCurrency(bookingData.propertyId?.price)}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Description</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color="gray.700" noOfLines={3}>{bookingData.propertyId?.description || 'No description'}</Text>
                  </Box>
                </VStack>
              </Box>

              {!hideCustomerDetails && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="purple.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="purple.100" borderRadius="full">
                    <Text fontSize={{ base: "md", sm: "lg" }} color="purple.600">👤</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="purple.700">Customer Details</Text>
                </HStack>
                <VStack spacing={{ base: 2, md: 2 }} align="start">
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Name</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color="gray.800" noOfLines={1}>
                      {bookingData.customerId ? `${bookingData.customerId.firstName || ''} ${bookingData.customerId.lastName || ''}`.trim() : 'N/A'}
                    </Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Email</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color="gray.800" noOfLines={1}>{bookingData.customerId?.email || 'N/A'}</Text>
                  </Box>
                  <Box w="full">
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="purple.600" fontWeight="medium" mb={1}>Phone</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color="gray.800" noOfLines={1}>{bookingData.customerId?.phoneNumber || 'N/A'}</Text>
                  </Box>
                </VStack>
              </Box>
              )}
            </SimpleGrid>

            {/* Buyer Details Section */}
            {(bookingData.buyerFullName || bookingData.buyerAddress || bookingData.buyerCityPin || bookingData.buyerMobileNo || bookingData.buyerEmailId || bookingData.buyerAadharNo || bookingData.buyerPanNo) && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="green.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="green.100" borderRadius="full">
                    <Text fontSize={{ base: "md", sm: "lg" }} color="green.600">🧾</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="green.700">Buyer Details</Text>
                </HStack>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 2, sm: 3, md: 4 }}>
                  {bookingData.buyerFullName && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Full Name</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerFullName}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerAddress && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Address</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerAddress}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerCityPin && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>City / PIN</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerCityPin}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerMobileNo && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Mobile No.</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerMobileNo}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerEmailId && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Email ID</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerEmailId}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerAadharNo && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>Aadhar No.</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerAadharNo}</Text>
                    </GridItem>
                  )}
                  {bookingData.buyerPanNo && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="green.600" fontWeight="medium" mb={1}>PAN No.</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.buyerPanNo}</Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>
            )}

            {/* Property Details - Merged Building/Apartment and Additional Details */}
            {/* Always show this section if bookingData exists */}
            {bookingData && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                <HStack mb={3} align="center" justify="space-between">
                  <HStack>
                    <Box p={2} bg="orange.100" borderRadius="full">
                      <Text fontSize={{ base: "md", sm: "lg" }} color="orange.600">🏢</Text>
                    </Box>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="orange.700">Property Details</Text>
                  </HStack>
                  {bookingData.propertyId && (
                    <Button
                      leftIcon={<FiEye />}
                      size={{ base: "xs", sm: "sm" }}
                      colorScheme="blue"
                      variant="outline"
                      onClick={onPropertyPreviewOpen}
                      _hover={{ bg: "blue.50" }}
                      fontSize={{ base: "xs", sm: "sm" }}
                    >
                      View Property
                    </Button>
                  )}
                </HStack>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 2, sm: 3, md: 4 }}>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Flat / Plot No.</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.flatNo || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Tower / Wing</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.towerWing || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Floor</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.floorNo || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Number of Balconies</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.balconies || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Type</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">
                      {bookingData.propertyType === "Other" ? (bookingData.propertyTypeOther || 'N/A') : (bookingData.propertyType || 'N/A')}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Carpet Area (sq.ft / sq.yd)</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.carpetArea || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Facing</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.facing || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Parking No.</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.parkingNo || 'N/A'}</Text>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, sm: 2 }}>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Special Flat / Corner / Garden View / Amenities</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.specialFeatures || 'N/A'}</Text>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, sm: 2 }}>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="orange.600" fontWeight="medium" mb={1}>Other Details</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.otherDetails || 'N/A'}</Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            {/* Financial Details - Only show if data exists */}
            {(bookingData.totalPropertyValue || bookingData.downPayment || bookingData.loanAmount || bookingData.bookingAmount || bookingData.paymentMode || bookingData.financeMode || bookingData.totalEmi || bookingData.transactionChequeNo || bookingData.bookingDate) && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="teal.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="teal.100" borderRadius="full">
                    <Text fontSize={{ base: "md", sm: "lg" }} color="teal.600">💰</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="teal.700">Financial Details</Text>
                </HStack>
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(3, 1fr)" 
                  }} 
                  gap={{ base: 2, sm: 3, md: 4 }}
                >
                  {bookingData.totalPropertyValue && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Total Cost</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.totalPropertyValue)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.bookingAmount && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Booking Amount</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.bookingAmount)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.downPayment && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Down Payment</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.downPayment)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.paymentMode && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Payment Mode</Text>
                      <Badge colorScheme="teal" variant="subtle" fontSize={{ base: "2xs", sm: "xs", md: "sm" }} px={2} py={1} borderRadius="full">
                        {bookingData.paymentMode}
                      </Badge>
                    </GridItem>
                  )}
                  {bookingData.financeMode && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Finance Mode</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.financeMode}</Text>
                    </GridItem>
                  )}
                  {bookingData.totalEmi && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Total EMI</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.totalEmi)}
                      </Text>
                    </GridItem>
                  )}
                  {bookingData.transactionChequeNo && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Transaction / Cheque No.</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{bookingData.transactionChequeNo}</Text>
                    </GridItem>
                  )}
                  {bookingData.bookingDate && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Booking Date</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.800">{formatDate(bookingData.bookingDate)}</Text>
                    </GridItem>
                  )}
                  {bookingData.loanAmount && (
                    <GridItem>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="teal.600" fontWeight="semibold">Loan Amount</Text>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="bold" color="teal.700" noOfLines={1}>
                        {formatCurrency(bookingData.loanAmount)}
                      </Text>
                    </GridItem>
                  )}
                </Grid>
              </Box>
            )}

            {/* Payment Terms */}
            <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="indigo.100" shadow="sm">
              <HStack mb={3} align="center">
                <Box p={2} bg="indigo.100" borderRadius="full">
                  <Text fontSize={{ base: "md", sm: "lg" }} color="indigo.600">📝</Text>
                </Box>
                <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="indigo.700">Payment Terms</Text>
              </HStack>
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  md: "repeat(2, 1fr)" 
                }} 
                gap={{ base: 2, sm: 3, md: 4 }}
              >
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="indigo.600" fontWeight="semibold">Payment Terms</Text>
                  <Badge 
                    colorScheme="indigo" 
                    variant="solid" 
                    fontSize={{ base: "3xs", sm: "2xs", md: "xs", lg: "sm" }} 
                    px={{ base: 1, sm: 2, md: 3 }} 
                    py={{ base: 0.5, sm: 1 }}
                    borderRadius="full"
                  >
                    {bookingData.paymentTerms || 'N/A'}
                  </Badge>
                </GridItem>
                <GridItem>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="indigo.600" fontWeight="semibold">Number of Installments</Text>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold">
                    {bookingData.installmentCount || '0'}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Financing Details */}
            {bookingData.isFinanced && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="pink.100" shadow="sm">
                <HStack mb={3} align="center">
                  <Box p={2} bg="pink.100" borderRadius="full">
                    <Text fontSize={{ base: "md", sm: "lg" }} color="pink.600">🏦</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="pink.700">Financing Details</Text>
                </HStack>
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)" 
                  }} 
                  gap={{ base: 2, sm: 3, md: 4 }}
                >
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="pink.600" fontWeight="semibold">Bank Name</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} noOfLines={1}>{bookingData.bankName || 'N/A'}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="pink.600" fontWeight="semibold">Loan Tenure</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} noOfLines={1}>
                      {bookingData.loanTenure ? `${bookingData.loanTenure} months` : 'N/A'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="pink.600" fontWeight="semibold">Interest Rate</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} noOfLines={1}>
                      {bookingData.interestRate ? `${bookingData.interestRate}%` : 'N/A'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="pink.600" fontWeight="semibold">EMI Amount</Text>
                    <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" noOfLines={1}>
                      {formatCurrency(bookingData.emiAmount)}
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            {/* Installment Schedule */}
            {bookingData.installmentSchedule && bookingData.installmentSchedule.length > 0 && (
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="yellow.100" shadow="sm">
                <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="stretch">
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <HStack align="center">
                      <Box p={2} bg="yellow.100" borderRadius="full">
                        <Text fontSize={{ base: "md", sm: "lg" }} color="yellow.600">📅</Text>
                      </Box>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="yellow.700">
                        Installment Schedule ({bookingData.installmentSchedule.length} installments)
                      </Text>
                    </HStack>
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge colorScheme="green" variant="subtle" fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PAID').length} Paid
                      </Badge>
                      <Badge colorScheme="yellow" variant="subtle" fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'PENDING').length} Pending
                      </Badge>
                      <Badge colorScheme="red" variant="subtle" fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} borderRadius="full">
                        {bookingData.installmentSchedule.filter(inst => inst.status === 'OVERDUE').length} Overdue
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="yellow.700" textAlign="center" fontWeight="medium">
                    Amount per installment: {formatCurrency(bookingData.installmentSchedule[0]?.amount)}
                  </Text>
                  
                  <Box 
                    maxH={{ base: "200px", sm: "250px", md: "300px", lg: "400px" }} 
                    overflowY="auto" 
                    border="1px" 
                    borderColor="yellow.200" 
                    borderRadius="md"
                    bg="gray.25"
                  >
                    <SimpleGrid 
                      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                      spacing={{ base: 1, sm: 2, md: 3 }} 
                      p={{ base: 1, sm: 2, md: 3 }}
                    >
                      {bookingData.installmentSchedule.map((installment, index) => (
                        <Box 
                          key={installment._id || index} 
                          p={{ base: 1, sm: 2, md: 3 }} 
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
                              <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                                Installment {installment.installmentNumber}
                              </Text>
                              <Badge
                                colorScheme={
                                  installment.status === 'PAID' ? 'green' :
                                  installment.status === 'PENDING' ? 'yellow' :
                                  installment.status === 'OVERDUE' ? 'red' : 'gray'
                                }
                                variant="solid"
                                fontSize={{ base: "3xs", sm: "2xs", md: "xs" }}
                                px={{ base: 1, sm: 2 }}
                                py={{ base: 0.5, sm: 1 }}
                                borderRadius="full"
                              >
                                {installment.status}
                              </Badge>
                            </HStack>
                            
                            <Text fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }} fontWeight="bold" color="blue.600">
                              {formatCurrency(installment.amount)}
                            </Text>
                            
                            <VStack spacing={{ base: 0.5, sm: 1 }} align="start" w="full">
                              <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="gray.600">
                                <strong>Due:</strong> {formatDate(installment.dueDate)}
                              </Text>
                              
                              {installment.status === 'PAID' && installment.paidDate && (
                                <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="green.600">
                                  <strong>Paid:</strong> {formatDate(installment.paidDate)}
                                </Text>
                              )}
                              
                              {installment.lateFees > 0 && (
                                <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="red.600">
                                  <strong>Late Fees:</strong> {formatCurrency(installment.lateFees)}
                                </Text>
                              )}
                              
                              {installment.paymentId && (
                                <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="blue.600">
                                  <strong>Payment ID:</strong> {installment.paymentId.slice(-8)}
                                </Text>
                              )}
                            </VStack>
                            
                            {installment.responsiblePersonId && (
                              <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="gray.500">
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
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="orange.100" shadow="sm">
                <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="stretch">
                  <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <HStack align="center">
                      <Box p={2} bg="orange.100" borderRadius="full">
                        <Text fontSize={{ base: "md", sm: "lg" }} color="orange.600">📎</Text>
                      </Box>
                      <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="orange.700">
                        Uploaded Documents ({bookingData.documents.length} files)
                      </Text>
                    </HStack>
                    <Badge colorScheme="orange" variant="subtle" fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} borderRadius="full">
                      {bookingData.documents.length} Document{bookingData.documents.length !== 1 ? 's' : ''}
                    </Badge>
                  </HStack>
                  
                  <Box 
                    maxH={{ base: "200px", sm: "250px", md: "300px", lg: "400px" }} 
                    overflowY="auto" 
                    border="1px" 
                    borderColor="orange.200" 
                    borderRadius="md"
                    bg="gray.25"
                  >
                    <SimpleGrid 
                      columns={{ base: 1, sm: 2, md: 3 }} 
                      spacing={{ base: 1, sm: 2, md: 3 }} 
                      p={{ base: 1, sm: 2, md: 3 }}
                    >
                      {bookingData.documents.map((document, index) => (
                        <Box 
                          key={document._id || index} 
                          p={{ base: 1, sm: 2, md: 3 }} 
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
                          <VStack spacing={{ base: 1, sm: 2, md: 3 }} align="stretch">
                            {/* Document Icon and Type */}
                            <HStack justify="space-between" align="center">
                              <Box p={2} bg="orange.100" borderRadius="full">
                                <Text fontSize={{ base: "md", sm: "lg" }} color="orange.600">
                                  {document.mimeType?.includes('pdf') ? '📄' : 
                                   document.mimeType?.includes('doc') ? '📝' : 
                                   document.mimeType?.includes('image') ? '🖼️' : '📎'}
                                </Text>
                              </Box>
                              <Badge
                                colorScheme="orange"
                                variant="subtle"
                                fontSize={{ base: "3xs", sm: "2xs", md: "xs" }}
                                px={{ base: 1, sm: 2 }}
                                py={{ base: 0.5, sm: 1 }}
                                borderRadius="full"
                              >
                                {document.documentType?.replace(/_/g, ' ') || 'OTHER'}
                              </Badge>
                            </HStack>
                            
                            {/* Document Name */}
                            <VStack spacing={{ base: 1, sm: 1 }} align="start" w="full">
                              <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} fontWeight="bold" color="blue.700" noOfLines={2}>
                                {getDocumentDisplayName(document)}
                              </Text>
                              <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="gray.500" fontStyle="italic" noOfLines={1}>
                                {document.originalName}
                              </Text>
                              
                              {/* File Size */}
                              <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="gray.600">
                                <strong>Size:</strong> {formatFileSize(document.fileSize)}
                              </Text>
                              
                              {/* Upload Date */}
                              {document.uploadedAt && (
                                <Text fontSize={{ base: "3xs", sm: "2xs", md: "xs" }} color="gray.600">
                                  <strong>Uploaded:</strong> {formatDate(document.uploadedAt)}
                                </Text>
                              )}
                            </VStack>
                            
                            {/* Action Buttons */}
                            <HStack spacing={{ base: 1, sm: 2 }} justify="center">
                              <Button
                                size={{ base: "2xs", sm: "xs", md: "sm" }}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => window.open(document.documentUrl, '_blank')}
                                leftIcon={<FiEye />}
                                _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                fontSize={{ base: "3xs", sm: "2xs", md: "xs" }}
                              >
                                View
                              </Button>
                              <Button
                                size={{ base: "2xs", sm: "xs", md: "sm" }}
                                colorScheme="green"
                                variant="outline"
                                onClick={() => downloadDocument(document.documentUrl, document.originalName)}
                                leftIcon={<FiDownload />}
                                _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                                fontSize={{ base: "3xs", sm: "2xs", md: "xs" }}
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
              <Box p={{ base: 2, sm: 3, md: 4 }} bg="white" borderRadius="lg" border="1px" borderColor="gray.100" shadow="sm">
                <VStack spacing={{ base: 2, sm: 3 }} align="center">
                  <Box p={3} bg="gray.100" borderRadius="full">
                    <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} color="gray.500">📎</Text>
                  </Box>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} fontWeight="semibold" color="gray.600">
                    No Documents Uploaded
                  </Text>
                  <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color="gray.500" textAlign="center">
                    This purchase booking doesn't have any supporting documents uploaded yet.
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter 
          p={{ base: 2, sm: 3, md: 4 }} 
          bg="gray.50" 
          borderTop="1px" 
          borderColor="gray.200"
        >
          <Button 
            colorScheme="blue" 
            onClick={onClose}
            size={{ base: "sm", md: "md" }}
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Property Preview Modal */}
    {bookingData.propertyId && (
      <PropertyPreview
        isOpen={isPropertyPreviewOpen}
        onClose={onPropertyPreviewClose}
        property={bookingData.propertyId}
        isViewOnly={true}
      />
    )}
  </>
  );
};

export default PurchaseBookingViewer; 