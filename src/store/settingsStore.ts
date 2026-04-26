export interface SettingsState {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  teamAName: string;
  teamBName: string;
}

export type SettingsStore = SettingsState & {
  setSoundEnabled: (value: boolean) => void;
  setVibrationEnabled: (value: boolean) => void;
  setTeamName: (team: 'A' | 'B', name: string) => void;
};

export const useSettingsStore = () => ({} as SettingsStore);
