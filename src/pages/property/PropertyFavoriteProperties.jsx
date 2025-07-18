import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaBed, FaBath, FaRuler, FaEye, FaImage } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Box, Heading, Flex, Grid, IconButton, Text, Badge, Image, Skeleton, SkeletonText, Button } from '@chakra-ui/react';
import PropertyPreview from './propertyMaster/PropertyPreview';
import CommonCard from '../../components/common/Card/CommonCard';
import Loader from '../../components/common/Loader';
import { usePropertyTypeContext } from '../../context/PropertyTypeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchProperties, 
  fetchPropertiesWithParams
} from '../../services/propertyService';
import { 
  deleteFavoriteProperty,
  getFavoritePropertiesWithParams
} from '../../services/favoriteproperty/favoritePropertyService';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import ServerError from '../../components/common/errors/ServerError';
import NoInternet from '../../components/common/errors/NoInternet';
import { ROUTES } from '../../utils/constants';

const PropertyFavoriteProperties = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('ALL');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoriteRecordIds, setFavoriteRecordIds] = useState({}); // Store favorite record IDs
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [clearAllLoading, setClearAllLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Get property type context and auth context
  const propertyTypeContext = usePropertyTypeContext();
  const { propertyTypes, getAllPropertyTypes, loading: propertyTypesLoading } = propertyTypeContext;
  const { getUserId, isAuthenticated } = useAuth();

  // Fetch properties and favorites on component mount
  useEffect(() => {
    fetchAllProperties();
    getAllPropertyTypes();
    if (isAuthenticated) {
      fetchUserFavorites();
    }
  }, [getAllPropertyTypes, isAuthenticated]);

  const fetchUserFavorites = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      
      // Use the favorite property search endpoint with user filter
      const searchParams = {
        userId: userId,
        propertyId: null,
        createdByUserId: null,
        updatedByUserId: null,
        published: true
      };
      
      const response = await getFavoritePropertiesWithParams(searchParams);
      const favoritePropertyIds = response.data.map(fav => fav.propertyId);
      
      // Store favorite record IDs for direct deletion
      const recordIdsMap = {};
      response.data.forEach(fav => {
        recordIdsMap[fav.propertyId] = fav._id;
      });
      
      setFavorites(favoritePropertyIds);
      setFavoriteRecordIds(recordIdsMap);
    } catch (error) {
      console.error('Failed to fetch user favorites:', error);
      showErrorToast('Failed to load favorites');
    }
  };

  const fetchAllProperties = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const response = await fetchProperties();
      console.log('PropertyFavoriteProperties: Fetch properties response:', response);
      setAllProperties(response.data || []);
    } catch (error) {
      if (error.message === 'Network Error') setErrorType('network');
      else if (error.response?.status === 500) setErrorType('server');
      else setErrorType('server');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySearch = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedType && selectedType !== 'ALL') params.propertyType = selectedType;
      const response = await fetchPropertiesWithParams(params);
      setAllProperties(response.data || []);
    } catch (error) {
      if (error.message === 'Network Error') setErrorType('network');
      else if (error.response?.status === 500) setErrorType('server');
      else setErrorType('server');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (property) => {
    setSelectedProperty(property);
    setIsPreviewOpen(true);
  };

  const removeFromFavorites = async (propertyId) => {
    if (!isAuthenticated) {
      showErrorToast('Please login to manage favorites');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      showErrorToast('User not found');
      return;
    }

    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      const favoriteRecordId = favoriteRecordIds[propertyId];
      if (!favoriteRecordId) {
        showErrorToast('Favorite record not found');
        return;
      }
      
      await deleteFavoriteProperty(favoriteRecordId);
      setFavorites(prev => prev.filter(id => id !== propertyId));
      
      // Remove from favoriteRecordIds map
      setFavoriteRecordIds(prev => {
        const newMap = { ...prev };
        delete newMap[propertyId];
        return newMap;
      });
      
      showSuccessToast('Property removed from favorites');
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      showErrorToast(errorMessage);
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const clearAllFavorites = async () => {
    if (!isAuthenticated) {
      showErrorToast('Please login to manage favorites');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      showErrorToast('User not found');
      return;
    }

    setClearAllLoading(true);

    try {
      // Use the stored favorite record IDs instead of making an API call
      const recordIds = Object.values(favoriteRecordIds);
      
      // Delete all favorite records using stored IDs
      for (const recordId of recordIds) {
        await deleteFavoriteProperty(recordId);
      }
      
      setFavorites([]);
      setFavoriteRecordIds({}); // Clear the map
      showSuccessToast('All favorites cleared');
    } catch (error) {
      console.error('Failed to clear all favorites:', error);
      showErrorToast('Failed to clear all favorites');
    } finally {
      setClearAllLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Helper function to get fallback image based on property type
  const getFallbackImage = (property) => {
    // Free, high-quality property images (completely free to use, no attribution required)
    const fallbackImages = [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643386/pexels-photo-1643386.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643388/pexels-photo-1643388.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643390/pexels-photo-1643390.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643391/pexels-photo-1643391.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643392/pexels-photo-1643392.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643393/pexels-photo-1643393.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643394/pexels-photo-1643394.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643395/pexels-photo-1643395.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643396/pexels-photo-1643396.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643397/pexels-photo-1643397.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643398/pexels-photo-1643398.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643399/pexels-photo-1643399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    // Use property ID to consistently select the same fallback image
    if (property._id) {
      const index = property._id.toString().charCodeAt(0) % fallbackImages.length;
      return fallbackImages[index];
    }
    
    // Default fallback
    return fallbackImages[0];
  };

  // Helper function to get property image
  const getPropertyImage = (property) => {
    // If property has images array and first image exists
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    
    // If property has a single image string
    if (property.image) {
      return property.image;
    }
    
    // Use fallback image
    return getFallbackImage(property);
  };

  // Filter properties to show only favorites
  const favoriteProps = allProperties.filter(property => favorites.includes(property._id));

  const filteredProperties = selectedType === 'ALL' 
    ? favoriteProps 
    : favoriteProps.filter(property => {
        const type = propertyTypes.find(t => t._id === property.propertyTypeId);
        return type?.typeName === selectedType;
      });

  if (errorType === 'network') return <NoInternet onRetry={fetchAllProperties} />;
  if (errorType === 'server') return <ServerError onRetry={fetchAllProperties} />;

  return (
    <Box p={{ base: 3, md: 5 }}>
      {/* Loader at the top, non-blocking */}
      {(loading || propertyTypesLoading) && <Loader size="xl" />}
      
      {/* Header Section */}
      <Flex 
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between" 
        align={{ base: 'flex-start', sm: 'center' }} 
        mb={6}
        gap={{ base: 3, sm: 0 }}
      >
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Property Favorite Properties
        </Heading>
        
      </Flex>

      {/* Empty State */}
      {favorites.length === 0 && (
        <Box textAlign="center" py={16} px={4}>
          <Box
            w="100px"
            h="100px"
            mx="auto"
            mb={6}
            borderRadius="full"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FaHeart size={40} color="#9CA3AF" />
          </Box>
          <Heading size="md" color="gray.600" mb={4}>
            No Favorite Properties
          </Heading>
          <Text color="gray.500" mb={6} maxW="400px" mx="auto">
            You haven't added any properties to your favorites yet. Start exploring properties and click the heart icon to save them here.
          </Text>
          <Flex gap={3} justify="center">
            {/* <Button
              colorScheme="brand"
              onClick={() => navigate(ROUTES.PROPERTY_MASTER)}
            >
              Browse Properties
            </Button> */}
            <Button
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate(ROUTES.PROPERTY_MASTER)}
            >
              View All Properties
            </Button>
          </Flex>
        </Box>
      )}

      {favorites.length > 0 && (
        <>
          {/* Search and Filter Section */}
          <Flex gap={2} align="center" mb={4} wrap="wrap" direction={{ base: 'column', md: 'row' }}>
            <Box flex="1" minW={{ base: '100%', sm: '180px' }}>
              <input
                type="text"
                placeholder="Search favorite properties..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  background: '#fff',
                  outline: 'none',
                  marginRight: '8px',
                  boxShadow: '0 1px 2px 0 rgba(80, 36, 143, 0.04)'
                }}
                onKeyDown={e => { if (e.key === 'Enter') handlePropertySearch(); }}
              />
            </Box>
            <Box>
              <button
                onClick={handlePropertySearch}
                style={{
                  background: 'linear-gradient(90deg, #805AD5 0%, #6B46C1 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgba(80, 36, 143, 0.08)',
                  maxWidth: '160px',
                  width: '100%'
                }}
              >
                Search
              </button>
            </Box>
          </Flex>

          {/* Property Types Filter - Responsive */}
          <Box 
            mb={6} 
            overflowX="auto" 
            pb={2}
            sx={{
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'gray.100',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'brand.400',
                borderRadius: '2px',
              },
            }}
          >
            <Flex 
              gap={{ base: 2, md: 3 }} 
              minW="max-content"
              px={{ base: 1, md: 0 }}
            >
              <CommonCard
                px={{ base: 2, md: 3 }}
                py={{ base: 1, md: 2 }}
                onClick={() => setSelectedType('ALL')}
                _hover={{ 
                  borderColor: selectedType === 'ALL' ? 'brand.500' : 'gray.300',
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }}
                bg={selectedType === 'ALL' ? 'gray.50' : 'white'}
                borderColor={selectedType === 'ALL' ? 'brand.500' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.2s"
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight="medium"
                whiteSpace="nowrap"
              >
                All Properties
              </CommonCard>
              {propertyTypes.map((type) => (
                <CommonCard
                  key={type._id}
                  px={{ base: 2, md: 3 }}
                  py={{ base: 1, md: 2 }}
                  onClick={() => setSelectedType(type.typeName)}
                  _hover={{ 
                    borderColor: selectedType === type.typeName ? 'brand.500' : 'gray.300',
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                  }}
                  bg={selectedType === type.typeName ? 'gray.50' : 'white'}
                  borderColor={selectedType === type.typeName ? 'brand.500' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  cursor="pointer"
                  transition="all 0.2s"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  fontWeight="medium"
                  whiteSpace="nowrap"
                >
                  {type.typeName}
                </CommonCard>
              ))}
            </Flex>
          </Box>

          
          {favorites.length > 0 && (
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={clearAllFavorites}
            leftIcon={<FaHeart />}
            isLoading={clearAllLoading}
            loadingText="Clearing..."
            disabled={clearAllLoading}
            _hover={{
              bg: clearAllLoading ? "red.50" : "red.50",
              borderColor: "red.400",
              transform: clearAllLoading ? "none" : "translateY(-1px)",
              boxShadow: clearAllLoading ? "none" : "md"
            }}
            transition="all 0.2s"
            opacity={clearAllLoading ? 0.7 : 1}
          >
            Clear All
          </Button>
        )}

          {/* Properties Count */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            mb={4}
            fontWeight="medium"
          >
            {filteredProperties.length} {filteredProperties.length === 1 ? 'favorite property' : 'favorite properties'} found
          </Text>

          {/* Properties Grid - Responsive */}
          <Grid 
            templateColumns={{ 
              base: 'repeat(2, 1fr)', 
              sm: 'repeat(3, 1fr)', 
              md: 'repeat(4, 1fr)', 
              lg: 'repeat(5, 1fr)', 
              xl: 'repeat(6, 1fr)' 
            }} 
            gap={{ base: 3, md: 4 }}
            mb={8}
          >
            {!loading && !propertyTypesLoading && filteredProperties.length === 0 ? (
              <Box textAlign="center" py={12} px={4}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.500" fontWeight="medium">
                  No favorite properties found
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.400" mt={2}>
                  {selectedType === 'ALL' 
                    ? 'No favorite properties match your search criteria' 
                    : `No favorite properties found for ${selectedType}`
                  }
                </Text>
              </Box>
            ) : (
              filteredProperties.map((property) => (
                <Box
                  key={property._id}
                  bg="white"
                  borderRadius="2xl"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                  overflow="hidden"
                  _hover={{ 
                    transform: 'translateY(-2px)', 
                    boxShadow: 'lg',
                    borderColor: 'brand.300'
                  }}
                  transition="all 0.2s"
                  position="relative"
                  minH={{ base: '220px', md: '240px' }}
                  maxW="100%"
                >
                  {/* Property Image */}
                  <Box 
                    h={{ base: '32', sm: '36', md: '40' }} 
                    overflow="hidden" 
                    cursor="pointer" 
                    onClick={() => handlePreview(property)}
                    position="relative"
                    bg="gray.100"
                  >
                    <Image
                      src={getPropertyImage(property)}
                      alt={property.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      fallback={
                        <Flex 
                          direction="column" 
                          align="center" 
                          justify="center" 
                          h="full" 
                          bg="gray.100"
                          color="gray.400"
                        >
                          <FaImage size={32} />
                          <Text fontSize="xs" mt={2} textAlign="center">
                            No Image
                          </Text>
                        </Flex>
                      }
                      transition="transform 0.3s ease"
                      _hover={{ transform: 'scale(1.05)' }}
                    />
                    
                    {/* Image Count Badge */}
                    {property.images && property.images.length > 1 && (
                      <Badge
                        position="absolute"
                        top={2}
                        left={2}
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="2xs"
                        fontWeight="bold"
                        backdropFilter="blur(4px)"
                      >
                        +{property.images.length - 1}
                      </Badge>
                    )}
                    
                    {/* Status Badge */}
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      bg="brand.500"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="2xs"
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      boxShadow="md"
                    >
                      {property.propertyStatus}
                    </Badge>

                    {/* Remove from Favorites Button */}
                    <IconButton
                      icon={<FaHeart />}
                      size="xs"
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme="red"
                      variant="solid"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(property._id);
                      }}
                      aria-label="Remove from favorites"
                      bg="red.500"
                      color="white"
                      _hover={{
                        bg: "red.600",
                        transform: "scale(1.1)"
                      }}
                      transition="all 0.2s"
                      isLoading={favoriteLoading[property._id]}
                    />
                  </Box>

                  {/* Property Details */}
                  <Box p={{ base: 2, md: 3 }}>
                    {/* Property Name */}
                    <Text
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="bold"
                      color="gray.900"
                      cursor="pointer"
                      onClick={() => handlePreview(property)}
                      _hover={{ color: 'brand.500' }}
                      mb={1}
                      noOfLines={1}
                      lineHeight="tight"
                    >
                      {property.name}
                    </Text>

                    {/* Price */}
                    <Text 
                      color="brand.500" 
                      fontWeight="bold" 
                      fontSize={{ base: 'sm', md: 'md' }} 
                      mb={2}
                    >
                      {formatPrice(property.price)}
                    </Text>

                    {/* Location */}
                    <Flex 
                      align="center" 
                      gap={1} 
                      color="gray.600" 
                      fontSize="xs" 
                      mb={2}
                    >
                      <MdLocationOn size={12} />
                      <Text
                        as="a"
                        href={`https://www.google.com/maps/search/?api=1&query=${property.propertyAddress?.location?.lat},${property.propertyAddress?.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{ color: 'brand.500' }}
                        noOfLines={1}
                        flex={1}
                      >
                        {`${property.propertyAddress?.area}, ${property.propertyAddress?.city}`}
                      </Text>
                    </Flex>

                    {/* Property Features */}
                    <Flex 
                      justify="space-between" 
                      color="gray.600" 
                      fontSize="xs" 
                      mb={3}
                      gap={1}
                    >
                      <Flex align="center" gap={1} flex={1}>
                        <FaBed size={10} />
                        <Text fontWeight="medium">{property.features?.bedRooms || 0}</Text>
                      </Flex>
                      <Flex align="center" gap={1} flex={1}>
                        <FaBath size={10} />
                        <Text fontWeight="medium">{property.features?.bathRooms || 0}</Text>
                      </Flex>
                      <Flex align="center" gap={1} flex={1}>
                        <FaRuler size={10} />
                        <Text fontWeight="medium">{property.features?.areaInSquarFoot || 0}</Text>
                      </Flex>
                    </Flex>

                    {/* Action Buttons */}
                    <Flex 
                      justify="space-between" 
                      gap={1}
                      pt={2}
                      borderTop="1px"
                      borderColor="gray.100"
                    >
                      <IconButton
                        icon={<FaEye />}
                        size="xs"
                        variant="ghost"
                        colorScheme="brand"
                        onClick={() => handlePreview(property)}
                        aria-label="Preview Property"
                        flex={1}
                      />
                    </Flex>
                  </Box>
                </Box>
              ))
            )}
          </Grid>
        </>
      )}

      {/* Property Preview Popup */}
      {selectedProperty && (
        <PropertyPreview 
          isOpen={isPreviewOpen} 
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty} 
        />
      )}
    </Box>
  );
};

export default PropertyFavoriteProperties; 