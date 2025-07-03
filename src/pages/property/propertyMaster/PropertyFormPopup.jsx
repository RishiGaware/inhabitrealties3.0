import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaTimes, FaUser, FaHome, FaMapMarkerAlt, FaRupeeSign,
  FaBed, FaBath, FaRulerCombined, FaListUl, FaCalendarAlt, FaCheckCircle
} from 'react-icons/fa';
import {
  Box, Heading, Flex, Grid, Button, Input, Checkbox,
  CheckboxGroup, Stack, Tag, TagLabel, TagCloseButton,
  FormControl, FormLabel, FormErrorMessage, VStack, Text, Textarea
} from '@chakra-ui/react';
import CommonCard from '../../../components/common/Card/CommonCard';
import SearchableSelect from '../../../components/common/SearchableSelect';
import FormModal from '../../../components/common/FormModal';
import { fetchUsers } from '../../../services/usermanagement/userService';
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon issue in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function DraggableMarker({ position, onChange }) {
  const [markerPos, setMarkerPos] = useState(position);

  const handleClick = useCallback((e) => {
    setMarkerPos([e.latlng.lat, e.latlng.lng]);
    onChange(e.latlng.lat, e.latlng.lng);
  }, [onChange]);

  const handleDragEnd = useCallback((e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos([lat, lng]);
    onChange(lat, lng);
  }, [onChange]);

  useMapEvents({ click: handleClick });

  return (
    <Marker
      position={markerPos}
      draggable={true}
      eventHandlers={{ dragend: handleDragEnd }}
    />
  );
}

