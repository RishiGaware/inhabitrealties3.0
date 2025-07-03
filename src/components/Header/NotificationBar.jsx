import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  VStack, Box, HStack, Text as ChakraText
} from '@chakra-ui/react';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const getIconForType = (type) => {
  switch (type) {
    case 'info': return <FiInfo color="#3182ce" />;
    case 'success': return <FiCheckCircle color="#38a169" />;
    case 'warning': return <FiAlertTriangle color="#dd6b20" />;
    default: return <FiBell color="#718096" />;
  }
};

const NotificationBar = ({ isOpen, onClose, notifications = [] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInTop">
      <ModalOverlay />
      <ModalContent
        borderRadius="2xl"
        boxShadow="2xl"
        mx={8}
        maxW="380px"
        w="full"
        p={0}
        bgGradient="linear(135deg, #fff 0%, #f3ebff 100%)"
        border="1px solid #E2E8F0"
      >
        <ModalHeader borderBottomWidth="1px" fontWeight="bold" fontSize="lg" bg="white" borderTopRadius="2xl">
          Notifications
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} maxH="60vh" overflowY="auto">
          <VStack align="stretch" spacing={0} divider={<Box h="1px" bg="gray.100" />}> 
            {notifications.length > 0 ? notifications.map((n) => (
              <HStack key={n.id} align="flex-start" spacing={3} p={4} _hover={{ bg: 'gray.50' }} transition="background 0.2s">
                <Box p={2} borderRadius="full" bg="gray.100" minW="36px" minH="36px" display="flex" alignItems="center" justifyContent="center">
                  {getIconForType(n.type)}
                </Box>
                <Box flex={1} minW={0}>
                  <ChakraText fontWeight="semibold" fontSize="md" color="gray.800" noOfLines={1}>{n.title}</ChakraText>
                  <ChakraText fontSize="sm" color="gray.600" noOfLines={2}>{n.description}</ChakraText>
                  <ChakraText fontSize="xs" color="gray.400" mt={1}>{n.timestamp}</ChakraText>
                </Box>
              </HStack>
            )) : (
              <Box p={8} textAlign="center" color="gray.400">
                <FiBell size={40} />
                <ChakraText mt={3} fontSize="md">No new notifications</ChakraText>
              </Box>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotificationBar; 