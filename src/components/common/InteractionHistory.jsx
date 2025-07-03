import React from 'react';
import {
  VStack,
  Box,
  Text,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiPhone, FiMail, FiUser, FiCalendar } from 'react-icons/fi';

const InteractionHistory = ({ interactions = [] }) => {
  const getInteractionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'call':
        return FiPhone;
      case 'email':
        return FiMail;
      case 'meeting':
        return FiUser;
      default:
        return FiCalendar;
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {interactions.map((interaction, index) => (
        <Box
          key={index}
          p={4}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <HStack spacing={4}>
            <Icon
              as={getInteractionIcon(interaction.type)}
              w={5}
              h={5}
              color="blue.500"
            />
            <Box flex="1">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium" fontSize="sm" color="gray.700">
                  {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(interaction.date).toLocaleDateString()}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                {interaction.notes}
              </Text>
            </Box>
          </HStack>
        </Box>
      ))}
      {interactions.length === 0 && (
        <Box p={4} bg="gray.50" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.500">
            No interactions recorded
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default InteractionHistory; 