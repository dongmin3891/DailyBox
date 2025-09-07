import { db, DbCalcHistory } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export const calcHistoryRepository: Repository<DbCalcHistory> = {
    async add(entity) {
        return db.calcHistory.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbCalcHistory>) {
        await db.calcHistory.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.calcHistory.delete(id);
    },
    async getById(id: Identifier) {
        return db.calcHistory.get(id);
    },
    async getAll() {
        return db.calcHistory.orderBy('createdAt').reverse().toArray();
    },
};
