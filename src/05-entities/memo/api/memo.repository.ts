import { db, DbMemo } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export type MemoSortOption = 'updatedAt' | 'title' | 'createdAt' | 'tag' | 'favorite';
export type MemoGroupOption = 'none' | 'today' | 'thisWeek' | 'thisMonth';

export interface MemoFilterOptions {
    tags?: string[];
    isArchived?: boolean;
    isLocked?: boolean;
    searchQuery?: string;
}

export const memoRepository: Repository<DbMemo> = {
    async add(entity) {
        return db.memos.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbMemo>) {
        await db.memos.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.memos.delete(id);
    },
    async getById(id: Identifier) {
        return db.memos.get(id);
    },
    async getAll() {
        return db.memos.orderBy('updatedAt').reverse().toArray();
    },
    async clear() {
        await db.memos.clear();
    },
};

/**
 * 메모 검색 (태그 포함)
 */
export async function searchMemos(query: string, filters?: MemoFilterOptions): Promise<DbMemo[]> {
    let allMemos = await db.memos.toArray();
    
    // 잠금 필터
    if (filters?.isLocked !== undefined) {
        allMemos = allMemos.filter((m) => m.isLocked === filters.isLocked);
    }
    
    // 태그 필터
    if (filters?.tags && filters.tags.length > 0) {
        allMemos = allMemos.filter((memo) =>
            memo.tags?.some((tag) => filters.tags!.includes(tag))
        );
    }
    
    // 검색어 필터
    if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        allMemos = allMemos.filter(
            (memo) =>
                memo.title.toLowerCase().includes(lowerQuery) ||
                memo.content.toLowerCase().includes(lowerQuery) ||
                memo.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }
    
    return allMemos;
}

/**
 * 정렬된 메모 목록 가져오기
 */
export async function getSortedMemos(
    sortBy: MemoSortOption = 'updatedAt',
    filters?: MemoFilterOptions
): Promise<DbMemo[]> {
    let allMemos = await db.memos.toArray();
    
    // 필터 적용
    if (filters?.isLocked !== undefined) {
        allMemos = allMemos.filter((m) => m.isLocked === filters.isLocked);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
        allMemos = allMemos.filter((memo) =>
            memo.tags?.some((tag) => filters.tags!.includes(tag))
        );
    }
    
    if (filters?.searchQuery) {
        const lowerQuery = filters.searchQuery.toLowerCase();
        allMemos = allMemos.filter(
            (memo) =>
                memo.title.toLowerCase().includes(lowerQuery) ||
                memo.content.toLowerCase().includes(lowerQuery) ||
                memo.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }
    
    // 즐겨찾기 우선 정렬
    const pinnedMemos = allMemos.filter((m) => m.isPinned);
    const unpinnedMemos = allMemos.filter((m) => !m.isPinned);
    
    const sortFn = (a: DbMemo, b: DbMemo) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title, 'ko');
        }
        if (sortBy === 'createdAt') {
            return b.createdAt - a.createdAt; // 최신순
        }
        if (sortBy === 'tag') {
            const aTag = a.tags?.[0] || '';
            const bTag = b.tags?.[0] || '';
            return aTag.localeCompare(bTag, 'ko');
        }
        if (sortBy === 'favorite') {
            // 즐겨찾기 우선, 그 다음 updatedAt
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.updatedAt - a.updatedAt;
        }
        // updatedAt (기본값)
        return b.updatedAt - a.updatedAt; // 최신순
    };
    
    pinnedMemos.sort(sortFn);
    unpinnedMemos.sort(sortFn);
    
    return [...pinnedMemos, ...unpinnedMemos];
}

/**
 * 메모 그룹핑
 */
export function groupMemosByDate(memos: DbMemo[], groupBy: MemoGroupOption): Record<string, DbMemo[]> {
    if (groupBy === 'none') {
        return { all: memos };
    }
    
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const thisMonthStart = new Date(today);
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    
    const groups: Record<string, DbMemo[]> = {
        today: [],
        thisWeek: [],
        thisMonth: [],
        older: [],
    };
    
    memos.forEach((memo) => {
        const updatedAt = memo.updatedAt;
        
        if (groupBy === 'today' && updatedAt >= todayStart) {
            groups.today.push(memo);
        } else if (groupBy === 'thisWeek' && updatedAt >= thisWeekStart.getTime()) {
            if (updatedAt >= todayStart) {
                groups.today.push(memo);
            } else {
                groups.thisWeek.push(memo);
            }
        } else if (groupBy === 'thisMonth' && updatedAt >= thisMonthStart.getTime()) {
            if (updatedAt >= todayStart) {
                groups.today.push(memo);
            } else if (updatedAt >= thisWeekStart.getTime()) {
                groups.thisWeek.push(memo);
            } else {
                groups.thisMonth.push(memo);
            }
        } else {
            groups.older.push(memo);
        }
    });
    
    return groups;
}

/**
 * 모든 태그 목록 가져오기
 */
export async function getAllTags(): Promise<string[]> {
    const allMemos = await db.memos.toArray();
    const tagSet = new Set<string>();
    
    allMemos.forEach((memo) => {
        memo.tags?.forEach((tag) => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
}
