import React from 'react';
import { Box } from '@chakra-ui/react';

const CommonCard = ({ 
  children, 
  onClick, 
  cursor = 'default',
  transition = 'all 0.2s',
  _hover = {},
  ...props 
}) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor="gray.200"
      cursor={onClick ? 'pointer' : cursor}
      transition={transition}
      _hover={onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        ..._hover
      } : _hover}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CommonCard; 