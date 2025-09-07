import { db, DbMemo } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

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
};