const LocationPicker = React.memo(({ lat, lng, onChange }) => {
  const position = useMemo(() => [lat || 20.5937, lng || 78.9629], [lat, lng]);
  const handleChange = useCallback((newLat, newLng) => {
    onChange(newLat, newLng);
  }, [onChange]);

  return (
    <MapContainer
      key={`${lat}-${lng}`}
      center={position}
      zoom={lat && lng ? 15 : 5}
      style={{ height: 250, width: '100%', borderRadius: 12, marginTop: 8 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} onChange={handleChange} />
    </MapContainer>
  );
});

const PropertyFormPopup = ({
  isOpen, onClose, onSubmit, propertyTypes,
  initialData = null, isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    propertyTypeId: '',
    description: '',
    propertyAddress: {
      street: '',
      area: '',
      city: '',
      state: '',
      zipOrPinCode: '',
      country: '',
      location: { lat: '', lng: '' }
    },
    owner: '',
    price: '',
    propertyStatus: 'FOR SALE',
    features: {
      bedRooms: '',
      bathRooms: '',
      areaInSquarFoot: '',
      amenities: []
    },
    listedDate: '',
    published: true
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
    if (initialData) {
      setFormData({
          ...initialData,
          listedDate: initialData.listedDate || dayjs().format('YYYY-MM-DD'),
        published: initialData.published !== undefined ? initialData.published : true
      });
    } else {
      setFormData({
        name: '',
        propertyTypeId: '',
        description: '',
        propertyAddress: {
          street: '',
          area: '',
          city: '',
          state: '',
          zipOrPinCode: '',
          country: '',
            location: { lat: '', lng: '' }
        },
        owner: '',
        price: '',
        propertyStatus: 'FOR SALE',
        features: {
          bedRooms: '',
          bathRooms: '',
          areaInSquarFoot: '',
          amenities: []
        },
          listedDate: dayjs().format('YYYY-MM-DD'),
        published: true
      });
    }
      setErrors({});
      setHasInitialized(true);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) setHasInitialized(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUsersLoading(true);
      fetchUsers()
        .then((res) => setUsers(res.data || []))
        .catch(() => setUsersError('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [isOpen]);

  const getFormErrors = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Property name is required';
    if (!formData.propertyTypeId) newErrors.propertyTypeId = 'Property type is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.propertyAddress?.street?.trim()) newErrors.street = 'Street address is required';
    if (!formData.propertyAddress?.area?.trim()) newErrors.area = 'Area is required';
    if (!formData.propertyAddress?.city?.trim()) newErrors.city = 'City is required';
    if (!formData.propertyAddress?.state?.trim()) newErrors.state = 'State is required';
    if (!formData.propertyAddress?.zipOrPinCode?.trim()) newErrors.zipOrPinCode = 'ZIP/PIN code is required';
    if (!formData.propertyAddress?.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.owner?.trim()) newErrors.owner = 'Owner is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.features?.bedRooms || parseInt(formData.features.bedRooms) < 0) newErrors.bedRooms = 'Valid number of bedrooms is required';
    if (!formData.features?.bathRooms || parseInt(formData.features.bathRooms) < 0) newErrors.bathRooms = 'Valid number of bathrooms is required';
    if (!formData.features?.areaInSquarFoot || parseFloat(formData.features.areaInSquarFoot) <= 0) newErrors.areaInSquarFoot = 'Valid area is required';
    return newErrors;
  };

  const validateForm = () => {
    const newErrors = getFormErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleAddressChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      propertyAddress: { ...prev.propertyAddress, [field]: value }
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleLocationChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      propertyAddress: {
        ...prev.propertyAddress,
        location: { ...prev.propertyAddress.location, [field]: value }
      }
    }));
  }, []);

  const handleFeatureChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [field]: value }
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.features.amenities.includes(amenity)
        ? prev.features.amenities.filter(a => a !== amenity)
        : [...prev.features.amenities, amenity];
      return { ...prev, features: { ...prev.features, amenities } };
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Property Details' : 'Add Property Details'}
      onSave={handleSubmit}
      size="6xl"
      initialData={initialData}
      modalProps={{
        isCentered: true,
        borderRadius: '2xl',
        boxShadow: '2xl',
        px: { base: 4, md: 8 },
        py: { base: 6, md: 8 },
        bg: 'white',
        border: '2px solid #E9D8FD',
        maxW: '90vw',
        maxH: '90vh',
        overflowY: 'auto',
      }}
      buttonProps={{
        colorScheme: 'brand',
        borderRadius: 'full',
        fontWeight: 'bold',
        fontSize: { base: 'md', md: 'lg' },
        px: 8,
        py: 2,
        mt: 4,
      }}
      buttonLabel={initialData ? 'Update Property' : 'Add Property'}
      isSubmitting={isSubmitting}
    >
      <VStack spacing={6} align="stretch">
        {/* Basic Information */}
        <Box borderLeft="4px solid #D53F8C" pl={3} mb={2}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Basic Information</Text>
        </Box>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Property Name</FormLabel>
          <Input
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter property name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <SearchableSelect
          label="Property Type"
          options={propertyTypes.map((type) => ({
            value: type._id,
            label: type.typeName
          }))}
                value={formData.propertyTypeId}
          onChange={val => handleInputChange('propertyTypeId', val)}
          placeholder="Select Property Type"
          isRequired
          error={errors.propertyTypeId}
        />
        <FormControl isRequired isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Input 
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter property description" 
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        {/* Address Information */}
        <Box borderLeft="4px solid #38A169" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Address Information</Text>
          </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FormControl isRequired isInvalid={!!errors.street}>
            <FormLabel>Street Address</FormLabel>
            <Input 
                name="street"
                value={formData.propertyAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Enter street address" 
            />
            <FormErrorMessage>{errors.street}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.area}>
            <FormLabel>Area</FormLabel>
            <Input 
                name="area"
                value={formData.propertyAddress.area}
                onChange={(e) => handleAddressChange('area', e.target.value)}
              placeholder="Enter area" 
            />
            <FormErrorMessage>{errors.area}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.city}>
            <FormLabel>City</FormLabel>
            <Input 
                name="city"
                value={formData.propertyAddress.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Enter city" 
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.state}>
            <FormLabel>State</FormLabel>
            <Input 
                name="state"
                value={formData.propertyAddress.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="Enter state" 
            />
            <FormErrorMessage>{errors.state}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.zipOrPinCode}>
            <FormLabel>ZIP/PIN Code</FormLabel>
            <Input 
                name="zipOrPinCode"
                value={formData.propertyAddress.zipOrPinCode}
                onChange={(e) => handleAddressChange('zipOrPinCode', e.target.value)}
              placeholder="Enter ZIP/PIN code" 
            />
            <FormErrorMessage>{errors.zipOrPinCode}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.country}>
            <FormLabel>Country</FormLabel>
            <Input 
              name="country"
              value={formData.propertyAddress.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="Enter country" 
            />
            <FormErrorMessage>{errors.country}</FormErrorMessage>
          </FormControl>
        </Grid>

          {/* Location */}
        <Box borderLeft="4px solid #3182CE" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Location</Text>
        </Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FormControl isRequired>
            <FormLabel>Latitude</FormLabel>
            <Input 
                type="number"
              name="lat" 
                value={formData.propertyAddress.location.lat}
                onChange={(e) => handleLocationChange('lat', e.target.value)}
              placeholder="Enter latitude" 
              />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Longitude</FormLabel>
            <Input 
                type="number"
              name="lng" 
                value={formData.propertyAddress.location.lng}
                onChange={(e) => handleLocationChange('lng', e.target.value)}
              placeholder="Enter longitude" 
              />
          </FormControl>
            </Grid>
        <Box>
          <LocationPicker
            lat={parseFloat(formData.propertyAddress.location.lat) || 20.5937}
            lng={parseFloat(formData.propertyAddress.location.lng) || 78.9629}
            onChange={(lat, lng) => {
              handleLocationChange('lat', lat);
              handleLocationChange('lng', lng);
            }}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Drag the marker or click on the map to set the property location.
          </Text>
          </Box>

          {/* Owner Details */}
        <Box borderLeft="4px solid #D69E2E" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Owner Details</Text>
              </Box>
        <SearchableSelect
          label="Choose Owner"
          options={usersLoading ? [{ value: '', label: 'Loading users...' }] : usersError ? [{ value: '', label: usersError }] : users.map((user) => ({
            value: user._id,
            label: `${user.firstName} ${user.lastName} (${user.email})`
          }))}
                value={formData.owner}
          onChange={val => handleInputChange('owner', val)}
          placeholder="Select Owner"
          isRequired
          error={errors.owner}
        />

        {/* Price & Status */}
        <Box borderLeft="4px solid #E53E3E" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Price & Status</Text>
                </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FormControl isRequired isInvalid={!!errors.price}>
            <FormLabel>Price (INR)</FormLabel>
            <Input 
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price" 
            />
            <FormErrorMessage>{errors.price}</FormErrorMessage>
          </FormControl>
          <SearchableSelect
            label="Property Status"
            options={[
              { value: 'FOR SALE', label: 'FOR SALE' },
              { value: 'FOR RENT', label: 'FOR RENT' },
              { value: 'SOLD', label: 'SOLD' },
              { value: 'RENTED', label: 'RENTED' }
            ]}
                value={formData.propertyStatus}
            onChange={val => handleInputChange('propertyStatus', val)}
            placeholder="Select Status"
            isRequired
          />
          </Grid>

          {/* Features */}
        <Box borderLeft="4px solid #805AD5" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Features</Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <FormControl isRequired isInvalid={!!errors.bedRooms}>
            <FormLabel>Number of Bedrooms</FormLabel>
            <Input 
                type="number"
                name="bedRooms"
                value={formData.features.bedRooms}
              onChange={(e) => handleFeatureChange('bedRooms', e.target.value)} 
              placeholder="Enter number of bedrooms" 
            />
            <FormErrorMessage>{errors.bedRooms}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.bathRooms}>
            <FormLabel>Number of Bathrooms</FormLabel>
            <Input 
                type="number"
                name="bathRooms"
                value={formData.features.bathRooms}
              onChange={(e) => handleFeatureChange('bathRooms', e.target.value)} 
              placeholder="Enter number of bathrooms" 
            />
            <FormErrorMessage>{errors.bathRooms}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.areaInSquarFoot}>
            <FormLabel>Area (sq ft)</FormLabel>
            <Input 
                type="number"
                name="areaInSquarFoot"
                value={formData.features.areaInSquarFoot}
              onChange={(e) => handleFeatureChange('areaInSquarFoot', e.target.value)} 
              placeholder="Enter area in square feet" 
            />
            <FormErrorMessage>{errors.areaInSquarFoot}</FormErrorMessage>
          </FormControl>
            </Grid>
        
            <Box>
          <Text fontWeight="medium" color="gray.700" fontSize="sm" mb={2}>
                Amenities
          </Text>
          <CheckboxGroup
            colorScheme="purple"
            value={formData.features.amenities}
            onChange={(values) => handleFeatureChange('amenities', values)}
          >
            <Stack direction="row" wrap="wrap" spacing={2}>
              {['Parking', 'Swimming Pool', 'Garden', 'Gym', 'Security', 'Balcony', 'Air Conditioning', 'Elevator', '24/7 Water', 'Power Backup'].map((amenity) => (
                <Checkbox key={amenity} value={amenity} isDisabled={isSubmitting}>
                      {amenity}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <Flex mt={2} gap={2} wrap="wrap">
            {formData.features.amenities.map((amenity) => (
              <Tag key={amenity} colorScheme="purple" borderRadius="full" px={3} py={1} fontSize="sm">
                <TagLabel>{amenity}</TagLabel>
                <TagCloseButton onClick={() => handleAmenityToggle(amenity)} />
              </Tag>
            ))}
          </Flex>
        </Box>

        {/* Additional Details */}
        <Box borderLeft="4px solid #319795" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Additional Details</Text>
    </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <FormControl isRequired>
            <FormLabel>Listed Date</FormLabel>
            <Input
              type="date"
              value={formData.listedDate}
              onChange={(e) => handleInputChange('listedDate', e.target.value)}
              min={dayjs().subtract(50, 'year').format('YYYY-MM-DD')}
              max={dayjs().add(2, 'year').format('YYYY-MM-DD')}
            />
          </FormControl>
          <SearchableSelect
            label="Published"
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ]}
            value={formData.published ? 'true' : 'false'}
            onChange={val => handleInputChange('published', val === 'true')}
            placeholder="Select Status"
          />
        </Grid>
      </VStack>
    </FormModal>
  );
};

export default PropertyFormPopup; 
