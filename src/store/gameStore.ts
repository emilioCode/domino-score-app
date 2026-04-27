import { create } from 'zustand';
import type { GameState, Team, Round } from '../types/game.types';
import { DEFAULT_TARGET_SCORE } from '../constants/game';
import { theme } from '../constants/theme';
import { saveGame } from '../utils/storage';

const INITIAL_TEAMS: [Team, Team] = [
  { id: 'team-a', name: 'Equipo A', color: theme.colors.teamA },
  { id: 'team-b', name: 'Equipo B', color: theme.colors.teamB },
];

const INITIAL_GAME: GameState = {
  teams: INITIAL_TEAMS,
  rounds: [],
  targetScore: DEFAULT_TARGET_SCORE,
  isFinished: false,
  winnerId: null,
};

interface GameActions {
  setTeamName: (teamId: string, name: string) => void;
  setTargetScore: (score: number) => void;
  addPoints: (teamId: string, points: number) => void;
  undoLastRound: () => void;
  resetGame: () => void;
  discardGame: () => void;
  checkWinner: () => Team | null;
  updateRound: (roundId: string, teamAPoints: number, teamBPoints: number) => void;
}

export type GameStore = GameState & GameActions;

const sumScore = (rounds: Round[], field: 'teamAPoints' | 'teamBPoints') =>
  rounds.reduce((acc, r) => acc + r[field], 0);

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_GAME,

  setTeamName: (teamId, name) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.id === teamId ? { ...t, name } : t)) as [Team, Team],
    })),

  setTargetScore: (score) => set({ targetScore: score }),

  addPoints: (teamId, points) => {
    const { teams, rounds, targetScore } = get();
    const isTeamA = teams[0].id === teamId;
    const newRound: Round = {
      id: `round-${Date.now()}`,
      teamAPoints: isTeamA ? points : 0,
      teamBPoints: isTeamA ? 0 : points,
      timestamp: Date.now(),
    };
    const next = [...rounds, newRound];
    const scoreA = sumScore(next, 'teamAPoints');
    const scoreB = sumScore(next, 'teamBPoints');
    const winnerId =
      scoreA >= targetScore ? teams[0].id
      : scoreB >= targetScore ? teams[1].id
      : null;
    set({ rounds: next, isFinished: winnerId !== null, winnerId });
  },

  undoLastRound: () =>
    set((s) => {
      const rounds = s.rounds.slice(0, -1);
      const scoreA = sumScore(rounds, 'teamAPoints');
      const scoreB = sumScore(rounds, 'teamBPoints');
      const winnerId =
        scoreA >= s.targetScore ? s.teams[0].id
        : scoreB >= s.targetScore ? s.teams[1].id
        : null;
      return { rounds, isFinished: winnerId !== null, winnerId };
    }),

  resetGame: () => {
    const s = get();
    if (s.winnerId && s.rounds.length > 0) {
      saveGame(s); // fire-and-forget: persiste antes de limpiar
    }
    set((_s) => ({
      rounds: [],
      isFinished: false,
      winnerId: null,
      teams: _s.teams,
      targetScore: _s.targetScore,
    }));
  },

  discardGame: () =>
    set((_s) => ({
      rounds: [],
      isFinished: false,
      winnerId: null,
      teams: _s.teams,
      targetScore: _s.targetScore,
    })),

  checkWinner: () => {
    const { teams, rounds, targetScore } = get();
    const scoreA = sumScore(rounds, 'teamAPoints');
    const scoreB = sumScore(rounds, 'teamBPoints');
    if (scoreA >= targetScore) return teams[0];
    if (scoreB >= targetScore) return teams[1];
    return null;
  },

  updateRound: (roundId, teamAPoints, teamBPoints) =>
    set((s) => {
      const rounds =
        teamAPoints === 0 && teamBPoints === 0
          ? s.rounds.filter((r) => r.id !== roundId)
          : s.rounds.map((r) =>
              r.id === roundId ? { ...r, teamAPoints, teamBPoints } : r
            );
      const scoreA = sumScore(rounds, 'teamAPoints');
      const scoreB = sumScore(rounds, 'teamBPoints');
      const winnerId =
        scoreA >= s.targetScore ? s.teams[0].id
        : scoreB >= s.targetScore ? s.teams[1].id
        : null;
      return { rounds, isFinished: winnerId !== null, winnerId };
    }),
}));
