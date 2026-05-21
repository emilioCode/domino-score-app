import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import { useAppStateInterstitial } from '../hooks/useAppStateInterstitial';

export default function RootLayout() {
  useAppStateInterstitial();
  const scheme = useColorScheme();
  const bg = scheme === 'light' ? lightTheme.colors.background : darkTheme.colors.background;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
