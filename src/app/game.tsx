import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useGame } from '@/hooks/useGame';
import BannerAdComponent from '@/components/ads/BannerAd';
import { useTheme } from '../hooks/useTheme';
import { POINT_OPTIONS } from '../constants/game';
import type { Team } from '../types/game.types';
import type { Theme } from '../constants/theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
    scoreWrapper: {
      alignItems: 'center',
      overflow: 'visible',
    },
    floatPoints: {
      position: 'absolute',
      fontSize: 28,
      fontWeight: 'bold',
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

    // Edición inline
    historyRowEditing: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.xs,
    },
    editInput: {
      flex: 1,
      height: 34,
      borderWidth: 1.5,
      borderRadius: 6,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.sm,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
    editActionBtn: {
      width: 32,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editConfirm: {
      color: theme.colors.success,
      fontSize: theme.fontSize.md,
      fontWeight: '700',
    },
    editCancel: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      fontWeight: '700',
    },

    // Input personalizado
    customRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      borderWidth: 1.5,
      borderRadius: 10,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    customInput: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    customBtn: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customBtnText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
    },
  });

export default function GameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { teams, rounds, targetScore, isFinished } = useGameStore();
  const { addPoints, undoLastRound, updateRound } = useGame();

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

  // ── Animaciones de puntos ──────────────────────────────────────────────────
  const scaleA = useRef(new Animated.Value(1)).current;
  const scaleB = useRef(new Animated.Value(1)).current;
  const floatOpacityA = useRef(new Animated.Value(0)).current;
  const floatOpacityB = useRef(new Animated.Value(0)).current;
  const floatTranslateA = useRef(new Animated.Value(0)).current;
  const floatTranslateB = useRef(new Animated.Value(0)).current;
  const [floatTextA, setFloatTextA] = useState('');
  const [floatTextB, setFloatTextB] = useState('');

  const handleAddPoints = (teamId: string, points: number) => {
    addPoints(teamId, points);
    const isA = teamId === teamA.id;
    const scale = isA ? scaleA : scaleB;
    const floatOpacity = isA ? floatOpacityA : floatOpacityB;
    const floatTranslate = isA ? floatTranslateA : floatTranslateB;
    const setFloatText = isA ? setFloatTextA : setFloatTextB;

    setFloatText(`+${points}`);
    scale.setValue(1);
    floatOpacity.setValue(1);
    floatTranslate.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 150, useNativeDriver: true }),
      ]),
      Animated.timing(floatTranslate, { toValue: -60, duration: 800, useNativeDriver: true }),
      Animated.timing(floatOpacity,   { toValue: 0,   duration: 800, useNativeDriver: true }),
    ]).start();
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editA, setEditA] = useState('');
  const [editB, setEditB] = useState('');

  useEffect(() => {
    if (editingId && !rounds.find((r) => r.id === editingId)) {
      setEditingId(null);
    }
  }, [rounds]);

  const handleStartEdit = (roundId: string, curA: number, curB: number) => {
    setEditingId(roundId);
    setEditA(curA > 0 ? String(curA) : '');
    setEditB(curB > 0 ? String(curB) : '');
  };

  const handleConfirmEdit = () => {
    if (!editingId) return;
    updateRound(editingId, parseInt(editA, 10) || 0, parseInt(editB, 10) || 0);
    setEditingId(null);
  };

  const handleCancelEdit = () => setEditingId(null);

  const [custom, setCustom] = useState<Record<string, string>>({});
  const getCustom = (teamId: string) => custom[teamId] ?? '';
  const setTeamCustom = (teamId: string, val: string) =>
    setCustom((prev) => ({ ...prev, [teamId]: val }));

  const handleCustomPoints = (teamId: string) => {
    const val = parseInt(getCustom(teamId), 10);
    if (!val || val <= 0) return;
    handleAddPoints(teamId, val);
    setTeamCustom(teamId, '');
  };

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

          <Text style={styles.headerTitle}>Domino Score</Text>

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

                <View style={styles.scoreWrapper}>
                  <Animated.Text
                    style={[
                      styles.scoreValue,
                      { transform: [{ scale: team.id === teamA.id ? scaleA : scaleB }] },
                    ]}
                  >
                    {score}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      styles.floatPoints,
                      {
                        color: team.color,
                        opacity: team.id === teamA.id ? floatOpacityA : floatOpacityB,
                        transform: [{ translateY: team.id === teamA.id ? floatTranslateA : floatTranslateB }],
                      },
                    ]}
                  >
                    {team.id === teamA.id ? floatTextA : floatTextB}
                  </Animated.Text>
                </View>
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
                  onPress={() => handleAddPoints(team.id, pts)}
                  activeOpacity={0.65}
                >
                  <Text style={[styles.pointBtnText, { color: team.color }]}>
                    +{pts}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input personalizado */}
            <View style={[styles.customRow, { borderColor: team.color }]}>
              <TextInput
                style={styles.customInput}
                value={getCustom(team.id)}
                onChangeText={(val) =>
                  setTeamCustom(team.id, val.replace(/[^0-9]/g, ''))
                }
                placeholder="Otro monto..."
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={() => handleCustomPoints(team.id)}
              />
              <TouchableOpacity
                style={[styles.customBtn, { backgroundColor: team.color }]}
                onPress={() => handleCustomPoints(team.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.customBtnText}>+</Text>
              </TouchableOpacity>
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

            <ScrollView
              style={{ maxHeight: 220 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
            {[...rounds]
              .reverse()
              .map((round, idx) => {
                const roundNum = rounds.length - idx;
                const isEditing = editingId === round.id;

                if (isEditing) {
                  return (
                    <View key={round.id} style={styles.historyRowEditing}>
                      <Text style={[styles.historyCell, styles.cellIndex]}>
                        R{roundNum}
                      </Text>
                      <TextInput
                        style={[styles.editInput, { borderColor: teamA.color }]}
                        value={editA}
                        onChangeText={(v) => setEditA(v.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                        selectTextOnFocus
                      />
                      <TextInput
                        style={[styles.editInput, { borderColor: teamB.color }]}
                        value={editB}
                        onChangeText={(v) => setEditB(v.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                        selectTextOnFocus
                      />
                      <TouchableOpacity
                        onPress={handleConfirmEdit}
                        style={styles.editActionBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.editConfirm}>✓</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleCancelEdit}
                        style={styles.editActionBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.editCancel}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }

                return (
                  <TouchableOpacity
                    key={round.id}
                    style={[
                      styles.historyRow,
                      idx % 2 === 1 && styles.historyRowAlt,
                    ]}
                    onPress={() =>
                      handleStartEdit(round.id, round.teamAPoints, round.teamBPoints)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.historyCell, styles.cellIndex]}>
                      R{roundNum}
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
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <BannerAdComponent />
    </SafeAreaView>
  );
}
