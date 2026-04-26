import type { GameState } from '../types/game.types';

export type GameStore = GameState & {
  addRound: (teamAPoints: number, teamBPoints: number) => void;
  resetGame: () => void;
  setTargetScore: (score: number) => void;
};

export const useGameStore = () => ({} as GameStore);
