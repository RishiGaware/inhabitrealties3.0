import React from 'react';
import { Button } from '@chakra-ui/react';

const CommonButton = ({
  children,
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  isDisabled = false,
  onClick,
  type = 'button',
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClick}
      type={type}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton; 