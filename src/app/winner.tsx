import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useMemo } from "react";
import * as Haptics from 'expo-haptics';
import { useGameStore } from "../store/gameStore";
import { useHistoryStore } from "../store/historyStore";
import { useInterstitialAd } from "@/components/ads/InterstitialAd";
import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../constants/theme";

const { width: W } = Dimensions.get("window");

// Colors hardcoded so confetti looks great in both light and dark mode
const CONFETTI_PIECES = [
  { id: "1",  x: 0.05, size: 8, color: '#D4AF37', delay: 0,   duration: 3200 },
  { id: "2",  x: 0.13, size: 5, color: '#C0392B', delay: 380, duration: 3600 },
  { id: "3",  x: 0.22, size: 7, color: '#2980B9', delay: 190, duration: 2900 },
  { id: "4",  x: 0.31, size: 6, color: '#F5F0DC', delay: 700, duration: 3300 },
  { id: "5",  x: 0.41, size: 9, color: '#D4AF37', delay: 90,  duration: 3700 },
  { id: "6",  x: 0.5,  size: 5, color: '#C0392B', delay: 540, duration: 3000 },
  { id: "7",  x: 0.59, size: 7, color: '#2980B9', delay: 310, duration: 3400 },
  { id: "8",  x: 0.68, size: 6, color: '#D4AF37', delay: 860, duration: 3100 },
  { id: "9",  x: 0.77, size: 8, color: '#F5F0DC', delay: 140, duration: 2800 },
  { id: "10", x: 0.86, size: 5, color: '#C0392B', delay: 620, duration: 3500 },
  { id: "11", x: 0.93, size: 7, color: '#D4AF37', delay: 470, duration: 3200 },
  { id: "12", x: 0.08, size: 6, color: '#2980B9', delay: 950, duration: 3000 },
  { id: "13", x: 0.36, size: 5, color: '#D4AF37', delay: 250, duration: 3600 },
  { id: "14", x: 0.54, size: 8, color: '#C0392B', delay: 730, duration: 2900 },
  { id: "15", x: 0.8,  size: 6, color: '#2980B9', delay: 500, duration: 3300 },
].map((p) => ({ ...p, left: p.x * W }));

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    confettiLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },
    confettiPiece: {
      position: "absolute",
      top: 0,
    },
    scroll: {
      flexGrow: 1,
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xxl,
      paddingBottom: theme.spacing.xxl,
      zIndex: 1,
    },
    trophy: {
      fontSize: 80,
      marginBottom: theme.spacing.md,
    },
    ganadorLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize.lg,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    winnerName: {
      fontSize: theme.fontSize.xxl,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    winnerScore: {
      color: theme.colors.accent,
      fontSize: theme.fontSize.xl,
      fontWeight: "700",
    },
    divider: {
      width: 60,
      height: 2,
      backgroundColor: theme.colors.accent,
      borderRadius: 1,
      marginVertical: theme.spacing.xl,
    },
    roundsLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      marginBottom: theme.spacing.lg,
    },
    scoresRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
      width: "100%",
      marginBottom: theme.spacing.xxl,
    },
    scoreBox: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      alignItems: "center",
    },
    scoreBoxWinner: {
      borderColor: theme.colors.accent,
    },
    scoreBoxName: {
      fontSize: theme.fontSize.xs,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: theme.spacing.xs,
    },
    scoreBoxValue: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xl,
      fontWeight: "bold",
    },
    scoreBoxValueWinner: {
      color: theme.colors.textPrimary,
    },
    crownBadge: {
      fontSize: 14,
      marginTop: theme.spacing.xs,
    },
    primaryBtn: {
      width: "100%",
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    primaryBtnText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.lg,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    secondaryBtn: {
      width: "100%",
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    },
    secondaryBtnText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      fontWeight: "600",
    },
    floatingShareBtn: {
      position: "absolute",
      top: 48,
      right: 20,
      zIndex: 10,
      opacity: 0.6,
    },
    floatingShareIcon: {
      fontSize: 22,
    },
    correctBtn: {
      marginTop: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      alignItems: "center",
    },
    correctBtnText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      opacity: 0.7,
    },
  });

