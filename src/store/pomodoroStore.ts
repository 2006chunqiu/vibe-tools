import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PomodoroMode = "focus" | "short" | "long";

export type PomodoroSettings = {
  focus: number;
  short: number;
  long: number;
  sound: boolean;
};

export type FocusSession = {
  id: string;
  completedAt: string;
  minutes: number;
};

type PomodoroState = {
  sessions: FocusSession[];
  settings: PomodoroSettings;
  addSession: (minutes: number) => void;
  updateSettings: (patch: Partial<PomodoroSettings>) => void;
  clearSessions: () => void;
};

const defaultSettings: PomodoroSettings = {
  focus: 25,
  short: 5,
  long: 15,
  sound: true
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      sessions: [],
      settings: defaultSettings,
      addSession: (minutes) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              id:
                typeof crypto !== "undefined" && "randomUUID" in crypto
                  ? crypto.randomUUID()
                  : `session-${Date.now()}`,
              completedAt: new Date().toISOString(),
              minutes
            }
          ].slice(-500)
        })),
      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch }
        })),
      clearSessions: () => set({ sessions: [] })
    }),
    { name: "vibe-tools-pomodoro-v1" }
  )
);
