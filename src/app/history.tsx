import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useCallback, useMemo } from 'react';
import { deleteGame, clearAllGames } from '../utils/storage';
import { useHistoryStore } from '../store/historyStore';
import BannerAdComponent from '@/components/ads/BannerAd';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../constants/theme';
import type { SavedGame } from '../types/game.types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] as const;
const DAYS_FULL = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'] as const;
const MONTHS_FULL = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'] as const;

const formatDate = (ts: number): string => {
  const d = new Date(ts);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${day} ${month} · ${h12}:${mins} ${ampm}`;
};

const formatDateFull = (ts: number): string => {
  const d = new Date(ts);
  return `${DAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDuration = (ms: number): string => {
  const mins = Math.round(ms / 60_000);
  return mins < 1 ? '< 1 min' : `${mins} min`;
};

// ── Styles ────────────────────────────────────────────────────────────────────

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
    },
    dimmed: {
      opacity: 0.25,
    },

    // List
    list: {
      padding: theme.spacing.md,
      flexGrow: 1,
    },

    // Card wrapper + delete background
    cardWrapper: {
      marginBottom: theme.spacing.md,
      borderRadius: 14,
      overflow: 'hidden',
    },
    deleteBackground: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 80,
      backgroundColor: theme.colors.teamA,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteIcon: {
      fontSize: 22,
    },

    // Card — padding removed so TouchableOpacity covers full area
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardInner: {
      padding: theme.spacing.md,
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    winnerLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: '700',
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    dateText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
    },
    cardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    scoreNum: {
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold',
    },
    scoreDash: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.lg,
    },
    metaText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
      textAlign: 'right',
    },

    // Empty state
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      textAlign: 'center',
    },

    // Modal overlay + card
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    modalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: '100%',
      maxHeight: '88%',
      overflow: 'hidden',
    },
    modalScroll: {
      padding: theme.spacing.lg,
    },

    // Date header
    modalDate: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
      textAlign: 'center',
    },

    // Separator
    modalSeparator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },

    // Matchup row: "Equipo A  vs  Equipo B"
    matchupRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    matchupName: {
      fontSize: theme.fontSize.md,
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    matchupVs: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      fontWeight: '600',
    },

    // Result: big scores + winner badge
    resultRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    resultCol: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    resultScore: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
    },
    resultDash: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xl,
      lineHeight: theme.fontSize.xxl * 1.2,
    },
    winnerBadge: {
      fontSize: theme.fontSize.xs,
      fontWeight: '700',
    },

    // Rounds table
    roundsHeaderRow: {
      flexDirection: 'row',
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.xs,
    },
    roundsColIndex: {
      width: 44,
    },
    roundsColName: {
      flex: 1,
      fontSize: theme.fontSize.xs,
      fontWeight: '700',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    roundRow: {
      flexDirection: 'row',
      paddingVertical: 5,
    },
    roundIndex: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      width: 44,
      fontWeight: '600',
    },
    roundPts: {
      flex: 1,
      fontSize: theme.fontSize.sm,
      fontWeight: '700',
      textAlign: 'center',
    },

    // Footer stats
    modalFooter: {
      gap: theme.spacing.xs,
    },
    modalFooterText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
    },

    // Modal buttons
    modalButtons: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    closeBtn: {
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    closeBtnText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.md,
      fontWeight: 'bold',
    },
    deleteModalBtn: {
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.teamA,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    deleteModalBtnText: {
      color: theme.colors.teamA,
      fontSize: theme.fontSize.md,
      fontWeight: '600',
    },
  });

// ── GameCard ──────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = -80;

type CardProps = { game: SavedGame; onDelete: () => void; onOpen: () => void };

