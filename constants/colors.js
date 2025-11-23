import { Platform } from "react-native";

export const COLORS = {
  // Dark, horror-themed colors
  background: '#0a0a0a', // Deep black background
  backgroundSecondary: '#1a1a1a', // Slightly lighter for contrast
  backgroundTertiary: '#2a2a2a', // Even lighter for cards
  
  // Text colors
  text: {
    primary: '#e0e0e0', // Light gray for main text
    secondary: '#b0b0b0', // Medium gray for secondary text
    muted: '#707070', // Dark gray for muted text
    ai: '#ff6b6b', // Red for AI messages (disturbing)
    narrator: '#9d9d9d', // Muted for narration
    player: '#4a9eff', // Blue for player messages
  },
  
  // Message bubble colors
  message: {
    ai: {
      background: '#1a0a0a', // Dark red tint
      border: '#3a1a1a',
      text: '#ff6b6b',
    },
    player: {
      background: '#0a0a1a', // Dark blue tint
      border: '#1a1a3a',
      text: '#4a9eff',
    },
    narrator: {
      background: '#1a1a1a',
      border: '#2a2a2a',
      text: '#9d9d9d',
    },
  },
  
  // Choice buttons
  choice: {
    background: '#1a1a1a',
    backgroundHover: '#2a2a2a',
    border: '#3a3a3a',
    text: '#e0e0e0',
    selected: '#ff6b6b',
  },
  
  // Accent colors for horror
  accent: {
    red: '#ff6b6b',
    darkRed: '#8b0000',
    blood: '#cc0000',
    eerie: '#4a4a4a',
  },
  
  white: '#ffffff',
  black: '#000000',
  
  // Status colors (minimal use)
  error: '#ff4444',
  warning: '#ffaa00',
  
  // Borders and dividers
  border: '#2a2a2a',
  divider: '#1a1a1a',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const FONTS = {
  // Clean, readable typography for narrative
  heading: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 16,
  },
  // Special font for AI messages (slightly unsettling)
  aiMessage: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 24,
    letterSpacing: 0.2,
  },
};
