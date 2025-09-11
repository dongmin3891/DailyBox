'use client';
import { create } from 'zustand';
import { memoRepository } from '@/entities/memo/api/memo.repository';

type MemoItem = {
    id: number;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
};

type MemoSlice = {
    memos: MemoItem[];
    isLoading: boolean;
    loadMemos: () => Promise<void>;
};

export const useMemoSlice = create<MemoSlice>((set) => ({
    memos: [],
    isLoading: false,
    loadMemos: async () => {
        set({ isLoading: true });
        const items = await memoRepository.getAll();
        set({ memos: items as MemoItem[], isLoading: false });
    },
}));
