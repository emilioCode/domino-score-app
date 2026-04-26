export interface UseSoundReturn {
  playScore: () => void;
  playWin: () => void;
  playUndo: () => void;
}

export const useSound = (): UseSoundReturn => ({
  playScore: () => {},
  playWin: () => {},
  playUndo: () => {},
});
