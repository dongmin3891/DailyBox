import { create } from 'zustand';

type MemoSlice = {
    memos: { id: number; title: string; content: string; createdAt: number; updatedAt: number }[];
    setMemos: (items: MemoSlice['memos']) => void;
};

type TodoSlice = {
    todos: { id: number; title: string; isDone: boolean; createdAt: number; updatedAt: number }[];
    setTodos: (items: TodoSlice['todos']) => void;
};

type TimerSlice = {
    timers: { id: number; label: string; durationMs: number; createdAt: number }[];
    setTimers: (items: TimerSlice['timers']) => void;
};

type MenuSlice = {
    menus: { id: number; name: string; tags: string[]; createdAt: number }[];
    setMenus: (items: MenuSlice['menus']) => void;
};

type FortuneSlice = {
    fortunes: { id: number; dateKey: string; text: string; createdAt: number }[];
    setFortunes: (items: FortuneSlice['fortunes']) => void;
};

export type AppState = MemoSlice & TodoSlice & TimerSlice & MenuSlice & FortuneSlice;

export const useAppStore = create<AppState>((set) => ({
    memos: [],
    setMemos: (items) => set({ memos: items }),

    todos: [],
    setTodos: (items) => set({ todos: items }),

    timers: [],
    setTimers: (items) => set({ timers: items }),

    menus: [],
    setMenus: (items) => set({ menus: items }),

    fortunes: [],
    setFortunes: (items) => set({ fortunes: items }),
}));
