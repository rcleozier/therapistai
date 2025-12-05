import { Platform } from "react-native";

export const COLORS = {
  // Premium psychological horror - refined near-black palette
  background: '#050608', // Near-black base (refined from spec)
  backgroundSecondary: '#080A0C', // Slightly lighter for chat area
  backgroundTertiary: '#111318', // Message bubble background
  backgroundStart: '#050508', // Darker variant for start screen
  backgroundGradient: {
    start: '#050608', // Edges darker
    end: '#080A0C', // Center slightly lighter (vignette effect)
  },
  
  // Text colors - refined premium palette
  text: {
    primary: '#F5F3EE', // Soft off-white (refined from spec)
    secondary: '#9a9a9a', // Muted gray
    muted: 'rgba(154, 154, 154, 0.6)', // Status text at 60% opacity
    status: 'rgba(154, 154, 154, 0.6)', // Status bar text
    ai: '#F3E4D8', // Muted warm off-white for AI messages (refined from spec)
    narrator: '#7a7a7a', // Ghostly gray
    player: '#6b8db8', // Muted blue-gray - clinical
    tagline: 'rgba(245, 243, 238, 0.65)', // Tagline with 65% opacity
    disclaimer: 'rgba(245, 243, 238, 0.4)', // Disclaimer with 40% opacity
  },
  
  // Message bubble colors - premium refined design
  message: {
    ai: {
      background: '#111318', // Very dark gray (refined from spec)
      border: 'rgba(242, 92, 77, 0.4)', // Desaturated red-orange at 40% opacity
      borderGlow: 'rgba(242, 92, 77, 0.15)', // Outer glow at 10-15% opacity
      text: '#F3E4D8', // Muted warm off-white (refined from spec)
      shadow: 'rgba(242, 92, 77, 0.12)', // Subtle accent shadow
      accent: '#F25C4D', // Warm red accent for key words
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
  
  // Choice buttons - premium refined design
  choice: {
    background: '#13151A', // Slightly lighter than page background (refined from spec)
    backgroundPressed: '#0F1115', // Darkened by ~10% when pressed
    border: 'rgba(242, 92, 77, 0.3)', // Subtle stroke at 25-35% opacity
    borderHover: 'rgba(242, 92, 77, 0.5)', // Stronger on press
    text: '#F5F3EE', // Soft off-white (refined from spec)
    textHover: '#F25C4D', // Accent color on press
    shadow: 'rgba(0, 0, 0, 0.3)', // Deep shadow
    innerShadow: 'rgba(0, 0, 0, 0.2)', // Inner shadow on press
  },
  
  // Accent colors - refined premium palette
  accent: {
    red: '#F25C4D', // Desaturated red-orange (refined from spec)
    redPressed: '#D84A3D', // Darker when pressed
    redGlow: 'rgba(242, 92, 77, 0.3)', // Soft glow for primary button
    darkRed: '#8b2a2a', // Darker red
    ember: '#b85c3a', // Ember orange (muted)
    gold: '#b8a86b', // Dim gold
    eerie: '#3a3a3a', // Eerie gray
    teal: '#4A9E9E', // Teal for character avatar eye glow
    cyan: '#4A9E9E', // Soft cyan for avatar glow
  },
  
  white: '#ffffff',
  black: '#000000',
  
  // Status colors (minimal use)
  error: '#c44d4d',
  warning: '#b85c3a',
  
  // Borders and dividers - refined subtle palette
  border: '#1f1f1f', // Very subtle
  divider: 'rgba(255, 255, 255, 0.08)', // Almost invisible, refined
  dividerStrong: 'rgba(255, 255, 255, 0.12)', // When needed
  dividerGradient: 'rgba(242, 92, 77, 0.2)', // Subtle gradient line for choices separator
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
  sm: 12, // Message bubbles - tighter, more modern
  md: 14, // Choice buttons
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
  avatar: 7, // Square avatar with rounded corners (6-8px range)
};

export const FONTS = {
  // Typography hierarchy - clinical precision with subtle tension
  heading: {
    fontSize: 20, // Refined size
    fontWeight: '400', // Medium weight for better readability
    fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
    letterSpacing: 0.5, // Refined spacing (title case, not all caps)
    textTransform: 'none', // Title case instead of all caps
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
    fontSize: 12, // Refined to 11-12pt from spec
    fontWeight: '400', // Medium weight for status text
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 16,
    letterSpacing: 1.2, // Increased letter spacing for "CHOOSE YOUR RESPONSE"
    textTransform: 'uppercase', // All caps for labels
  },
  status: {
    fontSize: 11, // 11-12pt from spec
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 16,
    letterSpacing: 0.8, // Slightly increased
  },
  small: {
    fontSize: 11,
    fontWeight: '300',
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  // AI messages - refined premium styling
  aiMessage: {
    fontSize: 16, // 15-16pt from spec
    fontWeight: '400', // Medium weight
    fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
    lineHeight: 26, // Increased for better readability of longer sentences
    letterSpacing: 0.2, // Refined spacing
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
  // Premium title screen typography
  titleScreen: {
    title: {
      fontSize: 30,
      fontWeight: '600', // Semibold
      fontFamily: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
      letterSpacing: 0.5,
      textTransform: 'none', // Title case, not all caps
    },
    tagline: {
      fontSize: 13,
      fontWeight: '400',
      fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
      letterSpacing: 0.2,
      lineHeight: 18,
    },
    disclaimer: {
      fontSize: 10,
      fontWeight: '300',
      fontFamily: Platform.select({ ios: 'SF Pro Text', android: 'Roboto' }),
      letterSpacing: 0.3,
      lineHeight: 14,
    },
  },
};
