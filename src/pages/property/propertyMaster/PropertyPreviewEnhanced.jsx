import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Modal, ModalOverlay, ModalContent, ModalCloseButton,
  Heading, Text, Flex, Grid, Badge, Button, IconButton,
  VStack, HStack, Divider, Image, SimpleGrid,
  Circle, Icon, Spinner, Alert, AlertIcon, Input,
  Tooltip, Progress, AspectRatio, Container, Stack, Wrap, WrapItem
} from '@chakra-ui/react';
import {
  FaTimes, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPhone, FaEnvelope,
  FaUpload, FaTrash, FaExpand, FaCompress, FaShare, FaHome,
  FaHeart, FaStar, FaParking, FaWifi, FaSnowflake, FaDumbbell, FaSwimmingPool,
  FaShieldAlt, FaLeaf, FaCar, FaUtensils, FaTv, FaCouch, FaDoorOpen
} from 'react-icons/fa';
import { 
  fetchPropertyImages, 
  uploadPropertyImage, 
  uploadPropertyImageV2,
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
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const PropertyPreviewEnhanced = ({ isOpen, onClose, property }) => {
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

    if (!file.type.startsWith('image/')) {
      showErrorToast('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Please select an image smaller than 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await uploadPropertyImageV2(property._id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setPropertyImages(prev => [...prev, response.data]);
      
      showSuccessToast('Image uploaded successfully');

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

  const handleDeleteImage = (image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await deletePropertyImage(imageToDelete._id);
      
      setPropertyImages(prev => prev.filter(img => img._id !== imageToDelete._id));
      
      if (currentImageIndex >= propertyImages.length - 1) {
        setCurrentImageIndex(Math.max(0, propertyImages.length - 2));
      }

      showSuccessToast('Image deleted successfully');
    } catch (err) {
      console.error('Failed to delete image:', err);
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

  // Amenities icons mapping
  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'parking': FaParking,
      'wifi': FaWifi,
      'ac': FaSnowflake,
      'gym': FaDumbbell,
      'pool': FaSwimmingPool,
      'security': FaShieldAlt,
      'garden': FaLeaf,
      'car': FaCar,
      'restaurant': FaUtensils,
      'tv': FaTv,
      'furnished': FaCouch,
      'balcony': FaDoorOpen
    };
    
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (lowerAmenity.includes(key)) {
        return icon;
      }
    }
    return FaHome;
  };

  if (!isOpen || !property) return null;

  const currentImage = propertyImages[currentImageIndex] || null;
  const hasImages = propertyImages.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent
        maxW="100vw"
        maxH="100vh"
        borderRadius="0"
        overflow="hidden"
        bg="white"
        mx={0}
        my={0}
        p={0}
      >
        <ModalCloseButton
          position="absolute"
          top={4}
          right={4}
          zIndex={20}
          size="lg"
          {...floatingButtonStyle}
        />

        <Box maxH="100vh" overflowY="auto">
          {/* Hero Image Section */}
          <Box position="relative" h={{ base: '300px', sm: '400px', md: '500px', lg: '600px' }}>
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
                    fallbackSrc="https://via.placeholder.com/1200x800?text=Property+Image"
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
                      size="lg"
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
                      size="lg"
                      {...floatingButtonStyle}
                    />
                  </>
                )}

                {/* Image Counter */}
                <Box
                  position="absolute"
                  bottom={4}
                  right={4}
                  bg="blackAlpha.800"
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                  backdropFilter="blur(10px)"
                >
                  {currentImageIndex + 1} / {propertyImages.length}
                </Box>

                {/* Image Actions */}
                <HStack
                  position="absolute"
                  top={4}
                  right={4}
                  spacing={3}
                  zIndex={10}
                >
                  <Tooltip label="Upload Image">
                    <IconButton
                      icon={<FaUpload />}
                      size="md"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload image"
                      {...floatingButtonStyle}
                    />
                  </Tooltip>
                  <Tooltip label="Fullscreen">
                    <IconButton
                      icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                      size="md"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      aria-label="Toggle fullscreen"
                      {...floatingButtonStyle}
                    />
                  </Tooltip>
                  <Tooltip label="Share">
                    <IconButton
                      icon={<FaShare />}
                      size="md"
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
                    p={3}
                  >
                    <Progress value={uploadProgress} colorScheme="brand" size="sm" />
                    <Text fontSize="xs" textAlign="center" mt={2}>
                      Uploading... {uploadProgress}%
                    </Text>
                  </Box>
                )}
              </>
            ) : (
              <Flex justify="center" align="center" h="full" bg="gray.100">
                <VStack spacing={6}>
                  <Circle size="100px" bg="gray.200">
                    <FaHome size={48} color="#9CA3AF" />
                  </Circle>
                  <VStack spacing={2}>
                    <Text color="gray.500" fontSize="xl" fontWeight="semibold">No images available</Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Upload the first image to showcase this property
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<FaUpload />}
                    colorScheme="brand"
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.3s"
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
              px={4}
              py={2}
              borderRadius="full"
              fontSize="md"
              fontWeight="bold"
              textTransform="uppercase"
              boxShadow="lg"
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
          <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
              {/* Header Information */}
              <Box>
                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb={6}>
                  <Box flex={1}>
                    <Heading size="2xl" color="gray.900" mb={3} lineHeight="1.2">
                      {property.name}
                    </Heading>
                    <Flex align="center" color="gray.600" fontSize="lg" mb={4}>
                      <Icon as={FaMapMarkerAlt} mr={3} color="brand.500" />
                      <Text>
                        {`${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}, ${property.propertyAddress?.state} ${property.propertyAddress?.zipOrPinCode}`}
                      </Text>
                    </Flex>
                  </Box>
                  <Box textAlign={{ base: 'left', md: 'right' }}>
                    <Text fontSize="4xl" fontWeight="black" color="brand.500" mb={2}>
                      {formatPrice(property.price)}
                    </Text>
                    <Badge colorScheme="green" variant="subtle" fontSize="md" px={3} py={1}>
                      <Icon as={FaStar} mr={2} />
                      Premium Property
                    </Badge>
                  </Box>
                </Flex>
              </Box>

              {/* Key Features Grid */}
              <Box 
                bg="gray.50"
                borderRadius="2xl"
                p={8}
                border="1px solid"
                borderColor="gray.200"
                boxShadow="xl"
              >
                <Text 
                  fontSize="xl"
                  fontWeight="bold" 
                  color="gray.800" 
                  mb={6}
                  textAlign="center"
                >
                  Property Highlights
                </Text>
                
                <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={6}>
                  {/* Bedrooms */}
                  <Box
                    bg="white"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '2xl',
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
                        size="60px"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        mb={4}
                        boxShadow="0 8px 24px rgba(102, 126, 234, 0.3)"
                        _hover={{
                          transform: 'rotate(5deg) scale(1.1)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaBed} size={24} />
                      </Circle>
                      <Text 
                        fontSize="2xl"
                        fontWeight="black" 
                        color="gray.800"
                        mb={2}
                      >
                        {property.features?.bedRooms || 0}
                      </Text>
                      <Text 
                        fontSize="sm"
                        color="gray.600" 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Bedrooms
                      </Text>
                    </Box>
                  </Box>

                  {/* Bathrooms */}
                  <Box
                    bg="white"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '2xl',
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
                        size="60px"
                        bg="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
                        color="white"
                        mb={4}
                        boxShadow="0 8px 24px rgba(66, 153, 225, 0.3)"
                        _hover={{
                          transform: 'rotate(-5deg) scale(1.1)',
                          boxShadow: '0 12px 32px rgba(66, 153, 225, 0.4)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaBath} size={24} />
                      </Circle>
                      <Text 
                        fontSize="2xl"
                        fontWeight="black" 
                        color="gray.800"
                        mb={2}
                      >
                        {property.features?.bathRooms || 0}
                      </Text>
                      <Text 
                        fontSize="sm"
                        color="gray.600" 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Bathrooms
                      </Text>
                    </Box>
                  </Box>

                  {/* Square Feet */}
                  <Box
                    bg="white"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '2xl',
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
                        size="60px"
                        bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                        color="white"
                        mb={4}
                        boxShadow="0 8px 24px rgba(72, 187, 120, 0.3)"
                        _hover={{
                          transform: 'rotate(3deg) scale(1.1)',
                          boxShadow: '0 12px 32px rgba(72, 187, 120, 0.4)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaRuler} size={24} />
                      </Circle>
                      <Text 
                        fontSize="2xl"
                        fontWeight="black" 
                        color="gray.800"
                        mb={2}
                      >
                        {property.features?.areaInSquarFoot || 0}
                      </Text>
                      <Text 
                        fontSize="sm"
                        color="gray.600" 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        sq.ft
                      </Text>
                    </Box>
                  </Box>

                  {/* Listed Date */}
                  <Box
                    bg="white"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '2xl',
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
                        size="60px"
                        bg="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
                        color="white"
                        mb={4}
                        boxShadow="0 8px 24px rgba(159, 122, 234, 0.3)"
                        _hover={{
                          transform: 'rotate(-3deg) scale(1.1)',
                          boxShadow: '0 12px 32px rgba(159, 122, 234, 0.4)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaCalendarAlt} size={24} />
                      </Circle>
                      <Text 
                        fontSize="lg"
                        fontWeight="bold" 
                        color="gray.800"
                        mb={2}
                        noOfLines={2}
                      >
                        {property.listedDate ? formatDate(property.listedDate) : 'N/A'}
                      </Text>
                      <Text 
                        fontSize="sm"
                        color="gray.600" 
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wide"
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
                <Heading size="lg" color="gray.900" mb={4}>About This Property</Heading>
                <Text color="gray.700" lineHeight="1.8" fontSize="lg">
                  {property.description}
                </Text>
              </Box>

              {/* Amenities */}
              {property.features?.amenities?.length > 0 && (
                <Box
                  bg="gray.50"
                  borderRadius="2xl"
                  p={8}
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="xl"
                >
                  <Flex align="center" mb={6}>
                    <Box
                      p={4}
                      bg="green.50"
                      borderRadius="xl"
                      color="green.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={4}
                      _hover={{
                        transform: 'rotate(5deg) scale(1.05)',
                        boxShadow: '0 8px 24px rgba(72, 187, 120, 0.3)'
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <Icon as={FaHome} size={24} />
                    </Box>
                    <Box>
                      <Heading size="lg" color="gray.900" mb={2}>Amenities & Features</Heading>
                      <Text color="gray.600" fontSize="md">World-class facilities and modern conveniences</Text>
                    </Box>
                  </Flex>
                  
                  <Wrap spacing={4}>
                    {property.features.amenities.map((amenity, index) => {
                      const AmenityIcon = getAmenityIcon(amenity);
                      return (
                        <WrapItem key={amenity}>
                          <Flex 
                            align="center" 
                            color="gray.700"
                            p={4}
                            bg="white"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="gray.200"
                            _hover={{
                              bg: "brand.50",
                              borderColor: "brand.300",
                              transform: "translateY(-4px) scale(1.02)",
                              boxShadow: "0 12px 32px rgba(102, 126, 234, 0.15)"
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            minW="200px"
                          >
                            <Circle 
                              size="40px" 
                              bg="brand.100" 
                              color="brand.600"
                              mr={3}
                              _hover={{
                                transform: 'scale(1.1)',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                              }}
                              transition="all 0.3s ease"
                            >
                              <Icon as={AmenityIcon} size={16} />
                            </Circle>
                            <Text 
                              fontSize="md"
                              fontWeight="semibold"
                              _hover={{ color: 'brand.600' }}
                              transition="color 0.3s ease"
                            >
                              {amenity}
                            </Text>
                          </Flex>
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </Box>
              )}

              {/* Location & Contact */}
              <Box
                bg="gray.50"
                borderRadius="2xl"
                p={8}
                border="1px solid"
                borderColor="gray.200"
                boxShadow="xl"
              >
                <VStack spacing={8} align="stretch">
                  {/* Location Section */}
                  <Box>
                    <Flex align="center" mb={4}>
                      <Box
                        p={3}
                        bg="orange.50"
                        borderRadius="xl"
                        color="orange.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mr={4}
                        _hover={{
                          transform: 'rotate(-5deg) scale(1.05)',
                          boxShadow: '0 8px 24px rgba(237, 137, 54, 0.3)'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Icon as={FaMapMarkerAlt} size={20} />
                    </Box>
                    <Box>
                      <Heading size="lg" color="gray.900" mb={2}>Location</Heading>
                      <Text color="gray.600" fontSize="md">Prime location with excellent connectivity</Text>
                    </Box>
                  </Flex>
                  
                  <Text 
                    color="gray.700" 
                    fontSize="lg" 
                    mb={4}
                    lineHeight="1.6"
                  >
                    {`${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}, ${property.propertyAddress?.state} ${property.propertyAddress?.zipOrPinCode}`}
                  </Text>
                  
                  <Button
                    leftIcon={<FaExternalLinkAlt />}
                    variant="outline"
                    colorScheme="brand"
                    size="lg"
                    borderRadius="xl"
                    fontWeight="bold"
                    w="full"
                    maxW="300px"
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${property.propertyAddress?.location?.lat},${property.propertyAddress?.location?.lng}`;
                      window.open(url, '_blank');
                    }}
                    _hover={{
                      bg: "brand.50",
                      borderColor: "brand.400",
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    View on Google Maps
                  </Button>
                </Box>
                
                {/* Contact Actions */}
                <Box>
                  <Heading size="lg" color="gray.900" mb={4}>Get in Touch</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Button
                      leftIcon={<FaPhone />}
                      colorScheme="brand"
                      variant="solid"
                      size="lg"
                      borderRadius="xl"
                      fontWeight="bold"
                      h="60px"
                      onClick={() => {
                        const phoneNumber = property.agentPhone || '+1234567890';
                        window.open(`tel:${phoneNumber}`, '_blank');
                      }}
                      _hover={{
                        transform: "translateY(-2px) scale(1.02)",
                        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Call Agent
                    </Button>
                    <Button
                      leftIcon={<FaEnvelope />}
                      colorScheme="gray"
                      variant="outline"
                      size="lg"
                      borderRadius="xl"
                      fontWeight="bold"
                      h="60px"
                      onClick={() => {
                        const subject = `Inquiry about ${property.name}`;
                        const body = `Hi,\n\nI'm interested in the property: ${property.name}\n\nProperty Details:\n- Price: ${formatPrice(property.price)}\n- Address: ${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}\n\nPlease provide more information about this property.\n\nThank you!`;
                        const email = property.agentEmail || 'info@inhabitrealties.com';
                        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      }}
                      _hover={{
                        bg: "gray.50",
                        borderColor: "gray.400",
                        transform: "translateY(-2px) scale(1.02)",
                        boxShadow: "0 8px 24px rgba(113, 128, 150, 0.2)"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      Send Email
                    </Button>
                  </SimpleGrid>
                </Box>
              </Box>

              {/* Image Gallery */}
              {hasImages && (
                <Box>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="lg" color="gray.900">Property Gallery</Heading>
                    <Button
                      leftIcon={<FaUpload />}
                      size="md"
                      variant="outline"
                      colorScheme="brand"
                      borderRadius="xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add Image
                    </Button>
                  </Flex>
                  
                  <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={4}>
                    {propertyImages.map((image, index) => (
                      <Box
                        key={image._id}
                        position="relative"
                        cursor="pointer"
                        borderRadius="xl"
                        overflow="hidden"
                        border={currentImageIndex === index ? '3px solid' : '1px solid'}
                        borderColor={currentImageIndex === index ? 'brand.500' : 'gray.200'}
                        onClick={() => setCurrentImageIndex(index)}
                        transition="all 0.3s"
                        _hover={{ 
                          transform: 'scale(1.05)',
                          boxShadow: 'lg'
                        }}
                        h="80px"
                      >
                        <Image
                          src={image.thumbnailUrl || image.originalUrl}
                          alt={`Thumbnail ${index + 1}`}
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                        <IconButton
                          icon={<FaTrash />}
                          size="xs"
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
                          _hover={{
                            opacity: 1,
                            bg: "red.600",
                            transform: "scale(1.1)"
                          }}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </Container>
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

export default PropertyPreviewEnhanced; 