import { Box, Container, Heading, Text, SimpleGrid, Icon, VStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaChartLine, FaHome } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

const AboutUs = () => {
  const bgColor = useColorModeValue("light.background", "light.background");
  const cardBg = useColorModeValue("light.cardBackground", "light.cardBackground");

  const features = [
    {
      icon: FaUsers,
      title: "Expert Team",
      description: "Our team of real estate professionals brings years of experience to help you find your perfect home."
    },
    {
      icon: FaHandshake,
      title: "Trusted Service",
      description: "We prioritize transparency and trust in every transaction, ensuring a smooth experience for our clients."
    },
    {
      icon: FaChartLine,
      title: "Market Insights",
      description: "Stay informed with our comprehensive market analysis and real-time property value tracking."
    },
    {
      icon: FaHome,
      title: "Quality Properties",
      description: "We carefully curate our listings to ensure you only see the best properties that match your criteria."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box as="section" py={20} bg={bgColor} id="about">
      <Container maxW="container.xl">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <VStack spacing={12}>
            <MotionBox 
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Heading
                as="h2"
                size="2xl"
                textAlign="center"
                bgGradient="linear(to-r, brand.primary, brand.secondary)"
                bgClip="text"
                mb={4}
              >
                About Us
              </Heading>
              <Text
                fontSize="xl"
                textAlign="center"
                maxW="2xl"
                color="light.darkText"
              >
                We are dedicated to making your real estate journey seamless and successful.
                Our commitment to excellence and customer satisfaction sets us apart.
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <VStack
                    p={8}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="lg"
                    spacing={4}
                    align="start"
                    _hover={{
                      boxShadow: "2xl",
                      transform: "translateY(-5px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <MotionIcon
                      as={feature.icon}
                      w={10}
                      h={10}
                      color="brand.primary"
                      variants={iconVariants}
                      whileHover="hover"
                    />
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="light.darkText">{feature.description}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default AboutUs; 