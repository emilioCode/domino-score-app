import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@nexboot_settings';

type ColorScheme = 'dark' | 'light' | 'system';

interface SettingsState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  colorScheme: 'dark',
  setColorScheme: (scheme) => {
    set({ colorScheme: scheme });
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ colorScheme: scheme }));
  },
}));

// Hydrate persisted value on module load
AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
  if (!raw) return;
  try {
    const { colorScheme } = JSON.parse(raw) as { colorScheme: ColorScheme };
    if (colorScheme === 'dark' || colorScheme === 'light' || colorScheme === 'system') {
      useSettingsStore.setState({ colorScheme });
    }
  } catch {
    // ignore malformed data
  }
});
