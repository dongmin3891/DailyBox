'use client';
import { create } from 'zustand';
import { timerRepository } from '@/entities/timer/api/timer.repository';
import type { Timer, TimerCategory } from '@/entities/timer/model/types';

type TimerItem = Timer & {
    id: number;
};

type TimerStats = {
    today: {
        total: number; // 오늘 총 시간 (밀리초)
        byCategory: Record<TimerCategory, number>;
    };
};

type TimerSlice = {
    timers: TimerItem[];
    isLoading: boolean;
    stats: TimerStats;

    // Actions
    loadTimers: () => Promise<void>;
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => Promise<void>;
    saveStopwatchSession: (category: TimerCategory, startedAt: number, endedAt: number) => Promise<void>;
    deleteTimer: (id: number) => Promise<void>;
    getTodayStats: () => TimerStats;
    getStatsByDateRange: (startDate: Date, endDate: Date) => Promise<TimerItem[]>;
};

const getTodayStart = (): number => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
};

const getTodayEnd = (): number => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now.getTime();
};

export const useTimerSlice = create<TimerSlice>((set, get) => ({
    timers: [],
    isLoading: false,
    stats: {
        today: {
            total: 0,
            byCategory: {
                work: 0,
                study: 0,
                exercise: 0,
            },
        },
    },

    loadTimers: async () => {
        set({ isLoading: true });
        try {
            const items = await timerRepository.getAll();
            set({ timers: items as TimerItem[], isLoading: false });
            // 통계 업데이트
            const stats = get().getTodayStats();
            set({ stats });
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

    saveStopwatchSession: async (category, startedAt, endedAt) => {
        try {
            const durationMs = endedAt - startedAt;
            const now = Date.now();
            const categoryLabels: Record<TimerCategory, string> = {
                work: '업무',
                study: '공부',
                exercise: '운동',
            };
            const newTimer: Omit<TimerItem, 'id'> = {
                label: `${categoryLabels[category]} 세션`,
                durationMs,
                category,
                startedAt,
                endedAt,
                createdAt: now,
            };
            const newId = await timerRepository.add(newTimer);
            const { timers } = get();
            set({
                timers: [{ ...newTimer, id: newId } as TimerItem, ...timers],
            });
            // 통계 업데이트
            const stats = get().getTodayStats();
            set({ stats });
        } catch (error) {
            console.error('Failed to save stopwatch session:', error);
        }
    },

    deleteTimer: async (id) => {
        try {
            await timerRepository.remove(id);
            const { timers } = get();
            set({
                timers: timers.filter((timer) => timer.id !== id),
            });
            // 통계 업데이트
            const stats = get().getTodayStats();
            set({ stats });
        } catch (error) {
            console.error('Failed to delete timer:', error);
        }
    },

    getTodayStats: () => {
        const { timers } = get();
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        const todayTimers = timers.filter(
            (timer) => timer.startedAt >= todayStart && timer.startedAt <= todayEnd && timer.endedAt
        );

        const stats: TimerStats = {
            today: {
                total: 0,
                byCategory: {
                    work: 0,
                    study: 0,
                    exercise: 0,
                },
            },
        };

        todayTimers.forEach((timer) => {
            if (timer.endedAt) {
                const duration = timer.endedAt - timer.startedAt;
                stats.today.total += duration;
                stats.today.byCategory[timer.category] += duration;
            }
        });

        return stats;
    },

    getStatsByDateRange: async (startDate, endDate) => {
        const { timers } = get();
        const start = startDate.getTime();
        const end = endDate.getTime();

        return timers.filter(
            (timer) => timer.startedAt >= start && timer.startedAt <= end && timer.endedAt
        );
    },
}));
