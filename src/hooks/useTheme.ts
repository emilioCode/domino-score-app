import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import type { Theme } from '../constants/theme';

export const useTheme = (): Theme => {
  const scheme = useColorScheme();
  return scheme === 'light' ? lightTheme : darkTheme;
};
