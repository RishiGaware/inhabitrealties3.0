import { Box } from '@chakra-ui/react';
import Header from '../Header/Header';
import Footer from '../Footer';

export const MainLayout = ({ children }) => {
    return (
      <>
        <Box w="100vw" position="relative" left="50%" right="50%" marginLeft="-50vw" marginRight="-50vw">
          <Header />
        </Box>
        <Box w="100vw" position="relative" left="50%" right="50%" marginLeft="-50vw" marginRight="-50vw">
          {children}
        </Box>
        <Box w="100vw" position="relative" left="50%" right="50%" marginLeft="-50vw" marginRight="-50vw">
          <Footer />
        </Box>
      </>
    )
  }