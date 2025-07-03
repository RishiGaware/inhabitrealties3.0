import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { MdSearch, MdHome, MdArrowBack } from 'react-icons/md';

const NotFound = () => (
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
      background: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)',
      zIndex: 1,
    }}
  >
    {/* Animated background elements */}
    <Box
      position="absolute"
      top="10%"
      left="10%"
      w="120px"
      h="120px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        animation: 'float 10s ease-in-out infinite',
      }}
      zIndex={2}
    />
    <Box
      position="absolute"
      top="20%"
      right="15%"
      w="80px"
      h="80px"
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
      w="100px"
      h="100px"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        animation: 'float 12s ease-in-out infinite',
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
          w: '160px',
          h: '160px',
          borderRadius: 'full',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      >
        <Icon 
          as={MdSearch} 
          boxSize={28} 
          color="white"
          filter="drop-shadow(0 0 30px rgba(255, 255, 255, 0.7))"
        />
      </Box>

      {/* Error code */}
      <Box>
        <Heading 
          as="h1" 
          size="4xl" 
          fontWeight="black"
          color="white"
          textShadow="0 0 40px rgba(255, 255, 255, 0.6)"
          letterSpacing="tight"
        >
          404
        </Heading>
      </Box>

      {/* Main heading with gradient text */}
      <Box>
        <Heading 
          as="h2" 
          size="xl" 
          fontWeight="bold"
          bg="linear-gradient(45deg, #FFD700, #FFA500, #FF6347)"
          bgClip="text"
          backgroundSize="200% 200%"
          sx={{
            animation: 'gradient 5s ease infinite',
          }}
          textShadow="0 0 30px rgba(255, 215, 0, 0.5)"
        >
          Page Not Found
        </Heading>
      </Box>

      {/* Subtitle */}
      <Text 
        fontSize="xl" 
        fontWeight="semibold" 
        color="white"
        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        Oops! The page you're looking for doesn't exist
      </Text>

      {/* Description */}
      <Text 
        color="rgba(255, 255, 255, 0.9)" 
        fontSize="lg" 
        lineHeight="1.8"
        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
      >
        The page you requested might have been moved, deleted, or you entered 
        the wrong URL. Let's get you back on track!
      </Text>

      {/* Action buttons */}
      <VStack spacing={4} w="full">
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
          leftIcon={<Icon as={MdHome} boxSize={5} />}
          onClick={() => window.location.href = '/'}
          w="full"
          maxW="300px"
        >
          Go Home
        </Button>
        
        <Button 
          size="md"
          px={8}
          py={3}
          bg="rgba(255, 255, 255, 0.1)"
          color="white"
          fontWeight="medium"
          fontSize="md"
          borderRadius="full"
          border="1px solid rgba(255, 255, 255, 0.2)"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
          }}
          _active={{
            transform: 'translateY(0px)',
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          leftIcon={<Icon as={MdArrowBack} boxSize={4} />}
          onClick={() => window.history.back()}
          w="full"
          maxW="300px"
        >
          Go Back
        </Button>
      </VStack>

      {/* Additional info */}
      <Text 
        color="rgba(255, 255, 255, 0.7)" 
        fontSize="sm"
        mt={4}
      >
        If you believe this is an error, please contact support
      </Text>
    </VStack>

    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
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

export default NotFound; 