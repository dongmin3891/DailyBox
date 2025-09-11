'use client';
import { create } from 'zustand';
import { calcHistoryRepository } from '@/entities/calculator/api/calc.repository';
import { CalcHistory } from '@/entities/calculator/model/types';

type CalcItem = CalcHistory & {
    id: number;
};

type CalcSlice = {
    history: CalcItem[];
    isLoading: boolean;
    currentExpression: string;
    currentResult: string;

    // Actions
    loadHistory: () => Promise<void>;
    addToHistory: (item: CalcHistory) => Promise<void>;
    clearHistory: () => Promise<void>;
    setCurrentCalculation: (expression: string, result: string) => void;
};

export const useCalcSlice = create<CalcSlice>((set, get) => ({
    history: [],
    isLoading: false,
    currentExpression: '',
    currentResult: '0',

    loadHistory: async () => {
        set({ isLoading: true });
        try {
            const items = await calcHistoryRepository.getAll();
            set({ history: items as CalcItem[], isLoading: false });
        } catch (error) {
            console.error('Failed to load history:', error);
            set({ isLoading: false });
        }
    },

    addToHistory: async (item: CalcHistory) => {
        try {
            const newItemId = await calcHistoryRepository.add(item);
            const newItem: CalcItem = { ...item, id: newItemId };
            const { history } = get();
            set({
                history: [newItem, ...history].slice(0, 50), // 최대 50개 기록 유지
            });
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    },

    clearHistory: async () => {
        try {
            await calcHistoryRepository.clear();
            set({ history: [] });
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    },

    setCurrentCalculation: (expression: string, result: string) => {
        set({ currentExpression: expression, currentResult: result });
    },
}));
