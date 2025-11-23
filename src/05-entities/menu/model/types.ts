export type MenuCategory = 'korean' | 'chinese' | 'japanese' | 'western' | 'snack' | 'other';

export type TimeOfDay = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Menu = {
    id?: number;
    name: string;
    tags: string[];
    category?: MenuCategory;
    timeOfDay?: TimeOfDay[];
    createdAt: number;
};

/**
 * 추천 규칙 조건
 */
export type RecommendationRuleCondition = {
    /** 요일 (0=일요일, 1=월요일, ..., 6=토요일) */
    dayOfWeek?: number[];
    /** 시간대 */
    timeOfDay?: TimeOfDay[];
    /** 카테고리 */
    category?: MenuCategory[];
};

/**
 * 추천 규칙 액션
 */
export type RecommendationRuleAction = {
    /** 우선 추천할 카테고리 (가중치 높임) */
    priorityCategories?: MenuCategory[];
    /** 제외할 카테고리 */
    excludeCategories?: MenuCategory[];
    /** 가중치 배수 (기본 1.0) */
    weight?: number;
};

/**
 * 추천 규칙
 */
export type RecommendationRule = {
    id?: number;
    name: string;
    enabled: boolean;
    conditions: RecommendationRuleCondition;
    actions: RecommendationRuleAction;
    createdAt: number;
    updatedAt: number;
};
