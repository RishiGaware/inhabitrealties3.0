import React from 'react';
import { Box } from '@chakra-ui/react';

const TableContainer = ({ children }) => {
  return (
    <Box>
      {children[0]} {/* Table */}
      <Box 
        mt={4}
        py={4}
        borderTop="1px" 
        borderColor="gray.100"
        bg="white"
      >
        {children[1]} {/* Pagination */}
      </Box>
    </Box>
  );
};

export default TableContainer; 