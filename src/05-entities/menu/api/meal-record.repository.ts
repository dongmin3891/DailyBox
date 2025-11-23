import { db, DbMealRecord } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

interface MealRecordRepository extends Repository<DbMealRecord> {
    getByDateRange(startDate: number, endDate: number): Promise<DbMealRecord[]>;
    getByTimeOfDay(timeOfDay: DbMealRecord['timeOfDay']): Promise<DbMealRecord[]>;
    getByCategory(category: DbMealRecord['category']): Promise<DbMealRecord[]>;
}

export const mealRecordRepository: MealRecordRepository = {
    async add(entity) {
        return db.mealRecords.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbMealRecord>) {
        await db.mealRecords.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.mealRecords.delete(id);
    },
    async getById(id: Identifier) {
        return db.mealRecords.get(id);
    },
    async getAll() {
        return db.mealRecords.orderBy('mealDate').reverse().toArray();
    },
    async clear() {
        await db.mealRecords.clear();
    },
    // 추가 메서드들
    async getByDateRange(startDate: number, endDate: number) {
        return db.mealRecords
            .where('mealDate')
            .between(startDate, endDate, true, true)
            .reverse()
            .toArray();
    },
    async getByTimeOfDay(timeOfDay: DbMealRecord['timeOfDay']) {
        return db.mealRecords
            .where('timeOfDay')
            .equals(timeOfDay)
            .reverse()
            .toArray();
    },
    async getByCategory(category: DbMealRecord['category']) {
        if (!category) return [];
        return db.mealRecords
            .where('category')
            .equals(category)
            .reverse()
            .toArray();
    },
};

