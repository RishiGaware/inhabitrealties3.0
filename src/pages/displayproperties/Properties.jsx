import React, { useState, useEffect } from 'react';
import { FaBed, FaBath, FaRuler, FaEye, FaImage, FaHeart } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Box, Heading, Flex, Grid, IconButton, Text, Badge, Image, Skeleton, SkeletonText, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyPreview from '../property/propertyMaster/PropertyPreview';
import CommonCard from '../../components/common/Card/CommonCard';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import Loader from '../../components/common/Loader';
import { usePropertyTypeContext } from '../../context/PropertyTypeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchProperties, 
  fetchPropertiesWithParams
} from '../../services/propertyService';
import { 
  createFavoriteProperty,
  deleteFavoriteProperty,
  getFavoritePropertiesWithParams
} from '../../services/favoriteproperty/favoritePropertyService';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import ServerError from '../../components/common/errors/ServerError';
import NoInternet from '../../components/common/errors/NoInternet';
import { ROUTES } from '../../utils/constants';

const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState('ALL');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoriteRecordIds, setFavoriteRecordIds] = useState({}); // Store favorite record IDs
  const [favoriteLoading, setFavoriteLoading] = useState({});
  
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

  const fetchAllProperties = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const response = await fetchProperties();
      console.log('Properties: Fetch properties response:', response);
      setProperties(response.data || []);
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
      setProperties(response.data || []);
    } catch (error) {
      if (error.message === 'Network Error') setErrorType('network');
      else if (error.response?.status === 500) setErrorType('server');
      else setErrorType('server');
    } finally {
      setLoading(false);
    }
  };

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

  const handlePreview = (property) => {
    setSelectedProperty(property);
    setIsPreviewOpen(true);
  };

  const toggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      showErrorToast('Please login to add favorites');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      showErrorToast('User not found');
      return;
    }

    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      const isFavorited = favorites.includes(propertyId);
      
      if (isFavorited) {
        // Remove from favorites using stored record ID
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
      } else {
        // Add to favorites
        const response = await createFavoriteProperty(userId, propertyId);
        setFavorites(prev => [...prev, propertyId]);
        
        // Store the new favorite record ID
        if (response.data && response.data._id) {
          setFavoriteRecordIds(prev => ({
            ...prev,
            [propertyId]: response.data._id
          }));
        }
        
        showSuccessToast('Property added to favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update favorites';
      showErrorToast(errorMessage);
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));
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

  const filteredProperties = selectedType === 'ALL' 
    ? properties 
    : properties.filter(property => {
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
        <Box>
          <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
            Properties
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Discover amazing properties
          </Text>
        </Box>
        <Flex gap={3}>
          
          <Button
            size="sm"
            colorScheme="brand"
            variant="outline"
            leftIcon={<FaHeart />}
            onClick={() => {
              sessionStorage.setItem('previousPath', location.pathname);
              navigate(ROUTES.DISPLAY_FAVORITES);
            }}
          >
            Favorites
          </Button>
        </Flex>
      </Flex>

      {/* Search and Filter Section */}
      <Flex gap={2} align="center" mb={4} wrap="wrap" direction={{ base: 'column', md: 'row' }}>
        <Box flex="1" minW={{ base: '100%', sm: '180px' }}>
          <input
            type="text"
            placeholder="Search properties..."
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

      {/* Properties Count */}
      <Text 
        fontSize="sm" 
        color="gray.600" 
        mb={4}
        fontWeight="medium"
      >
        {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
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
              No properties found
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.400" mt={2}>
              {selectedType === 'ALL' 
                ? 'No properties available at the moment' 
                : `No properties found for ${selectedType}`
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

                {/* Favorite Button */}
                <IconButton
                  icon={<FaHeart />}
                  size="xs"
                  position="absolute"
                  bottom={2}
                  right={2}
                  colorScheme={favorites.includes(property._id) ? "red" : "gray"}
                  variant="solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property._id);
                  }}
                  aria-label="Toggle favorite"
                  bg={favorites.includes(property._id) ? "red.500" : "rgba(0,0,0,0.7)"}
                  color="white"
                  _hover={{
                    bg: favorites.includes(property._id) ? "red.600" : "rgba(0,0,0,0.8)",
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

                {/* Action Button - Only View */}
                <Flex 
                  justify="center" 
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
                    aria-label="View Property"
                    flex={1}
                  />
                </Flex>
              </Box>
            </Box>
          ))
        )}
      </Grid>

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

export default Properties; 