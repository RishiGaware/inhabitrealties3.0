import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaTimes, FaUser, FaHome, FaMapMarkerAlt, FaRupeeSign,
  FaBed, FaBath, FaRulerCombined, FaListUl, FaCalendarAlt, FaCheckCircle,
  FaPlus, FaFilePdf, FaUpload, FaTrash
} from 'react-icons/fa';
import {
  Box, Heading, Flex, Grid, Button, Input, Checkbox,
  CheckboxGroup, Stack, Tag, TagLabel, TagCloseButton,
  FormControl, FormLabel, FormErrorMessage, FormHelperText, VStack, Text, Textarea,
  HStack, IconButton, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper
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
      bhk: null,
      amenities: []
    },
    listedDate: '',
    published: true,
    buildingStructure: {
      totalFloors: null,
      flatsPerFloor: null,
      totalFlats: null
    }
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochurePreview, setBrochurePreview] = useState(null);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
    if (initialData) {
      // Format the initial data properly for editing
      const formattedData = {
        name: initialData.name || '',
        // Handle propertyTypeId - it might be an object from populated data or just an ID
        propertyTypeId: typeof initialData.propertyTypeId === 'object' && initialData.propertyTypeId?._id 
          ? initialData.propertyTypeId._id 
          : initialData.propertyTypeId || '',
        description: initialData.description || '',
        propertyAddress: {
          street: initialData.propertyAddress?.street || '',
          area: initialData.propertyAddress?.area || '',
          city: initialData.propertyAddress?.city || '',
          state: initialData.propertyAddress?.state || '',
          zipOrPinCode: initialData.propertyAddress?.zipOrPinCode || '',
          country: initialData.propertyAddress?.country || '',
          location: { 
            lat: initialData.propertyAddress?.location?.lat || '', 
            lng: initialData.propertyAddress?.location?.lng || '' 
          }
        },
        // Handle owner - it might be an object from populated data or just an ID
        owner: typeof initialData.owner === 'object' && initialData.owner?._id 
          ? initialData.owner._id 
          : initialData.owner || '',
        price: initialData.price || '',
        propertyStatus: initialData.propertyStatus || 'FOR SALE',
        features: {
          bedRooms: initialData.features?.bedRooms || '',
          bathRooms: initialData.features?.bathRooms || '',
          areaInSquarFoot: initialData.features?.areaInSquarFoot || '',
          bhk: initialData.features?.bhk || null,
          amenities: initialData.features?.amenities || []
        },
        listedDate: initialData.listedDate ? dayjs(initialData.listedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        published: initialData.published !== undefined ? initialData.published : true,
        buildingStructure: {
          totalFloors: initialData.buildingStructure?.totalFloors || null,
          flatsPerFloor: initialData.buildingStructure?.flatsPerFloor || null,
          totalFlats: initialData.buildingStructure?.totalFlats || null
        }
      };
      
      setFormData(formattedData);
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
  }, [isOpen, initialData, hasInitialized]);

  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
      setCustomAmenityInput('');
      setBrochureFile(null);
      setBrochurePreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Set brochure preview from initialData if editing and no new file selected
    if (isOpen && initialData?.brochureUrl && !brochureFile) {
      setBrochurePreview(initialData.brochureUrl);
    } else if (isOpen && !initialData?.brochureUrl && !brochureFile) {
      setBrochurePreview(null);
    }
  }, [isOpen, initialData?.brochureUrl, brochureFile]);

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

  const handleBrochureFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, brochure: 'Please select a PDF file' }));
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, brochure: 'File size must be less than 10MB' }));
      return;
    }

    setBrochureFile(file);
    setBrochurePreview(URL.createObjectURL(file));
    if (errors.brochure) {
      setErrors(prev => ({ ...prev, brochure: '' }));
    }
  };

  const handleRemoveBrochure = () => {
    setBrochureFile(null);
    // If editing and there's an existing brochure, keep showing it
    if (initialData?.brochureUrl && !brochureFile) {
      // User removed the new file, keep existing brochure
      return;
    }
    // If no existing brochure, clear preview
    if (!initialData?.brochureUrl) {
      setBrochurePreview(null);
    } else {
      // Restore to existing brochure preview
      setBrochurePreview(initialData.brochureUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass brochure file along with form data
      onSubmit(formData, brochureFile);
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

  const handleBuildingStructureChange = useCallback((field, value) => {
    const numValue = value ? parseInt(value) : null;
    setFormData(prev => {
      const newStructure = {
        ...prev.buildingStructure,
        [field]: numValue
      };
      // Auto-calculate totalFlats if both totalFloors and flatsPerFloor are set
      if (field === 'totalFloors' || field === 'flatsPerFloor') {
        const totalFloors = field === 'totalFloors' ? numValue : prev.buildingStructure.totalFloors;
        const flatsPerFloor = field === 'flatsPerFloor' ? numValue : prev.buildingStructure.flatsPerFloor;
        if (totalFloors && flatsPerFloor) {
          newStructure.totalFlats = totalFloors * flatsPerFloor;
        } else {
          newStructure.totalFlats = null;
        }
      }
      const updatedFormData = {
        ...prev,
        buildingStructure: newStructure
      };
      return updatedFormData;
    });
  }, []);

  // Check if property type is building/apartment
  const isBuildingType = () => {
    if (!formData.propertyTypeId) return false;
    const selectedType = propertyTypes.find(pt => pt._id === formData.propertyTypeId);
    if (!selectedType) return false;
    const typeName = selectedType.typeName?.toUpperCase() || '';
    const buildingTypes = ['APARTMENT', 'BUILDING', 'FLAT', 'CONDOMINIUM', 'TOWER'];
    return buildingTypes.some(type => typeName.includes(type));
  };

  const handleAddCustomAmenity = () => {
    const amenity = customAmenityInput.trim();
    if (amenity && !formData.features.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          amenities: [...prev.features.amenities, amenity]
        }
      }));
      setCustomAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        amenities: prev.features.amenities.filter(a => a !== amenity)
      }
    }));
  };

  const handleAmenityInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomAmenity();
    }
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
      closeOnOverlayClick={false}
      closeOnEsc={false}
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
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Agent Details</Text>
              </Box>
        <SearchableSelect
          label="Choose Agent"
          options={usersLoading ? [{ value: '', label: 'Loading users...' }] : usersError ? [{ value: '', label: usersError }] : users.map((user) => ({
            value: user._id,
            label: `${user.firstName} ${user.lastName} (${user.email})`
          }))}
                value={formData.owner}
          onChange={val => handleInputChange('owner', val)}
          placeholder="Select Agent"
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
              { value: 'RENT', label: 'RENT' },
              { value: 'RENTED', label: 'RENTED' },
              { value: 'LEASE', label: 'LEASE' },
              { value: 'READY TO MOVE', label: 'READY TO MOVE' },
              { value: 'UNDER CONSTRUCTION', label: 'UNDER CONSTRUCTION' },
              { value: 'NEW LAUNCH', label: 'NEW LAUNCH' },
              { value: 'AFTER 1 YEAR POSSESSION', label: 'AFTER 1 YEAR POSSESSION' }
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
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
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
          <FormControl isInvalid={!!errors.bhk}>
            <FormLabel>BHK</FormLabel>
            <Input 
                type="number"
                name="bhk"
                value={formData.features.bhk || ''}
              onChange={(e) => handleFeatureChange('bhk', e.target.value ? parseInt(e.target.value) : null)} 
              placeholder="e.g., 1, 2, 3, 4, 5" 
            />
            <FormErrorMessage>{errors.bhk}</FormErrorMessage>
          </FormControl>
        </Grid>
        
            <Box>
          <Text fontWeight="medium" color="gray.700" fontSize="sm" mb={2}>
                Amenities
          </Text>
          
          {/* Quick Add Common Amenities */}
          <Box mb={3}>
            <Text fontSize="xs" color="gray.500" mb={2}>Quick Add Common Amenities:</Text>
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
          </Box>

          {/* Custom Amenity Input */}
          <Box mb={3}>
            <Text fontSize="xs" color="gray.500" mb={2}>Add Custom Amenity:</Text>
            <HStack spacing={2}>
              <Input
                placeholder="Type custom amenity and press Enter or click Add"
                value={customAmenityInput}
                onChange={(e) => setCustomAmenityInput(e.target.value)}
                onKeyPress={handleAmenityInputKeyPress}
                isDisabled={isSubmitting}
                size="sm"
              />
              <IconButton
                icon={<FaPlus />}
                colorScheme="purple"
                onClick={handleAddCustomAmenity}
                isDisabled={isSubmitting || !customAmenityInput.trim()}
                aria-label="Add custom amenity"
                size="sm"
              />
            </HStack>
          </Box>

          {/* Selected Amenities Display */}
          {formData.features.amenities.length > 0 && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>Selected Amenities:</Text>
              <Flex gap={2} wrap="wrap">
                {formData.features.amenities.map((amenity) => (
                  <Tag key={amenity} colorScheme="purple" borderRadius="full" px={3} py={1} fontSize="sm">
                    <TagLabel>{amenity}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveAmenity(amenity)} isDisabled={isSubmitting} />
                  </Tag>
                ))}
              </Flex>
            </Box>
          )}
        </Box>

        {/* Building Structure - Only show for building/apartment types */}
        {isBuildingType() && (
          <>
            <Box borderLeft="4px solid #3182CE" pl={3} mb={2} mt={4}>
              <Text fontWeight="bold" fontSize="lg" color="gray.800">Building Structure</Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Enter building details for apartment/building type properties
              </Text>
            </Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <FormControl>
                <FormLabel>Total Floors</FormLabel>
                <NumberInput
                  value={formData.buildingStructure.totalFloors || ''}
                  onChange={(value) => handleBuildingStructureChange('totalFloors', value)}
                  min={1}
                  max={100}
                >
                  <NumberInputField placeholder="Enter total floors" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText fontSize="xs">Number of floors in the building</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Flats Per Floor</FormLabel>
                <NumberInput
                  value={formData.buildingStructure.flatsPerFloor || ''}
                  onChange={(value) => handleBuildingStructureChange('flatsPerFloor', value)}
                  min={1}
                  max={50}
                >
                  <NumberInputField placeholder="Enter flats per floor" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText fontSize="xs">Number of flats on each floor</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Total Flats</FormLabel>
                <NumberInput
                  value={formData.buildingStructure.totalFlats || ''}
                  // isReadOnly
                  bg="gray.50"
                >
                  <NumberInputField placeholder="Auto-calculated" />
                </NumberInput>
                <FormHelperText fontSize="xs">Automatically calculated</FormHelperText>
              </FormControl>
            </Grid>
          </>
        )}

        {/* Property Brochure */}
        <Box borderLeft="4px solid #DC143C" pl={3} mb={2} mt={4}>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Property Brochure</Text>
        </Box>
        <FormControl isInvalid={!!errors.brochure}>
          <FormLabel>Brochure PDF (Optional)</FormLabel>
          {brochurePreview ? (
            <Box
              p={4}
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="gray.50"
              mb={2}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="red.100"
                    borderRadius="md"
                    color="red.600"
                  >
                    <FaFilePdf size={24} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" fontSize="sm">
                      {brochureFile ? brochureFile.name : (initialData?.brochureUrl ? 'Current Brochure' : 'New Brochure')}
                    </Text>
                    {brochureFile ? (
                      <Text fontSize="xs" color="gray.500">
                        {(brochureFile.size / 1024).toFixed(2)} KB
                      </Text>
                    ) : initialData?.brochureUrl ? (
                      <Text fontSize="xs" color="gray.500">
                        Click "Change" to upload a new brochure
                      </Text>
                    ) : null}
                  </VStack>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FaUpload />}
                    onClick={() => document.getElementById('brochure-input')?.click()}
                    isDisabled={isSubmitting}
                  >
                    {brochureFile ? 'Change' : 'Upload New'}
                  </Button>
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemoveBrochure}
                    isDisabled={isSubmitting}
                    aria-label="Remove brochure"
                  />
                </HStack>
              </HStack>
            </Box>
          ) : (
            <Box
              p={6}
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="gray.50"
              textAlign="center"
              cursor="pointer"
              _hover={{
                borderColor: "brand.400",
                bg: "brand.50"
              }}
              onClick={() => document.getElementById('brochure-input')?.click()}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <FaFilePdf size={32} color="gray.400" />
                <Text fontSize="sm" color="gray.600">
                  Click to upload PDF brochure (Max 10MB)
                </Text>
              </VStack>
            </Box>
          )}
          <Input
            id="brochure-input"
            type="file"
            accept="application/pdf"
            onChange={handleBrochureFileChange}
            display="none"
            isDisabled={isSubmitting}
          />
          {errors.brochure && (
            <FormErrorMessage>{errors.brochure}</FormErrorMessage>
          )}
        </FormControl>

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
