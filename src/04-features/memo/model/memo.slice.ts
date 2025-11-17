'use client';
import { create } from 'zustand';
import { memoRepository } from '@/entities/memo/api/memo.repository';
import type { Memo } from '@/entities/memo/model/types';

type MemoItem = Memo & {
    id: number;
};

type MemoSlice = {
    memos: MemoItem[];
    isLoading: boolean;
    selectedMemoId: number | null;

    // Actions
    loadMemos: () => Promise<void>;
    addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateMemo: (id: number, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => Promise<void>;
    deleteMemo: (id: number) => Promise<void>;
    setSelectedMemoId: (id: number | null) => void;
};

export const useMemoSlice = create<MemoSlice>((set, get) => ({
    memos: [],
    isLoading: false,
    selectedMemoId: null,

    loadMemos: async () => {
        set({ isLoading: true });
        try {
            const items = await memoRepository.getAll();
            set({ memos: items as MemoItem[], isLoading: false });
        } catch (error) {
            console.error('Failed to load memos:', error);
            set({ isLoading: false });
        }
    },

    addMemo: async (memo) => {
        try {
            const now = Date.now();
            const newMemo: Omit<MemoItem, 'id'> = {
                ...memo,
                createdAt: now,
                updatedAt: now,
            };
            const newId = await memoRepository.add(newMemo);
            const { memos } = get();
            set({
                memos: [{ ...newMemo, id: newId } as MemoItem, ...memos],
                selectedMemoId: newId,
            });
        } catch (error) {
            console.error('Failed to add memo:', error);
        }
    },

    updateMemo: async (id, updates) => {
        try {
            const now = Date.now();
            await memoRepository.update(id, {
                ...updates,
                updatedAt: now,
            });
            const { memos } = get();
            set({
                memos: memos.map((memo) =>
                    memo.id === id ? { ...memo, ...updates, updatedAt: now } : memo
                ),
            });
        } catch (error) {
            console.error('Failed to update memo:', error);
        }
    },

    deleteMemo: async (id) => {
        try {
            await memoRepository.remove(id);
            const { memos, selectedMemoId } = get();
            const newMemos = memos.filter((memo) => memo.id !== id);
            set({
                memos: newMemos,
                selectedMemoId: selectedMemoId === id ? (newMemos[0]?.id ?? null) : selectedMemoId,
            });
        } catch (error) {
            console.error('Failed to delete memo:', error);
        }
    },

    setSelectedMemoId: (id) => {
        set({ selectedMemoId: id });
    },
}));
