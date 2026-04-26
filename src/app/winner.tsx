import { View, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function WinnerScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
