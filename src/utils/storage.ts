import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState, SavedGame } from '../types/game.types';

const HISTORY_KEY = 'domino_history';
const MAX_GAMES = 50;

export const saveGame = async (state: GameState): Promise<void> => {
  if (!state.winnerId || state.rounds.length === 0) return;

  const winner = state.teams.find((t) => t.id === state.winnerId);
  if (!winner) return;

  const first = state.rounds[0].timestamp;
  const last = state.rounds[state.rounds.length - 1].timestamp;
  const duration = last - first;

  const entry: SavedGame = {
    id: `game-${Date.now()}`,
    date: Date.now(),
    winner,
    teams: state.teams,
    rounds: state.rounds,
    targetScore: state.targetScore,
    duration,
  };

  const existing = await loadGames();
  const updated = [entry, ...existing].slice(0, MAX_GAMES);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const loadGames = async (): Promise<SavedGame[]> => {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as SavedGame[]) : [];
};

export const deleteGame = async (id: string): Promise<void> => {
  const games = await loadGames();
  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(games.filter((g) => g.id !== id))
  );
};

export const clearAllGames = async (): Promise<void> => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};

const TEAM_NAMES_KEY = '@team_names';

export const saveTeamNames = async (nameA: string, nameB: string): Promise<void> => {
  await AsyncStorage.setItem(TEAM_NAMES_KEY, JSON.stringify({ nameA, nameB }));
};

export const loadTeamNames = async (): Promise<{ nameA: string; nameB: string } | null> => {
  const raw = await AsyncStorage.getItem(TEAM_NAMES_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { nameA: string; nameB: string };
  } catch {
    return null;
  }
};
