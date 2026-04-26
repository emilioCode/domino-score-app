import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { theme } from '../constants/theme';
import { POINT_OPTIONS } from '../constants/game';
import type { Team } from '../types/game.types';

export default function GameScreen() {
  const router = useRouter();
  const { teams, rounds, targetScore, isFinished, addPoints, undoLastRound } =
    useGameStore();

  const teamA = teams[0];
  const teamB = teams[1];
  const scoreA = rounds.reduce((acc, r) => acc + r.teamAPoints, 0);
  const scoreB = rounds.reduce((acc, r) => acc + r.teamBPoints, 0);
  const leadingId =
    scoreA > scoreB ? teamA.id : scoreB > scoreA ? teamB.id : null;

  useEffect(() => {
    if (isFinished) {
      router.replace('/winner');
    }
  }, [isFinished]);

  const handleBack = () => {
    Alert.alert('¿Abandonar partida?', 'Se perderá el progreso actual.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const scoreOf = (team: Team) => (team.id === teamA.id ? scoreA : scoreB);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.headerBtnText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Dominó Score</Text>

          <TouchableOpacity
            onPress={undoLastRound}
            style={styles.headerBtn}
            activeOpacity={0.7}
            disabled={rounds.length === 0}
          >
            <Text
              style={[
                styles.headerBtnText,
                rounds.length === 0 && styles.dimmed,
              ]}
            >
              ↩
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Marcador ── */}
        <View style={styles.scoreRow}>
          {[teamA, teamB].map((team) => {
            const score = scoreOf(team);
            const progress = Math.min(score / targetScore, 1);
            const isLeading = leadingId === team.id;

            return (
              <View
                key={team.id}
                style={[styles.scoreCard, isLeading && styles.scoreCardLeading]}
              >
                <Text
                  style={[styles.teamName, { color: team.color }]}
                  numberOfLines={1}
                >
                  {team.name}
                </Text>

                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.metaLabel}>/ {targetScore}</Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.round(progress * 100)}%` as `${number}%`,
                        backgroundColor: team.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Botones de puntos ── */}
        {[teamA, teamB].map((team) => (
          <View key={team.id} style={styles.pointsSection}>
            <Text style={[styles.pointsLabel, { color: team.color }]}>
              {team.name}
            </Text>
            <View style={styles.pointsGrid}>
              {POINT_OPTIONS.map((pts) => (
                <TouchableOpacity
                  key={pts}
                  style={[styles.pointBtn, { borderColor: team.color }]}
                  onPress={() => addPoints(team.id, pts)}
                  activeOpacity={0.65}
                >
                  <Text style={[styles.pointBtnText, { color: team.color }]}>
                    +{pts}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* ── Historial de rondas ── */}
        {rounds.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.historyTitle}>Historial</Text>

            <View style={styles.historyHeaderRow}>
              <Text style={[styles.historyCell, styles.cellIndex]} />
              <Text
                style={[
                  styles.historyCell,
                  styles.cellScore,
                  { color: teamA.color },
                ]}
              >
                {teamA.name}
              </Text>
              <Text
                style={[
                  styles.historyCell,
                  styles.cellScore,
                  { color: teamB.color },
                ]}
              >
                {teamB.name}
              </Text>
            </View>

            {[...rounds]
              .reverse()
              .slice(0, 5)
              .map((round, idx) => (
                <View
                  key={round.id}
                  style={[
                    styles.historyRow,
                    idx % 2 === 1 && styles.historyRowAlt,
                  ]}
                >
                  <Text style={[styles.historyCell, styles.cellIndex]}>
                    R{rounds.length - idx}
                  </Text>
                  <Text
                    style={[
                      styles.historyCell,
                      styles.cellScore,
                      {
                        color:
                          round.teamAPoints > 0
                            ? teamA.color
                            : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {round.teamAPoints > 0 ? `+${round.teamAPoints}` : '—'}
                  </Text>
                  <Text
                    style={[
                      styles.historyCell,
                      styles.cellScore,
                      {
                        color:
                          round.teamBPoints > 0
                            ? teamB.color
                            : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {round.teamBPoints > 0 ? `+${round.teamBPoints}` : '—'}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xl,
  },
  headerTitle: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  dimmed: {
    opacity: 0.25,
  },

  // Marcador
  scoreRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  scoreCardLeading: {
    borderColor: theme.colors.accent,
  },
  teamName: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  scoreValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: theme.fontSize.xxl * 1.15,
  },
  metaLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    marginBottom: theme.spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Botones de puntos
  pointsSection: {
    marginBottom: theme.spacing.md,
  },
  pointsLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  pointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  pointBtn: {
    // 3 por fila: (100% - 2 gaps de 8) / 3
    width: '30%',
    flexGrow: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  pointBtnText: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },

  // Historial
  history: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  historyTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
  },
  historyRowAlt: {
    backgroundColor: theme.colors.background,
  },
  historyCell: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  cellIndex: {
    width: 44,
    fontWeight: '600',
  },
  cellScore: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
});
