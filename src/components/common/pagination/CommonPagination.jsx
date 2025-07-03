import React from 'react';
import {
  HStack,
  Button,
  Text,
  Select,
  Flex,
  Stack,
} from '@chakra-ui/react';

const CommonPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  totalItems = 0,
}) => {
  // Ensure values are valid numbers
  const safeCurrentPage = Math.max(1, parseInt(currentPage) || 1);
  const safeTotalPages = Math.max(1, parseInt(totalPages) || 1);
  const safePageSize = parseInt(pageSize) || 10;
  const safeTotalItems = parseInt(totalItems) || 0;

  // Calculate display values
  const startItem = safeTotalItems > 0 ? ((safeCurrentPage - 1) * safePageSize) + 1 : 0;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);
  const displayTotalItems = safeTotalItems || (safeTotalPages * safePageSize);

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
      align={{ base: 'center', md: 'center' }}
      spacing={{ base: 4, md: 0 }}
      px={4}
      w="100%"
    >
      <Text 
        fontSize={{ base: 'xs', md: 'sm' }} 
        color="gray.600"
        textAlign={{ base: 'center', md: 'left' }}
        display={{ base: 'none', sm: 'block' }}
      >
        {safeTotalItems > 0 ? (
          `Showing ${startItem} to ${endItem} of ${displayTotalItems} entries`
        ) : (
          'No entries to display'
        )}
      </Text>

      <Stack
        direction={{ base: 'column', sm: 'row' }}
        spacing={4}
        align="center"
        w={{ base: '100%', md: 'auto' }}
      >
        <HStack 
          spacing={2} 
          justify={{ base: 'center', md: 'flex-start' }}
          w={{ base: '100%', sm: 'auto' }}
        >
          <Button
            size="sm"
            onClick={() => onPageChange && onPageChange(safeCurrentPage - 1)}
            isDisabled={safeCurrentPage === 1}
            variant="outline"
            colorScheme="brand"
            w={{ base: '40%', sm: 'auto' }}
            minW={{ base: 'auto', sm: '80px' }}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            Previous
          </Button>
          <Text 
            fontSize={{ base: 'xs', md: 'sm' }} 
            color="gray.600"
            whiteSpace="nowrap"
          >
            Page {safeCurrentPage} of {safeTotalPages}
          </Text>
          <Button
            size="sm"
            onClick={() => onPageChange && onPageChange(safeCurrentPage + 1)}
            isDisabled={safeCurrentPage === safeTotalPages}
            variant="outline"
            colorScheme="brand"
            w={{ base: '40%', sm: 'auto' }}
            minW={{ base: 'auto', sm: '80px' }}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            Next
          </Button>
        </HStack>
        
        <HStack 
          spacing={2}
          justify={{ base: 'center', md: 'flex-start' }}
          w={{ base: '100%', sm: 'auto' }}
        >
          <Text 
            fontSize={{ base: 'xs', md: 'sm' }} 
            color="gray.600"
            display={{ base: 'none', sm: 'block' }}
          >
            Show:
          </Text>
          <Select
            size="sm"
            value={safePageSize}
            onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
            width={{ base: '100%', sm: 'auto' }}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </Select>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default CommonPagination; 