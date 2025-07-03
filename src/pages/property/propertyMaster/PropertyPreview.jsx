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
  FaUpload, FaTrash, FaDownload, FaExpand, FaCompress, FaShare
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
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        maxW="90vw"
        maxH="90vh"
        borderRadius="2xl"
        overflow="hidden"
        bg="white"
        boxShadow="2xl"
      >
        <ModalCloseButton
          position="absolute"
          top={4}
          right={4}
          zIndex={10}
          {...floatingButtonStyle}
        />

        <Box maxH="90vh" overflowY="auto">
          {/* Image Gallery Section */}
          <Box position="relative" h={{ base: '300px', md: '400px', lg: '500px' }}>
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
          <Box p={{ base: 4, md: 6, lg: 8 }}>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Box>
                <Heading size="lg" color="gray.900" mb={2}>
                  {property.name}
                </Heading>
                <Flex align="center" color="gray.600" fontSize="sm" mb={3}>
                  <Icon as={FaMapMarkerAlt} mr={2} />
                  <Text>
                    {`${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}, ${property.propertyAddress?.state} ${property.propertyAddress?.zipOrPinCode}`}
                  </Text>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              {formatPrice(property.price)}
                </Text>
              </Box>

          {/* Features Grid */}
              <SimpleGrid columns={{ base: 3, md: 4 }} spacing={4} py={4}>
                <VStack spacing={1}>
                  <Circle size="40px" bg="brand.50" color="brand.600">
                    <Icon as={FaBed} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {property.features?.bedRooms || 0}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Bedrooms</Text>
                </VStack>
                <VStack spacing={1}>
                  <Circle size="40px" bg="blue.50" color="blue.600">
                    <Icon as={FaBath} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {property.features?.bathRooms || 0}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Bathrooms</Text>
                </VStack>
                <VStack spacing={1}>
                  <Circle size="40px" bg="green.50" color="green.600">
                    <Icon as={FaRuler} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {property.features?.areaInSquarFoot || 0}
                  </Text>
                  <Text fontSize="xs" color="gray.500">sq.ft</Text>
                </VStack>
                <VStack spacing={1}>
                  <Circle size="40px" bg="purple.50" color="purple.600">
                    <Icon as={FaCalendarAlt} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {property.listedDate ? formatDate(property.listedDate) : 'N/A'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Listed</Text>
                </VStack>
              </SimpleGrid>

              <Divider />

          {/* Description */}
              <Box>
                <Heading size="md" color="gray.900" mb={3}>Description</Heading>
                <Text color="gray.700" lineHeight="1.6">
                  {property.description}
                </Text>
              </Box>

          {/* Amenities */}
              {property.features?.amenities?.length > 0 && (
                <Box>
                  <Heading size="md" color="gray.900" mb={3}>Amenities</Heading>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={2}>
              {property.features.amenities.map((amenity) => (
                      <Flex key={amenity} align="center" color="gray.700">
                        <Circle size="8px" bg="brand.500" mr={2} />
                        <Text fontSize="sm">{amenity}</Text>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Location & Actions */}
              <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={4} alignItems="center">
                <Box>
                  <Heading size="md" color="gray.900" mb={2}>Location</Heading>
                  <Button
                    leftIcon={<FaExternalLinkAlt />}
                    variant="outline"
                    colorScheme="brand"
                    size="sm"
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${property.propertyAddress?.location?.lat},${property.propertyAddress?.location?.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    View on Google Maps
                  </Button>
                </Box>
                
                <HStack spacing={3}>
                  <Button
                    leftIcon={<FaPhone />}
                    colorScheme="brand"
                    variant="solid"
                    size="sm"
                  >
                    Contact
                  </Button>
                  <Button
                    leftIcon={<FaEnvelope />}
                    colorScheme="gray"
                    variant="outline"
                    size="sm"
                  >
                    Email
                  </Button>
                </HStack>
              </Grid>

              {/* Image Thumbnails */}
              {hasImages && (
                <Box>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md" color="gray.900">Gallery</Heading>
                    <Button
                      leftIcon={<FaUpload />}
                      size="sm"
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add Image
                    </Button>
                  </Flex>
                  <SimpleGrid columns={{ base: 4, md: 6, lg: 8 }} spacing={2}>
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