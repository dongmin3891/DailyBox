import Dexie, { Table } from 'dexie';

export type DbMemo = {
    id?: number;
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
    isArchived?: boolean;
    isLocked?: boolean;
    lockPin?: string;
    createdAt: number;
    updatedAt: number;
};

export type DbTodo = {
    id?: number;
    title: string;
    isDone: boolean;
    priority: 'high' | 'medium' | 'low';
    category: 'work' | 'home' | 'personal';
    dueDate?: number; // 마감일 (밀리초 타임스탬프)
    repeat: 'none' | 'daily' | 'weekly';
    createdAt: number;
    updatedAt: number;
};

export type DbTimer = {
    id?: number;
    label: string;
    durationMs: number;
    category: 'work' | 'study' | 'exercise'; // 카테고리 분류
    startedAt: number; // 시작 시간 (밀리초)
    endedAt?: number; // 종료 시간 (밀리초, 타임라인 기록용)
    createdAt: number;
};

export type DbMenu = {
    id?: number;
    name: string;
    tags: string[];
    category?: 'korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other';
    timeOfDay?: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
    createdAt: number;
};

export type DbFortune = {
    id?: number;
    dateKey: string; // YYYY-MM-DD
    text: string;
    createdAt: number;
};

export type DbMealRecord = {
    id?: number;
    menuId: number; // 선택한 메뉴 ID
    menuName: string; // 메뉴 이름 (스냅샷)
    category?: 'korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other';
    timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    mealDate: number; // 식사 날짜/시간 (밀리초)
    createdAt: number;
};

export type DbRecommendationRule = {
    id?: number;
    name: string;
    enabled: boolean;
    conditions: {
        dayOfWeek?: number[]; // 0-6 (일-토)
        timeOfDay?: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
        category?: ('korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other')[];
    };
    actions: {
        priorityCategories?: ('korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other')[];
        excludeCategories?: ('korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other')[];
        weight?: number;
    };
    createdAt: number;
    updatedAt: number;
};

export type DbCalcHistory = {
    id?: number;
    expression: string;
    result: string;
    createdAt: number;
    favorite?: boolean;
    type?: 'normal' | 'settlement' | 'vat' | 'unit-conversion';
};

export class DailyboxDb extends Dexie {
    memos!: Table<DbMemo, number>;
    todos!: Table<DbTodo, number>;
    timers!: Table<DbTimer, number>;
    menus!: Table<DbMenu, number>;
    fortunes!: Table<DbFortune, number>;
    calcHistory!: Table<DbCalcHistory, number>;
    mealRecords!: Table<DbMealRecord, number>;
    recommendationRules!: Table<DbRecommendationRule, number>;

    constructor() {
        super('dailybox-db');
        this.version(1).stores({
            memos: '++id, updatedAt, createdAt, title, isPinned, isArchived, isLocked',
            todos: '++id, updatedAt, createdAt, isDone, title',
            timers: '++id, createdAt, label',
            menus: '++id, createdAt, name',
            fortunes: '++id, dateKey',
            calcHistory: '++id, createdAt, favorite, type',
        });
        // 버전 2: 타이머에 카테고리 및 타임라인 필드 추가
        this.version(2)
            .stores({
                memos: '++id, updatedAt, createdAt, title, isPinned, isArchived, isLocked',
                todos: '++id, updatedAt, createdAt, isDone, title',
                timers: '++id, createdAt, label, category, startedAt, endedAt',
                menus: '++id, createdAt, name',
                fortunes: '++id, dateKey',
                calcHistory: '++id, createdAt, favorite, type',
            })
            .upgrade(async (tx) => {
                // 기존 타이머 데이터 마이그레이션
                const timers = await tx.table('timers').toArray();
                await Promise.all(
                    timers.map(async (timer: DbTimer & { durationMs?: number }) => {
                        if (!timer.category || !timer.startedAt) {
                            await tx.table('timers').update(timer.id, {
                                category: 'work' as const,
                                startedAt: timer.createdAt || Date.now(),
                                endedAt: timer.createdAt && timer.durationMs ? timer.createdAt + timer.durationMs : undefined,
                            });
                        }
                    })
                );
            });
        
        // 버전 3: 식사 기록 테이블 추가 및 메뉴에 카테고리/시간대 필드 추가
        this.version(3)
            .stores({
                memos: '++id, updatedAt, createdAt, title, isPinned, isArchived, isLocked',
                todos: '++id, updatedAt, createdAt, isDone, title',
                timers: '++id, createdAt, label, category, startedAt, endedAt',
                menus: '++id, createdAt, name, category',
                fortunes: '++id, dateKey',
                calcHistory: '++id, createdAt, favorite, type',
                mealRecords: '++id, mealDate, createdAt, menuId, timeOfDay',
            });
        
        // 버전 4: 추천 규칙 테이블 추가
        this.version(4)
            .stores({
                memos: '++id, updatedAt, createdAt, title, isPinned, isArchived, isLocked',
                todos: '++id, updatedAt, createdAt, isDone, title',
                timers: '++id, createdAt, label, category, startedAt, endedAt',
                menus: '++id, createdAt, name, category',
                fortunes: '++id, dateKey',
                calcHistory: '++id, createdAt, favorite, type',
                mealRecords: '++id, mealDate, createdAt, menuId, timeOfDay',
                recommendationRules: '++id, enabled, createdAt, updatedAt',
            });
    }
}

export const db = new DailyboxDb();
