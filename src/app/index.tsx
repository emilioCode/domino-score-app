import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  // return <View style={styles.container} />;
    return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: theme.colors.accent, fontSize: theme.fontSize.xl, fontWeight: 'bold' }}>
        🁣 Dominó Score
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.md, marginTop: 8 }}>
        v0.1.0 — en construcción
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
