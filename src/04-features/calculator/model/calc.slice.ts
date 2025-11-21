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
    searchQuery: string;
    settlementMode: boolean;
    settlementAmounts: number[];

    // Actions
    loadHistory: () => Promise<void>;
    addToHistory: (item: CalcHistory) => Promise<void>;
    removeFromHistory: (id: number) => Promise<void>;
    clearHistory: () => Promise<void>;
    toggleFavorite: (id: number) => Promise<void>;
    setCurrentCalculation: (expression: string, result: string) => void;
    setSearchQuery: (query: string) => void;
    setSettlementMode: (enabled: boolean) => void;
    addSettlementAmount: (amount: number) => void;
    clearSettlementAmounts: () => void;
    getFilteredHistory: () => CalcItem[];
};

export const useCalcSlice = create<CalcSlice>((set, get) => ({
    history: [],
    isLoading: false,
    currentExpression: '',
    currentResult: '0',
    searchQuery: '',
    settlementMode: false,
    settlementAmounts: [],

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
                history: [newItem, ...history].slice(0, 100), // 최대 100개 기록 유지
            });
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    },

    removeFromHistory: async (id: number) => {
        try {
            await calcHistoryRepository.remove(id);
            const { history } = get();
            set({
                history: history.filter((item) => item.id !== id),
            });
        } catch (error) {
            console.error('Failed to remove from history:', error);
        }
    },

    clearHistory: async () => {
        try {
            await calcHistoryRepository.clear();
            // 상태를 즉시 빈 배열로 설정하여 UI 즉시 업데이트
            set({ history: [], searchQuery: '' });
        } catch (error) {
            console.error('Failed to clear history:', error);
            throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
        }
    },

    toggleFavorite: async (id: number) => {
        try {
            const { history } = get();
            const item = history.find((h) => h.id === id);
            if (item) {
                const updated = { ...item, favorite: !item.favorite };
                await calcHistoryRepository.update(id, updated);
                set({
                    history: history.map((h) => (h.id === id ? updated : h)),
                });
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    },

    setCurrentCalculation: (expression: string, result: string) => {
        set({ currentExpression: expression, currentResult: result });
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    setSettlementMode: (enabled: boolean) => {
        set({ settlementMode: enabled, settlementAmounts: enabled ? [] : [] });
    },

    addSettlementAmount: (amount: number) => {
        const { settlementAmounts } = get();
        set({ settlementAmounts: [...settlementAmounts, amount] });
    },

    clearSettlementAmounts: () => {
        set({ settlementAmounts: [] });
    },

    getFilteredHistory: () => {
        const { history, searchQuery } = get();
        if (!searchQuery.trim()) {
            return history;
        }
        const query = searchQuery.toLowerCase();
        return history.filter(
            (item) =>
                item.expression.toLowerCase().includes(query) ||
                item.result.toLowerCase().includes(query)
        );
    },
}));
