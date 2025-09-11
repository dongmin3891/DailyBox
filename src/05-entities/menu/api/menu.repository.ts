import { db, DbMenu } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export const menuRepository: Repository<DbMenu> = {
    async add(entity) {
        return db.menus.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbMenu>) {
        await db.menus.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.menus.delete(id);
    },
    async getById(id: Identifier) {
        return db.menus.get(id);
    },
    async getAll() {
        return db.menus.orderBy('createdAt').reverse().toArray();
    },
    async clear() {
        await db.menus.clear();
    },
};
