/**
 * 추천 규칙 엔진
 * 규칙 조건을 체크하고 액션을 적용하는 로직
 */

import type { RecommendationRule, MenuCategory, TimeOfDay } from '../model/types';
import type { DbRecommendationRule } from '@/shared/lib/db/dexie';

/**
 * 규칙 조건이 현재 상황과 일치하는지 확인
 */
export const checkRuleConditions = (
    rule: DbRecommendationRule,
    currentDayOfWeek: number,
    currentTimeOfDay: TimeOfDay
): boolean => {
    const { conditions } = rule;

    // 요일 조건 체크
    if (conditions.dayOfWeek && conditions.dayOfWeek.length > 0) {
        if (!conditions.dayOfWeek.includes(currentDayOfWeek)) {
            return false;
        }
    }

    // 시간대 조건 체크
    if (conditions.timeOfDay && conditions.timeOfDay.length > 0) {
        if (!conditions.timeOfDay.includes(currentTimeOfDay)) {
            return false;
        }
    }

    return true;
};

/**
 * 메뉴에 규칙 액션 적용 (가중치 계산)
 */
export const applyRuleAction = (
    menuCategory: MenuCategory | undefined,
    rule: DbRecommendationRule
): number => {
    const { actions } = rule;
    let weight = actions.weight || 1.0;

    // 우선 카테고리에 가중치 적용
    if (menuCategory && actions.priorityCategories?.includes(menuCategory)) {
        weight *= 2.0; // 우선 카테고리는 2배 가중치
    }

    // 제외 카테고리는 가중치 0
    if (menuCategory && actions.excludeCategories?.includes(menuCategory)) {
        return 0;
    }

    return weight;
};

/**
 * 모든 활성화된 규칙을 적용하여 메뉴 가중치 계산
 */
export const calculateMenuWeights = (
    menus: Array<{ id: number; category?: MenuCategory }>,
    rules: DbRecommendationRule[],
    currentDayOfWeek: number,
    currentTimeOfDay: TimeOfDay
): Map<number, number> => {
    const weights = new Map<number, number>();

    // 기본 가중치 1.0으로 초기화
    menus.forEach((menu) => {
        weights.set(menu.id, 1.0);
    });

    // 활성화된 규칙만 적용
    const enabledRules = rules.filter((rule) => rule.enabled);

    enabledRules.forEach((rule) => {
        // 규칙 조건이 현재 상황과 일치하는지 확인
        if (!checkRuleConditions(rule, currentDayOfWeek, currentTimeOfDay)) {
            return;
        }

        // 각 메뉴에 규칙 액션 적용
        menus.forEach((menu) => {
            const currentWeight = weights.get(menu.id) || 1.0;
            const ruleWeight = applyRuleAction(menu.category, rule);
            weights.set(menu.id, currentWeight * ruleWeight);
        });
    });

    return weights;
};

/**
 * 가중치 기반 랜덤 선택
 */
export const weightedRandomSelect = <T extends { id: number }>(
    items: T[],
    weights: Map<number, number>
): T | null => {
    if (items.length === 0) return null;

    // 가중치 합계 계산
    let totalWeight = 0;
    items.forEach((item) => {
        const weight = weights.get(item.id) || 1.0;
        if (weight > 0) {
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) return null;

    // 랜덤 값 선택
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (const item of items) {
        const weight = weights.get(item.id) || 1.0;
        if (weight > 0) {
            currentWeight += weight;
            if (random <= currentWeight) {
                return item;
            }
        }
    }

    // fallback: 첫 번째 아이템 반환
    return items[0];
};

