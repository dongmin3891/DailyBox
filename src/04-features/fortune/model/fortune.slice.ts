'use client';
import { create } from 'zustand';
import { fortuneRepository } from '@/entities/fortune/api/fortune.repository';

type FortuneItem = {
    id: number;
    dateKey: string;
    text: string;
    createdAt: number;
};

type FortuneSlice = {
    fortunes: FortuneItem[];
    isLoading: boolean;
    loadFortunes: () => Promise<void>;
};

export const useFortuneSlice = create<FortuneSlice>((set) => ({
    fortunes: [],
    isLoading: false,
    loadFortunes: async () => {
        set({ isLoading: true });
        const items = await fortuneRepository.getAll();
        set({ fortunes: items as FortuneItem[], isLoading: false });
    },
}));
