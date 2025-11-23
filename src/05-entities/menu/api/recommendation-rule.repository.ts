import { db, DbRecommendationRule } from '@/shared/lib/db/dexie';
import type { Repository, Identifier } from '@/shared/lib/repository/base-repository';

interface RecommendationRuleRepository extends Repository<DbRecommendationRule> {
    getEnabled(): Promise<DbRecommendationRule[]>;
}

export const recommendationRuleRepository: RecommendationRuleRepository = {
    async add(entity) {
        return db.recommendationRules.add(entity);
    },
    async update(id: Identifier, updates: Partial<DbRecommendationRule>) {
        await db.recommendationRules.update(id, updates);
    },
    async remove(id: Identifier) {
        await db.recommendationRules.delete(id);
    },
    async getById(id: Identifier) {
        return db.recommendationRules.get(id);
    },
    async getAll() {
        return db.recommendationRules.orderBy('createdAt').reverse().toArray();
    },
    async clear() {
        await db.recommendationRules.clear();
    },
    // 추가 메서드들
    async getEnabled() {
        return db.recommendationRules.where('enabled').equals(1).toArray();
    },
};

