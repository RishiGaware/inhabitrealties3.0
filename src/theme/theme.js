import { extendTheme } from '@chakra-ui/react';

// Refined color palette based on the logo
const colors = {
  brand: {
    primary: '#622376', // A vibrant, accessible purple
    secondary: '#5534A4', // A darker shade for hover states
    accent: '#A37FF0', // A lighter, softer purple for accents
    dark: '#7c117e', // A deep purple for text and headers
    light: '#F4EFFF', // A very light purple for backgrounds
  },
  
  ui: {
    background: '#F9F9FB',
    cardBackground: '#FFFFFF',
    border: '#EAEAEA',
    text: '#333333',
    subtext: '#666666',
    success: '#2E7D32',
    danger: '#C62828',
    warning: '#EF6C00',
  },
};

const theme = extendTheme({
  colors,
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
        transition: 'all 0.2s ease-in-out',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? colors.brand.primary : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? colors.brand.secondary : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        }),
        outline: (props) => ({
          borderColor:
            props.colorScheme === 'brand'
              ? colors.brand.primary
              : props.colorScheme === 'red'
              ? colors.ui.danger
              : undefined,
          color:
            props.colorScheme === 'brand'
              ? colors.brand.primary
              : props.colorScheme === 'red'
              ? colors.ui.danger
              : undefined,
          _hover: {
            color: 'white',
            bg:
              props.colorScheme === 'brand'
                ? colors.brand.primary
                : props.colorScheme === 'red'
                ? colors.ui.danger
                : undefined,
            borderColor: 'transparent',
          },
        }),
        ghost: (props) => ({
          color: props.colorScheme === 'brand' ? colors.brand.primary : undefined,
          _hover: {
            bg: 'gray.100',
          },
        }),
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Table: {
      baseStyle: {
        th: {
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'white',
          bg: colors.brand.dark,
          border: 'none',
        },
        td: {
          color: 'ui.text',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'brand.dark',
      },
      variants: {
        pageTitle: {
          fontSize: { base: 'md', md: 'lg' },
          fontWeight: 'bold',
        },
        sectionTitle: {
          fontSize: { base: 'xl', md: '2xl' },
          fontWeight: 'semibold',
          borderBottom: '2px solid',
          borderColor: 'brand.primary',
          pb: 2,
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'ui.subtext',
      },
      variants: {
        pageTitle: {
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'brand.dark',
        },
        sectionTitle: {
          fontSize: 'xl',
          fontWeight: 'semibold',
          color: 'brand.dark',
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.primary',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'brand.primary',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'ui.background',
        color: 'ui.text',
      },
    },
  },
});

export default theme; 