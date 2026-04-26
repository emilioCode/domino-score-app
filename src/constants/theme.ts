import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#0D0D0D',
    surface: '#1A1A1A',
    tile: '#F5F0DC',
    tileAlt: '#EDE5C8',
    accent: '#D4AF37',
    accentDim: '#A07D20',
    textPrimary: '#F5F0DC',
    textSecondary: '#A09880',
    teamA: '#C0392B',
    teamB: '#2980B9',
    border: '#2A2A2A',
    success: '#27AE60',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
  shadowIOS: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 4,
  },
} as const;

export const shadow = (elevation = 4) =>
  Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.2,
      shadowRadius: elevation,
    },
    android: { elevation },
    default: {},
  });

export type Theme = typeof theme;
