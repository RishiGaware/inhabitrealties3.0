import React from 'react';
import {
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Icon,
  Badge,
  Collapse,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  HStack,
  Text,
  IconButton,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { FiFilter, FiX, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchAndFilter = ({
  // Search props
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",
  
  // Filter props
  filters = {},
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  filterOptions = {},
  
  // UI props
  title = "Search and Filter",
  activeFiltersCount = 0,
  
  // Custom filter fields
  customFilterFields = [],
}) => {
  const { isOpen: isFilterOpen, onToggle: onFilterToggle, onClose: onFilterClose } = useDisclosure();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const handleApplyAndClose = () => {
    onApplyFilters();
    onFilterClose();
  };

  return (
    <Box
      mb={6}
      w="100%"
      bg="gray.50"
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
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={onSearchChange}
              onKeyDown={handleSearchKeyDown}
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
          onClick={onSearchSubmit}
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
          rightIcon={activeFiltersCount > 0 ? <Badge colorScheme="brand" borderRadius="full" fontSize="2xs">{activeFiltersCount}</Badge> : null}
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
          bg="white"
          borderRadius="md"
          boxShadow="0 2px 8px 0 rgba(80, 36, 143, 0.08)"
          border="1px solid"
          borderColor="gray.100"
          overflowY="auto"
          maxH={{ base: '40vh', md: 'none' }}
          w="100%"
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text size="xs" color="brand.700" fontWeight="bold" letterSpacing="tight">
              {title}
            </Text>
            <HStack spacing={1}>
              {activeFiltersCount > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  leftIcon={<Icon as={FiX} boxSize={3} />}
                  onClick={onClearFilters}
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
            {/* Dynamic Filter Fields */}
            {Object.entries(filterOptions).map(([key, options]) => (
              <FormControl key={key}>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize="2xs" mb={1}>
                  {options.label}
                </FormLabel>
                <Select
                  size="xs"
                  placeholder={options.placeholder || `Select ${options.label}`}
                  value={filters[key] || ''}
                  onChange={(e) => onFilterChange(key, e.target.value)}
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
                  {options.options.map(option => (
                    <option key={option.value} value={option.value} style={{ fontSize: '11px' }}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ))}

            {/* Custom Filter Fields */}
            {customFilterFields.map((field, index) => (
              <Box key={index}>
                {field}
              </Box>
            ))}
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
              onClick={handleApplyAndClose}
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
  );
};

export default SearchAndFilter; 