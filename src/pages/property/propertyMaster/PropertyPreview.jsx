import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Modal, ModalOverlay, ModalContent, ModalCloseButton,
  Heading, Text, Flex, Grid, Badge, Button, IconButton,
  VStack, HStack, Divider, Image, SimpleGrid,
  Circle, Icon, Spinner, Alert, AlertIcon, Input,
  Tooltip, Progress, AspectRatio, Skeleton, SkeletonText,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaTimes, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPhone, FaEnvelope,
  FaUpload, FaTrash, FaDownload, FaExpand, FaCompress, FaShare, FaHome,
  FaHeart, FaStar, FaBuilding, FaUser, FaTag
} from 'react-icons/fa';
import { 
  fetchPropertyImages, 
  uploadPropertyImage, 
  deletePropertyImage 
} from '../../../services/propertyService';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

const floatingButtonStyle = {
  bg: 'rgba(30,30,30,0.75)',
  color: 'white',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  borderRadius: 'full',
  backdropFilter: 'blur(8px)',
  _hover: {
    bg: 'rgba(30,30,30,0.9)',
    color: 'white',
    transform: 'scale(1.1)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const PropertyPreview = ({ isOpen, onClose, property }) => {
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const fileInputRef = useRef();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    if (isOpen && property?._id) {
      fetchPropertyImagesData();
    }
  }, [isOpen, property?._id]);

  const fetchPropertyImagesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPropertyImages(property._id);
      setPropertyImages(response.data || []);
    } catch (err) {
      console.error('Failed to fetch property images:', err);
      setError('Failed to load property images');
      showErrorToast('Failed to load property images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorToast('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Please select an image smaller than 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadPropertyImage(property._id, formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add new image to the list
      setPropertyImages(prev => [...prev, response.data]);
      setCurrentImageIndex(propertyImages.length); // Show the new image
      
      showSuccessToast('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      showErrorToast('Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await deletePropertyImage(property._id, imageToDelete._id);
      
      // Remove image from the list
      setPropertyImages(prev => prev.filter(img => img._id !== imageToDelete._id));
      
      // Adjust current index if needed
      if (currentImageIndex >= propertyImages.length - 1) {
        setCurrentImageIndex(Math.max(0, propertyImages.length - 2));
      }
      
      showSuccessToast('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      showErrorToast('Failed to delete image');
    } finally {
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'FOR SALE': return 'green';
      case 'FOR RENT': return 'blue';
      case 'SOLD': return 'red';
      case 'RENTED': return 'purple';
      default: return 'gray';
    }
  };

  const shareProperty = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out this property: ${property.name} - ${formatPrice(property.price)}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      showSuccessToast('Property link copied to clipboard');
    }
  };

  if (!isOpen || !property) return null;

  const currentImage = propertyImages[currentImageIndex] || null;
  const hasImages = propertyImages.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "full", md: "7xl" }} isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(12px)" />
      <ModalContent
        maxW={{ base: "100vw", sm: "100vw", md: "98vw", lg: "95vw", xl: "90vw" }}
        maxH={{ base: "100vh", sm: "100vh", md: "98vh", lg: "95vh" }}
        borderRadius={{ base: "0", sm: "0", md: "3xl" }}
        overflow="hidden"
        bg={bgColor}
        boxShadow="0 25px 50px rgba(0, 0, 0, 0.25)"
        mx={{ base: 0, sm: 0, md: 4 }}
        my={{ base: 0, sm: 0, md: 4 }}
        p={0}
        border="1px solid"
        borderColor={borderColor}
      >
        <ModalCloseButton
          position="absolute"
          top={{ base: 3, sm: 4, md: 6 }}
          right={{ base: 3, sm: 4, md: 6 }}
          zIndex={10}
          size={{ base: "sm", sm: "md", md: "lg" }}
          {...floatingButtonStyle}
        />

        <Box maxH={{ base: "100vh", sm: "100vh", md: "95vh", lg: "90vh" }} overflowY="auto" p={0}>
          {/* Enhanced Image Gallery Section - AdminMeetings Style */}
          <Box position="relative" h={{ base: '400px', sm: '450px', md: '500px', lg: '600px' }} m={0} p={0}>
            {loading ? (
              <Flex justify="center" align="center" h="full" bg={cardBg}>
                <VStack spacing={6}>
                  <Spinner size="xl" color="brand.500" thickness="4px" />
                  <Text color={subTextColor} fontSize="lg" fontWeight="medium">Loading images...</Text>
                </VStack>
              </Flex>
            ) : error ? (
              <Flex justify="center" align="center" h="full" bg={cardBg}>
                <Alert status="error" borderRadius="xl" maxW="400px" bg="red.50" border="1px solid" borderColor="red.200">
                  <AlertIcon />
                  {error}
                </Alert>
              </Flex>
            ) : hasImages ? (
              <>
                {/* Enhanced Main Image with Better Styling */}
                <Box position="relative" h="full" overflow="hidden">
                  <Image
                    src={currentImage?.displayUrl || currentImage?.originalUrl}
                    alt={`${property.name} - Image ${currentImageIndex + 1}`}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/800x500?text=Property+Image"
                    transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: 'scale(1.05)' }}
                    filter="brightness(0.9) contrast(1.1)"
                  />
                  
                  {/* Gradient Overlay for Better Text Visibility */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)"
                    pointerEvents="none"
                  />
                </Box>
                
                {/* Enhanced Image Navigation - AdminMeetings Style */}
                {propertyImages.length > 1 && (
                  <>
                    <IconButton
                      icon={<FaChevronLeft />}
                      position="absolute"
                      left={4}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={prevImage}
                      aria-label="Previous image"
                      size="lg"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      _hover={{
                        bg: "rgba(0,0,0,0.9)",
                        transform: "translateY(-50%) scale(1.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderRadius="full"
                      backdropFilter="blur(8px)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    />
                    <IconButton
                      icon={<FaChevronRight />}
                      position="absolute"
                      right={4}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={nextImage}
                      aria-label="Next image"
                      size="lg"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      _hover={{
                        bg: "rgba(0,0,0,0.9)",
                        transform: "translateY(-50%) scale(1.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderRadius="full"
                      backdropFilter="blur(8px)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    />
                  </>
                )}

                {/* Enhanced Image Counter - AdminMeetings Style */}
                <Box
                  position="absolute"
                  bottom={4}
                  right={4}
                  bg="rgba(0,0,0,0.8)"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                  backdropFilter="blur(12px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                >
                  {currentImageIndex + 1} / {propertyImages.length}
                </Box>

                {/* Enhanced Image Actions - AdminMeetings Style */}
                <HStack
                  position="absolute"
                  top={4}
                  right={4}
                  spacing={2}
                  zIndex={5}
                >
                  <Tooltip label="Upload Image" placement="bottom">
                    <IconButton
                      icon={<FaUpload />}
                      size="md"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload image"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      _hover={{
                        bg: "rgba(0,0,0,0.9)",
                        transform: "scale(1.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderRadius="full"
                      backdropFilter="blur(8px)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    />
                  </Tooltip>
                  <Tooltip label="Fullscreen" placement="bottom">
                    <IconButton
                      icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                      size="md"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      aria-label="Toggle fullscreen"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      _hover={{
                        bg: "rgba(0,0,0,0.9)",
                        transform: "scale(1.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderRadius="full"
                      backdropFilter="blur(8px)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    />
                  </Tooltip>
                  <Tooltip label="Share Property" placement="bottom">
                    <IconButton
                      icon={<FaShare />}
                      size="md"
                      onClick={shareProperty}
                      aria-label="Share property"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      _hover={{
                        bg: "rgba(0,0,0,0.9)",
                        transform: "scale(1.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                      }}
       s               transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderRadius="full"
                      backdropFilter="blur(8px)"
                      border="1px solid"
                    />
                  </Tooltip>
                </HStack>

                {/* Enhanced Upload Progress */}
                {uploading && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="whiteAlpha.950"
                    p={4}
                    backdropFilter="blur(8px)"
                  >
                    <Progress 
                      value={uploadProgress} 
                      colorScheme="brand" 
                      size="md" 
                      borderRadius="full"
                      bg="gray.200"
                    />
                    <Text fontSize="sm" textAlign="center" mt={2} fontWeight="medium">
                      Uploading... {uploadProgress}%
                    </Text>
                  </Box>
                )}
              </>
            ) : (
              <Flex justify="center" align="center" h="full" bg={cardBg}>
                <VStack spacing={6}>
                  <Circle size="80px" bg="gray.200" color="gray.400">
                    <FaMapMarkerAlt size={32} />
                  </Circle>
                  <Text color={subTextColor} fontSize="lg" fontWeight="medium">No images available</Text>
                  <Button
                    leftIcon={<FaUpload />}
                    colorScheme="brand"
                    variant="outline"
                    size="md"
                    onClick={() => fileInputRef.current?.click()}
                    borderRadius="xl"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    Upload First Image
                  </Button>
                </VStack>
              </Flex>
            )}

            {/* Enhanced Status Badge - AdminMeetings Style */}
            <Badge
              position="absolute"
              top={4}
              left={4}
              colorScheme={getStatusColor(property.propertyStatus)}
              variant="solid"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
              boxShadow="lg"
              backdropFilter="blur(12px)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              letterSpacing="wide"
            >
              {property.propertyStatus}
            </Badge>

            {/* Hidden file input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              display="none"
            />
          </Box>

          {/* Enhanced Content Section - AdminMeetings Style */}
          <Box p={{ base: 4, sm: 6, md: 8, lg: 10 }} pb={{ base: 4, sm: 6, md: 8 }}>
            <VStack spacing={{ base: 6, sm: 8, md: 10, lg: 12 }} align="stretch">
              {/* Enhanced Header - AdminMeetings Style */}
              <Box>
                <VStack spacing={4} align="start">
                  <Heading 
                    size={{ base: "lg", sm: "xl", md: "2xl" }} 
                    color={textColor} 
                    fontWeight="bold"
                    lineHeight="tight"
                  >
                    {property.name}
                  </Heading>
                  
                  <Flex align="center" color={subTextColor} fontSize={{ base: "sm", sm: "md" }} gap={2}>
                    <Icon as={FaMapMarkerAlt} color="brand.500" />
                    <Text noOfLines={{ base: 2, sm: 1 }} fontWeight="medium">
                      {`${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}, ${property.propertyAddress?.state} ${property.propertyAddress?.zipOrPinCode}`}
                    </Text>
                  </Flex>
                  
                  <Text 
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }} 
                    fontWeight="bold" 
                    color="brand.500"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    bgClip="text"
                    lineHeight="tight"
                  >
                    {formatPrice(property.price)}
                  </Text>
                </VStack>
              </Box>

              {/* Enhanced Features Grid - AdminMeetings Style */}
              <Box 
                bg="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                borderRadius="3xl"
                p={{ base: 6, sm: 8, md: 10 }}
                border="1px solid"
                borderColor={borderColor}
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
                position="relative"
                overflow="hidden"
              >
                {/* Background Pattern */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.03) 50%, transparent 70%)"
                  opacity="0.6"
                />
                
                <Text 
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  fontWeight="bold" 
                  color={textColor} 
                  mb={{ base: 4, sm: 6, md: 8 }}
                  textAlign="center"
                  letterSpacing="wide"
                  position="relative"
                  zIndex={1}
                >
                  Property Features
                </Text>
                
                <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={{ base: 4, sm: 6, md: 8 }} position="relative" zIndex={1}>
                  {/* Enhanced Bedrooms - AdminMeetings Style */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 4, sm: 5, md: 6 }}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                      borderColor: 'brand.400'
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      opacity="0"
                      _hover={{ opacity: 0.05 }}
                      transition="opacity 0.4s ease"
                    />
                    
                    <Box position="relative" zIndex={1}>
                      <Circle 
                        size={{ base: "50px", sm: "60px", md: "70px" }}
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        mb={{ base: 3, sm: 4, md: 5 }}
                        boxShadow="0 8px 24px rgba(102, 126, 234, 0.4)"
                        _hover={{
                          transform: 'rotate(8deg) scale(1.15)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaBed} size={{ base: 20, sm: 24, md: 28 }} />
                      </Circle>
                      <Text 
                        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                        fontWeight="bold" 
                        color={textColor}
                        mb={2}
                        _hover={{ color: 'brand.600' }}
                        transition="color 0.3s ease"
                      >
                        {property.features?.bedRooms || 0}
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", sm: "sm", md: "md" }}
                        color={subTextColor} 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{ color: 'brand.500' }}
                        transition="color 0.3s ease"
                      >
                        Bedrooms
                      </Text>
                    </Box>
                  </Box>

                  {/* Enhanced Bathrooms - AdminMeetings Style */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 4, sm: 5, md: 6 }}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(66, 153, 225, 0.2)',
                      borderColor: 'blue.400'
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                      opacity="0"
                      _hover={{ opacity: 0.05 }}
                      transition="opacity 0.4s ease"
                    />
                    
                    <Box position="relative" zIndex={1}>
                      <Circle 
                        size={{ base: "50px", sm: "60px", md: "70px" }}
                        bg="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                        color="white"
                        mb={{ base: 3, sm: 4, md: 5 }}
                        boxShadow="0 8px 24px rgba(66, 153, 225, 0.4)"
                        _hover={{
                          transform: 'rotate(-8deg) scale(1.15)',
                          boxShadow: '0 12px 32px rgba(66, 153, 225, 0.5)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaBath} size={{ base: 20, sm: 24, md: 28 }} />
                      </Circle>
                      <Text 
                        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                        fontWeight="bold" 
                        color={textColor}
                        mb={2}
                        _hover={{ color: 'blue.600' }}
                        transition="color 0.3s ease"
                      >
                        {property.features?.bathRooms || 0}
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", sm: "sm", md: "md" }}
                        color={subTextColor} 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{ color: 'blue.500' }}
                        transition="color 0.3s ease"
                      >
                        Bathrooms
                      </Text>
                    </Box>
                  </Box>

                  {/* Enhanced Square Feet - AdminMeetings Style */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 4, sm: 5, md: 6 }}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(72, 187, 120, 0.2)',
                      borderColor: 'green.400'
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                      opacity="0"
                      _hover={{ opacity: 0.05 }}
                      transition="opacity 0.4s ease"
                    />
                    
                    <Box position="relative" zIndex={1}>
                      <Circle 
                        size={{ base: "50px", sm: "60px", md: "70px" }}
                        bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                        color="white"
                        mb={{ base: 3, sm: 4, md: 5 }}
                        boxShadow="0 8px 24px rgba(72, 187, 120, 0.4)"
                        _hover={{
                          transform: 'rotate(5deg) scale(1.15)',
                          boxShadow: '0 12px 32px rgba(72, 187, 120, 0.5)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaRuler} size={{ base: 20, sm: 24, md: 28 }} />
                      </Circle>
                      <Text 
                        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                        fontWeight="bold" 
                        color={textColor}
                        mb={2}
                        _hover={{ color: 'green.600' }}
                        transition="color 0.3s ease"
                      >
                        {property.features?.areaInSquarFoot || 0}
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", sm: "sm", md: "md" }}
                        color={subTextColor} 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{ color: 'green.500' }}
                        transition="color 0.3s ease"
                      >
                        sq.ft
                      </Text>
                    </Box>
                  </Box>

                  {/* Enhanced Listed Date - AdminMeetings Style */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 4, sm: 5, md: 6 }}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
                    _hover={{
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(159, 122, 234, 0.2)',
                      borderColor: 'purple.400'
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
                      opacity="0"
                      _hover={{ opacity: 0.05 }}
                      transition="opacity 0.4s ease"
                    />
                    
                    <Box position="relative" zIndex={1}>
                      <Circle 
                        size={{ base: "50px", sm: "60px", md: "70px" }}
                        bg="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
                        color="white"
                        mb={{ base: 3, sm: 4, md: 5 }}
                        boxShadow="0 8px 24px rgba(159, 122, 234, 0.4)"
                        _hover={{
                          transform: 'rotate(-5deg) scale(1.15)',
                          boxShadow: '0 12px 32px rgba(159, 122, 234, 0.5)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaCalendarAlt} size={{ base: 20, sm: 24, md: 28 }} />
                      </Circle>
                      <Text 
                        fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                        fontWeight="bold" 
                        color={textColor}
                        mb={2}
                        noOfLines={2}
                        _hover={{ color: 'purple.600' }}
                        transition="color 0.3s ease"
                      >
                        {property.listedDate ? formatDate(property.listedDate) : 'N/A'}
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", sm: "sm", md: "md" }}
                        color={subTextColor} 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        _hover={{ color: 'purple.500' }}
                        transition="color 0.3s ease"
                      >
                        Listed
                      </Text>
                    </Box>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider borderColor={borderColor} />

              {/* Enhanced Description - AdminMeetings Style */}
              <Box>
                <VStack spacing={4} align="start">
                  <Flex align="center" gap={3}>
                    <Box
                      p={3}
                      bg="brand.50"
                      borderRadius="xl"
                      color="brand.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FaBuilding size={20} />
                    </Box>
                    <Heading size={{ base: "md", sm: "lg" }} color={textColor}>Description</Heading>
                  </Flex>
                  <Text 
                    color={subTextColor} 
                    lineHeight="1.8" 
                    fontSize={{ base: "md", sm: "lg" }}
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                  >
                    {property.description}
                  </Text>
                </VStack>
              </Box>

              {/* Enhanced Amenities - AdminMeetings Style */}
              {property.features?.amenities?.length > 0 && (
                <Box
                  bg="white"
                  borderRadius="3xl"
                  p={{ base: 6, sm: 8, md: 10 }}
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
                >
                  <Flex align="center" mb={{ base: 4, sm: 6 }}>
                    <Box
                      p={4}
                      bg="green.50"
                      borderRadius="2xl"
                      color="green.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={4}
                      _hover={{
                        transform: 'rotate(8deg) scale(1.1)',
                        boxShadow: '0 8px 24px rgba(72, 187, 120, 0.4)'
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <FaHome size={24} />
                    </Box>
                    <Box>
                      <Heading size={{ base: "md", sm: "lg" }} color={textColor} mb={2}>Amenities</Heading>
                      <Text color={subTextColor} fontSize={{ base: "sm", sm: "md" }}>Available features and facilities</Text>
                    </Box>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 3, sm: 4 }}>
                    {property.features.amenities.map((amenity, index) => (
                      <Flex 
                        key={amenity} 
                        align="center" 
                        color={textColor}
                        p={{ base: 3, sm: 4 }}
                        bg={cardBg}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          bg: "brand.50",
                          borderColor: "brand.300",
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                          animationDelay: `${index * 0.1}s`
                        }}
                        animation="fadeInUp 0.6s ease-out forwards"
                        opacity="0"
                        transform="translateY(20px)"
                        _animation={{
                          opacity: 1,
                          transform: "translateY(0)"
                        }}
                      >
                        <Circle 
                          size="12px" 
                          bg="brand.500" 
                          mr={4}
                          _hover={{
                            transform: 'scale(1.3)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)'
                          }}
                          transition="all 0.3s ease"
                        />
                        <Text 
                          fontSize={{ base: "sm", sm: "md" }}
                          fontWeight="medium"
                          _hover={{ color: 'brand.600' }}
                          transition="color 0.3s ease"
                        >
                          {amenity}
                        </Text>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Enhanced Location & Actions - AdminMeetings Style */}
              <Box
                bg="white"
                borderRadius="3xl"
                p={{ base: 6, sm: 8, md: 10 }}
                border="1px solid"
                borderColor={borderColor}
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
              >
                <VStack spacing={{ base: 6, sm: 8, md: 10 }} align="center" textAlign="center">
                  {/* Enhanced Location Section - AdminMeetings Style */}
                  <Box w="full" maxW="600px">
                    <VStack spacing={{ base: 4, sm: 6 }} align="center" textAlign="center">
                      <Box
                        p={4}
                        bg="orange.50"
                        borderRadius="2xl"
                        color="orange.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{
                          transform: 'rotate(-8deg) scale(1.1)',
                          boxShadow: '0 8px 24px rgba(237, 137, 54, 0.4)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <FaMapMarkerAlt size={28} />
                      </Box>
                      <Box textAlign="center">
                        <Heading size={{ base: "md", sm: "lg" }} color={textColor} mb={3}>Location</Heading>
                        <Text 
                          color={subTextColor} 
                          fontSize={{ base: "sm", sm: "md" }} 
                          mb={6}
                        >
                          Property location and directions
                        </Text>
                      </Box>
                      <Button
                        leftIcon={<FaExternalLinkAlt />}
                        variant="outline"
                        colorScheme="brand"
                        size={{ base: "md", sm: "lg" }}
                        borderRadius="xl"
                        fontWeight="bold"
                        w="full"
                        onClick={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${property.propertyAddress?.location?.lat},${property.propertyAddress?.location?.lng}`;
                          window.open(url, '_blank');
                        }}
                        _hover={{
                          bg: "brand.50",
                          borderColor: "brand.400",
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        View on Google Maps
                      </Button>
                    </VStack>
                  </Box>
                  
                  {/* Enhanced Action Buttons - AdminMeetings Style */}
                  <Box w="full" maxW="600px">
                    <VStack spacing={{ base: 3, sm: 4 }} align="stretch">
                      <Button
                        leftIcon={<FaPhone />}
                        colorScheme="brand"
                        variant="solid"
                        size={{ base: "md", sm: "lg" }}
                        borderRadius="xl"
                        fontWeight="bold"
                        w="full"
                        onClick={() => {
                          const phoneNumber = property.agentPhone || '+1234567890';
                          window.open(`tel:${phoneNumber}`, '_blank');
                        }}
                        _hover={{
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Contact Agent
                      </Button>
                      <Button
                        leftIcon={<FaEnvelope />}
                        colorScheme="gray"
                        variant="outline"
                        size={{ base: "md", sm: "lg" }}
                        borderRadius="xl"
                        fontWeight="bold"
                        w="full"
                        onClick={() => {
                          const subject = `Inquiry about ${property.name}`;
                          const body = `Hi,\n\nI'm interested in the property: ${property.name}\n\nProperty Details:\n- Price: ${formatPrice(property.price)}\n- Address: ${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}\n\nPlease provide more information about this property.\n\nThank you!`;
                          const email = property.agentEmail || 'info@inhabitrealties.com';
                          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                        }}
                        _hover={{
                          bg: "gray.50",
                          borderColor: "gray.400",
                          transform: "translateY(-3px) scale(1.02)",
                          boxShadow: "0 8px 24px rgba(113, 128, 150, 0.3)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Send Email
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Enhanced Image Thumbnails - AdminMeetings Style */}
              {hasImages && (
                <Box>
                  <Flex justify="space-between" align="center" mb={{ base: 4, sm: 6 }}>
                    <Heading size={{ base: "md", sm: "lg" }} color={textColor}>Gallery</Heading>
                    <Button
                      leftIcon={<FaUpload />}
                      size={{ base: "sm", sm: "md" }}
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => fileInputRef.current?.click()}
                      borderRadius="xl"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Add Image
                    </Button>
                  </Flex>
                  <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={{ base: 2, sm: 3 }}>
                    {propertyImages.map((image, index) => (
                      <Box
                        key={image._id}
                        position="relative"
                        cursor="pointer"
                        borderRadius="xl"
                        overflow="hidden"
                        border={currentImageIndex === index ? '3px solid' : '1px solid'}
                        borderColor={currentImageIndex === index ? 'brand.500' : borderColor}
                        onClick={() => setCurrentImageIndex(index)}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        _hover={{ 
                          transform: 'scale(1.08)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                        }}
                        bg="white"
                        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                        _hover={{
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                          transform: 'scale(1.08)'
                        }}
                      >
                        <Image
                          src={image.thumbnailUrl || image.originalUrl}
                          alt={`Thumbnail ${index + 1}`}
                          w="full"
                          h="80px"
                          objectFit="cover"
                          transition="all 0.3s ease"
                          _hover={{
                            filter: 'brightness(1.1) contrast(1.1)'
                          }}
                        />
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme="red"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image);
                          }}
                          opacity={0}
                          transition="opacity 0.3s"
                          zIndex={10}
                          bg="red.500"
                          color="white"
                          borderRadius="full"
                          _hover={{
                            opacity: 1,
                            bg: "red.600",
                            transform: "scale(1.1)"
                          }}
                          boxShadow="0 4px 12px rgba(239, 68, 68, 0.4)"
                        />
                        {/* Selection Indicator */}
                        {currentImageIndex === index && (
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="brand.500"
                            opacity="0.2"
                            pointerEvents="none"
                          />
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>
      </ModalContent>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={confirmDeleteImage}
        title="Delete Image"
        message={`Are you sure you want to delete this image? This action cannot be undone.`}
      />
    </Modal>
  );
};

export default PropertyPreview; 