export default function WinnerScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { teams, rounds, targetScore, winnerId, resetGame, discardGame, undoLastRound } =
    useGameStore();

  const confettiAnims = useRef(
    CONFETTI_PIECES.map(() => new Animated.Value(0)),
  ).current;

  useInterstitialAd();

  useEffect(() => {
    if (!winnerId) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    if (!winnerId) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    confettiAnims.forEach((anim, i) => {
      const { delay, duration } = CONFETTI_PIECES[i];

      const loop = () => {
        if (cancelled) return;
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) loop();
        });
      };

      timers.push(setTimeout(loop, delay));
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      confettiAnims.forEach((a) => a.stopAnimation());
    };
  }, [winnerId]);

  if (!winnerId) return null;

  const winner = teams.find((t) => t.id === winnerId)!;
  const scoreA = rounds.reduce((acc, r) => acc + r.teamAPoints, 0);
  const scoreB = rounds.reduce((acc, r) => acc + r.teamBPoints, 0);
  const winnerScore = winner.id === teams[0].id ? scoreA : scoreB;

  const handleNewGame = () => {
    Alert.alert(
      '¿Guardar partida?',
      '¿Deseas guardar este resultado en el historial?',
      [
        {
          text: 'No guardar',
          style: 'destructive',
          onPress: () => {
            discardGame();
            router.replace('/');
          },
        },
        {
          text: 'Guardar',
          onPress: async () => {
            resetGame();
            await useHistoryStore.getState().load();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleCorrect = () => {
    undoLastRound();
    router.replace("/game");
  };

  const handleShare = async () => {
    const message =
      `🏆 ¡${winner.name} ganó en Domino Score!\n\n` +
      `📊 Resultado final:\n` +
      `${teams[0].name}: ${scoreA} pts\n` +
      `${teams[1].name}: ${scoreB} pts\n\n` +
      `🎲 ${rounds.length} ${rounds.length === 1 ? "ronda" : "rondas"} jugadas\n` +
      `🎯 Meta: ${targetScore} puntos\n\n` +
      `Jugado con Domino Score 🁣`;
    await Share.share({ message });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Confetti layer */}
      <View style={styles.confettiLayer} pointerEvents="none">
        {CONFETTI_PIECES.map((piece, i) => {
          const anim = confettiAnims[i];
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-piece.size, 900],
          });
          const opacity = anim.interpolate({
            inputRange: [0, 0.78, 1],
            outputRange: [1, 1, 0],
          });
          return (
            <Animated.View
              key={piece.id}
              style={[
                styles.confettiPiece,
                {
                  left: piece.left,
                  width: piece.size,
                  height: piece.size,
                  borderRadius: piece.size / 2,
                  backgroundColor: piece.color,
                  transform: [{ translateY }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Botón compartir flotante */}
      <TouchableOpacity
        style={styles.floatingShareBtn}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Text style={styles.floatingShareIcon}>📤</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Trofeo */}
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.ganadorLabel}>¡Ganador!</Text>
        <Text style={[styles.winnerName, { color: winner.color }]}>
          {winner.name}
        </Text>
        <Text style={styles.winnerScore}>{winnerScore} puntos</Text>

        {/* Separador dorado */}
        <View style={styles.divider} />

        {/* Resumen */}
        <Text style={styles.roundsLabel}>
          {rounds.length}{" "}
          {rounds.length === 1 ? "ronda jugada" : "rondas jugadas"}
        </Text>

        {/* Puntajes finales */}
        <View style={styles.scoresRow}>
          {teams.map((team) => {
            const score = team.id === teams[0].id ? scoreA : scoreB;
            const isWinner = team.id === winnerId;
            return (
              <View
                key={team.id}
                style={[styles.scoreBox, isWinner && styles.scoreBoxWinner]}
              >
                <Text
                  style={[styles.scoreBoxName, { color: team.color }]}
                  numberOfLines={1}
                >
                  {team.name}
                </Text>
                <Text
                  style={[
                    styles.scoreBoxValue,
                    isWinner && styles.scoreBoxValueWinner,
                  ]}
                >
                  {score}
                </Text>
                {isWinner && <Text style={styles.crownBadge}>👑</Text>}
              </View>
            );
          })}
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Nueva Partida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/history")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Ver Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.correctBtn}
          onPress={handleCorrect}
          activeOpacity={0.6}
        >
          <Text style={styles.correctBtnText}>✏️ Corregir puntaje</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
