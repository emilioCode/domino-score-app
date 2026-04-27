import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import type { Theme } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';

export const useTheme = (): Theme => {
  const systemScheme = useColorScheme();
  const colorScheme = useSettingsStore((s) => s.colorScheme);

  if (colorScheme === 'dark') return darkTheme;
  if (colorScheme === 'light') return lightTheme;
  return systemScheme === 'light' ? lightTheme : darkTheme;
};
