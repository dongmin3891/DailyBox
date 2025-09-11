'use client';
import { create } from 'zustand';
import { timerRepository } from '@/entities/timer/api/timer.repository';

type TimerItem = {
    id: number;
    label: string;
    durationMs: number;
    createdAt: number;
};

type TimerSlice = {
    timers: TimerItem[];
    isLoading: boolean;
    loadTimers: () => Promise<void>;
};

export const useTimerSlice = create<TimerSlice>((set) => ({
    timers: [],
    isLoading: false,
    loadTimers: async () => {
        set({ isLoading: true });
        const items = await timerRepository.getAll();
        set({ timers: items as TimerItem[], isLoading: false });
    },
}));
