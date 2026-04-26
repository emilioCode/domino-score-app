import { Platform } from 'react-native';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    tile: string;
    tileAlt: string;
    accent: string;
    accentDim: string;
    textPrimary: string;
    textSecondary: string;
    teamA: string;
    teamB: string;
    border: string;
    success: string;
    overlay: string;
    cardBackground: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  fontSize: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  shadowIOS: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  shadowAndroid: { elevation: number };
}

const shared: Omit<Theme, 'colors'> = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  fontSize: { xs: 11, sm: 13, md: 16, lg: 20, xl: 28, xxl: 40 },
  shadowIOS: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shadowAndroid: { elevation: 4 },
};

export const darkTheme: Theme = {
  ...shared,
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
    overlay: 'rgba(0,0,0,0.7)',
    cardBackground: '#1A1A1A',
  },
};

export const lightTheme: Theme = {
  ...shared,
  colors: {
    background: '#F5F0DC',
    surface: '#EDE5C8',
    tile: '#1A1A1A',
    tileAlt: '#2A2A2A',
    accent: '#A07D20',
    accentDim: '#D4AF37',
    textPrimary: '#0D0D0D',
    textSecondary: '#5A5040',
    teamA: '#C0392B',
    teamB: '#2980B9',
    border: '#D4C9A8',
    success: '#27AE60',
    overlay: 'rgba(0,0,0,0.4)',
    cardBackground: '#EDE5C8',
  },
};

export const theme = darkTheme;

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
