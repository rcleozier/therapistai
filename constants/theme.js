import { COLORS, SPACING, BORDER_RADIUS } from './colors';

// Lightweight theme facade used by high-level screens/components.
// Keeps a consistent naming scheme (background/surface/text/accent) without
// disrupting the existing COLORS export used elsewhere.
export const THEME = {
  colors: {
    background: COLORS.background,
    surface: COLORS.backgroundSecondary,
    surfaceStrong: COLORS.backgroundTertiary,
    textPrimary: COLORS.text.primary,
    textSecondary: COLORS.text.muted,
    accent: COLORS.accent.red,
    borderSoft: COLORS.divider,
    borderAccentSoft: COLORS.dividerGradient,
  },
  spacing: SPACING,
  radii: BORDER_RADIUS,
};


