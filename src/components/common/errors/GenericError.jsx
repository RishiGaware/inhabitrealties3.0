import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { MdWarning, MdRefresh, MdHome } from 'react-icons/md';

const GenericError = ({ onRetry, title = "Something Went Wrong", message = "An unexpected error occurred. Please try again." }) => (
  <Box 
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
    position="relative"
    overflow="hidden"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 25% 75%, rgba(255, 154, 158, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(254, 207, 239, 0.3) 0%, transparent 50%)',
      zIndex: 1,
    }}
  >
    {/* Animated background elements */}
    <Box
      position="absolute"
      top="15%"
      left="15%"
      w="90px"
      h="90px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.15)"
      sx={{
        animation: 'float 9s ease-in-out infinite',
      }}
      zIndex={2}
    />
    <Box
      position="absolute"
      top="25%"
      right="20%"
      w="70px"
      h="70px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.15)"
      sx={{
        animation: 'float 7s ease-in-out infinite reverse',
      }}
      zIndex={2}
    />
    <Box
      position="absolute"
      bottom="25%"
      left="25%"
      w="110px"
      h="110px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.15)"
      sx={{
        animation: 'float 11s ease-in-out infinite',
      }}
      zIndex={2}
    />

    <VStack 
      spacing={8} 
      maxW="500px" 
      textAlign="center"
      position="relative"
      zIndex={3}
      px={6}
    >
      {/* Main icon with glow effect */}
      <Box
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          w: '130px',
          h: '130px',
          borderRadius: 'full',
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      >
        <Icon 
          as={MdWarning} 
          boxSize={22} 
          color="white"
          filter="drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))"
        />
      </Box>

      {/* Main heading with gradient text */}
      <Box>
        <Heading 
          as="h1" 
          size="2xl" 
          fontWeight="bold"
          bg="linear-gradient(45deg, #FFD700, #FFA500, #FF6347)"
          bgClip="text"
          backgroundSize="200% 200%"
          sx={{
            animation: 'gradient 4s ease infinite',
          }}
          textShadow="0 0 30px rgba(255, 215, 0, 0.5)"
        >
          {title}
        </Heading>
      </Box>

      {/* Subtitle */}
      <Text 
        fontSize="xl" 
        fontWeight="semibold" 
        color="white"
        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        Unexpected Error
      </Text>

      {/* Description */}
      <Text 
        color="rgba(255, 255, 255, 0.9)" 
        fontSize="lg" 
        lineHeight="1.8"
        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
      >
        {message}
      </Text>

      {/* Action buttons */}
      <VStack spacing={4} w="full">
        {onRetry && (
          <Button 
            size="lg"
            px={10}
            py={4}
            bg="linear-gradient(45deg, #FFD700, #FFA500)"
            color="white"
            fontWeight="bold"
            fontSize="lg"
            borderRadius="full"
            boxShadow="0 8px 32px rgba(255, 215, 0, 0.3)"
            _hover={{
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)',
              bg: 'linear-gradient(45deg, #FFA500, #FF6347)',
            }}
            _active={{
              transform: 'translateY(-1px)',
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            leftIcon={<Icon as={MdRefresh} boxSize={5} />}
            onClick={onRetry}
            w="full"
            maxW="300px"
          >
            Try Again
          </Button>
        )}
        
        <Button 
          size="md"
          px={8}
          py={3}
          bg="rgba(255, 255, 255, 0.15)"
          color="white"
          fontWeight="medium"
          fontSize="md"
          borderRadius="full"
          border="1px solid rgba(255, 255, 255, 0.3)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.25)',
            transform: 'translateY(-2px)',
          }}
          _active={{
            transform: 'translateY(0px)',
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          leftIcon={<Icon as={MdHome} boxSize={4} />}
          onClick={() => window.location.href = '/'}
          w="full"
          maxW="300px"
        >
          Go Home
        </Button>
      </VStack>

      {/* Additional info */}
      <Text 
        color="rgba(255, 255, 255, 0.7)" 
        fontSize="sm"
        mt={4}
      >
        If the problem persists, please contact our support team
      </Text>
    </VStack>

    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}
    </style>
  </Box>
);

export default GenericError; 