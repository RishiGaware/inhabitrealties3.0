import React from 'react';
import { Button, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const CommonAddButton = ({ onClick, label = 'Add', isIconOnly, ...rest }) => {
  // Always call the hook at the top level
  const responsiveIconOnly = useBreakpointValue({ base: true, md: false });
  const showIconOnly = isIconOnly !== undefined ? isIconOnly : responsiveIconOnly;

  if (showIconOnly) {
    return (
      <IconButton
        aria-label={label}
        icon={<AddIcon />}
        colorScheme="brand"
        size="sm"
        borderRadius="lg"
        onClick={onClick}
        {...rest}
      />
    );
  }

  return (
    <Button
      leftIcon={<AddIcon />}
      colorScheme="brand"
      size="sm"
      borderRadius="lg"
      fontWeight="bold"
      onClick={onClick}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default CommonAddButton; 