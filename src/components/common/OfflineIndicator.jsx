import React from 'react';
import { Box, Badge, Icon } from '@chakra-ui/react';
import { MdWifiOff } from 'react-icons/md';
import useNetworkStatus from '../../hooks/useNetworkStatus';

const OfflineIndicator = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={4}
      right={4}
      zIndex={10000}
      bg="orange.500"
      color="white"
      px={3}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      gap={2}
      boxShadow="lg"
      animation="pulse 2s infinite"
    >
      <Icon as={MdWifiOff} boxSize={3} />
      Offline
    </Box>
  );
};

export default OfflineIndicator; 