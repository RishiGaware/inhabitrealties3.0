import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FiUser, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';

const CustomerDetailsCard = ({ customer }) => {
  const {
    personalDetails: {
      name,
      dob,
      phone,
      email
    }
  } = customer;

  const details = [
    { icon: FiUser, label: 'Name', value: name },
    { icon: FiCalendar, label: 'Date of Birth', value: new Date(dob).toLocaleDateString() },
    { icon: FiPhone, label: 'Phone', value: phone },
    { icon: FiMail, label: 'Email', value: email },
  ];

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Text fontSize="lg" fontWeight="medium" color="gray.700" mb={4}>
        Personal Details
      </Text>
      <Divider mb={4} />
      <VStack spacing={4} align="stretch">
        {details.map((detail, index) => (
          <HStack key={index} spacing={4}>
            <Icon as={detail.icon} w={5} h={5} color="blue.500" />
            <Box>
              <Text fontSize="xs" color="gray.500">
                {detail.label}
              </Text>
              <Text fontSize="sm" color="gray.700">
                {detail.value}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default CustomerDetailsCard; 