function GameCard({ game, onDelete, onOpen }: CardProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const translateX = useRef(new Animated.Value(0)).current;

  const scoreA = game.rounds.reduce((acc, r) => acc + r.teamAPoints, 0);
  const scoreB = game.rounds.reduce((acc, r) => acc + r.teamBPoints, 0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 2,
      onPanResponderMove: (_, { dx }) => {
        if (dx < 0) translateX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDelete());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </View>

      <Animated.View
        style={[styles.card, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={onOpen}
          onLongPress={onOpen}
          activeOpacity={0.75}
        >
          <View style={styles.cardInner}>
            <View style={styles.cardTop}>
              <Text style={[styles.winnerLabel, { color: game.winner.color }]} numberOfLines={1}>
                🏆 {game.winner.name}
              </Text>
              <Text style={styles.dateText}>{formatDate(game.date)}</Text>
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.scoreRow}>
                <Text
                  style={[
                    styles.scoreNum,
                    { color: game.teams[0].id === game.winner.id
                        ? game.teams[0].color
                        : theme.colors.textSecondary },
                  ]}
                >
                  {scoreA}
                </Text>
                <Text style={styles.scoreDash}>—</Text>
                <Text
                  style={[
                    styles.scoreNum,
                    { color: game.teams[1].id === game.winner.id
                        ? game.teams[1].color
                        : theme.colors.textSecondary },
                  ]}
                >
                  {scoreB}
                </Text>
              </View>

              <Text style={styles.metaText}>
                {game.rounds.length} {game.rounds.length === 1 ? 'ronda' : 'rondas'} · {formatDuration(game.duration)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── HistoryScreen ─────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { games, load } = useHistoryStore();
  const [selectedGame, setSelectedGame] = useState<SavedGame | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openModal = useCallback((game: SavedGame) => {
    setSelectedGame(game);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const closeModal = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteGame(id);
    load();
  }, [load]);

  const handleDeleteFromModal = useCallback(() => {
    if (!selectedGame) return;
    Alert.alert(
      'Eliminar partida',
      '¿Eliminar esta partida del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteGame(selectedGame.id);
            load();
            closeModal();
          },
        },
      ]
    );
  }, [selectedGame, closeModal, load]);

  const handleClearAll = () => {
    Alert.alert(
      'Borrar historial',
      '¿Eliminar todas las partidas guardadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await clearAllGames();
            load();
          },
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: SavedGame }) => (
      <GameCard
        game={item}
        onDelete={() => handleDelete(item.id)}
        onOpen={() => openModal(item)}
      />
    ),
    [handleDelete, openModal]
  );

  const EmptyState = (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🎲</Text>
      <Text style={styles.emptyText}>No hay partidas guardadas aún</Text>
    </View>
  );

  const modalScoreA = selectedGame?.rounds.reduce((acc, r) => acc + r.teamAPoints, 0) ?? 0;
  const modalScoreB = selectedGame?.rounds.reduce((acc, r) => acc + r.teamBPoints, 0) ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Historial</Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleClearAll}
          activeOpacity={0.7}
          disabled={games.length === 0}
        >
          <Text style={[styles.headerBtnText, games.length === 0 && styles.dimmed]}>
            🗑
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail modal */}
      <Modal
        visible={!!selectedGame}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalCard}>
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {selectedGame && (() => {
                const tA = selectedGame.teams[0];
                const tB = selectedGame.teams[1];
                const isAWinner = tA.id === selectedGame.winner.id;
                const mins = Math.round(selectedGame.duration / 60_000);
                return (
                  <>
                    {/* Fecha */}
                    <Text style={styles.modalDate}>
                      {formatDateFull(selectedGame.date)}
                    </Text>

                    <View style={styles.modalSeparator} />

                    {/* Enfrentamiento */}
                    <View style={styles.matchupRow}>
                      <Text
                        style={[styles.matchupName, { color: tA.color }]}
                        numberOfLines={1}
                      >
                        {tA.name}
                      </Text>
                      <Text style={styles.matchupVs}>vs</Text>
                      <Text
                        style={[styles.matchupName, { color: tB.color }]}
                        numberOfLines={1}
                      >
                        {tB.name}
                      </Text>
                    </View>

                    {/* Resultado */}
                    <View style={styles.resultRow}>
                      <View style={styles.resultCol}>
                        <Text
                          style={[
                            styles.resultScore,
                            { color: isAWinner ? tA.color : theme.colors.textSecondary },
                          ]}
                        >
                          {modalScoreA}
                        </Text>
                        {isAWinner && (
                          <Text style={[styles.winnerBadge, { color: tA.color }]}>
                            🏆 Ganador
                          </Text>
                        )}
                      </View>
                      <Text style={styles.resultDash}>—</Text>
                      <View style={styles.resultCol}>
                        <Text
                          style={[
                            styles.resultScore,
                            { color: !isAWinner ? tB.color : theme.colors.textSecondary },
                          ]}
                        >
                          {modalScoreB}
                        </Text>
                        {!isAWinner && (
                          <Text style={[styles.winnerBadge, { color: tB.color }]}>
                            🏆 Ganador
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.modalSeparator} />

                    {/* Rondas — header de columnas */}
                    <View style={styles.roundsHeaderRow}>
                      <View style={styles.roundsColIndex} />
                      <Text
                        style={[styles.roundsColName, { color: tA.color }]}
                        numberOfLines={1}
                      >
                        {tA.name}
                      </Text>
                      <Text
                        style={[styles.roundsColName, { color: tB.color }]}
                        numberOfLines={1}
                      >
                        {tB.name}
                      </Text>
                    </View>

                    {selectedGame.rounds.map((round, idx) => (
                      <View key={round.id} style={styles.roundRow}>
                        <Text style={styles.roundIndex}>R{idx + 1}</Text>
                        <Text
                          style={[
                            styles.roundPts,
                            { color: round.teamAPoints > 0
                                ? tA.color
                                : theme.colors.textSecondary },
                          ]}
                        >
                          {round.teamAPoints > 0 ? `+${round.teamAPoints}` : '—'}
                        </Text>
                        <Text
                          style={[
                            styles.roundPts,
                            { color: round.teamBPoints > 0
                                ? tB.color
                                : theme.colors.textSecondary },
                          ]}
                        >
                          {round.teamBPoints > 0 ? `+${round.teamBPoints}` : '—'}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.modalSeparator} />

                    {/* Pie de datos */}
                    <View style={styles.modalFooter}>
                      <Text style={styles.modalFooterText}>
                        ⏱ {mins < 1 ? 'Menos de 1 minuto jugado' : `${mins} minutos jugados`}
                      </Text>
                      <Text style={styles.modalFooterText}>
                        🎯 Meta: {selectedGame.targetScore} puntos
                      </Text>
                      <Text style={styles.modalFooterText}>
                        🎲 {selectedGame.rounds.length} {selectedGame.rounds.length === 1 ? 'ronda' : 'rondas'}
                      </Text>
                    </View>
                  </>
                );
              })()}
            </ScrollView>

            {/* Action buttons — fixed outside ScrollView */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalBtn}
                onPress={handleDeleteFromModal}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteModalBtnText}>🗑 Eliminar partida</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
      <BannerAdComponent />
    </SafeAreaView>
  );
}
