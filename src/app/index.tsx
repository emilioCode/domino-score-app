import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadGames } from '../utils/storage';
import { theme } from '../constants/theme';

const TARGET_OPTIONS = [100, 150, 200, 250, 300] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { teams, targetScore, setTeamName, setTargetScore, resetGame } = useGameStore();

  const teamA = teams[0];
  const teamB = teams[1];

  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    loadGames().then((g) => setGameCount(g.length));
  }, []);

  const handleStart = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🁣 Dominó Score</Text>
      <Text style={styles.subtitle}>Configura la partida</Text>

      {/* Team inputs */}
      <View style={styles.section}>
        <Text style={styles.label}>Equipos</Text>

        <View style={styles.inputRow}>
          <View style={[styles.teamDot, { backgroundColor: teamA.color }]} />
          <TextInput
            style={styles.input}
            value={teamA.name}
            onChangeText={(name) => setTeamName(teamA.id, name)}
            placeholder="Equipo A"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={20}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.teamDot, { backgroundColor: teamB.color }]} />
          <TextInput
            style={styles.input}
            value={teamB.name}
            onChangeText={(name) => setTeamName(teamB.id, name)}
            placeholder="Equipo B"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={20}
          />
        </View>
      </View>

      {/* Target score selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Meta de puntos</Text>
        <View style={styles.targetRow}>
          {TARGET_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.targetButton,
                targetScore === option && styles.targetButtonActive,
              ]}
              onPress={() => setTargetScore(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.targetText,
                  targetScore === option && styles.targetTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Start button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={styles.startText}>Iniciar Partida</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        {gameCount > 0 && (
          <TouchableOpacity onPress={() => router.push('/history')} activeOpacity={0.7}>
            <Text style={styles.historyLink}>
              🎲 {gameCount} {gameCount === 1 ? 'partida jugada' : 'partidas jugadas'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl + theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  teamDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.md,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    paddingVertical: theme.spacing.md,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  targetButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  targetButtonActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accent + '20',
  },
  targetText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  targetTextActive: {
    color: theme.colors.accent,
  },
  startButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  startText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing.xl,
  },
  historyLink: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
});
