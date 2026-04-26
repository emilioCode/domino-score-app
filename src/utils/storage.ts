import type { GameState } from '../types/game.types';

export const saveGame = async (_game: GameState): Promise<void> => {};

export const loadGame = async (): Promise<GameState | null> => null;

export const clearGame = async (): Promise<void> => {};

export const saveGameHistory = async (_games: GameState[]): Promise<void> => {};

export const loadGameHistory = async (): Promise<GameState[]> => [];
