'use client';
import { create } from 'zustand';
import { calcHistoryRepository } from '@/entities/calculator/api/calc.repository';

type CalcItem = {
    id: number;
    expression: string;
    result: string;
    createdAt: number;
};

type CalcSlice = {
    history: CalcItem[];
    isLoading: boolean;
    loadHistory: () => Promise<void>;
};

export const useCalcSlice = create<CalcSlice>((set) => ({
    history: [],
    isLoading: false,
    loadHistory: async () => {
        set({ isLoading: true });
        const items = await calcHistoryRepository.getAll();
        set({ history: items as CalcItem[], isLoading: false });
    },
}));
