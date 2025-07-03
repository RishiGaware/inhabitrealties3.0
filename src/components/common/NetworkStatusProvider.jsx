import React from 'react';
import { Box } from '@chakra-ui/react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import NoInternet from './errors/NoInternet';

const NetworkStatusProvider = ({ children }) => {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9999}
        bg="white"
        overflow="hidden"
      >
        <NoInternet 
          onRetry={() => {
            // Force a page reload when user clicks retry
            window.location.reload();
          }}
        />
      </Box>
    );
  }

  return children;
};

export default NetworkStatusProvider; 