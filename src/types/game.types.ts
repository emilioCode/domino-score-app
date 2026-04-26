export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Round {
  id: string;
  teamAPoints: number;
  teamBPoints: number;
  timestamp: number;
}

export interface GameState {
  teams: [Team, Team];
  rounds: Round[];
  targetScore: number;
  isFinished: boolean;
  winnerId: string | null;
}

export interface SavedGame {
  id: string;
  date: number;
  winner: Team;
  teams: [Team, Team];
  rounds: Round[];
  targetScore: number;
  duration: number;
}
