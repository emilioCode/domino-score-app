import { create } from 'zustand';
import { loadGames } from '../utils/storage';
import type { SavedGame } from '../types/game.types';

interface HistoryState {
  games: SavedGame[];
  load: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  games: [],
  load: async () => {
    const games = await loadGames();
    set({ games });
  },
}));
