import type { GameState } from '../types/game.types';

export interface UseGameReturn {
  gameState: GameState | null;
  addRound: (teamAPoints: number, teamBPoints: number) => void;
  resetGame: () => void;
  currentScores: { teamA: number; teamB: number };
}

export const useGame = (): UseGameReturn => ({
  gameState: null,
  addRound: () => {},
  resetGame: () => {},
  currentScores: { teamA: 0, teamB: 0 },
});
