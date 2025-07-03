import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBed, FaBath, FaRuler, FaEye } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Box, Heading, Flex, Grid, IconButton, useDisclosure, Text, Badge } from '@chakra-ui/react';
import PropertyFormPopup from './PropertyFormPopup';
import PropertyPreview from './PropertyPreview';
import CommonCard from '../../../components/common/Card/CommonCard';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import Loader from '../../../components/common/Loader';
import { usePropertyTypeContext } from '../../../context/PropertyTypeContext';
import { 
  fetchProperties, 
  createProperty, 
  editProperty, 
  deleteProperty,
  fetchPropertiesWithParams
} from '../../../services/propertyService';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';
import CommonAddButton from '../../../components/common/Button/CommonAddButton';
import ServerError from '../../../components/common/errors/ServerError';
import NoInternet from '../../../components/common/errors/NoInternet';

const PropertyMaster = () => {
  const [selectedType, setSelectedType] = useState('ALL');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Get property type context
  const propertyTypeContext = usePropertyTypeContext();
  const { propertyTypes, getAllPropertyTypes, loading: propertyTypesLoading } = propertyTypeContext;

  // Fetch properties on component mount
  useEffect(() => {
    fetchAllProperties();
    getAllPropertyTypes();
  }, [getAllPropertyTypes]);

  const fetchAllProperties = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const response = await fetchProperties();
      console.log('PropertyMaster: Fetch properties response:', response);
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

  const handleAddProperty = async (propertyData) => {
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      // Format data for backend API
      const formattedData = {
        name: propertyData.name?.trim(),
        propertyTypeId: propertyData.propertyTypeId,
        description: propertyData.description?.trim(),
        propertyAddress: {
          street: propertyData.propertyAddress?.street?.trim(),
          area: propertyData.propertyAddress?.area?.trim(),
          city: propertyData.propertyAddress?.city?.trim(),
          state: propertyData.propertyAddress?.state?.trim(),
          zipOrPinCode: propertyData.propertyAddress?.zipOrPinCode?.trim(),
          country: propertyData.propertyAddress?.country?.trim(),
          location: {
            lat: propertyData.propertyAddress?.location?.lat ? parseFloat(propertyData.propertyAddress.location.lat) : null,
            lng: propertyData.propertyAddress?.location?.lng ? parseFloat(propertyData.propertyAddress.location.lng) : null
          }
        },
        owner: propertyData.owner?.trim(),
        price: propertyData.price ? parseFloat(propertyData.price) : 0,
        propertyStatus: propertyData.propertyStatus,
        features: {
          bedRooms: propertyData.features?.bedRooms ? parseInt(propertyData.features.bedRooms) : 0,
          bathRooms: propertyData.features?.bathRooms ? parseInt(propertyData.features.bathRooms) : 0,
          areaInSquarFoot: propertyData.features?.areaInSquarFoot ? parseFloat(propertyData.features.areaInSquarFoot) : 0,
          amenities: propertyData.features?.amenities || []
        },
        listedDate: propertyData.listedDate || new Date().toISOString(),
        published: propertyData.published !== undefined ? propertyData.published : true
      };

      console.log('PropertyMaster: Sending formatted data to backend:', formattedData);
      const response = await createProperty(formattedData);
      console.log('PropertyMaster: Add property response:', response);
      
      // Add the new property to local state
      const newProperty = {
        ...formattedData,
        _id: response.data?._id || Date.now().toString(),
        images: response.data?.images || ['default-property.jpg'],
        createdAt: response.data?.createdAt || new Date().toISOString(),
      };
      
      setProperties(prevProperties => [...prevProperties, newProperty]);
      setIsModalOpen(false);
      
      const successMessage = response?.message || 'Property added successfully';
      showSuccessToast(successMessage);
    } catch (error) {
      console.error('PropertyMaster: Add property error:', error);
      let errorMessage = 'Failed to add property';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
    }
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleUpdateProperty = async (updatedData) => {
    if (isApiCallInProgress || isSubmitting) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }

    setIsSubmitting(true);
    setIsApiCallInProgress(true);

    try {
      // Format data for backend API
      const formattedData = {
        name: updatedData.name?.trim(),
        propertyTypeId: updatedData.propertyTypeId,
        description: updatedData.description?.trim(),
        propertyAddress: {
          street: updatedData.propertyAddress?.street?.trim(),
          area: updatedData.propertyAddress?.area?.trim(),
          city: updatedData.propertyAddress?.city?.trim(),
          state: updatedData.propertyAddress?.state?.trim(),
          zipOrPinCode: updatedData.propertyAddress?.zipOrPinCode?.trim(),
          country: updatedData.propertyAddress?.country?.trim(),
          location: {
            lat: updatedData.propertyAddress?.location?.lat ? parseFloat(updatedData.propertyAddress.location.lat) : null,
            lng: updatedData.propertyAddress?.location?.lng ? parseFloat(updatedData.propertyAddress.location.lng) : null
          }
        },
        owner: updatedData.owner?.trim(),
        price: updatedData.price ? parseFloat(updatedData.price) : 0,
        propertyStatus: updatedData.propertyStatus,
        features: {
          bedRooms: updatedData.features?.bedRooms ? parseInt(updatedData.features.bedRooms) : 0,
          bathRooms: updatedData.features?.bathRooms ? parseInt(updatedData.features.bathRooms) : 0,
          areaInSquarFoot: updatedData.features?.areaInSquarFoot ? parseFloat(updatedData.features.areaInSquarFoot) : 0,
          amenities: updatedData.features?.amenities || []
        },
        listedDate: updatedData.listedDate || selectedProperty.listedDate,
        published: updatedData.published !== undefined ? updatedData.published : true
      };

      console.log('PropertyMaster: Sending formatted update data to backend:', formattedData);
      const response = await editProperty(selectedProperty._id, formattedData);
      console.log('PropertyMaster: Update property response:', response);
      
      // Update the property in local state
      setProperties(prevProperties => 
        prevProperties.map(property => 
          property._id === selectedProperty._id 
            ? { ...property, ...formattedData, updatedAt: new Date().toISOString() }
            : property
        )
      );
      
      setSelectedProperty(null);
      setIsModalOpen(false);
      
      const successMessage = response?.message || 'Property updated successfully';
      showSuccessToast(successMessage);
    } catch (error) {
      console.error('PropertyMaster: Update property error:', error);
      let errorMessage = 'Failed to update property';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsApiCallInProgress(false);
    }
  };

  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (propertyToDelete && !isApiCallInProgress) {
      setIsApiCallInProgress(true);
      try {
        const response = await deleteProperty(propertyToDelete._id);
        console.log('PropertyMaster: Delete property response:', response);
        
        // Remove the property from local state
        setProperties(prevProperties => 
          prevProperties.filter(property => property._id !== propertyToDelete._id)
        );
        
        onDeleteClose();
        setPropertyToDelete(null);
        
        const successMessage = response?.message || 'Property deleted successfully';
        showSuccessToast(successMessage);
      } catch (error) {
        console.error('PropertyMaster: Delete property error:', error);
        showErrorToast('Failed to delete property');
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const handlePreview = (property) => {
    setSelectedProperty(property);
    setIsPreviewOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
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
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Property Master
        </Heading>
        <CommonAddButton onClick={() => {
          setSelectedProperty(null);
          setIsModalOpen(true);
        }} />
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
                ? 'Add your first property to get started' 
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
              >
                <img
                  src={property.images?.[0] || 'default-property.jpg'}
                  alt={property.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                
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
                  <IconButton
                    icon={<FaEdit />}
                    size="xs"
                    variant="ghost"
                    colorScheme="brand"
                    onClick={() => handleEditProperty(property)}
                    aria-label="Edit Property"
                    flex={1}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDeleteProperty(property)}
                    aria-label="Delete Property"
                    flex={1}
                  />
                </Flex>
              </Box>
            </Box>
          ))
        )}
      </Grid>

      {/* Property Form Popup */}
      <PropertyFormPopup
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
        propertyTypes={propertyTypes}
        initialData={selectedProperty}
        isSubmitting={isSubmitting}
      />

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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete the property "${propertyToDelete?.name}"?`}
      />
    </Box>
  );
};

export default PropertyMaster; 