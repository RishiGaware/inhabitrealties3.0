import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  HStack,
  Icon,
  useOutsideClick,
  Badge,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon, SearchIcon, CloseIcon } from '@chakra-ui/icons';

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  label,
  error,
  isRequired = false,
  isDisabled = false,
  maxHeight = '200px',
  size = 'md',
  variant = 'outline',
  showClearButton = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const inputRef = useRef(null);
  const popoverRef = useRef(null);
  const containerRef = useRef(null);

  // Find selected option based on value
  useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(option => option.value === value);
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Auto-close when clicking outside
  useOutsideClick({
    ref: containerRef,
    handler: () => {
      if (isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    },
  });

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    (option.label || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange('');
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleToggle = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else {
        setSearchTerm('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const displayValue = selectedOption ? selectedOption.label : '';

  // Size configurations
  const sizeConfig = {
    sm: { height: '32px', fontSize: 'xs', padding: 2 },
    md: { height: '40px', fontSize: 'sm', padding: 3 },
    lg: { height: '48px', fontSize: 'md', padding: 4 },
  };

  const currentSize = sizeConfig[size];

  return (
    <Box position="relative" ref={containerRef}>
      {label && (
        <Text 
          fontSize="sm" 
          fontWeight="600" 
          color="gray.700" 
          mb={2}
          letterSpacing="0.025em"
        >
          {label}
          {isRequired && <Text as="span" color="red.500" ml={1}>*</Text>}
        </Text>
      )}
      
      <Popover
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchTerm('');
        }}
        placement="bottom-start"
        closeOnBlur={false}
        autoFocus={false}
        matchWidth={true}
      >
        <PopoverTrigger>
          <Button
            ref={popoverRef}
            w="full"
            justifyContent="space-between"
            variant={variant}
            onClick={handleToggle}
            isDisabled={isDisabled}
            borderColor={error ? 'red.300' : isOpen ? '#015958' : 'gray.300'}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ 
              borderColor: error ? 'red.400' : isOpen ? '#015958' : 'gray.400',
              bg: isDisabled ? 'gray.50' : 'white',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            _focus={{ 
              borderColor: error ? 'red.500' : '#015958', 
              boxShadow: error 
                ? '0 0 0 3px rgba(235, 84, 99, 0.1)' 
                : '0 0 0 3px rgba(1, 89, 88, 0.1)',
              bg: 'white',
              transform: 'translateY(-1px)',
            }}
            _active={{
              bg: 'gray.50',
              transform: 'translateY(0px)',
            }}
            _disabled={{
              bg: 'gray.50',
              color: 'gray.400',
              cursor: 'not-allowed',
              transform: 'none',
              boxShadow: 'none',
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            h={currentSize.height}
            fontSize={currentSize.fontSize}
            fontWeight="500"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(1, 89, 88, 0.02) 0%, rgba(0, 168, 150, 0.02) 100%)',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <HStack spacing={2} flex={1} justify="flex-start">
              <Text
                color={displayValue ? 'gray.900' : 'gray.500'}
                textAlign="left"
                noOfLines={1}
                fontWeight={displayValue ? '600' : '400'}
                fontSize={currentSize.fontSize}
                transition="all 0.2s ease"
                width="100%"
              >
                {displayValue || placeholder}
              </Text>
              {selectedOption && showClearButton && (
                <Badge
                  colorScheme="teal"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                  bg="rgba(1, 89, 88, 0.1)"
                  color="#015958"
                  fontWeight="500"
                >
                  Selected
                </Badge>
              )}
            </HStack>
            
            <HStack spacing={1}>
              {selectedOption && showClearButton && (
                <Box
                  as="span"
                  role="button"
                  tabIndex={0}
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleClear(e);
                    }
                  }}
                  cursor="pointer"
                  p={1}
                  minW="auto"
                  h="auto"
                  color="gray.400"
                  bg="transparent"
                  border="none"
                  borderRadius="md"
                  _hover={{
                    color: 'red.500',
                  }}
                >
                  <CloseIcon />
                </Box>
              )}
              <Icon 
                as={ChevronDownIcon} 
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                color={isOpen ? '#015958' : 'gray.400'}
                boxSize={4}
              />
            </HStack>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          w="100%"
          minW={0}
          maxW="100vw"
          overflowX="hidden"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, #015958 0%, #00A896 100%)',
          }}
        >
          <PopoverBody p={0}>
            <VStack spacing={0} maxH={maxHeight} overflowY="auto" width="100%" >
              {/* Search Input */}
              <Box 
                p={{ base: 2.5, sm: currentSize.padding }}
                borderBottom="1px solid" 
                borderColor="gray.100"
                bg="gray.50"
                position="sticky"
                top={0}
                zIndex={1}
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(1, 89, 88, 0.1) 50%, transparent 100%)',
                }}
                width="100%"
              >
                <HStack spacing={{ base: 2, sm: 3 }} width="100%">
                  <Icon 
                    as={SearchIcon} 
                    color="gray.400" 
                    boxSize={4}
                    transition="color 0.2s ease"
                  />
                  <Input
                    ref={inputRef}
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    border="none"
                    bg="white"
                    borderRadius="md"
                    w="100%"
                    minW={0}
                    _focus={{ 
                      boxShadow: '0 0 0 3px rgba(1, 89, 88, 0.1)',
                      bg: 'white',
                      border: '1px solid',
                      borderColor: '#015958',
                    }}
                    _placeholder={{ 
                      color: 'gray.400',
                      fontWeight: '400',
                    }}
                    fontSize={{ base: 'md', sm: 'sm', md: 'md' }}
                    fontWeight="500"
                    _hover={{
                      bg: 'gray.50',
                    }}
                    transition="all 0.2s ease"
                  />
                </HStack>
              </Box>
              
              {/* Options List */}
              <List spacing={0} w="full">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <ListItem
                      key={option.value || index}
                      px={{ base: 2.5, sm: currentSize.padding }}
                      py={{ base: 3, sm: 3 }}
                      cursor="pointer"
                      _hover={{ 
                        bg: 'rgba(1, 89, 88, 0.05)',
                        color: '#015958',
                        transform: 'translateX(4px)',
                      }}
                      _active={{
                        bg: 'rgba(1, 89, 88, 0.1)',
                      }}
                      onClick={() => handleSelect(option)}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      borderBottom={index < filteredOptions.length - 1 ? "1px solid" : "none"}
                      borderColor="gray.100"
                      position="relative"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: selectedOption?.value === option.value 
                          ? 'linear-gradient(180deg, #015958 0%, #00A896 100%)' 
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Text 
                        fontSize={{ base: 'md', sm: 'sm', md: 'md' }}
                        fontWeight={selectedOption?.value === option.value ? '600' : '500'}
                        color={selectedOption?.value === option.value ? '#015958' : 'gray.700'}
                        transition="all 0.2s ease"
                        ml={selectedOption?.value === option.value ? 2 : 0}
                      >
                        {option.label}
                      </Text>
                      {selectedOption?.value === option.value && (
                        <HStack spacing={2}>
                          <Badge
                            colorScheme="teal"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                            bg="rgba(1, 89, 88, 0.1)"
                            color="#015958"
                            fontWeight="500"
                          >
                            Current
                          </Badge>
                          <Icon 
                            as={CheckIcon} 
                            color="#015958" 
                            boxSize={4}
                            transition="all 0.2s ease"
                          />
                        </HStack>
                      )}
                    </ListItem>
                  ))
                ) : (
                  <ListItem px={{ base: 2.5, sm: currentSize.padding }} py={{ base: 5, sm: 6 }}>
                    <VStack spacing={2}>
                      <Icon 
                        as={SearchIcon} 
                        color="gray.300" 
                        boxSize={6}
                      />
                      <Text 
                        fontSize={{ base: 'md', sm: 'sm', md: 'md' }}
                        color="gray.500" 
                        textAlign="center"
                        fontWeight="500"
                      >
                        {searchTerm ? 'No options found' : 'No options available'}
                      </Text>
                      {searchTerm && (
                        <Text 
                          fontSize={{ base: 'sm', sm: 'sm' }}
                          color="gray.400" 
                          textAlign="center"
                        >
                          Try adjusting your search terms
                        </Text>
                      )}
                    </VStack>
                  </ListItem>
                )}
              </List>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      
      {error && (
        <HStack spacing={1} mt={2}>
          <Icon as={CloseIcon} color="red.500" boxSize={3} />
          <Text 
            fontSize="xs" 
            color="red.500" 
            fontWeight="500"
            letterSpacing="0.025em"
          >
            {error}
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default SearchableSelect; 