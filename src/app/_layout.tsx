import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';

export default function RootLayout() {
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
