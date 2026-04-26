import * as Haptics from 'expo-haptics';
import { useGameStore } from '../store/gameStore';

export const useGame = () => {
  const store = useGameStore();

  const addPoints = async (teamId: string, points: number) => {
    store.addPoints(teamId, points);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (store.checkWinner()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const undoLastRound = async () => {
    store.undoLastRound();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  };

  const updateRound = async (
    roundId: string,
    teamAPoints: number,
    teamBPoints: number,
  ) => {
    store.updateRound(roundId, teamAPoints, teamBPoints);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const resetGame = () => {
    store.resetGame();
  };

  return { addPoints, undoLastRound, updateRound, resetGame };
};

export default useGame;
