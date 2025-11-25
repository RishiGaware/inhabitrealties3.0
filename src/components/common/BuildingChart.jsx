import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Badge,
  Tooltip,
  useColorModeValue,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { Building2, Home } from 'lucide-react';

const BuildingChart = ({
  propertyId,
  totalFloors,
  flatsPerFloor,
  totalFlats,
  selectedFlatNo = null,
  selectedFloorNo = null,
  bookedFlats = [],
  soldFlats = [],
  onFlatClick = null,
  isViewOnly = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  // Helper to normalize flat numbers for comparison
  const normalizeFlatNo = (flatNo) => {
    if (!flatNo) return '';
    return flatNo.toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  // Helper to check if a flat matches (handles different formats)
  const flatMatches = (flat1, flat2, floor1, floor2) => {
    if (!flat1 && !flat2) return floor1 === floor2;
    if (!flat1 || !flat2) return false;
    
    const normalized1 = normalizeFlatNo(flat1);
    const normalized2 = normalizeFlatNo(flat2);
    
    // Exact match
    if (normalized1 === normalized2) return true;
    
    // Check if floor numbers match when flat numbers are provided
    if (floor1 && floor2 && floor1 === floor2) {
      // If flat numbers contain the floor number, check if they match
      if (normalized1.includes(floor1.toString()) && normalized2.includes(floor2.toString())) {
        return true;
      }
    }
    
    return false;
  };

  // Generate flat structure
  const generateFlatStructure = () => {
    if (!totalFloors || !flatsPerFloor) return [];

    const structure = [];
    for (let floor = totalFloors; floor >= 1; floor--) {
      const floorFlats = [];
      for (let flat = 1; flat <= flatsPerFloor; flat++) {
        const flatNo = `${floor}${String.fromCharCode(64 + flat)}`; // e.g., 3A, 3B, 3C
        const isBooked = bookedFlats.some(
          (b) => flatMatches(flatNo, b.flatNo, floor, b.floorNo)
        );
        const isSold = soldFlats.some(
          (s) => flatMatches(flatNo, s.flatNo, floor, s.floorNo)
        );
        const isSelected = selectedFlatNo && flatMatches(flatNo, selectedFlatNo, floor, selectedFloorNo) ||
                           selectedFloorNo === floor;

        let status = 'available'; // green
        if (isSold) status = 'sold'; // red
        else if (isBooked) status = 'booked'; // blue
        else if (isSelected) status = 'selected'; // highlight

        floorFlats.push({
          flatNo,
          floorNo: floor,
          flatIndex: flat,
          status,
          isSelected,
        });
      }
      structure.push({
        floorNo: floor,
        flats: floorFlats,
      });
    }
    return structure;
  };

  const flatStructure = generateFlatStructure();

  const getStatusColor = (status) => {
    switch (status) {
      case 'sold':
        return 'red.500';
      case 'booked':
        return 'blue.500';
      case 'selected':
        return 'yellow.400';
      case 'available':
      default:
        return 'green.500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'sold':
        return 'red.100';
      case 'booked':
        return 'blue.100';
      case 'selected':
        return 'yellow.100';
      case 'available':
      default:
        return 'green.100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sold':
        return 'Sold';
      case 'booked':
        return 'Booked';
      case 'selected':
        return 'Selected';
      case 'available':
      default:
        return 'Available';
    }
  };

  if (!totalFloors || !flatsPerFloor) {
    return (
      <Box
        p={4}
        bg={cardBg}
        borderRadius="md"
        border="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.500">
          Building structure not configured. Please add total floors and flats per floor.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      p={{ base: 3, md: 4 }}
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Box as={Building2} color="blue.500" boxSize="18px" />
            <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
              Building Chart
            </Text>
          </HStack>
          <Badge colorScheme="gray" fontSize="xs">
            {totalFloors} Floors × {flatsPerFloor} Flats
          </Badge>
        </Flex>

        {/* Legend */}
        <SimpleGrid columns={4} spacing={2} fontSize="xs">
          <HStack spacing={1}>
            <Box w="12px" h="12px" bg="green.500" borderRadius="sm" />
            <Text>Available</Text>
          </HStack>
          <HStack spacing={1}>
            <Box w="12px" h="12px" bg="blue.500" borderRadius="sm" />
            <Text>Booked</Text>
          </HStack>
          <HStack spacing={1}>
            <Box w="12px" h="12px" bg="red.500" borderRadius="sm" />
            <Text>Sold</Text>
          </HStack>
          <HStack spacing={1}>
            <Box w="12px" h="12px" bg="yellow.400" borderRadius="sm" />
            <Text>Selected</Text>
          </HStack>
        </SimpleGrid>

        {/* Building Chart */}
        <Box
          overflowX="auto"
          overflowY="auto"
          maxH={{ base: '400px', md: '500px' }}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          p={2}
          bg={cardBg}
        >
          <VStack spacing={2} align="stretch">
            {flatStructure.map((floor) => (
              <Box key={floor.floorNo}>
                <HStack spacing={2} mb={1}>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.600"
                    minW="40px"
                  >
                    Floor {floor.floorNo}
                  </Text>
                  <Grid
                    templateColumns={`repeat(${flatsPerFloor}, 1fr)`}
                    gap={1}
                    flex={1}
                  >
                    {floor.flats.map((flat) => (
                      <Tooltip
                        key={flat.flatNo}
                        label={`${flat.flatNo} - ${getStatusText(flat.status)}`}
                        placement="top"
                      >
                        <GridItem>
                          <Box
                            w="full"
                            h={{ base: '32px', md: '36px' }}
                            bg={getStatusBg(flat.status)}
                            border="2px solid"
                            borderColor={
                              flat.isSelected
                                ? 'yellow.500'
                                : getStatusColor(flat.status)
                            }
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor={onFlatClick && !isViewOnly ? 'pointer' : 'default'}
                            onClick={() => {
                              if (onFlatClick && !isViewOnly) {
                                onFlatClick(flat.flatNo, flat.floorNo);
                              }
                            }}
                            _hover={
                              onFlatClick && !isViewOnly
                                ? {
                                    transform: 'scale(1.05)',
                                    boxShadow: 'md',
                                    zIndex: 1,
                                  }
                                : {}
                            }
                            transition="all 0.2s"
                            position="relative"
                          >
                            <Text
                              fontSize={{ base: 'xs', md: 'sm' }}
                              fontWeight="bold"
                              color={flat.isSelected ? 'yellow.700' : 'gray.700'}
                            >
                              {flat.flatNo}
                            </Text>
                            {flat.isSelected && (
                              <Box
                                position="absolute"
                                top="-2px"
                                right="-2px"
                                w="8px"
                                h="8px"
                                bg="yellow.500"
                                borderRadius="full"
                                border="2px solid white"
                              />
                            )}
                          </Box>
                        </GridItem>
                      </Tooltip>
                    ))}
                  </Grid>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Summary */}
        <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={2} fontSize="xs">
          <HStack justify="center" p={2} bg="green.50" borderRadius="md">
            <Text fontWeight="semibold">Available:</Text>
            <Text>
              {totalFlats -
                (bookedFlats.length + soldFlats.length) >
              0
                ? totalFlats - (bookedFlats.length + soldFlats.length)
                : 0}
            </Text>
          </HStack>
          <HStack justify="center" p={2} bg="blue.50" borderRadius="md">
            <Text fontWeight="semibold">Booked:</Text>
            <Text>{bookedFlats.length}</Text>
          </HStack>
          <HStack justify="center" p={2} bg="red.50" borderRadius="md">
            <Text fontWeight="semibold">Sold:</Text>
            <Text>{soldFlats.length}</Text>
          </HStack>
          <HStack justify="center" p={2} bg="gray.50" borderRadius="md">
            <Text fontWeight="semibold">Total:</Text>
            <Text>{totalFlats || totalFloors * flatsPerFloor}</Text>
          </HStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default BuildingChart;

