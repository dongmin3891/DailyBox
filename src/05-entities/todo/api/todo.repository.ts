import { db, DbTodo } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

export const todoRepository: Repository<DbTodo> = {
    async add(entity) {
        return db.todos.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbTodo>) {
        await db.todos.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.todos.delete(id);
    },
    async getById(id: Identifier) {
        return db.todos.get(id);
    },
    async getAll() {
        return db.todos.orderBy('updatedAt').reverse().toArray();
    },
    async clear() {
        await db.todos.clear();
    },
};
