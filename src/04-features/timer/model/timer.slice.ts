'use client';
import { create } from 'zustand';
import { timerRepository } from '@/entities/timer/api/timer.repository';
import type { Timer } from '@/entities/timer/model/types';

type TimerItem = Timer & {
    id: number;
};

type TimerSlice = {
    timers: TimerItem[];
    isLoading: boolean;

    // Actions
    loadTimers: () => Promise<void>;
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => Promise<void>;
    deleteTimer: (id: number) => Promise<void>;
};

export const useTimerSlice = create<TimerSlice>((set, get) => ({
    timers: [],
    isLoading: false,

    loadTimers: async () => {
        set({ isLoading: true });
        try {
            const items = await timerRepository.getAll();
            set({ timers: items as TimerItem[], isLoading: false });
        } catch (error) {
            console.error('Failed to load timers:', error);
            set({ isLoading: false });
        }
    },

    addTimer: async (timer) => {
        try {
            const now = Date.now();
            const newTimer: Omit<TimerItem, 'id'> = {
                ...timer,
                createdAt: now,
            };
            const newId = await timerRepository.add(newTimer);
            const { timers } = get();
            set({
                timers: [{ ...newTimer, id: newId } as TimerItem, ...timers],
            });
        } catch (error) {
            console.error('Failed to add timer:', error);
        }
    },

    deleteTimer: async (id) => {
        try {
            await timerRepository.remove(id);
            const { timers } = get();
            set({
                timers: timers.filter((timer) => timer.id !== id),
            });
        } catch (error) {
            console.error('Failed to delete timer:', error);
        }
    },
}));
