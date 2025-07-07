import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Modal, ModalOverlay, ModalContent, ModalCloseButton,
  Heading, Text, Flex, Grid, Badge, Button, IconButton,
  VStack, HStack, Divider, Image, SimpleGrid,
  Circle, Icon, Spinner, Alert, AlertIcon, Input,
  Tooltip, Progress, AspectRatio, Skeleton, SkeletonText
} from '@chakra-ui/react';
import {
  FaTimes, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPhone, FaEnvelope,
  FaUpload, FaTrash, FaDownload, FaExpand, FaCompress, FaShare, FaHome
} from 'react-icons/fa';
import { 
  fetchPropertyImages, 
  uploadPropertyImage, 
  deletePropertyImage 
} from '../../../services/propertyService';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';

const floatingButtonStyle = {
  bg: 'rgba(30,30,30,0.65)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
  borderRadius: 'full',
  backdropFilter: 'blur(2px)',
  _hover: {
    bg: 'rgba(30,30,30,0.85)',
    color: 'white',
    transform: 'scale(1.08)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
  },
  transition: 'all 0.18s',
};

const PropertyPreview = ({ isOpen, onClose, property }) => {
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();

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

      const response = await uploadPropertyImage(property._id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add new image to the list
      setPropertyImages(prev => [...prev, response.data]);
      
      showSuccessToast('Image uploaded successfully');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload image';
      showErrorToast(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await deletePropertyImage(imageId);
      
      // Remove image from list
      setPropertyImages(prev => prev.filter(img => img._id !== imageId));
      
      // Adjust current index if needed
      if (currentImageIndex >= propertyImages.length - 1) {
        setCurrentImageIndex(Math.max(0, propertyImages.length - 2));
      }

      showSuccessToast('Image deleted successfully');
    } catch (err) {
      console.error('Failed to delete image:', err);
      showErrorToast('Failed to delete image');
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
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
        text: `Check out this property: ${property.name}`,
        url: url,
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
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "6xl" }} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        maxW={{ base: "100vw", sm: "95vw", md: "90vw", lg: "85vw", xl: "80vw" }}
        maxH={{ base: "100vh", sm: "95vh", md: "90vh" }}
        borderRadius={{ base: "0", sm: "2xl" }}
        overflow="hidden"
        bg="white"
        boxShadow="2xl"
        mx={{ base: 0, sm: 4 }}
        my={{ base: 0, sm: 4 }}
      >
        <ModalCloseButton
          position="absolute"
          top={4}
          right={4}
          zIndex={10}
          {...floatingButtonStyle}
        />

        <Box maxH={{ base: "100vh", sm: "95vh", md: "90vh" }} overflowY="auto">
          {/* Image Gallery Section */}
          <Box position="relative" h={{ base: '250px', sm: '300px', md: '400px', lg: '500px' }}>
            {loading ? (
              <Flex justify="center" align="center" h="full" bg="gray.100">
                <VStack spacing={4}>
                  <Spinner size="xl" color="brand.500" />
                  <Text color="gray.600">Loading images...</Text>
                </VStack>
              </Flex>
            ) : error ? (
              <Flex justify="center" align="center" h="full" bg="gray.100">
                <Alert status="error" borderRadius="md" maxW="400px">
                  <AlertIcon />
                  {error}
                </Alert>
              </Flex>
            ) : hasImages ? (
              <>
        {/* Main Image */}
                <AspectRatio ratio={16/9} h="full">
                  <Image
                    src={currentImage?.displayUrl || currentImage?.originalUrl}
                    alt={`${property.name} - Image ${currentImageIndex + 1}`}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/800x500?text=Property+Image"
                    transition="all 0.3s ease"
                    _hover={{ transform: 'scale(1.02)' }}
                  />
                </AspectRatio>
                
                {/* Image Navigation */}
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
                      {...floatingButtonStyle}
                    />
                    <IconButton
                      icon={<FaChevronRight />}
                      position="absolute"
                      right={4}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={nextImage}
                      aria-label="Next image"
                      {...floatingButtonStyle}
                    />
                  </>
                )}

                {/* Image Counter */}
                <Box
                  position="absolute"
                  bottom={4}
                  right={4}
                  bg="blackAlpha.700"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                  backdropFilter="blur(10px)"
                >
                  {currentImageIndex + 1} / {propertyImages.length}
                </Box>

                {/* Image Actions */}
                <HStack
                  position="absolute"
                  top={4}
                  right={4}
                  spacing={2}
                  zIndex={5}
                >
                  <Tooltip label="Upload Image">
                    <IconButton
                      icon={<FaUpload />}
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload image"
                      {...floatingButtonStyle}
                    />
                  </Tooltip>
                  <Tooltip label="Fullscreen">
                    <IconButton
                      icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      aria-label="Toggle fullscreen"
                      {...floatingButtonStyle}
                    />
                  </Tooltip>
                  <Tooltip label="Share">
                    <IconButton
                      icon={<FaShare />}
                      size="sm"
                      onClick={shareProperty}
                      aria-label="Share property"
                      {...floatingButtonStyle}
                    />
                  </Tooltip>
                </HStack>

                {/* Upload Progress */}
                {uploading && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="whiteAlpha.900"
                    p={2}
                  >
                    <Progress value={uploadProgress} colorScheme="brand" size="sm" />
                    <Text fontSize="xs" textAlign="center" mt={1}>
                      Uploading... {uploadProgress}%
                    </Text>
                  </Box>
                )}
              </>
            ) : (
              <Flex justify="center" align="center" h="full" bg="gray.100">
                <VStack spacing={4}>
                  <Icon as={FaMapMarkerAlt} size={48} color="gray.400" />
                  <Text color="gray.500" fontSize="lg">No images available</Text>
                  <Button
                    leftIcon={<FaUpload />}
                    colorScheme="brand"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload First Image
                  </Button>
                </VStack>
              </Flex>
            )}

            {/* Status Badge */}
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
              boxShadow="md"
              backdropFilter="blur(10px)"
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

          {/* Content Section */}
          <Box p={{ base: 3, sm: 4, md: 6, lg: 8 }}>
            <VStack spacing={{ base: 4, sm: 5, md: 6, lg: 8 }} align="stretch">
              {/* Header */}
                              <Box>
                  <Heading size={{ base: "md", sm: "lg", md: "xl" }} color="gray.900" mb={{ base: 2, sm: 3 }}>
                    {property.name}
                  </Heading>
                  <Flex align="center" color="gray.600" fontSize={{ base: "xs", sm: "sm" }} mb={{ base: 2, sm: 3 }}>
                    <Icon as={FaMapMarkerAlt} mr={{ base: 1, sm: 2 }} />
                    <Text noOfLines={{ base: 2, sm: 1 }}>
                      {`${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}, ${property.propertyAddress?.state} ${property.propertyAddress?.zipOrPinCode}`}
                    </Text>
                  </Flex>
                  <Text fontSize={{ base: "xl", sm: "2xl", md: "3xl" }} fontWeight="bold" color="brand.500">
                    {formatPrice(property.price)}
                  </Text>
                </Box>

          {/* Features Grid - Enhanced with Animations */}
          <Box 
            bg="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
            borderRadius={{ base: "xl", sm: "2xl" }}
            p={{ base: 4, sm: 5, md: 6 }}
            border="1px solid"
            borderColor="gray.200"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
          >
            <Text 
              fontSize={{ base: "md", sm: "lg" }}
              fontWeight="bold" 
              color="gray.800" 
              mb={{ base: 3, sm: 4 }}
              textAlign="center"
              letterSpacing="wide"
            >
              Property Features
            </Text>
            
            <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={{ base: 3, sm: 4, md: 6 }}>
              {/* Bedrooms */}
              <Box
                bg="white"
                borderRadius={{ base: "lg", sm: "xl" }}
                p={{ base: 3, sm: 4 }}
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.15)',
                  borderColor: 'brand.400'
                }}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
              >
                {/* Animated Background */}
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
                    size={{ base: "40px", sm: "45px" }}
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    mb={{ base: 2, sm: 3 }}
                    boxShadow="0 4px 16px rgba(102, 126, 234, 0.3)"
                    _hover={{
                      transform: 'rotate(5deg) scale(1.1)',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Icon as={FaBed} size={{ base: 16, sm: 18 }} />
                  </Circle>
                  <Text 
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    fontWeight="bold" 
                    color="gray.800"
                    mb={1}
                    _hover={{ color: 'brand.600' }}
                    transition="color 0.3s ease"
                  >
                    {property.features?.bedRooms || 0}
                  </Text>
                  <Text 
                    fontSize={{ base: "xs", sm: "sm" }}
                    color="gray.600" 
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

              {/* Bathrooms */}
              <Box
                bg="white"
                borderRadius={{ base: "lg", sm: "xl" }}
                p={{ base: 3, sm: 4 }}
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 32px rgba(66, 153, 225, 0.15)',
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
                    size={{ base: "40px", sm: "45px" }}
                    bg="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                    color="white"
                    mb={{ base: 2, sm: 3 }}
                    boxShadow="0 4px 16px rgba(66, 153, 225, 0.3)"
                    _hover={{
                      transform: 'rotate(-5deg) scale(1.1)',
                      boxShadow: '0 8px 24px rgba(66, 153, 225, 0.4)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Icon as={FaBath} size={{ base: 16, sm: 18 }} />
                  </Circle>
                  <Text 
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    fontWeight="bold" 
                    color="gray.800"
                    mb={1}
                    _hover={{ color: 'blue.600' }}
                    transition="color 0.3s ease"
                  >
                    {property.features?.bathRooms || 0}
                  </Text>
                  <Text 
                    fontSize={{ base: "xs", sm: "sm" }}
                    color="gray.600" 
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

              {/* Square Feet */}
              <Box
                bg="white"
                borderRadius={{ base: "lg", sm: "xl" }}
                p={{ base: 3, sm: 4 }}
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 32px rgba(72, 187, 120, 0.15)',
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
                    size={{ base: "40px", sm: "45px" }}
                    bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                    color="white"
                    mb={{ base: 2, sm: 3 }}
                    boxShadow="0 4px 16px rgba(72, 187, 120, 0.3)"
                    _hover={{
                      transform: 'rotate(3deg) scale(1.1)',
                      boxShadow: '0 8px 24px rgba(72, 187, 120, 0.4)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Icon as={FaRuler} size={{ base: 16, sm: 18 }} />
                  </Circle>
                  <Text 
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    fontWeight="bold" 
                    color="gray.800"
                    mb={1}
                    _hover={{ color: 'green.600' }}
                    transition="color 0.3s ease"
                  >
                    {property.features?.areaInSquarFoot || 0}
                  </Text>
                  <Text 
                    fontSize={{ base: "xs", sm: "sm" }}
                    color="gray.600" 
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

              {/* Listed Date */}
              <Box
                bg="white"
                borderRadius={{ base: "lg", sm: "xl" }}
                p={{ base: 3, sm: 4 }}
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
                _hover={{
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 32px rgba(159, 122, 234, 0.15)',
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
                    size="45px" 
                    bg="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
                    color="white"
                    mb={3}
                    boxShadow="0 4px 16px rgba(159, 122, 234, 0.3)"
                    _hover={{
                      transform: 'rotate(-3deg) scale(1.1)',
                      boxShadow: '0 8px 24px rgba(159, 122, 234, 0.4)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <Icon as={FaCalendarAlt} size={18} />
                  </Circle>
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    color="gray.800"
                    mb={1}
                    noOfLines={2}
                    _hover={{ color: 'purple.600' }}
                    transition="color 0.3s ease"
                  >
                    {property.listedDate ? formatDate(property.listedDate) : 'N/A'}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color="gray.600" 
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

              <Divider />

          {/* Description */}
              <Box>
                <Heading size={{ base: "sm", sm: "md" }} color="gray.900" mb={{ base: 2, sm: 3 }}>Description</Heading>
                <Text color="gray.700" lineHeight="1.6" fontSize={{ base: "sm", sm: "md" }}>
                  {property.description}
                </Text>
              </Box>

          {/* Amenities - Enhanced with Animations */}
          {property.features?.amenities?.length > 0 && (
            <Box
              bg="white"
              borderRadius={{ base: "xl", sm: "2xl" }}
              p={{ base: 4, sm: 5, md: 6 }}
              border="1px solid"
              borderColor="gray.200"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
            >
              <Flex align="center" mb={{ base: 3, sm: 4 }}>
                <Box
                  p={{ base: 2, sm: 3 }}
                  bg="green.50"
                  borderRadius={{ base: "lg", sm: "xl" }}
                  color="green.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={{ base: 3, sm: 4 }}
                  _hover={{
                    transform: 'rotate(5deg) scale(1.05)',
                    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  <Icon as={FaHome} size={{ base: 18, sm: 20 }} />
                </Box>
                <Box>
                  <Heading size={{ base: "sm", sm: "md" }} color="gray.900" mb={1}>Amenities</Heading>
                  <Text color="gray.600" fontSize={{ base: "xs", sm: "sm" }}>Available features and facilities</Text>
                </Box>
              </Flex>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: 2, sm: 3 }}>
                {property.features.amenities.map((amenity, index) => (
                  <Flex 
                    key={amenity} 
                    align="center" 
                    color="gray.700"
                    p={{ base: 2, sm: 3 }}
                    bg="gray.50"
                    borderRadius={{ base: "md", sm: "lg" }}
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      bg: "brand.50",
                      borderColor: "brand.300",
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)"
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
                      size="10px" 
                      bg="brand.500" 
                      mr={3}
                      _hover={{
                        transform: 'scale(1.2)',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
                      }}
                      transition="all 0.3s ease"
                    />
                    <Text 
                      fontSize={{ base: "xs", sm: "sm" }}
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

              {/* Location & Actions - Enhanced with Animations */}
              <Box
                bg="white"
                borderRadius={{ base: "xl", sm: "2xl" }}
                p={{ base: 4, sm: 5, md: 6 }}
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
              >
                <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="center" textAlign="center">
                  {/* Location Section */}
                  <Box w="full" maxW="500px" display="flex" flexDirection="column" alignItems="center">
                    <VStack spacing={{ base: 3, sm: 4 }} align="center" textAlign="center">
                      <Box
                        p={{ base: 2, sm: 3 }}
                        bg="orange.50"
                        borderRadius={{ base: "lg", sm: "xl" }}
                        color="orange.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{
                          transform: 'rotate(-5deg) scale(1.05)',
                          boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaMapMarkerAlt} size={{ base: 18, sm: 20 }} />
                      </Box>
                      <Box textAlign="center">
                        <Heading size={{ base: "sm", sm: "md" }} color="gray.900" mb={1}>Location</Heading>
                        <Text 
                          color="gray.600" 
                          fontSize={{ base: "xs", sm: "sm" }} 
                          mb={4} // You can adjust the value (e.g., 2, 4, 6)
                        >
                          Property location and directions
                        </Text>                      </Box>
                    </VStack>
                    <Button
                      leftIcon={<FaExternalLinkAlt />}
                      variant="outline"
                      colorScheme="brand"
                      size={{ base: "sm", sm: "md" }}
                      borderRadius={{ base: "md", sm: "lg" }}
                      fontWeight="bold"
                      w="full"
                      onClick={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${property.propertyAddress?.location?.lat},${property.propertyAddress?.location?.lng}`;
                        window.open(url, '_blank');
                      }}
                      _hover={{
                        bg: "brand.50",
                        borderColor: "brand.400",
                        transform: "translateY(-2px) scale(1.02)",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      View on Google Maps
                    </Button>
                  </Box>
                  
                  {/* Action Buttons */}
                  <Box w="full" maxW="500px">
                    <VStack spacing={{ base: 2, sm: 3 }} align="stretch">
                      <Button
                        leftIcon={<FaPhone />}
                        colorScheme="brand"
                        variant="solid"
                        size={{ base: "sm", sm: "md" }}
                        borderRadius={{ base: "md", sm: "lg" }}
                        fontWeight="bold"
                        w="full"
                        _hover={{
                          transform: "translateY(-2px) scale(1.02)",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Contact Agent
                      </Button>
                      <Button
                        leftIcon={<FaEnvelope />}
                        colorScheme="gray"
                        variant="outline"
                        size={{ base: "sm", sm: "md" }}
                        borderRadius={{ base: "md", sm: "lg" }}
                        fontWeight="bold"
                        w="full"
                        _hover={{
                          bg: "gray.50",
                          borderColor: "gray.400",
                          transform: "translateY(-2px) scale(1.02)",
                          boxShadow: "0 4px 12px rgba(113, 128, 150, 0.2)"
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        Send Email
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Image Thumbnails */}
              {hasImages && (
                <Box>
                  <Flex justify="space-between" align="center" mb={{ base: 2, sm: 3 }}>
                    <Heading size={{ base: "sm", sm: "md" }} color="gray.900">Gallery</Heading>
                    <Button
                      leftIcon={<FaUpload />}
                      size={{ base: "xs", sm: "sm" }}
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add Image
                    </Button>
                  </Flex>
                  <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={{ base: 1, sm: 2 }}>
                    {propertyImages.map((image, index) => (
                      <Box
                        key={image._id}
                        position="relative"
                        cursor="pointer"
                        borderRadius="md"
                        overflow="hidden"
                        border={currentImageIndex === index ? '3px solid' : '1px solid'}
                        borderColor={currentImageIndex === index ? 'brand.500' : 'gray.200'}
                        onClick={() => setCurrentImageIndex(index)}
                        transition="all 0.2s"
                        _hover={{ transform: 'scale(1.05)' }}
                      >
                        <Image
                          src={image.thumbnailUrl || image.originalUrl}
                          alt={`Thumbnail ${index + 1}`}
                          w="full"
                          h="60px"
                          objectFit="cover"
                        />
                        <IconButton
                          icon={<FaTrash />}
                          size="xs"
                          position="absolute"
                          top={1}
                          right={1}
                          colorScheme="red"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image._id);
                          }}
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                          transition="opacity 0.2s"
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PropertyPreview; 