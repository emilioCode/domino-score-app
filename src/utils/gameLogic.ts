import type { GameState, Round } from '../types/game.types';

export const getTotalScore = (rounds: Round[], team: 'A' | 'B'): number =>
  rounds.reduce((sum, r) => sum + (team === 'A' ? r.teamAPoints : r.teamBPoints), 0);

export const checkWinner = (state: GameState): string | null => null;

export const isValidScore = (score: number): boolean => score >= 0;
