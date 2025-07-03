import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { MdWifiOff, MdRefresh } from 'react-icons/md';

const NoInternet = ({ onRetry }) => (
  <Box 
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    position="relative"
    overflow="hidden"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
      zIndex: 1,
    }}
  >
    {/* Animated background elements */}
    <Box
      position="absolute"
      top="10%"
      left="10%"
      w="100px"
      h="100px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        animation: 'float 6s ease-in-out infinite',
      }}
      zIndex={2}
    />
    <Box
      position="absolute"
      top="20%"
      right="15%"
      w="60px"
      h="60px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        animation: 'float 8s ease-in-out infinite reverse',
      }}
      zIndex={2}
    />
    <Box
      position="absolute"
      bottom="20%"
      left="20%"
      w="80px"
      h="80px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        animation: 'float 7s ease-in-out infinite',
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
          w: '120px',
          h: '120px',
          borderRadius: 'full',
          background: 'radial-gradient(circle, rgba(255, 165, 0, 0.3) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <Icon 
          as={MdWifiOff} 
          boxSize={20} 
          color="white"
          filter="drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))"
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
            animation: 'gradient 3s ease infinite',
          }}
          textShadow="0 0 30px rgba(255, 215, 0, 0.5)"
        >
          No Internet
        </Heading>
      </Box>

      {/* Subtitle */}
      <Text 
        fontSize="xl" 
        fontWeight="semibold" 
        color="white"
        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        Connection Lost
      </Text>

      {/* Description */}
      <Text 
        color="rgba(255, 255, 255, 0.9)" 
        fontSize="lg" 
        lineHeight="1.8"
        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
      >
        It looks like you've lost your internet connection. 
        Please check your network settings and try again.
      </Text>

      {/* Action button */}
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
        >
          Try Again
        </Button>
      )}

      {/* Additional info */}
      <Text 
        color="rgba(255, 255, 255, 0.7)" 
        fontSize="sm"
        mt={4}
      >
        We'll automatically reconnect when your internet is back
      </Text>
    </VStack>

    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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

export default NoInternet; 