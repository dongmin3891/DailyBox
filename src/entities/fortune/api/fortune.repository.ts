import { db, DbFortune } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export const fortuneRepository: Repository<DbFortune> = {
    async add(entity) {
        return db.fortunes.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbFortune>) {
        await db.fortunes.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.fortunes.delete(id);
    },
    async getById(id: Identifier) {
        return db.fortunes.get(id);
    },
    async getAll() {
        return db.fortunes.orderBy('dateKey').reverse().toArray();
    },
};
