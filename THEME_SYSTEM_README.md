# Global Theme System for Inhabit Realties

A comprehensive, scalable theme system for the Inhabit Realties real estate management application.

## 🎯 Overview

This theme system provides a unified design language across the entire application with:
- **Consistent Color Palette**: Brand colors, semantic colors, and theme-specific colors
- **Typography System**: Font families, sizes, weights, and line heights
- **Spacing System**: Consistent spacing, borders, shadows, and layout tokens
- **Component Theming**: Pre-styled components with theme integration
- **Theme Switching**: Light/dark theme support with context-based switching

## 🏗️ Architecture

```
src/theme/
├── colors.js           # Color tokens and palettes
├── typography.js       # Typography system
├── spacing.js          # Spacing, borders, shadows
├── index.js           # Main theme configuration
└── ThemeContext.jsx   # Theme context and hooks
```

## 🎨 Color System

### Brand Colors
```javascript
brandColors = {
  primary: '#015958',    // Main brand color
  secondary: '#1A1A1A',  // Secondary brand color
  accent: '#00A896',     // Accent color
  tertiary: '#6C026B',   // Tertiary brand color
}
```

### Semantic Colors
- **Success**: Green palette for positive actions
- **Warning**: Amber palette for caution states
- **Error**: Red palette for error states
- **Info**: Blue palette for informational content

### Theme Colors
- **Light Theme**: Backgrounds, text, borders for light mode
- **Dark Theme**: Backgrounds, text, borders for dark mode (future)

### Real Estate Specific Colors
```javascript
realEstateColors = {
  property: {
    available: '#8AC640',
    sold: '#EB5463',
    pending: '#FFCE55',
    featured: '#00A896',
  },
  status: {
    active: '#8AC640',
    inactive: '#9CA3AF',
    pending: '#FFCE55',
    completed: '#8AC640',
    cancelled: '#EB5463',
  }
}
```

## 📝 Typography System

### Font Families
```javascript
fontFamilies = {
  heading: "'Roboto Slab', serif",
  body: "'Montserrat', sans-serif",
  mono: "'JetBrains Mono', monospace",
  display: "'Playfair Display', serif",
}
```

### Typography Scale
- **Display**: Large, medium, small for hero sections
- **Headings**: H1-H6 with consistent hierarchy
- **Body**: Large, medium, small, xs for content
- **Labels**: Large, medium, small for form labels
- **Captions**: Large, medium for small text
- **Code**: Large, medium, small for code blocks

## 📏 Spacing System

### Base Unit: 4px
All spacing is based on a 4px grid system for consistency.

### Spacing Scale
```javascript
spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  // ... up to 96
}
```

### Border Radius
```javascript
borderRadius = {
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
}
```

### Shadows
```javascript
shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}
```

## 🔧 Usage

### 1. Theme Provider Setup

Wrap your app with the ThemeProvider:

```jsx
import { ThemeProvider } from './theme/ThemeContext';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';

function App() {
  return (
    <ThemeProvider>
      <ChakraProvider theme={theme}>
        <YourApp />
      </ChakraProvider>
    </ThemeProvider>
  );
}
```

### 2. Using Theme Hooks

```jsx
import { useTheme, useBrandColors, useCurrentTheme } from '../theme/ThemeContext';

function MyComponent() {
  const { themeMode, toggleTheme } = useTheme();
  const brandColors = useBrandColors();
  const currentTheme = useCurrentTheme();

  return (
    <div style={{ backgroundColor: currentTheme.background.primary }}>
      <button onClick={toggleTheme}>
        Current theme: {themeMode}
      </button>
    </div>
  );
}
```

### 3. Using Themed Components

```jsx
import Button from '../components/theme/Button';
import Card from '../components/theme/Card';
import Header from '../components/theme/Header';

function Dashboard() {
  return (
    <div>
      <Header title="Dashboard" />
      
      <Card title="Sales Overview" subtitle="Monthly performance">
        <p>Your content here</p>
        <Button variant="primary" size="md">
          View Details
        </Button>
      </Card>
    </div>
  );
}
```

## 🎨 Component Examples

### Button Component
```jsx
// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Different sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button disabled>Disabled Button</Button>
<Button onClick={handleClick}>Clickable Button</Button>
```

### Card Component
```jsx
// Basic card
<Card title="Property Details" subtitle="Sunset Villa">
  <p>Property information here</p>
</Card>

// Different variants
<Card variant="elevated" title="Featured Property">
  <p>Elevated card with shadow</p>
</Card>

<Card variant="primary" title="Success">
  <p>Primary themed card</p>
</Card>

// Using sub-components
<Card>
  <Card.Header>
    <h3>Card Header</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Header Component
```jsx
<Header 
  title="Inhabit Realties" 
  showThemeToggle={true}
