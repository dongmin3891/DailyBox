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
    createdAt: number;
    updatedAt: number;
};

export type DbTimer = {
    id?: number;
    label: string;
    durationMs: number;
    createdAt: number;
};

export type DbMenu = {
    id?: number;
    name: string;
    tags: string[];
    createdAt: number;
};

export type DbFortune = {
    id?: number;
    dateKey: string; // YYYY-MM-DD
    text: string;
    createdAt: number;
};

export type DbCalcHistory = {
    id?: number;
    expression: string;
    result: string;
    createdAt: number;
};

export class DailyboxDb extends Dexie {
    memos!: Table<DbMemo, number>;
    todos!: Table<DbTodo, number>;
    timers!: Table<DbTimer, number>;
    menus!: Table<DbMenu, number>;
    fortunes!: Table<DbFortune, number>;
    calcHistory!: Table<DbCalcHistory, number>;

    constructor() {
        super('dailybox-db');
        this.version(1).stores({
            memos: '++id, updatedAt, createdAt, title, isPinned, isArchived, isLocked',
            todos: '++id, updatedAt, createdAt, isDone, title',
            timers: '++id, createdAt, label',
            menus: '++id, createdAt, name',
            fortunes: '++id, dateKey',
            calcHistory: '++id, createdAt',
        });
    }
}

export const db = new DailyboxDb();
