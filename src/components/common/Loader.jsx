import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const Loader = ({ size = 'xl', label = 'Loading...' }) => {
  return (
    <Flex justify="center" align="center" direction="column">
      <Spinner
        thickness="2px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.primary"
        size={size}
        boxSize="35px"
      />
      {label && (
        <Text fontSize="10px" mt={0.5} fontWeight="medium" color="brand.dark">
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default Loader; 