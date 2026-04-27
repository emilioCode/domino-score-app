import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { loadGames } from '../utils/storage';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../constants/theme';

const TARGET_OPTIONS = [100, 150, 200, 250, 300] as const;

const SCHEME_OPTIONS = [
  { value: 'light',  icon: '☀️',  label: 'Claro' },
  { value: 'dark',   icon: '🌙',  label: 'Oscuro' },
  { value: 'system', icon: '📱',  label: 'Según el sistema' },
] as const;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xxl + theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
    },
    settingsBtn: {
      position: 'absolute',
      top: 48,
      right: theme.spacing.lg,
      zIndex: 10,
      padding: theme.spacing.xs,
    },
    settingsBtnIcon: {
      fontSize: theme.fontSize.lg,
      opacity: 0.6,
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

    // Settings modal
    settingsOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    settingsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: '100%',
      padding: theme.spacing.lg,
    },
    settingsTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    settingsOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 10,
      gap: theme.spacing.md,
    },
    settingsOptionActive: {
      backgroundColor: theme.colors.accent + '18',
    },
    settingsOptionIcon: {
      fontSize: theme.fontSize.lg,
    },
    settingsOptionLabel: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.md,
    },
    settingsCheck: {
      color: theme.colors.accent,
      fontSize: theme.fontSize.md,
      fontWeight: 'bold',
    },
    settingsCloseBtn: {
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    settingsCloseBtnText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.md,
      fontWeight: 'bold',
    },
  });

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { teams, targetScore, setTeamName, setTargetScore, resetGame } = useGameStore();
  const { colorScheme, setColorScheme } = useSettingsStore();

  const teamA = teams[0];
  const teamB = teams[1];

  const [gameCount, setGameCount] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadGames().then((g) => setGameCount(g.length));
    }, [])
  );

  const handleStart = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <View style={styles.root}>
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

      {/* Settings button — absolute top-right */}
      <TouchableOpacity
        style={styles.settingsBtn}
        onPress={() => setSettingsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.settingsBtnIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* Appearance modal */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Apariencia</Text>

            {SCHEME_OPTIONS.map((opt) => {
              const active = colorScheme === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.settingsOption, active && styles.settingsOptionActive]}
                  onPress={() => setColorScheme(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.settingsOptionIcon}>{opt.icon}</Text>
                  <Text style={styles.settingsOptionLabel}>{opt.label}</Text>
                  {active && <Text style={styles.settingsCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.settingsCloseBtn}
              onPress={() => setSettingsVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.settingsCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
