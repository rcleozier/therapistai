import { Platform } from "react-native";

export const COLORS = {
  // Clinical darkness - like a dimly lit therapy office
  background: '#0f0f0f', // Slightly warmer than pure black
  backgroundSecondary: '#151515', // Subtle elevation
  backgroundTertiary: '#1a1a1a', // Cards/surfaces
  
  // Text colors - desaturated, muted, with subtle warmth
  text: {
    primary: '#d8d8d8', // Soft white, not harsh
    secondary: '#9a9a9a', // Muted gray
    muted: '#5a5a5a', // Almost invisible
    ai: '#c44d4d', // Desaturated deep red - like dried blood
    narrator: '#7a7a7a', // Ghostly gray
    player: '#6b8db8', // Muted blue-gray - clinical
  },
  
  // Message bubble colors - clinical with subtle wrongness
  message: {
    ai: {
      background: '#1a0f0f', // Barely perceptible red tint
      border: '#2a1a1a', // Subtle border
      borderGlow: '#3a1a1a', // Slight glow for unease
      text: '#c44d4d', // Desaturated red
      shadow: 'rgba(196, 77, 77, 0.1)', // Subtle red shadow
    },
    player: {
      background: '#0f0f1a', // Barely perceptible blue tint
      border: '#1a1a2a', // Subtle border
      text: '#6b8db8', // Muted blue-gray
      shadow: 'rgba(107, 141, 184, 0.08)', // Subtle blue shadow
    },
    narrator: {
      background: 'transparent', // No background - just text
      border: '#2a2a2a', // Dashed border only
      text: '#7a7a7a', // Ghostly gray
      shadow: 'transparent',
    },
  },
  
  // Choice buttons - clinical but slightly off
  choice: {
    background: '#151515', // Slightly elevated
    backgroundPressed: '#1a1a1a', // Pressed state
    border: '#2a2a2a', // Subtle border
    borderHover: '#3a2a2a', // Slight red tint on hover
    text: '#d8d8d8', // Soft white
    textHover: '#c44d4d', // Slight red tint
    shadow: 'rgba(0, 0, 0, 0.3)', // Deep shadow
  },
  
  // Accent colors - danger but muted
  accent: {
    red: '#c44d4d', // Desaturated deep red
    darkRed: '#8b2a2a', // Darker red
    ember: '#b85c3a', // Ember orange (muted)
    gold: '#b8a86b', // Dim gold
    eerie: '#3a3a3a', // Eerie gray
  },
  
  white: '#ffffff',
  black: '#000000',
  
  // Status colors (minimal use)
  error: '#c44d4d',
  warning: '#b85c3a',
  
  // Borders and dividers - subtle but present
  border: '#1f1f1f', // Very subtle
  divider: '#151515', // Almost invisible
  dividerStrong: '#2a2a2a', // When needed
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
  // Typography hierarchy - clinical precision with subtle tension
  heading: {
    fontSize: 24,
    fontWeight: '300', // Thin, elegant, unsettling
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: 1.5, // Wide spacing - clinical, detached
    textTransform: 'uppercase', // Clinical formality
  },
  subheading: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 26, // Generous line height for readability
    letterSpacing: 0.1,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '500', // Medium weight, not too bold
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 26,
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 13,
    fontWeight: '300', // Thin, almost whisper-like
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase', // Clinical labels
  },
  small: {
    fontSize: 11,
    fontWeight: '300',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  // AI messages - slightly off, creating unease
  aiMessage: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 26,
    letterSpacing: 0.3, // Slightly wider - feels off
  },
  // Narrator - ethereal, ghostly
  narrator: {
    fontSize: 15,
    fontWeight: '300', // Very thin
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 24,
    letterSpacing: 0.8, // Wide spacing - ghostly
    fontStyle: 'italic',
  },
};
