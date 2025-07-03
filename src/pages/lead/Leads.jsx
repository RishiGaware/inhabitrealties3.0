import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Flex, Button, IconButton, Avatar, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, InputGroup, InputLeftElement, Input, Stack, SimpleGrid, useTheme, Tooltip, VStack, Icon, Circle, FormControl, FormLabel, Select, Textarea, Collapse, useDisclosure, HStack, Divider, Badge as ChakraBadge } from '@chakra-ui/react';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons';
import { useLeadsContext } from '../../context/LeadsContext';
import FormModal from '../../components/common/FormModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { fetchLeads, fetchLeadsWithParams } from '../../services/leadmanagement/leadsService';
import { FiUser, FiMail, FiPhone, FiHome, FiFlag, FiRepeat, FiLink, FiUsers, FiUserCheck, FiUserPlus, FiEdit2, FiInfo, FiFilter, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../components/common/Loader';
import { fetchLeadStatuses } from '../../services/leadmanagement/leadStatusService';
import { fetchFollowUpStatuses } from '../../services/leadmanagement/followUpStatusService';
import { fetchUsers } from '../../services/usermanagement/userService';
import { fetchProperties, fetchPropertiesWithParams } from '../../services/propertyService';
import SearchableSelect from '../../components/common/SearchableSelect';
import CommonAddButton from '../../components/common/Button/CommonAddButton';
import ServerError from '../../components/common/errors/ServerError';
import NoInternet from '../../components/common/errors/NoInternet';
const Leads = () => {
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isFilterOpen, onToggle: onFilterToggle, onClose: onFilterClose } = useDisclosure();

  const { leads: contextLeads, addLead, updateLead, removeLead, getAllLeads } = useLeadsContext();

  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    propertyId: '',
    leadStatusId: '',
    followUpStatusId: '',
    referanceFromId: '',
    assignedToUserId: '',
    note: '',
  });

  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
  const [followUpStatusOptions, setFollowUpStatusOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);

  // Filter state
  const [filter, setFilter] = useState({
    userId: '',
    leadStatus: '',
    followUpStatus: '',
    assignedToUserId: '',
    propertyId: '',
    designation: '',
    referanceFrom: '',
    published: ''
  });

  const [activeFilters, setActiveFilters] = useState(0);

  // Helper function to get property name by ID
  const getPropertyNameById = (propertyId) => {
    if (!propertyId) return 'N/A';
    const property = propertyOptions.find(option => option.value === propertyId);
    return property ? property.label : 'Property not found';
  };

  // Count active filters
  useEffect(() => {
    const count = Object.values(filter).filter(value => value !== '').length;
    setActiveFilters(count);
  }, [filter]);

  useEffect(() => {
    fetchAllLeads();

    fetchLeadStatuses().then(res => setLeadStatusOptions(res.data || []));
    fetchFollowUpStatuses().then(res => setFollowUpStatusOptions(res.data || []));
    fetchUsers().then(res => setUserOptions(res.data || []));
    
    // Fetch properties for the Interested Property dropdown
    const fetchPropertyOptions = async () => {
      try {
        const response = await fetchProperties();
        const properties = response.data || [];
        const options = properties.map(property => ({
          label: `${property.name} - ${property.propertyAddress?.area}, ${property.propertyAddress?.city} (₹${property.price?.toLocaleString()})`,
          value: property._id
        }));
        setPropertyOptions(options);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };
    fetchPropertyOptions();
  }, []);

  const fetchAllLeads = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const data = await fetchLeads();
      setFilteredLeads(data.data); // assuming API returns { data: [...] }
    } catch (error) {
      if (error.message === 'Network Error') setErrorType('network');
      else if (error.response?.status === 500) setErrorType('server');
      else setErrorType('server');
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedLeadDetails(null);
  };

  const handleAddNew = () => {
    setSelectedLead(null);
    setIsEditMode(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      propertyId: '',
      leadStatusId: '',
      followUpStatusId: '',
      referanceFromId: '',
      assignedToUserId: '',
      note: '',
    });
    setIsOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setIsEditMode(true);
    setFormData({
      userId: lead.userId?._id || '',
      leadDesignation: lead.leadDesignation || '',
      leadInterestedPropertyId: lead.leadInterestedPropertyId || '',
      leadStatus: lead.leadStatus?._id || '',
      followUpStatus: lead.followUpStatus?._id || '',
      referanceFrom: lead.referanceFrom?._id || '',
      assignedToUserId: lead.assignedToUserId?._id || '',
      leadAltEmail: lead.leadAltEmail || '',
      leadAltPhoneNumber: lead.leadAltPhoneNumber || '',
      leadLandLineNumber: lead.leadLandLineNumber || '',
      leadWebsite: lead.leadWebsite || '',
      note: lead.note || '',
      referredByUserId: lead.referredByUserId?._id || '',
      referredByUserFirstName: lead.referredByUserFirstName || '',
      referredByUserLastName: lead.referredByUserLastName || '',
      referredByUserEmail: lead.referredByUserEmail || '',
      referredByUserPhoneNumber: lead.referredByUserPhoneNumber || '',
      referredByUserDesignation: lead.referredByUserDesignation || '',
    });
    setIsOpen(true);
  };

  const handleDelete = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteOpen(true);
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // If search term is empty, reset to all leads
    if (!term.trim()) {
      await fetchAllLeads();
      return;
    }
    
    // Use API-based search for better performance
    setLoading(true);
    try {
      const params = {
        search: term.trim(),
        // Include any active filters
        ...Object.fromEntries(
          Object.entries(filter).map(([k, v]) => [k, v === '' ? null : v])
        )
      };
      
      const res = await fetchLeadsWithParams(params);
      setFilteredLeads(res.data || []);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to client-side search if API fails
    const filtered = contextLeads.filter(lead =>
        lead.userId?.firstName?.toLowerCase().includes(term.toLowerCase()) ||
        lead.userId?.lastName?.toLowerCase().includes(term.toLowerCase()) ||
        lead.userId?.email?.toLowerCase().includes(term.toLowerCase()) ||
        lead.userId?.phoneNumber?.toLowerCase().includes(term.toLowerCase()) ||
        lead.note?.toLowerCase().includes(term.toLowerCase()) ||
        getPropertyNameById(lead.propertyId)?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLeads(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm.trim()) {
      await fetchAllLeads();
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        search: searchTerm.trim(),
        // Include any active filters
        ...Object.fromEntries(
          Object.entries(filter).map(([k, v]) => [k, v === '' ? null : v])
        )
      };
      
      const res = await fetchLeadsWithParams(params);
      setFilteredLeads(res.data || []);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to client-side search if API fails
      const filtered = contextLeads.filter(lead =>
        lead.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.userId?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPropertyNameById(lead.propertyId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([, v]) => v !== "")
      );
      if (isEditMode && selectedLead) {
        await updateLead(selectedLead._id, cleanData);
      } else {
        await addLead(cleanData);
      }
      setIsOpen(false);
      setSelectedLead(null);
      setIsEditMode(false);
      // Refresh leads list after edit/add
      if (Object.values(filter).some(v => v !== '' && v !== null)) {
        await applyFilters();
      } else {
        await fetchAllLeads();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      // Optionally: set an error state and show it in the modal
    }
  };

  const confirmDelete = async () => {
    if (leadToDelete) {
      await removeLead(leadToDelete._id);
      setIsDeleteOpen(false);
      setLeadToDelete(null);
      getAllLeads();
    }
  };

  const onDeleteClose = () => {
    setIsDeleteOpen(false);
    setLeadToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      // Clean up filter object: send null for empty fields
      const params = Object.fromEntries(
        Object.entries(filter).map(([k, v]) => [k, v === '' ? null : v])
      );
      // If propertyId or other property params are present, use fetchPropertiesWithParams
      if (params.propertyId || params.propertyType || params.search) {
        // Only fetch properties if property-related filters are used
        const res = await fetchPropertiesWithParams(params);
        setFilteredLeads(res.data);
      } else {
        // Otherwise, use the default leads filter
        const res = await fetchLeadsWithParams(params);
        setFilteredLeads(res.data);
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setFilter({
      userId: '',
      leadStatus: '',
      followUpStatus: '',
      assignedToUserId: '',
      propertyId: '',
      designation: '',
      referanceFrom: '',
      published: ''
    });
    setSearchTerm('');
    fetchAllLeads();
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  // Build the options from all users
  const referenceSourceOptions = [
    ...userOptions.map(u => ({
      label: `${u.firstName} ${u.lastName} (${u.email})`,
      value: u._id
    }))
  ];

  // If editing and the saved value is not in the options, add a fallback
  if (
    formData.referanceFrom &&
    !referenceSourceOptions.some(opt => opt.value === formData.referanceFrom)
  ) {
    referenceSourceOptions.push({
      label: selectedLead?.referanceFrom?.name || 'Current Reference',
      value: formData.referanceFrom
    });
  }

  if (errorType === 'network') return <NoInternet onRetry={fetchAllLeads} />;
  if (errorType === 'server') return <ServerError onRetry={fetchAllLeads} />;

  return (
    <Box p={5}>
      {/* Loader at the top, non-blocking */}
      {loading && <Loader size="xl" />}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
          Leads
        </Heading>
        <CommonAddButton onClick={handleAddNew} />
      </Flex>

      {/* Search and Filter Section */}
      <Box
        mb={6}
        w="100%"
        bgGradient="linear(135deg, #f8fafc 0%, #f3ebff 100%)"
        borderRadius="2xl"
        boxShadow="0 4px 24px 0 rgba(80, 36, 143, 0.07)"
        p={{ base: 3, md: 6 }}
        border="1px solid"
        borderColor="gray.100"
        maxW="100%"
      >
        <Flex gap={2} align="center" wrap="wrap" direction={{ base: 'column', md: 'row' }}>
          {/* Search Box */}
          <Box flex="1" minW={{ base: '100%', sm: '180px' }}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" h="full">
                <SearchIcon color="brand.500" boxSize={3} />
          </InputLeftElement>
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                borderRadius="md"
                bg="white"
                border="1px solid"
                borderColor="brand.100"
                fontSize="xs"
                fontWeight="medium"
                py={2}
                px={3}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-200)',
                  bg: 'white',
                }}
                _hover={{ borderColor: 'brand.300', bg: 'white' }}
                transition="all 0.2s"
                boxShadow="0 1px 2px 0 rgba(80, 36, 143, 0.04)"
          />
        </InputGroup>
      </Box>

          {/* Search Button */}
          <Button
            size="xs"
            leftIcon={<SearchIcon boxSize={3} />}
            onClick={handleSearchSubmit}
            colorScheme="brand"
            variant="solid"
            borderRadius="md"
            px={3}
            py={2}
            fontWeight="semibold"
            fontSize="xs"
            boxShadow="0 1px 2px 0 rgba(80, 36, 143, 0.08)"
            _hover={{
              bg: 'brand.600',
              borderColor: 'brand.600',
              transform: 'translateY(-1px) scale(1.01)',
              boxShadow: '0 2px 6px 0 rgba(80, 36, 143, 0.10)',
            }}
            _active={{ bg: 'brand.700' }}
            transition="all 0.2s"
            w={{ base: '100%', md: 'auto' }}
            maxW="120px"
          >
            Search
          </Button>

          {/* Filter Button */}
          <Button
            size="xs"
            leftIcon={<Icon as={FiFilter} boxSize={3} />}
            rightIcon={activeFilters > 0 ? <ChakraBadge colorScheme="brand" borderRadius="full" fontSize="2xs">{activeFilters}</ChakraBadge> : null}
            onClick={onFilterToggle}
            colorScheme="brand"
            variant="outline"
            borderRadius="md"
            px={3}
            py={2}
            fontWeight="semibold"
            fontSize="xs"
            boxShadow="0 1px 2px 0 rgba(80, 36, 143, 0.08)"
            _hover={{
              bg: 'brand.50',
              borderColor: 'brand.600',
              transform: 'translateY(-1px) scale(1.01)',
              boxShadow: '0 2px 6px 0 rgba(80, 36, 143, 0.10)',
            }}
            _active={{ bg: 'brand.100' }}
            transition="all 0.2s"
            w={{ base: '100%', md: 'auto' }}
            maxW="160px"
          >
            Filters
          </Button>
        </Flex>

        {/* Filter Panel */}
        <Collapse in={isFilterOpen} animateOpacity>
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            mt={2}
            p={{ base: 1, md: 2 }}
            bgGradient="linear(135deg, #fff 0%, #f3ebff 100%)"
            borderRadius="md"
            boxShadow="0 2px 8px 0 rgba(80, 36, 143, 0.08)"
            border="1px solid"
            borderColor="gray.100"
            overflowY="auto"
            maxH={{ base: '40vh', md: 'none' }}
            w="100%"
          >
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="xs" color="brand.700" fontWeight="bold" letterSpacing="tight">
                Filter Leads
              </Heading>
              <HStack spacing={1}>
                {activeFilters > 0 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<Icon as={FiX} boxSize={3} />}
                    onClick={clearFilters}
                    borderRadius="full"
                    w={{ base: '100%', sm: 'auto' }}
                    fontSize="2xs"
                  >
                    Clear All
                  </Button>
                )}
                <IconButton
                  aria-label="Close filters"
                  icon={<CloseIcon boxSize={2.5} />}
                  size="xs"
                  variant="ghost"
                  onClick={onFilterClose}
                  borderRadius="full"
                />
              </HStack>
            </Flex>

            <Divider mb={2} />

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} w="100%">
              {/* Lead User Filter */}
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize="2xs" mb={1}>
                  Lead User
                </FormLabel>
                <Select
                  size="xs"
                  placeholder="Select User"
                  value={filter.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  borderRadius="sm"
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize="2xs"
                  py={1}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                >
                  {userOptions.map(user => (
                    <option key={user._id} value={user._id} style={{ fontSize: '11px' }}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Lead Status Filter */}
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize="2xs" mb={1}>
                  Lead Status
                </FormLabel>
                <Select
                  size="xs"
                  placeholder="Select Status"
                  value={filter.leadStatus}
                  onChange={(e) => handleFilterChange('leadStatus', e.target.value)}
                  borderRadius="sm"
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize="2xs"
                  py={1}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                >
                  {leadStatusOptions.map(status => (
                    <option key={status._id} value={status._id} style={{ fontSize: '11px' }}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Follow-up Status Filter */}
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize="2xs" mb={1}>
                  Follow-up Status
                </FormLabel>
                <Select
                  size="xs"
                  placeholder="Select Follow-up Status"
                  value={filter.followUpStatus}
                  onChange={(e) => handleFilterChange('followUpStatus', e.target.value)}
                  borderRadius="sm"
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize="2xs"
                  py={1}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                >
                  {followUpStatusOptions.map(status => (
                    <option key={status._id} value={status._id} style={{ fontSize: '11px' }}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Filter Actions */}
            <Flex direction={{ base: 'column', sm: 'row' }} justify="flex-end" gap={1} mt={2}>
              <Button
                size="xs"
                variant="outline"
                onClick={onFilterClose}
                borderRadius="sm"
                px={2}
                w={{ base: '100%', sm: 'auto' }}
                fontWeight="semibold"
                fontSize="2xs"
              >
                Cancel
              </Button>
              <Button
                size="xs"
                colorScheme="brand"
                onClick={() => {
                  applyFilters();
                  onFilterClose();
                }}
                leftIcon={<Icon as={FiCheck} boxSize={3} />}
                borderRadius="sm"
                px={2}
                w={{ base: '100%', sm: 'auto' }}
                fontWeight="semibold"
                fontSize="2xs"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm',
                }}
                transition="all 0.2s"
              >
                Apply Filters
              </Button>
            </Flex>
          </Box>
        </Collapse>
      </Box>

      {/* Results Count */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold" color="gray.700">
          {filteredLeads.length} leads found
        </Text>
        {activeFilters > 0 && (
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              Active filters:
            </Text>
            <ChakraBadge colorScheme="brand" borderRadius="full" px={3} py={1}>
              {activeFilters}
            </ChakraBadge>
          </HStack>
        )}
      </Flex>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        minChildWidth="220px"
        spacing={{ base: 2, sm: 3, md: 4 }}
        mb={6}
        justifyItems="center"
      >
        {!loading && filteredLeads.length === 0 ? (
          <Text color="gray.400">No leads match your search.</Text>
        ) : (
          filteredLeads.map((lead) => {
            const user = lead.userId || {};
            return (
              <Box
                key={lead._id}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                mb={2}
                w="100%"
                maxW="350px"
                minW="200px"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                position="relative"
                p={3}
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ 
                  transform: 'translateY(-2px) scale(1.03)', 
                  boxShadow: 'md',
                  borderColor: 'brand.600'
                }}
                style={{
                  borderLeft: '4px solid var(--light-primary)',
                  margin: '0 auto',
                  width: filteredLeads.length === 1 ? '100%' : undefined,
                  maxWidth: filteredLeads.length === 1 ? '350px' : '320px',
                }}
                onClick={() => {
                  setSelectedLeadDetails(lead);
                  setIsDetailsOpen(true);
                }}
              >
                <Flex
                  direction="column"
                  align="center"
                  gap={2}
                  w="100%"
                  mb={2}
                  flexWrap="wrap"
                >
                  <Avatar
                    name={`${user.firstName || ''} ${user.lastName || ''}`}
                    bg="gray.100"
                    color={theme.colors.brand[600] || 'purple.600'}
                    size={{ base: 'md', md: 'lg' }}
                    src={user.avatarUrl}
                    border={`3px solid ${theme.colors.brand[200] || '#E9D8FD'}`}
                    boxShadow="md"
                    mb={{ base: 2, md: 0 }}
                  />
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: 'sm', md: 'md' }}
                    color={theme.colors.brand[700] || 'purple.700'}
                    textTransform="capitalize"
                    maxW="100%"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {user.firstName} {user.lastName}
                  </Text>
                  <Flex
                    direction="column"
                    align={{ base: 'center', md: 'flex-start' }}
                    gap={1}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="gray.500"
                    mt={1}
                    wrap="wrap"
                    w="100%"
                  >
                    <Text as="span" display="flex" alignItems="center" gap={1} maxW="100%" whiteSpace="normal" wordBreak="break-word">📧 <span>{user.email}</span></Text>
                    <Text as="span" display="flex" alignItems="center" gap={1} maxW="100%" whiteSpace="normal" wordBreak="break-word">📞 <span>{user.phoneNumber}</span></Text>
                  </Flex>
                </Flex>
                <Flex gap={1} flexWrap="wrap" w="100%" mt={2}>
                  {lead.followUpStatus?.name && (
                    <Badge colorScheme="yellow" variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold" whiteSpace="normal" wordBreak="break-word">
                      {lead.followUpStatus.name}
                    </Badge>
                  )}
                  {lead.leadStatus?.name && (
                    <Badge colorScheme="brand" variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold" whiteSpace="normal" wordBreak="break-word">
                      {lead.leadStatus.name}
                    </Badge>
                  )}
                  {lead.referanceFrom?.name && (
                    <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="bold" whiteSpace="normal" wordBreak="break-word">
                      {lead.referanceFrom.name}
                    </Badge>
                  )}
                </Flex>
                <Flex
                  direction="row"
                  gap={2}
                  alignSelf="flex-end"
                  mt="auto"
                  opacity={{ base: 1, md: 0.7 }}
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                  position="absolute"
                  top={3}
                  right={3}
                >
                  <Tooltip label="Edit Lead" hasArrow placement="top">
                    <IconButton
                      aria-label="Edit Lead"
                      icon={<EditIcon />}
                      size={{ base: 'xs', md: 'sm' }}
                      colorScheme="brand"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(lead);
                      }}
                      _hover={{ bg: theme.colors.brand[50] || 'purple.50', color: theme.colors.brand[700] || 'purple.700' }}
                    />
                  </Tooltip>
                  <Tooltip label="Delete Lead" hasArrow placement="top">
                    <IconButton
                      aria-label="Delete Lead"
                      icon={<DeleteIcon />}
                      size={{ base: 'xs', md: 'sm' }}
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lead);
                      }}
                      _hover={{ bg: 'red.50', color: 'red.700' }}
                    />
                  </Tooltip>
                </Flex>
              </Box>
            );
          })
        )}
      </SimpleGrid>

      {/* Lead Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetails} size="lg" isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          w="100%"
          maxW={{ base: '95vw', sm: '90vw', md: '500px', lg: '600px' }}
          minW={{ base: '0', md: '400px' }}
          minH="320px"
          maxH={{ base: '90vh', md: '80vh' }}
          borderRadius="2xl"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          p={0}
          position="relative"
          overflowX="hidden"
          overflowY="auto"
          bgGradient="linear(135deg, #f3ebff 0%, #e9d8fd 100%)"
          m={{ base: 2, sm: 3, md: 2 }}
        >
          {selectedLeadDetails && (
            <Box
              bg="transparent"
              borderRadius="2xl"
              boxShadow="md"
              position="relative"
              w="100%"
              maxW="100%"
              minW={0}
              className="css-mypptw"
            >
              {/* Close Button inside the card */}
              <IconButton
                aria-label="Close preview"
                icon={<CloseIcon boxSize={3} color="white" />}
                onClick={closeDetails}
                position="absolute"
                top={2}
                right={2}
                zIndex={10}
                size="sm"
                bg="#6B46C1"
                borderRadius="full"
                boxShadow="md"
                _hover={{ bg: '#5536A6' }}
              />
              {/* Gradient Header Background */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h={{ base: '90px', md: '120px' }}
                bgGradient="linear(135deg, #7C3AED 0%, #6B46C1 50%, #5536A6 100%)"
                opacity={0.9}
                borderTopLeftRadius="2xl"
                borderTopRightRadius="2xl"
              />
              
              {/* Floating Avatar Section */}
              <Flex direction="column" align="center" pt={{ base: 5, sm: 6, md: 6 }} pb={{ base: 2, sm: 3, md: 3 }} position="relative" zIndex={2}>
                <Box
                  as={motion.div}
                  initial={{ y: -20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Avatar
                    name={`${selectedLeadDetails.userId?.firstName || ''} ${selectedLeadDetails.userId?.lastName || ''}`}
                    size={{ base: 'md', sm: 'lg', md: 'xl' }}
                    bg="white"
                    color="brand.600"
                    borderWidth="4px"
                    borderColor="white"
                    boxShadow="0 0 0 4px rgba(255,255,255,0.3), 0 8px 16px rgba(0,0,0,0.08)"
                    mb={2}
                    zIndex={3}
                    position="relative"
                  />
                </Box>
                
                <Box
                  as={motion.div}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  textAlign="center"
                  color="white"
                  px={{ base: 2, sm: 3, md: 2 }}
                >
                  <Text 
                    fontWeight="bold" 
                    fontSize={{ base: 'md', sm: 'lg', md: 'xl' }} 
                    mb={1}
                    textShadow="0 2px 4px rgba(0,0,0,0.3)"
                  >
                    {selectedLeadDetails.userId?.firstName} {selectedLeadDetails.userId?.lastName}
                  </Text>
                  <Text 
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }} 
                    opacity={0.9}
                    mb={1}
                  >
                    {selectedLeadDetails.userId?.email}
                  </Text>
                  <Text 
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }} 
                    opacity={0.9}
                    mb={2}
                  >
                    {selectedLeadDetails.userId?.phoneNumber}
                  </Text>
                  
                  {/* Status Badges */}
                  <Flex gap={2} justify="center" flexWrap="wrap">
                    {selectedLeadDetails.leadStatus?.name && (
                      <Badge 
                        colorScheme="yellow" 
                        variant="solid" 
                        borderRadius="full" 
                        px={2} 
                        py={1} 
                        fontSize="2xs" 
                        fontWeight="bold"
                        boxShadow="0 2px 8px rgba(255,193,7,0.3)"
                      >
                        {selectedLeadDetails.leadStatus.name}
                      </Badge>
                    )}
                    {selectedLeadDetails.followUpStatus?.name && (
                      <Badge 
                        colorScheme="blue" 
                        variant="solid" 
                        borderRadius="full" 
                        px={2} 
                        py={1} 
                        fontSize="2xs" 
                        fontWeight="bold"
                        boxShadow="0 2px 8px rgba(59,130,246,0.3)"
                      >
                        {selectedLeadDetails.followUpStatus.name}
                      </Badge>
                    )}
                  </Flex>
                </Box>
              </Flex>

              {/* Content Section */}
              <ModalBody bg="gray.50" px={0} py={0} w="100%" maxW="100%">
                <Box p={{ base: 2, sm: 3, md: 3 }} w="100%" maxW="100%">
                  <VStack spacing={{ base: 2, sm: 3, md: 3 }} align="stretch" w="100%" maxW="100%" minW={0} flexShrink={1}>
                    {/* Contact Information Card */}
                    <Box
                      as={motion.div}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      bg="white"
                      borderRadius="md"
                      boxShadow="0 1px 8px rgba(0,0,0,0.05)"
                      p={{ base: 2, sm: 3, md: 3 }}
                      borderLeft="3px solid"
                      borderColor="brand.400"
                      w="100%"
                      maxW="100%"
                    >
                      <Flex align="center" mb={1} minW={0} flexShrink={1}>
                        <Circle size="22px" bg="brand.50" color="brand.600" mr={2}>
                          <Icon as={FiUser} boxSize={3} />
                        </Circle>
                        <Heading size="xs" color="gray.800" fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>
                          Contact Information
                        </Heading>
                      </Flex>
                      <VStack spacing={1} align="stretch" w="100%" maxW="100%" minW={0} flexShrink={1}>
                        <Flex align="center" gap={2} minW={0} flexShrink={1}>
                          <Icon as={FiMail} color="gray.400" boxSize={3} />
                          <Text fontWeight="medium" color="gray.600" minW="40px" fontSize="2xs">Email:</Text>
                          <Text color="gray.800" fontSize="2xs" isTruncated w="100%">{selectedLeadDetails.userId?.email}</Text>
                        </Flex>
                        <Flex align="center" gap={2} minW={0} flexShrink={1}>
                          <Icon as={FiPhone} color="gray.400" boxSize={3} />
                          <Text fontWeight="medium" color="gray.600" minW="40px" fontSize="2xs">Phone:</Text>
                          <Text color="gray.800" fontSize="2xs" isTruncated w="100%">{selectedLeadDetails.userId?.phoneNumber}</Text>
                        </Flex>
                      </VStack>
                    </Box>

                    {/* Property Information Card */}
                    <Box
                      as={motion.div}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      bg="white"
                      borderRadius="md"
                      boxShadow="0 1px 8px rgba(0,0,0,0.05)"
                      p={{ base: 2, sm: 3, md: 3 }}
                      borderLeft="3px solid"
                      borderColor="green.400"
                      w="100%"
                      maxW="100%"
                    >
                      <Flex align="center" mb={1} minW={0} flexShrink={1}>
                        <Circle size="22px" bg="green.50" color="green.600" mr={2}>
                          <Icon as={FiHome} boxSize={3} />
                        </Circle>
                        <Heading size="xs" color="gray.800" fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>
                          Interested Property
                        </Heading>
                      </Flex>
                      <Flex align="center" gap={2} minW={0} flexShrink={1}>
                        <Icon as={FiHome} color="gray.400" boxSize={3} />
                        <Text fontWeight="medium" color="gray.600" minW="55px" fontSize="2xs">Property ID:</Text>
                        <Text color="gray.800" fontSize="2xs" isTruncated w="100%">{getPropertyNameById(selectedLeadDetails.leadInterestedPropertyId)}</Text>
                      </Flex>
                    </Box>

                    {/* Assignment Information Card */}
                    <Box
                      as={motion.div}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      bg="white"
                      borderRadius="md"
                      boxShadow="0 1px 8px rgba(0,0,0,0.05)"
                      p={{ base: 2, sm: 3, md: 3 }}
                      borderLeft="3px solid"
                      borderColor="blue.400"
                      w="100%"
                      maxW="100%"
                    >
                      <Flex align="center" mb={1} minW={0} flexShrink={1}>
                        <Circle size="22px" bg="blue.50" color="blue.600" mr={2}>
                          <Icon as={FiUserCheck} boxSize={3} />
                        </Circle>
                        <Heading size="xs" color="gray.800" fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>
                          Assignment Information
                        </Heading>
                      </Flex>
                      <Flex align="center" gap={2} minW={0} flexShrink={1}>
                        <Icon as={FiUser} color="gray.400" boxSize={3} />
                        <Text fontWeight="medium" color="gray.600" minW="55px" fontSize="2xs">Assigned To:</Text>
                        <Text color="gray.800" fontSize="2xs" isTruncated w="100%">
                          {selectedLeadDetails.assignedToUserId?.firstName} {selectedLeadDetails.assignedToUserId?.lastName}
                        </Text>
                      </Flex>
                    </Box>

                    {/* Notes Card */}
                    <Box
                      as={motion.div}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      bg="white"
                      borderRadius="md"
                      boxShadow="0 1px 8px rgba(0,0,0,0.05)"
                      p={{ base: 2, sm: 3, md: 3 }}
                      borderLeft="3px solid"
                      borderColor="orange.400"
                      w="100%"
                      maxW="100%"
                    >
                      <Flex align="center" mb={1} minW={0} flexShrink={1}>
                        <Circle size="22px" bg="orange.50" color="orange.600" mr={2}>
                          <Icon as={FiInfo} boxSize={3} />
                        </Circle>
                        <Heading size="xs" color="gray.800" fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>
                          Notes
                        </Heading>
                      </Flex>
                      <Text color="gray.800" lineHeight="1.4" fontSize="2xs" isTruncated w="100%">
                        {selectedLeadDetails.note || 'No notes available'}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </ModalBody>

              {/* Footer */}
            </Box>
          )}
        </ModalContent>
      </Modal>

      {/* Add/Edit Modal and DeleteConfirmationModal remain unchanged */}
      <FormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedLead(null);
          setIsEditMode(false);
        }}
        title={isEditMode ? 'Edit Lead' : 'Add New Lead'}
        onSave={handleFormSubmit}
        size="xl"
        initialData={isEditMode && selectedLead ? selectedLead : {}}
        modalProps={{
          isCentered: true,
          borderRadius: '2xl',
          boxShadow: '2xl',
          px: { base: 2, md: 8 },
          py: { base: 4, md: 8 },
          bg: 'white',
          border: `2px solid ${theme.colors.brand[100] || '#E9D8FD'}`,
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
        buttonLabel={isEditMode ? 'Update' : 'Add Lead'}
        isSubmitting={isSubmitting}
      >
        <VStack spacing={6} align="stretch">
          {/* Basic Information */}
          <Box borderLeft="4px solid #D53F8C" pl={3} mb={2}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">Basic Information</Text>
          </Box>
            <SearchableSelect
            label="Lead User"
            options={userOptions.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))}
            value={formData.userId}
            onChange={val => setFormData(f => ({ ...f, userId: val }))}
            placeholder="Select Lead User"
            isRequired
          />
          <SearchableSelect
            label="Designation"
            options={[{ label: 'Buyer', value: 'Buyer' }, { label: 'Seller', value: 'Seller' }]}
            value={formData.leadDesignation}
            onChange={val => setFormData(f => ({ ...f, leadDesignation: val }))}
            placeholder="Select Designation"
            isRequired
          />
            <SearchableSelect
            label="Interested Property"
              options={propertyOptions}
            value={formData.leadInterestedPropertyId}
            onChange={val => setFormData(f => ({ ...f, leadInterestedPropertyId: val }))}
              placeholder="Select Property"
            isRequired
            />
            <SearchableSelect
            label="Status"
              options={leadStatusOptions.map(s => ({ label: s.name, value: s._id }))}
            value={formData.leadStatus}
            onChange={val => setFormData(f => ({ ...f, leadStatus: val }))}
            placeholder="Select Status"
            isRequired
          />
            <SearchableSelect
            label="Follow-up Status"
              options={followUpStatusOptions.map(s => ({ label: s.name, value: s._id }))}
            value={formData.followUpStatus}
            onChange={val => setFormData(f => ({ ...f, followUpStatus: val }))}
            placeholder="Select Follow-up Status"
            isRequired
            />

          {/* Contact Information */}
          <Box borderLeft="4px solid #D53F8C" pl={3} mb={2} mt={4}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">Contact Information</Text>
          </Box>
          <Input name="leadAltEmail" value={formData.leadAltEmail || ''} onChange={handleInputChange} placeholder="Alternative Email (Optional)" />
          <Input name="leadAltPhoneNumber" value={formData.leadAltPhoneNumber || ''} onChange={handleInputChange} placeholder="Alternative Phone (Optional)" />
          <Input name="leadLandLineNumber" value={formData.leadLandLineNumber || ''} onChange={handleInputChange} placeholder="Landline (Optional)" />
          <Input name="leadWebsite" value={formData.leadWebsite || ''} onChange={handleInputChange} placeholder="Website (Optional)" />

          {/* Referral Information */}
          <Box borderLeft="4px solid #D53F8C" pl={3} mb={2} mt={4}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">Referral Information</Text>
          </Box>
            <SearchableSelect
            label="Referred By (Optional)"
            options={userOptions.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))}
            value={formData.referredByUserId}
            onChange={val => setFormData(f => ({ ...f, referredByUserId: val }))}
            placeholder="Select User"
          />
          {!formData.referredByUserId && (
            <>
              <Input name="referredByUserFirstName" value={formData.referredByUserFirstName || ''} onChange={handleInputChange} placeholder="Referred By First Name (Optional)" />
              <Input name="referredByUserLastName" value={formData.referredByUserLastName || ''} onChange={handleInputChange} placeholder="Referred By Last Name (Optional)" />
              <Input name="referredByUserEmail" value={formData.referredByUserEmail || ''} onChange={handleInputChange} placeholder="Referrer Email (Optional)" />
              <Input name="referredByUserPhoneNumber" value={formData.referredByUserPhoneNumber || ''} onChange={handleInputChange} placeholder="Referrer Phone (Optional)" />
              <Input name="referredByUserDesignation" value={formData.referredByUserDesignation || ''} onChange={handleInputChange} placeholder="Referrer Designation (Optional)" />
            </>
          )}

          {/* Assignment Information */}
          <Box borderLeft="4px solid #D53F8C" pl={3} mb={2} mt={4}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">Assignment Information</Text>
          </Box>
            <SearchableSelect
            label="Assigned To (Optional)"
              options={userOptions.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))}
              value={formData.assignedToUserId}
              onChange={val => setFormData(f => ({ ...f, assignedToUserId: val }))}
              placeholder="Select User"
            />

          {/* Additional Information */}
          <Box borderLeft="4px solid #D53F8C" pl={3} mb={2} mt={4}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">Additional Information</Text>
          </Box>
          <Textarea name="note" value={formData.note || ''} onChange={handleInputChange} placeholder="Notes (Optional)" />
        </VStack>
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead "${leadToDelete?.userId?.firstName} ${leadToDelete?.userId?.lastName}"?`}
      />

     
    </Box>
  );
};

export default Leads;