import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Modal, ModalOverlay, ModalContent, ModalCloseButton,
  Heading, Text, Flex, Grid, Badge, Button, IconButton,
  VStack, HStack, Divider, Image, SimpleGrid,
  Circle, Icon, Spinner, Alert, AlertIcon, Input,
  Tooltip, Progress, AspectRatio, Skeleton, SkeletonText,
  useColorModeValue, Portal
} from '@chakra-ui/react';
import {
  FaTimes, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPhone, FaEnvelope,
  FaUpload, FaTrash, FaDownload, FaExpand, FaCompress, FaShare, FaHome,
  FaHeart, FaStar, FaBuilding, FaUser, FaTag, FaFilePdf,
  FaSearchPlus, FaSearchMinus
} from 'react-icons/fa';
import { 
  fetchPropertyImages, 
  uploadPropertyImageV2,
  deletePropertyImage,
  uploadPropertyBrochure
} from '../../../services/propertyService';
import { submitContactUs } from '../../../services/homeservices/homeService';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { trackPropertyView } from '../../../services/propertyView/propertyViewService';
import { useAuth } from '../../../context/AuthContext';
import { usePropertyTypeContext } from '../../../context/PropertyTypeContext';

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

const PropertyPreview = ({ isOpen, onClose, property, isViewOnly = false, onPropertyUpdate }) => {
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef();
  const brochureInputRef = useRef();
  const imageViewerRef = useRef(null);
  const lastTouchDistance = useRef(0);
  const { isAuthenticated } = useAuth();
  const propertyTypeContext = usePropertyTypeContext();
  const { propertyTypes, getAllPropertyTypes } = propertyTypeContext;

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  const fetchPropertyImagesData = useCallback(async () => {
    if (!property?._id) return;
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
  }, [property?._id]);

  // Check if property is building type
  const isBuildingType = () => {
    if (!property) {
      return false;
    }
    const propertyType = property.propertyTypeId;
    if (!propertyType) {
      return false;
    }
    
    // Handle both cases: propertyTypeId as object (populated) or as string ID
    let typeName = '';
    if (typeof propertyType === 'object' && propertyType !== null && propertyType.typeName) {
      // PropertyTypeId is populated as an object
      typeName = propertyType.typeName;
    } else if (typeof propertyType === 'string' || (typeof propertyType === 'object' && propertyType?._id)) {
      // PropertyTypeId is a string ID or object with _id - look it up in propertyTypes array
      const propertyTypeIdStr = typeof propertyType === 'string' ? propertyType : propertyType._id?.toString();
      
      if (propertyTypes && propertyTypes.length > 0) {
        const foundType = propertyTypes.find(pt => {
          const ptId = pt._id?.toString();
          return ptId === propertyTypeIdStr;
        });
        typeName = foundType?.typeName || '';
        
        // If still not found, try case-insensitive search by ID
        if (!typeName) {
          const foundTypeCaseInsensitive = propertyTypes.find(pt => {
            const ptId = pt._id?.toString().toLowerCase();
            return ptId === propertyTypeIdStr?.toLowerCase();
          });
          typeName = foundTypeCaseInsensitive?.typeName || '';
        }
      }
      
      // Fallback: Check property name if typeName still empty
      if (!typeName) {
        const propertyName = property.name?.toUpperCase() || '';
        if (propertyName.includes('APARTMENT') || propertyName.includes('BUILDING') || 
            propertyName.includes('FLAT') || propertyName.includes('TOWER') ||
            propertyName.includes('CONDOMINIUM')) {
          return true;
        }
      }
    }
    
    // Check if typeName matches building types
    const buildingTypes = ['APARTMENT', 'BUILDING', 'FLAT', 'CONDOMINIUM', 'TOWER'];
    const typeNameUpper = typeName?.toUpperCase() || '';
    const isBuilding = buildingTypes.some(type => {
      // Check exact match or if typeName contains the building type
      return typeNameUpper === type || typeNameUpper.includes(type);
    });
    
   
    return isBuilding;
  };

  // Ensure property types are loaded
  useEffect(() => {
    if (isOpen && getAllPropertyTypes) {
      getAllPropertyTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && property?._id) {
      console.log('[Property Preview] Opening preview for property:', {
        id: property._id,
        name: property.name,
        hasBrochureUrl: !!property.brochureUrl,
        brochureUrl: property.brochureUrl
      });
      
      fetchPropertyImagesData();
      // Set brochure URL from property - use URL as-is (generated by cloudinary.url() like documents)
      // Keep full URL including query parameters (Cloudinary URLs work with query params)
      const url = property?.brochureUrl || null;
      console.log('[Property Preview] Setting brochure URL from property:', url);
      setBrochureUrl(url);
      console.log('[Property Preview] Brochure URL set:', url);
      
      // Track property view if user is authenticated
      if (isAuthenticated && isViewOnly) {
        trackPropertyView(property._id).catch(err => {
          // Silently fail - don't break the UI if tracking fails
          console.error('Failed to track property view:', err);
        });
      }
      
      // Debug: Log modal dimensions after a short delay (removed for simplicity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, property?._id, property?.brochureUrl, property?.buildingStructure, property?.propertyTypeId, isAuthenticated, isViewOnly, propertyTypes]);

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

      const response = await uploadPropertyImageV2(property._id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add new image to the list
      setPropertyImages(prev => [...prev, response.data]);
      setCurrentImageIndex(propertyImages.length); // Show the new image
      
      showSuccessToast('Image uploaded successfully');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
      await deletePropertyImage(imageToDelete._id);
      
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (!isImageViewerOpen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setImageZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  // Touch gesture handlers for pinch to zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (lastTouchDistance.current > 0) {
        const scale = distance / lastTouchDistance.current;
        setImageZoom(prev => Math.max(0.5, Math.min(5, prev * scale)));
      }
      lastTouchDistance.current = distance;
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      setImagePosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = 0;
    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (imageZoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleBrochureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showErrorToast('Please select a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showErrorToast('Please select a PDF smaller than 10MB');
      return;
    }

    setBrochureUploading(true);

    try {
      console.log('[Brochure Upload] Starting upload for property:', {
        propertyId: property._id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const response = await uploadPropertyBrochure(property._id, file);
      console.log('[Brochure Upload] Full response:', response);
      
      // Extract URL - same structure as documents (originalUrl or brochureUrl)
      const url = response?.data?.originalUrl || response?.data?.brochureUrl || response?.data?.data?.originalUrl || response?.data?.data?.brochureUrl;
      console.log('[Brochure Upload] Extracted URL:', url);
      console.log('[Brochure Upload] Response structure:', {
        'response.data': response?.data,
        'response.data.originalUrl': response?.data?.originalUrl,
        'response.data.brochureUrl': response?.data?.brochureUrl,
        'response.data.data': response?.data?.data
      });
      
      if (url) {
        console.log('[Brochure Upload] Setting brochure URL:', url);
        setBrochureUrl(url);
        
        // Update the property object with new brochureUrl
        const updatedProperty = {
          ...property,
          brochureUrl: url
        };
        console.log('[Brochure Upload] Updated property object:', {
          id: updatedProperty._id,
          name: updatedProperty.name,
          brochureUrl: updatedProperty.brochureUrl
        });
        
        // Notify parent component to update property
        if (onPropertyUpdate) {
          console.log('[Brochure Upload] Notifying parent component of property update');
          onPropertyUpdate(updatedProperty);
        } else {
          console.warn('[Brochure Upload] onPropertyUpdate callback not provided');
        }
        
        showSuccessToast('Brochure uploaded successfully');
        console.log('[Brochure Upload] Upload process completed successfully');
      } else {
        console.error('[Brochure Upload] Brochure URL not found in response:', response);
        showErrorToast('Brochure uploaded but URL not received');
      }
      
      // Clear the file input
      if (brochureInputRef.current) {
        brochureInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload brochure:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to upload brochure';
      showErrorToast(errorMessage);
    } finally {
      setBrochureUploading(false);
    }
  };

  const handleDownloadBrochure = () => {
    console.log('[Brochure Download] Button clicked');
    console.log('[Brochure Download] Current brochureUrl state:', brochureUrl);
    console.log('[Brochure Download] Property brochureUrl:', property?.brochureUrl);
    
    // Exact same approach as document management - open in new tab
    if (brochureUrl) {
      console.log('[Brochure Download] Opening brochure URL:', brochureUrl);
      window.open(brochureUrl, '_blank');
    } else {
      console.error('[Brochure Download] Brochure URL not available');
      showErrorToast('Brochure URL not available');
    }
  };

  const handleContactAgent = async () => {
    try {
      // Get user data from localStorage
      const authData = localStorage.getItem('auth');
      if (!authData) {
        showErrorToast('Please login to contact agent');
        return;
      }

      const parsedAuth = JSON.parse(authData);
      const userData = parsedAuth.data;

      if (!userData.firstName || !userData.lastName || !userData.email || !userData.phoneNumber) {
        showErrorToast('User information incomplete. Please update your profile.');
        return;
      }

      setContactLoading(true);

      // Prepare contact message
      const message = `Hi,\n\nI'm interested in the property: ${property.name}\n\nProperty Details:\n- Price: ${formatPrice(property.price)}\n- Address: ${property.propertyAddress?.street}, ${property.propertyAddress?.area}, ${property.propertyAddress?.city}\n\nPlease provide more information about this property.\n\nThank you!`;

      // Submit contact request
      await submitContactUs({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phoneNumber,
        description: message
      });

      showSuccessToast('Contact request sent successfully!');
    } catch (error) {
      console.error('Error sending contact request:', error);
      showErrorToast('Failed to send contact request. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  // Reset fullscreen when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  // Handle global mouse events for image viewer
  useEffect(() => {
    if (isImageViewerOpen) {
      const handleGlobalMouseMove = (e) => {
        if (isDragging && imageZoom > 1) {
          setImagePosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeImageViewer();
        } else if (e.key === '+' || e.key === '=') {
          handleZoomIn();
        } else if (e.key === '-') {
          handleZoomOut();
        } else if (e.key === '0') {
          handleResetZoom();
        } else if (e.key === 'ArrowLeft' && propertyImages.length > 1) {
          prevImage();
          setImageZoom(1);
          setImagePosition({ x: 0, y: 0 });
        } else if (e.key === 'ArrowRight' && propertyImages.length > 1) {
          nextImage();
          setImageZoom(1);
          setImagePosition({ x: 0, y: 0 });
        }
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageViewerOpen, isDragging, imageZoom, dragStart]);

  if (!isOpen || !property) return null;

  const currentImage = propertyImages[currentImageIndex] || null;
  const hasImages = propertyImages.length > 0;

  return (
    <>
    <Portal>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={isFullscreen ? "full" : { base: "full", sm: "full", md: "7xl" }} 
        isCentered={!isFullscreen}
        blockScrollOnMount={true}
        closeOnOverlayClick={true}
        closeOnEsc={true}
        preserveScrollBarGap={false}
      >
        <ModalOverlay 
          bg="blackAlpha.700" 
          backdropFilter="blur(12px)"
          zIndex={1400}
          onClick={(e) => {
            // Prevent overlay clicks from bubbling
            e.stopPropagation();
          }}
        />
      <ModalContent
        maxW={isFullscreen ? "100vw" : { base: "100vw", sm: "100vw", md: "98vw", lg: "95vw", xl: "90vw" }}
        maxH={isFullscreen ? "100vh" : { base: "100vh", sm: "100vh", md: "98vh", lg: "95vh" }}
        borderRadius={isFullscreen ? "0" : { base: "0", sm: "0", md: "3xl" }}
        overflow="hidden"
        bg={bgColor}
        boxShadow={isFullscreen ? "none" : "0 25px 50px rgba(0, 0, 0, 0.25)"}
        mx={isFullscreen ? 0 : { base: 0, sm: 0, md: 4 }}
        my={isFullscreen ? 0 : { base: 0, sm: 0, md: 4 }}
        p={0}
        border={isFullscreen ? "none" : "1px solid"}
        borderColor={borderColor}
        display="flex"
        flexDirection="column"
        zIndex={1500}
        position="relative"
        onClick={(e) => {
          // Prevent clicks from bubbling to parent modal
          e.stopPropagation();
        }}
        onWheel={(e) => {
          // Prevent wheel events from bubbling to parent modal
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Prevent touch events from bubbling to parent modal
          e.stopPropagation();
        }}
      >
        <ModalCloseButton
          position="absolute"
          top={{ base: 3, sm: 4, md: 6 }}
          right={{ base: 3, sm: 4, md: 6 }}
          zIndex={10}
          size={{ base: "sm", sm: "md", md: "lg" }}
          {...floatingButtonStyle}
        />

        <Box 
          flex="1"
          minH="0"
          overflowY="auto" 
          overflowX="hidden"
          p={0}
          data-scrollable="true"
          position="relative"
          zIndex={1}
          onScroll={(e) => {
            // Prevent scroll from bubbling to parent
            e.stopPropagation();
          }}
          onWheel={(e) => {
            // Prevent wheel from bubbling to parent modal
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            // Prevent touch from bubbling to parent modal
            e.stopPropagation();
          }}
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
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
                <Box 
                  position="relative" 
                  h="full" 
                  overflow="hidden" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  bg="gray.100"
                  cursor="pointer"
                  onClick={openImageViewer}
                >
                  <Image
                    src={currentImage?.displayUrl || currentImage?.originalUrl}
                    alt={`${property.name} - Image ${currentImageIndex + 1}`}
                    maxW="100%"
                    maxH="100%"
                    w="auto"
                    h="auto"
                    objectFit="contain"
                    fallbackSrc="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
                    transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                    filter="brightness(0.9) contrast(1.1)"
                    _hover={{ opacity: 0.9 }}
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
                  zIndex={15}
                >
                  {!isViewOnly && (
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
                  )}
                  <Tooltip label="Fullscreen" placement="bottom">
                    <IconButton
                      icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                      size="md"
                      onClick={toggleFullscreen}
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
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
                  {!isViewOnly && (
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
                  )}
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

            {/* Hidden file inputs */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              display="none"
            />
            <Input
              ref={brochureInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleBrochureUpload}
              display="none"
            />
          </Box>

          {/* Content Section - Minimalistic */}
          <Box p={{ base: 4, sm: 5, md: 6 }} pb={{ base: 4, sm: 5, md: 6 }}>
            <VStack spacing={4} align="stretch">
              {/* Header - Minimalistic */}
              <Box>
                <VStack spacing={2} align="start">
                  {/* Property Type and Status Badges */}
                  <HStack spacing={2} flexWrap="wrap">
                    {property.propertyTypeId?.typeName && (
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        {property.propertyTypeId.typeName}
                      </Badge>
                    )}
                    <Badge
                      colorScheme={getStatusColor(property.propertyStatus)}
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      {property.propertyStatus}
                    </Badge>
                  </HStack>

                  <Heading 
                    size={{ base: "md", sm: "lg" }} 
                    color={textColor} 
                    fontWeight="bold"
                    lineHeight="tight"
                  >
                    {property.name}
                  </Heading>
                  
                  {/* Property Type Description */}
                  {property.propertyTypeId?.description && (
                    <Text 
                      fontSize="xs" 
                      color={subTextColor}
                      fontStyle="italic"
                      noOfLines={2}
                    >
                      {property.propertyTypeId.description}
                    </Text>
                  )}
                  
                  <Text 
                    fontSize={{ base: "lg", sm: "xl" }} 
                    fontWeight="bold" 
                    color="brand.500"
                    lineHeight="tight"
                  >
                    {formatPrice(property.price)}
                  </Text>
                </VStack>
              </Box>

              {/* Property Type Information - For All Properties */}
              {property.propertyTypeId && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={4}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" mb={3} gap={2}>
                    <Icon as={FaTag} color="purple.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Property Type Information</Text>
                  </Flex>
                  <VStack spacing={2} align="stretch" fontSize="sm">
                    {property.propertyTypeId.typeName && (
                      <HStack>
                        <Text color={subTextColor} minW="120px" fontWeight="medium" fontSize="xs">Type Name:</Text>
                        <Text color={textColor} fontSize="sm" fontWeight="medium">
                          {property.propertyTypeId.typeName}
                        </Text>
                      </HStack>
                    )}
                    {property.propertyTypeId.description && (
                      <HStack align="start">
                        <Text color={subTextColor} minW="120px" fontWeight="medium" fontSize="xs">Description:</Text>
                        <Text color={textColor} fontSize="sm" flex={1}>
                          {property.propertyTypeId.description}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              )}

              {/* Full Address Details Section */}
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor={borderColor}
              >
                <Flex align="center" mb={3} gap={2}>
                  <Icon as={FaMapMarkerAlt} color="brand.500" boxSize="16px" />
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>Complete Address</Text>
                </Flex>
                <VStack spacing={2} align="stretch" fontSize="sm">
                  {property.propertyAddress?.street && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">Street:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.street}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.area && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">Area:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.area}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.city && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">City:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.city}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.state && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">State:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.state}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.zipOrPinCode && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">PIN Code:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.zipOrPinCode}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.country && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">Country:</Text>
                      <Text color={textColor} fontSize="sm">{property.propertyAddress.country}</Text>
                    </HStack>
                  )}
                  {property.propertyAddress?.location?.lat && property.propertyAddress?.location?.lng && (
                    <HStack>
                      <Text color={subTextColor} minW="100px" fontWeight="medium" fontSize="xs">Coordinates:</Text>
                      <Text color={textColor} fontSize="xs">
                        Lat: {property.propertyAddress.location.lat.toFixed(6)}, Lng: {property.propertyAddress.location.lng.toFixed(6)}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {/* Owner Information Section - Minimalistic */}
              {property.owner && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={4}
                border="1px solid"
                borderColor={borderColor}
                >
                  <Flex align="center" mb={3} gap={2}>
                    <Icon as={FaUser} color="brand.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Agent</Text>
                  </Flex>
                  
                  <VStack spacing={2} align="stretch">
                    <HStack spacing={2}>
                      <Text fontSize="xs" color={subTextColor} minW="60px">Name:</Text>
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {property.owner.firstName} {property.owner.lastName}
                      </Text>
                    </HStack>
                    
                    {property.owner.email && (
                      <HStack spacing={2}>
                        <Text fontSize="xs" color={subTextColor} minW="60px">Email:</Text>
                        <HStack spacing={1} flex={1}>
                          <Icon as={FaEnvelope} color="brand.500" boxSize="12px" />
                          <Text fontSize="xs" fontWeight="medium" color={textColor} noOfLines={1}>
                            {property.owner.email}
                          </Text>
                        </HStack>
                      </HStack>
                    )}
                    
                    {property.owner.phoneNumber && (
                      <HStack spacing={2}>
                        <Text fontSize="xs" color={subTextColor} minW="60px">Phone:</Text>
                        <HStack spacing={1}>
                          <Icon as={FaPhone} color="brand.500" boxSize="12px" />
                          <Text fontSize="xs" fontWeight="medium" color={textColor}>
                            {property.owner.phoneNumber}
                          </Text>
                        </HStack>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              )}

              {/* Features Grid - Comprehensive */}
              <Box 
                bg={cardBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor={borderColor}
              >
                <Text 
                  fontSize="sm"
                  fontWeight="semibold" 
                  color={textColor} 
                  mb={3}
                >
                  Property Features
                </Text>
                
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={3}>
                  {/* BHK - Minimalistic */}
                  {property.features?.bhk && (
                    <Box
                      bg="white"
                      borderRadius="md"
                      p={3}
                      textAlign="center"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Icon as={FaHome} color="purple.500" boxSize="20px" mb={1} />
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {property.features.bhk} BHK
                      </Text>
                      <Text fontSize="xs" color={subTextColor}>
                        Bedroom Hall Kitchen
                      </Text>
                    </Box>
                  )}

                  {/* Bedrooms - Minimalistic */}
                  <Box
                    bg="white"
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaBed} color="brand.500" boxSize="20px" mb={1} />
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {property.features?.bedRooms || 0}
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      Bedrooms
                    </Text>
                  </Box>

                  {/* Bathrooms - Minimalistic */}
                  <Box
                    bg="white"
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaBath} color="blue.500" boxSize="20px" mb={1} />
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {property.features?.bathRooms || 0}
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      Bathrooms
                    </Text>
                  </Box>

                  {/* Square Feet - Minimalistic */}
                  <Box
                    bg="white"
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaRuler} color="green.500" boxSize="20px" mb={1} />
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {property.features?.areaInSquarFoot || 0}
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      sq.ft
                    </Text>
                  </Box>

                  {/* Listed Date - Minimalistic */}
                  <Box
                    bg="white"
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaCalendarAlt} color="purple.500" boxSize="20px" mb={1} />
                    <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={1}>
                      {property.listedDate ? formatDate(property.listedDate) : 'N/A'}
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      Listed Date
                    </Text>
                  </Box>

                  {/* Property Status - Additional Info */}
                  <Box
                    bg="white"
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Icon as={FaTag} color={getStatusColor(property.propertyStatus) + ".500"} boxSize="20px" mb={1} />
                    <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={1}>
                      {property.propertyStatus || 'N/A'}
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      Status
                    </Text>
                  </Box>

                  {/* Property Type - Additional Info */}
                  {property.propertyTypeId?.typeName && (
                    <Box
                      bg="white"
                      borderRadius="md"
                      p={3}
                      textAlign="center"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Icon as={FaBuilding} color="orange.500" boxSize="20px" mb={1} />
                      <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={1}>
                        {property.propertyTypeId.typeName}
                      </Text>
                      <Text fontSize="xs" color={subTextColor}>
                        Type
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>
              </Box>

              <Divider borderColor={borderColor} />

              {/* Description - Minimalistic */}
              {property.description && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={4}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" gap={2} mb={2}>
                    <Icon as={FaBuilding} color="brand.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Description</Text>
                  </Flex>
                  <Text 
                    color={subTextColor} 
                    lineHeight="1.6" 
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                  >
                    {property.description}
                  </Text>
              </Box>
              )}

              {/* Amenities - Minimalistic */}
              {property.features?.amenities?.length > 0 && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={4}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" gap={2} mb={3}>
                    <Icon as={FaHome} color="green.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Amenities</Text>
                  </Flex>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={2}>
                    {property.features.amenities.map((amenity) => (
                      <Flex 
                        key={amenity} 
                        align="center" 
                        gap={2}
                        p={2}
                        bg="white"
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderColor}
                      >
                        <Circle size="6px" bg="green.500" />
                        <Text fontSize="xs" color={textColor}>
                          {amenity}
                        </Text>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Building Structure Information - Show for building/apartment type properties */}
              {isBuildingType() && (
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={4}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" gap={2} mb={3}>
                    <Icon as={FaBuilding} color="blue.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Building / Apartment Structure</Text>
                  </Flex>
                  
                  {property?.buildingStructure ? (
                    <>
                      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
                        {property.buildingStructure.totalFloors ? (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Total Floors</Text>
                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                              {property.buildingStructure.totalFloors}
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Total Floors</Text>
                            <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                              Not specified
                            </Text>
                          </Box>
                        )}
                        
                        {property.buildingStructure.flatsPerFloor ? (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Flats Per Floor</Text>
                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                              {property.buildingStructure.flatsPerFloor}
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Flats Per Floor</Text>
                            <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                              Not specified
                            </Text>
                          </Box>
                        )}
                        
                        {(property.buildingStructure.totalFlats || 
                          (property.buildingStructure.totalFloors && property.buildingStructure.flatsPerFloor)) ? (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Total Flats</Text>
                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                              {property.buildingStructure.totalFlats || 
                               (property.buildingStructure.totalFloors * property.buildingStructure.flatsPerFloor)}
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            bg="white"
                            borderRadius="md"
                            p={3}
                            textAlign="center"
                            border="1px solid"
                            borderColor={borderColor}
                          >
                            <Text fontSize="xs" color={subTextColor} mb={1}>Total Flats</Text>
                            <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                              Not specified
                            </Text>
                          </Box>
                        )}
                      </SimpleGrid>
                      
                      {/* Additional Building Info */}
                      <VStack spacing={2} align="stretch" mt={4}>
                        <Text fontSize="xs" color={subTextColor} fontWeight="medium">Building Details:</Text>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                          <HStack>
                            <Text fontSize="xs" color={subTextColor} minW="100px">Property Type:</Text>
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              {property.propertyTypeId?.typeName || 'N/A'}
                            </Text>
                          </HStack>
                          {property.propertyTypeId?.description && (
                            <HStack>
                              <Text fontSize="xs" color={subTextColor} minW="100px">Type Description:</Text>
                              <Text fontSize="xs" color={textColor} noOfLines={2}>
                                {property.propertyTypeId.description}
                              </Text>
                            </HStack>
                          )}
                        </SimpleGrid>
                      </VStack>
                    </>
                  ) : (
                    <VStack spacing={3} align="stretch">
                      <Alert status="info" borderRadius="md" fontSize="xs">
                        <AlertIcon boxSize="14px" />
                        <Text fontSize="xs">
                          Building structure details are not available for this property. Please add building structure information (total floors, flats per floor) in the property edit form.
                        </Text>
                      </Alert>
                      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
                        <Box
                          bg="white"
                          borderRadius="md"
                          p={3}
                          textAlign="center"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <Text fontSize="xs" color={subTextColor} mb={1}>Total Floors</Text>
                          <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                            Not specified
                          </Text>
                        </Box>
                        <Box
                          bg="white"
                          borderRadius="md"
                          p={3}
                          textAlign="center"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <Text fontSize="xs" color={subTextColor} mb={1}>Flats Per Floor</Text>
                          <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                            Not specified
                          </Text>
                        </Box>
                        <Box
                          bg="white"
                          borderRadius="md"
                          p={3}
                          textAlign="center"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <Text fontSize="xs" color={subTextColor} mb={1}>Total Flats</Text>
                          <Text fontSize="sm" fontWeight="medium" color={subTextColor} fontStyle="italic">
                            Not specified
                          </Text>
                        </Box>
                      </SimpleGrid>
                      {/* Additional Building Info */}
                      <VStack spacing={2} align="stretch" mt={4}>
                        <Text fontSize="xs" color={subTextColor} fontWeight="medium">Building Details:</Text>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                          <HStack>
                            <Text fontSize="xs" color={subTextColor} minW="100px">Property Type:</Text>
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              {property.propertyTypeId?.typeName || 'N/A'}
                            </Text>
                          </HStack>
                          {property.propertyTypeId?.description && (
                            <HStack>
                              <Text fontSize="xs" color={subTextColor} minW="100px">Type Description:</Text>
                              <Text fontSize="xs" color={textColor} noOfLines={2}>
                                {property.propertyTypeId.description}
                              </Text>
                            </HStack>
                          )}
                        </SimpleGrid>
                      </VStack>
                    </VStack>
                  )}
                </Box>
              )}

              {/* Brochure Section - Minimalistic */}
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor={borderColor}
              >
                <Flex align="center" mb={3} justify="space-between">
                  <Flex align="center" gap={2}>
                    <Icon as={FaFilePdf} color="red.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Brochure</Text>
                  </Flex>
                  {!isViewOnly && (
                    <Button
                      leftIcon={<FaUpload />}
                      size="xs"
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => brochureInputRef.current?.click()}
                      isLoading={brochureUploading}
                      loadingText="Uploading..."
                    >
                      {brochureUrl ? 'Update' : 'Upload'}
                    </Button>
                  )}
                </Flex>
                
                {brochureUrl ? (
                  <HStack spacing={2} justify="center">
                      <Button
                        leftIcon={<FaDownload />}
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadBrochure}
                        w="full"
                      >
                        Download Brochure
                      </Button>
                    </HStack>
                ) : (
                  <Text fontSize="xs" color={subTextColor} textAlign="center" py={2}>
                    No brochure available
                      </Text>
                )}
              </Box>

              {/* Location & Actions - Minimalistic */}
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor={borderColor}
              >
                <VStack spacing={3} align="stretch">
                  <Flex align="center" gap={2} mb={2}>
                    <Icon as={FaMapMarkerAlt} color="orange.500" boxSize="16px" />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>Location</Text>
                  </Flex>
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
                    View on Maps
                      </Button>
                  <Button
                    leftIcon={<FaPhone />}
                    colorScheme="brand"
                    variant="solid"
                    size="sm"
                    isLoading={contactLoading}
                    loadingText="Sending..."
                    onClick={handleContactAgent}
                  >
                    Contact Agent
                  </Button>
                </VStack>
              </Box>

              {/* Enhanced Image Thumbnails - AdminMeetings Style */}
              {hasImages && (
                <Box>
                  <Flex justify="space-between" align="center" mb={{ base: 4, sm: 6 }}>
                    <Heading size={{ base: "md", sm: "lg" }} color={textColor}>Gallery</Heading>
                    {!isViewOnly && (
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
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={{ base: 2, sm: 3 }}>
                    {propertyImages.map((image, index) => (
                      <VStack
                        key={image._id}
                        spacing={0}
                        align="stretch"
                      >
                        <Box
                          position="relative"
                          cursor="pointer"
                          borderRadius="xl"
                          overflow="hidden"
                          border={currentImageIndex === index ? '3px solid' : '1px solid'}
                          borderColor={currentImageIndex === index ? 'brand.500' : borderColor}
                          onClick={() => setCurrentImageIndex(index)}
                          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                          bg="white"
                          boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                          _hover={{
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                            transform: 'scale(1.02)'
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
                        {/* Delete Button Below Image */}
                        {!isViewOnly && (
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="solid"
                            leftIcon={<FaTrash />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(image);
                            }}
                            w="full"
                            borderRadius="md"
                            mt={1}
                            fontSize="xs"
                            h="24px"
                            _hover={{
                              bg: "red.600",
                              transform: "scale(1.02)"
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </VStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>
      </ModalContent>
      </Modal>
    </Portal>

      {/* Fullscreen Image Viewer Modal */}
      <Modal
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        size="full"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(4px)" />
        <ModalContent
          bg="black"
          maxW="100vw"
          maxH="100vh"
          m={0}
          p={0}
          borderRadius={0}
          onWheel={handleWheel}
        >
          <Box
            position="relative"
            w="100vw"
            h="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            ref={imageViewerRef}
          >
            {/* Close Button */}
            <IconButton
              icon={<FaTimes />}
              position="absolute"
              top={4}
              right={4}
              zIndex={10}
              size="lg"
              colorScheme="red"
              variant="solid"
              onClick={closeImageViewer}
              aria-label="Close image viewer"
              borderRadius="full"
              bg="rgba(0,0,0,0.7)"
              color="white"
              _hover={{ bg: "rgba(0,0,0,0.9)" }}
            />

            {/* Zoom Controls */}
            <VStack
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              zIndex={10}
              spacing={2}
            >
              <IconButton
                icon={<FaSearchPlus />}
                size="lg"
                colorScheme="blue"
                variant="solid"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                borderRadius="full"
                bg="rgba(0,0,0,0.7)"
                color="white"
                _hover={{ bg: "rgba(0,0,0,0.9)" }}
                isDisabled={imageZoom >= 5}
              />
              <IconButton
                icon={<FaSearchMinus />}
                size="lg"
                colorScheme="blue"
                variant="solid"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                borderRadius="full"
                bg="rgba(0,0,0,0.7)"
                color="white"
                _hover={{ bg: "rgba(0,0,0,0.9)" }}
                isDisabled={imageZoom <= 0.5}
              />
              {imageZoom !== 1 && (
                <Button
                  size="sm"
                  colorScheme="gray"
                  variant="solid"
                  onClick={handleResetZoom}
                  borderRadius="full"
                  bg="rgba(0,0,0,0.7)"
                  color="white"
                  _hover={{ bg: "rgba(0,0,0,0.9)" }}
                  fontSize="xs"
                >
                  Reset
                </Button>
              )}
            </VStack>

            {/* Zoom Level Indicator */}
            <Box
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              zIndex={10}
              bg="rgba(0,0,0,0.7)"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
            >
              {Math.round(imageZoom * 100)}%
            </Box>

            {/* Image Navigation (if multiple images) */}
            {propertyImages.length > 1 && (
              <>
                <IconButton
                  icon={<FaChevronLeft />}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={10}
                  size="lg"
                  colorScheme="blue"
                  variant="solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                    setImageZoom(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  aria-label="Previous image"
                  borderRadius="full"
                  bg="rgba(0,0,0,0.7)"
                  color="white"
                  _hover={{ bg: "rgba(0,0,0,0.9)" }}
                />
                <IconButton
                  icon={<FaChevronRight />}
                  position="absolute"
                  right={20}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={10}
                  size="lg"
                  colorScheme="blue"
                  variant="solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                    setImageZoom(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  aria-label="Next image"
                  borderRadius="full"
                  bg="rgba(0,0,0,0.7)"
                  color="white"
                  _hover={{ bg: "rgba(0,0,0,0.9)" }}
                />
                <Box
                  position="absolute"
                  top={4}
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={10}
                  bg="rgba(0,0,0,0.7)"
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {currentImageIndex + 1} / {propertyImages.length}
                </Box>
              </>
            )}

            {/* Zoomable Image */}
            <Box
              position="relative"
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              cursor={imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              style={{ touchAction: 'none' }}
            >
              <Box
                position="relative"
                transform={`translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`}
                transformOrigin="center center"
                transition={isDragging ? 'none' : 'transform 0.1s ease-out'}
                style={{
                  willChange: 'transform'
                }}
              >
                <Image
                  src={currentImage?.displayUrl || currentImage?.originalUrl}
                  alt={`${property.name} - Image ${currentImageIndex + 1}`}
                  maxW="90vw"
                  maxH="90vh"
                  w="auto"
                  h="auto"
                  objectFit="contain"
                  userSelect="none"
                  draggable={false}
                  pointerEvents="none"
                />
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>

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
    </>
  );
};

export default PropertyPreview; 