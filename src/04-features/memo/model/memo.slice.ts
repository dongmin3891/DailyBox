'use client';
import { create } from 'zustand';
import {
    memoRepository,
    searchMemos,
    getSortedMemos,
    getAllTags,
    groupMemosByDate,
    type MemoSortOption,
    type MemoGroupOption,
    type MemoFilterOptions,
} from '@/entities/memo/api/memo.repository';
import type { Memo } from '@/entities/memo/model/types';
import type { DbMemo } from '@/shared/lib/db/dexie';

type MemoItem = Memo & {
    id: number;
};

type MemoSlice = {
    memos: MemoItem[];
    isLoading: boolean;
    selectedMemoId: number | null;
    searchQuery: string;
    sortBy: MemoSortOption;
    groupBy: MemoGroupOption;
    filters: MemoFilterOptions;
    allTags: string[];
    allMemos: MemoItem[]; // 필터링 전 모든 메모 (그룹핑용)

    // Actions
    loadMemos: (skipLoading?: boolean) => Promise<void>;
    loadAllMemos: () => Promise<void>; // 필터링 없이 모든 메모 로드
    addMemo: (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateMemo: (id: number, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => Promise<void>;
    deleteMemo: (id: number) => Promise<void>;
    togglePin: (id: number) => Promise<void>;
    lockMemo: (id: number, pin: string) => Promise<void>;
    unlockMemo: (id: number, pin: string) => Promise<boolean>;
    setSelectedMemoId: (id: number | null) => void;
    setSearchQuery: (query: string) => Promise<void>;
    setSortBy: (sortBy: MemoSortOption) => Promise<void>;
    setGroupBy: (groupBy: MemoGroupOption) => Promise<void>;
    setFilters: (filters: Partial<MemoFilterOptions>) => Promise<void>;
    loadTags: () => Promise<void>;
    exportMemos: () => Promise<string>;
    importMemos: (jsonData: string) => Promise<void>;
};

export const useMemoSlice = create<MemoSlice>((set, get) => ({
    memos: [],
    isLoading: false,
    selectedMemoId: null,
    searchQuery: '',
    sortBy: 'updatedAt',
    groupBy: 'none',
    filters: {},
    allTags: [],
    allMemos: [],

    loadMemos: async (skipLoading = false) => {
        if (!skipLoading) {
            set({ isLoading: true });
        }
        try {
            const { searchQuery, sortBy, filters } = get();
            const filterOptions: MemoFilterOptions = {
                ...filters,
                searchQuery: searchQuery.trim() || undefined,
            };

            let items: DbMemo[];

            if (searchQuery.trim()) {
                items = await searchMemos(searchQuery, filterOptions);
            } else {
                items = await getSortedMemos(sortBy, filterOptions);
            }

            set({ memos: items as MemoItem[], isLoading: false });
        } catch (error) {
            console.error('Failed to load memos:', error);
            if (!skipLoading) {
                set({ isLoading: false });
            }
        }
    },

    loadAllMemos: async () => {
        try {
            const allItems = await memoRepository.getAll();
            set({ allMemos: allItems as MemoItem[] });
        } catch (error) {
            console.error('Failed to load all memos:', error);
        }
    },

    addMemo: async (memo) => {
        try {
            const now = Date.now();
            const newMemo: Omit<MemoItem, 'id'> = {
                ...memo,
                tags: memo.tags || [],
                isPinned: false,
                isLocked: false,
                createdAt: now,
                updatedAt: now,
            };
            const newId = await memoRepository.add(newMemo);
            await get().loadMemos();
            await get().loadAllMemos();
            await get().loadTags();
            set({ selectedMemoId: newId });
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
            await get().loadMemos();
            await get().loadAllMemos();
            await get().loadTags();
        } catch (error) {
            console.error('Failed to update memo:', error);
        }
    },

    deleteMemo: async (id) => {
        try {
            await memoRepository.remove(id);
            const { selectedMemoId } = get();
            await get().loadMemos();
            await get().loadAllMemos();
            await get().loadTags();
            const { memos } = get();
            set({
                selectedMemoId: selectedMemoId === id ? memos[0]?.id ?? null : selectedMemoId,
            });
        } catch (error) {
            console.error('Failed to delete memo:', error);
        }
    },

    togglePin: async (id) => {
        try {
            const { memos } = get();
            const memo = memos.find((m) => m.id === id);
            if (memo) {
                await memoRepository.update(id, { isPinned: !memo.isPinned });
                await get().loadMemos();
                await get().loadAllMemos();
            }
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    },

    lockMemo: async (id, pin) => {
        try {
            await memoRepository.update(id, { isLocked: true, lockPin: pin });
            await get().loadMemos();
            await get().loadAllMemos();
        } catch (error) {
            console.error('Failed to lock memo:', error);
        }
    },

    unlockMemo: async (id, pin) => {
        try {
            const { memos, allMemos } = get();
            // allMemos에서 먼저 찾고, 없으면 memos에서 찾기
            const memo = allMemos.find((m) => m.id === id) || memos.find((m) => m.id === id);
            if (memo && memo.lockPin === pin) {
                await memoRepository.update(id, { isLocked: false, lockPin: undefined });
                // allMemos를 먼저 업데이트하여 groupedMemos가 올바르게 계산되도록 함
                // MemoListWidget는 allMemos를 사용하므로 우선순위가 높음
                await get().loadAllMemos();
                // skipLoading=true로 호출하여 isLoading 상태 변경 없이 memos 업데이트
                // 다른 곳에서 memos를 사용할 수 있으므로 업데이트 필요
                await get().loadMemos(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to unlock memo:', error);
            return false;
        }
    },

    setSelectedMemoId: (id) => {
        set({ selectedMemoId: id });
    },

    setSearchQuery: async (query) => {
        set({ searchQuery: query });
        await get().loadMemos();
    },

    setSortBy: async (sortBy) => {
        set({ sortBy });
        await get().loadMemos();
    },

    setGroupBy: async (groupBy) => {
        set({ groupBy });
        await get().loadMemos();
    },

    setFilters: async (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
        await get().loadMemos();
    },

    loadTags: async () => {
        try {
            const tags = await getAllTags();
            set({ allTags: tags });
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    },

    exportMemos: async () => {
        try {
            const { memos } = get();
            const exportData = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                memos: memos.map(({ id, ...memo }) => memo),
            };
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Failed to export memos:', error);
            throw error;
        }
    },

    importMemos: async (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            const memosToImport = Array.isArray(data.memos) ? data.memos : data;

            for (const memo of memosToImport) {
                if (memo.title || memo.content) {
                    const now = Date.now();
                    await memoRepository.add({
                        title: memo.title || '제목 없음',
                        content: memo.content || '',
                        tags: memo.tags || [],
                        isPinned: memo.isPinned || false,
                        isLocked: memo.isLocked || false,
                        createdAt: memo.createdAt || now,
                        updatedAt: memo.updatedAt || now,
                    });
                }
            }
            await get().loadMemos();
            await get().loadAllMemos();
            await get().loadTags();
        } catch (error) {
            console.error('Failed to import memos:', error);
            throw error;
        }
    },
}));
