import { db, DbTimer } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export const timerRepository: Repository<DbTimer> = {
    async add(entity) {
        return db.timers.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbTimer>) {
        await db.timers.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.timers.delete(id);
    },
    async getById(id: Identifier) {
        return db.timers.get(id);
    },
    async getAll() {
        return db.timers.orderBy('createdAt').reverse().toArray();
    },
};