/>
```

## 🎯 Theme Integration in Existing Components

### Using Theme in Sales Components

```jsx
// In SalesList.jsx
import { useCurrentTheme, useBrandColors } from '../../theme/ThemeContext';

const SalesList = () => {
  const currentTheme = useCurrentTheme();
  const brandColors = useBrandColors();

  const tableStyles = {
    backgroundColor: currentTheme.background.secondary,
    border: `1px solid ${currentTheme.border.primary}`,
    borderRadius: '8px',
  };

  const headerStyles = {
    backgroundColor: currentTheme.background.tertiary,
    color: currentTheme.text.primary,
    fontWeight: 600,
  };

  return (
    <Box {...tableStyles}>
      <Table>
        <Thead>
          <Tr>
            <Th {...headerStyles}>Property Name</Th>
            <Th {...headerStyles}>Buyer Name</Th>
            {/* ... */}
          </Tr>
        </Thead>
        {/* ... */}
      </Table>
    </Box>
  );
};
```

## 🔄 Theme Switching

### Automatic Theme Persistence
The theme system automatically saves user preferences to localStorage and restores them on app load.

### Manual Theme Control
```jsx
import { useTheme } from '../theme/ThemeContext';

function ThemeToggle() {
  const { themeMode, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      
      <button onClick={() => setTheme('light')}>
        Light Mode
      </button>
      
      <button onClick={() => setTheme('dark')}>
        Dark Mode
      </button>
    </div>
  );
}
```

## 📱 Responsive Design

The theme system includes responsive breakpoints:

```javascript
breakpoints = {
  sm: '320px',
  md: '500px',
  lg: '720px',
  xl: '960px',
  '2xl': '1200px',
}
```

## 🎨 Customization

### Adding New Colors
```javascript
// In colors.js
export const customColors = {
  feature: {
    highlight: '#FF6B35',
    subtle: '#FFE8E0',
  },
};

// Add to main colors export
export const colors = {
  // ... existing colors
  custom: customColors,
};
```

### Adding New Typography Styles
```javascript
// In typography.js
export const customTypography = {
  hero: {
    fontSize: fontSizes['7xl'],
    fontWeight: fontWeights.black,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
};
```

### Adding New Component Variants
```javascript
// In theme/index.js
Button: {
  variants: {
    // ... existing variants
    custom: {
      bg: 'custom.feature.highlight',
      color: 'white',
      _hover: {
        bg: 'custom.feature.subtle',
        color: 'custom.feature.highlight',
      },
    },
  },
},
```

## 🧪 Testing

### Theme Testing
```jsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../theme/ThemeContext';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

test('button uses theme colors', () => {
  renderWithTheme(<Button>Test Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveStyle({ backgroundColor: '#015958' });
});
```

## 📋 Best Practices

### 1. Use Theme Hooks
Always use theme hooks instead of hardcoding colors:
```jsx
// ✅ Good
const currentTheme = useCurrentTheme();
const styles = { color: currentTheme.text.primary };

// ❌ Bad
const styles = { color: '#464646' };
```

### 2. Consistent Spacing
Use the spacing system for consistent layouts:
```jsx
// ✅ Good
<Box padding="24px" margin="16px">

// ❌ Bad
<Box padding="20px" margin="15px">
```

### 3. Semantic Color Usage
Use semantic colors for their intended purpose:
```jsx
// ✅ Good
<Badge colorScheme="success">Completed</Badge>
<Badge colorScheme="error">Failed</Badge>

// ❌ Bad
<Badge colorScheme="success">Failed</Badge>
```

### 4. Typography Hierarchy
Use the typography system for consistent text styling:
```jsx
// ✅ Good
<Text variant="heading">Title</Text>
<Text variant="body">Content</Text>

// ❌ Bad
<Text fontSize="24px" fontWeight="bold">Title</Text>
```

## 🚀 Future Enhancements

1. **Dark Theme Implementation**: Full dark theme support
2. **CSS Variables**: CSS custom properties for better performance
3. **Theme Presets**: Multiple theme variations
4. **Animation System**: Consistent animation tokens
5. **Icon System**: Themed icon components
6. **Design Tokens**: Export to design tools
7. **Accessibility**: High contrast themes
8. **Internationalization**: RTL support

## 📚 Resources

- [Chakra UI Theme Documentation](https://chakra-ui.com/docs/styled-system/theme)
- [Design System Best Practices](https://www.designsystems.com/)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)

## 🤝 Contributing

When contributing to the theme system:

1. Follow the existing token structure
2. Add comprehensive documentation
3. Include usage examples
4. Test across different components
5. Ensure accessibility compliance
6. Update this README for any changes

---

This theme system provides a solid foundation for consistent, scalable design across the Inhabit Realties application. It's designed to be flexible, maintainable, and easy to use for developers of all skill levels. 