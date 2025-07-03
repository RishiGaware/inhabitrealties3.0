/**
 * Theme Demo Page
 * 
 * This page showcases all theme system components and features
 * for easy testing and demonstration.
 */

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Divider,
  Badge,
  Input,
  Select,
  Textarea,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { useTheme, useBrandColors, useCurrentTheme, useSemanticColors } from '../theme/ThemeContext';
import Button from '../components/theme/Button';
import Card from '../components/theme/Card';
import Header from '../components/theme/Header';

const ThemeDemo = () => {
  const { themeMode, toggleTheme, setTheme } = useTheme();
  const brandColors = useBrandColors();
  const currentTheme = useCurrentTheme();
  const semanticColors = useSemanticColors();
  const toast = useToast();

  const handleButtonClick = (variant) => {
    toast({
      title: `${variant} Button Clicked`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg={currentTheme.background.primary}>
      <Header title="Theme System Demo" showThemeToggle={true} />
      
      <Box maxW="1200px" mx="auto" p="32px">
        <VStack spacing="48px" align="stretch">
          
          {/* Theme Information */}
          <Card title="Current Theme Information" variant="primary">
            <VStack spacing="16px" align="stretch">
              <HStack justify="space-between">
                <Text>Current Theme Mode:</Text>
                <Badge colorScheme={themeMode === 'light' ? 'blue' : 'purple'}>
                  {themeMode}
                </Badge>
              </HStack>
              
              <HStack spacing="16px">
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  Toggle Theme
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
                  Light Mode
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
                  Dark Mode
                </Button>
              </HStack>
              
              <Text fontSize="14px" color={currentTheme.text.secondary}>
                Theme preferences are automatically saved to localStorage and restored on page load.
              </Text>
            </VStack>
          </Card>

          {/* Brand Colors */}
          <Card title="Brand Colors" subtitle="Primary brand color palette">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="16px">
              <Box p="16px" bg={brandColors.primary} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Primary</Text>
                <Text fontSize="12px">{brandColors.primary}</Text>
              </Box>
              <Box p="16px" bg={brandColors.secondary} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Secondary</Text>
                <Text fontSize="12px">{brandColors.secondary}</Text>
              </Box>
              <Box p="16px" bg={brandColors.accent} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Accent</Text>
                <Text fontSize="12px">{brandColors.accent}</Text>
              </Box>
              <Box p="16px" bg={brandColors.tertiary} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Tertiary</Text>
                <Text fontSize="12px">{brandColors.tertiary}</Text>
              </Box>
            </SimpleGrid>
          </Card>

          {/* Semantic Colors */}
          <Card title="Semantic Colors" subtitle="Status and feedback colors">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="16px">
              <Box p="16px" bg={semanticColors.success[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Success</Text>
                <Text fontSize="12px">{semanticColors.success[600]}</Text>
              </Box>
              <Box p="16px" bg={semanticColors.warning[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Warning</Text>
                <Text fontSize="12px">{semanticColors.warning[600]}</Text>
              </Box>
              <Box p="16px" bg={semanticColors.error[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Error</Text>
                <Text fontSize="12px">{semanticColors.error[600]}</Text>
              </Box>
              <Box p="16px" bg={semanticColors.info[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Info</Text>
                <Text fontSize="12px">{semanticColors.info[600]}</Text>
              </Box>
            </SimpleGrid>
          </Card>

          {/* Button Variants */}
          <Card title="Button Variants" subtitle="Different button styles and states">
            <VStack spacing="24px" align="stretch">
              {/* Primary Buttons */}
              <Box>
                <Text fontWeight="600" mb="12px">Primary Buttons</Text>
                <HStack spacing="12px" flexWrap="wrap">
                  <Button variant="primary" size="xs" onClick={() => handleButtonClick('Primary XS')}>
                    Primary XS
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleButtonClick('Primary SM')}>
                    Primary SM
                  </Button>
                  <Button variant="primary" size="md" onClick={() => handleButtonClick('Primary MD')}>
                    Primary MD
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => handleButtonClick('Primary LG')}>
                    Primary LG
                  </Button>
                  <Button variant="primary" size="xl" onClick={() => handleButtonClick('Primary XL')}>
                    Primary XL
                  </Button>
                </HStack>
              </Box>

              {/* Secondary Buttons */}
              <Box>
                <Text fontWeight="600" mb="12px">Secondary Buttons</Text>
                <HStack spacing="12px" flexWrap="wrap">
                  <Button variant="secondary" size="sm" onClick={() => handleButtonClick('Secondary')}>
                    Secondary
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleButtonClick('Outline')}>
                    Outline
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleButtonClick('Ghost')}>
                    Ghost
                  </Button>
                </HStack>
              </Box>

              {/* Status Buttons */}
              <Box>
                <Text fontWeight="600" mb="12px">Status Buttons</Text>
                <HStack spacing="12px" flexWrap="wrap">
                  <Button variant="success" size="sm" onClick={() => handleButtonClick('Success')}>
                    Success
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleButtonClick('Danger')}>
                    Danger
                  </Button>
                </HStack>
              </Box>

              {/* Disabled Buttons */}
              <Box>
                <Text fontWeight="600" mb="12px">Disabled Buttons</Text>
                <HStack spacing="12px" flexWrap="wrap">
                  <Button variant="primary" size="sm" disabled>
                    Disabled Primary
                  </Button>
                  <Button variant="secondary" size="sm" disabled>
                    Disabled Secondary
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Disabled Outline
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Card>

          {/* Card Variants */}
          <Card title="Card Variants" subtitle="Different card styles and layouts">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
              <Card variant="default" title="Default Card" subtitle="Standard card style">
                <Text>This is a default card with standard styling.</Text>
              </Card>
              
              <Card variant="elevated" title="Elevated Card" subtitle="Card with enhanced shadow">
                <Text>This card has an elevated shadow effect.</Text>
              </Card>
              
              <Card variant="outlined" title="Outlined Card" subtitle="Card with prominent border">
                <Text>This card has a prominent border outline.</Text>
              </Card>
              
              <Card variant="primary" title="Primary Card" subtitle="Brand-themed card">
                <Text>This card uses the primary brand color theme.</Text>
              </Card>
              
              <Card variant="success" title="Success Card" subtitle="Success-themed card">
                <Text>This card uses the success color theme.</Text>
              </Card>
              
              <Card variant="warning" title="Warning Card" subtitle="Warning-themed card">
                <Text>This card uses the warning color theme.</Text>
              </Card>
              
              <Card variant="error" title="Error Card" subtitle="Error-themed card">
                <Text>This card uses the error color theme.</Text>
              </Card>
              
              <Card title="Complex Card">
                <Card.Header>
                  <Heading size="md">Card with Sub-components</Heading>
                </Card.Header>
                <Card.Body>
                  <Text>This card demonstrates the use of sub-components.</Text>
                  <VStack spacing="12px" mt="16px">
                    <Input placeholder="Sample input" />
                    <Select placeholder="Sample select">
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                    </Select>
                  </VStack>
                </Card.Body>
                <Card.Footer>
                  <HStack spacing="12px">
                    <Button variant="primary" size="sm">Save</Button>
                    <Button variant="secondary" size="sm">Cancel</Button>
                  </HStack>
                </Card.Footer>
              </Card>
            </SimpleGrid>
          </Card>

          {/* Form Elements */}
          <Card title="Form Elements" subtitle="Styled form components">
            <VStack spacing="24px" align="stretch">
              <Box>
                <Text fontWeight="600" mb="12px">Input Fields</Text>
                <VStack spacing="12px" align="stretch">
                  <Input placeholder="Default input field" />
                  <Input placeholder="Small input" size="sm" />
                  <Input placeholder="Large input" size="lg" />
                  <Textarea placeholder="Textarea with multiple lines" rows={4} />
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="600" mb="12px">Select Dropdowns</Text>
                <VStack spacing="12px" align="stretch">
                  <Select placeholder="Default select">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                  <Select placeholder="Small select" size="sm">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </Select>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="600" mb="12px">Switches and Controls</Text>
                <HStack spacing="24px">
                  <HStack>
                    <Switch colorScheme="brand" />
                    <Text>Brand Switch</Text>
                  </HStack>
                  <HStack>
                    <Switch colorScheme="green" />
                    <Text>Success Switch</Text>
                  </HStack>
                  <HStack>
                    <Switch colorScheme="red" />
                    <Text>Error Switch</Text>
                  </HStack>
                </HStack>
              </Box>
            </VStack>
          </Card>

          {/* Typography */}
          <Card title="Typography" subtitle="Text styles and hierarchy">
            <VStack spacing="16px" align="stretch">
              <Heading size="4xl">Display Heading (4xl)</Heading>
              <Heading size="3xl">Large Heading (3xl)</Heading>
              <Heading size="2xl">Medium Heading (2xl)</Heading>
              <Heading size="xl">Small Heading (xl)</Heading>
              <Heading size="lg">Tiny Heading (lg)</Heading>
              
              <Divider />
              
              <Text fontSize="lg" fontWeight="600">Large Body Text</Text>
              <Text fontSize="md">Medium Body Text - This is the default body text size used throughout the application.</Text>
              <Text fontSize="sm">Small Body Text - Used for secondary information and captions.</Text>
              <Text fontSize="xs">Extra Small Text - Used for very small labels and metadata.</Text>
              
              <Divider />
              
              <Text color={currentTheme.text.secondary}>Secondary Text Color</Text>
              <Text color={currentTheme.text.muted}>Muted Text Color</Text>
              <Text color={brandColors.accent} textDecoration="underline">Link Text Color</Text>
            </VStack>
          </Card>

          {/* Spacing and Layout */}
          <Card title="Spacing and Layout" subtitle="Consistent spacing tokens">
            <VStack spacing="24px" align="stretch">
              <Box>
                <Text fontWeight="600" mb="12px">Spacing Scale</Text>
                <VStack spacing="8px" align="stretch">
                  <Box p="4px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">4px (xs)</Text>
                  </Box>
                  <Box p="8px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">8px (sm)</Text>
                  </Box>
                  <Box p="16px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">16px (md)</Text>
                  </Box>
                  <Box p="24px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">24px (lg)</Text>
                  </Box>
                  <Box p="32px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">32px (xl)</Text>
                  </Box>
                  <Box p="48px" bg={currentTheme.background.tertiary} borderRadius="4px">
                    <Text fontSize="12px">48px (2xl)</Text>
                  </Box>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="600" mb="12px">Border Radius</Text>
                <HStack spacing="16px" flexWrap="wrap">
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="2px">
                    <Text fontSize="12px">2px (sm)</Text>
                  </Box>
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="4px">
                    <Text fontSize="12px">4px (base)</Text>
                  </Box>
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="8px">
                    <Text fontSize="12px">8px (lg)</Text>
                  </Box>
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="12px">
                    <Text fontSize="12px">12px (xl)</Text>
                  </Box>
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="16px">
                    <Text fontSize="12px">16px (2xl)</Text>
                  </Box>
                  <Box p="16px" bg={brandColors.primary} color="white" borderRadius="24px">
                    <Text fontSize="12px">24px (3xl)</Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Card>

          {/* Real Estate Specific */}
          <Card title="Real Estate Specific Colors" subtitle="Colors for property status and features">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="16px">
              <Box p="16px" bg={semanticColors.success[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Available</Text>
                <Text fontSize="12px">Property Status</Text>
              </Box>
              <Box p="16px" bg={semanticColors.error[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Sold</Text>
                <Text fontSize="12px">Property Status</Text>
              </Box>
              <Box p="16px" bg={semanticColors.warning[600]} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Pending</Text>
                <Text fontSize="12px">Property Status</Text>
              </Box>
              <Box p="16px" bg={brandColors.accent} color="white" borderRadius="8px" textAlign="center">
                <Text fontWeight="600">Featured</Text>
                <Text fontSize="12px">Property Status</Text>
              </Box>
            </SimpleGrid>
          </Card>

        </VStack>
      </Box>
    </Box>
  );
};

export default ThemeDemo; 