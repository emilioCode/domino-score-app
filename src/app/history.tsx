import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { loadGames, deleteGame, clearAllGames } from '../utils/storage';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../constants/theme';
import type { SavedGame } from '../types/game.types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] as const;

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
    list: {
      padding: theme.spacing.md,
      flexGrow: 1,
    },
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
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
  });

// ── GameCard ──────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = -80;

type CardProps = { game: SavedGame; onDelete: () => void };

function GameCard({ game, onDelete }: CardProps) {
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
      </Animated.View>
    </View>
  );
}

// ── HistoryScreen ─────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [games, setGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames()
      .then(setGames)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteGame(id);
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

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
            setGames([]);
          },
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: SavedGame }) => (
      <GameCard game={item} onDelete={() => handleDelete(item.id)} />
    ),
    [handleDelete]
  );

  const EmptyState = (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🎲</Text>
      <Text style={styles.emptyText}>No hay partidas guardadas aún</Text>
    </View>
  );

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
        ListEmptyComponent={!loading ? EmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
