import { extendTheme, theme as base, withDefaultVariant } from "@chakra-ui/react"
import LightThemeColors from '../assets/Colors'

const breakpoints = {
  sm: '320px',
  md: '500px',
  lg: '720px',
  xl: '960px',
  '2xl': '1200px',
}

export const theme = extendTheme({
  breakpoints,
  colors: {
    brand: {
      primary: 'var(--chakra-colors-light-darkText)',
      secondary: LightThemeColors.brandSecondary,
      tertiary: LightThemeColors.brandTurnary,
    },
    light: {
      background: LightThemeColors.lightBackground,
      cardBackground: LightThemeColors.lightCardBackground,
      darkText: LightThemeColors.lightDarkText,
      success: LightThemeColors.lightSuccess,
      danger: LightThemeColors.lightDanger,
      warning: LightThemeColors.lightWarning,
      primary: LightThemeColors.lightPrimary,
      secondary: LightThemeColors.lightSecondary,
    }
  },
  fonts: {
    heading: `'Roboto Slab', ${base.fonts.heading}`,
    body: `'Montserrat', sans-serif`,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  styles: {
    global: {
      body: {
        bg: 'light.background',
        color: 'light.darkText',
        fontSize: 'md',
      },
      h1: {
        fontSize: '4xl',
        fontWeight: 'bold',
        color: 'light.darkText',
      },
      h2: {
        fontSize: '3xl',
        fontWeight: 'bold',
        color: 'light.darkText',
      },
      h3: {
        fontSize: '2xl',
        fontWeight: 'semibold',
        color: 'light.darkText',
      },
      h4: {
        fontSize: 'xl',
        fontWeight: 'semibold',
        color: 'light.darkText',
      },
      p: {
        fontSize: 'md',
        color: 'light.darkText',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      defaultProps: {
        colorScheme: 'brand',
        size: 'md',
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 2,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 3,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 4,
        },
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.primary',
        size: 'md',
      },
      sizes: {
        sm: {
          fontSize: 'sm',
        },
        md: {
          fontSize: 'md',
        },
        lg: {
          fontSize: 'lg',
        },
      }
    },
    Select: {
      baseStyle: {
        _focus: {
          borderColor: 'brand.primary'
        }
      },
      defaultProps: {
        size: 'md',
      },
      sizes: {
        sm: {
          fontSize: 'sm',
        },
        md: {
          fontSize: 'md',
        },
        lg: {
          fontSize: 'lg',
        },
      }
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.primary',
        size: 'md',
      },
      sizes: {
        sm: {
          fontSize: 'sm',
        },
        md: {
          fontSize: 'md',
        },
        lg: {
          fontSize: 'lg',
        },
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'light.cardBackground',
          borderRadius: 'lg',
          boxShadow: 'md',
        }
      }
    }
  }
});