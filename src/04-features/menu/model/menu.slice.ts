'use client';
import { create } from 'zustand';
import { menuRepository } from '@/entities/menu/api/menu.repository';
import { mealRecordRepository } from '@/entities/menu/api/meal-record.repository';
import { recommendationRuleRepository } from '@/entities/menu/api/recommendation-rule.repository';
import { calculateMenuWeights, weightedRandomSelect } from '@/entities/menu/lib/ruleEngine';
import type { Menu, MenuCategory, TimeOfDay } from '@/entities/menu/model/types';
import type { DbMealRecord, DbRecommendationRule } from '@/shared/lib/db/dexie';

type MenuItem = Menu & {
    id: number;
};

type MenuSlice = {
    menus: MenuItem[];
    isLoading: boolean;
    recommendedMenu: MenuItem | null;
    recentRecommendations: MenuItem[];
    mealRecords: DbMealRecord[];
    isLoadingMealRecords: boolean;
    recommendationRules: DbRecommendationRule[];
    isLoadingRules: boolean;

    // Actions
    loadMenus: () => Promise<void>;
    addMenu: (menu: Omit<Menu, 'id' | 'createdAt'>) => Promise<void>;
    updateMenu: (id: number, updates: Partial<Omit<Menu, 'id' | 'createdAt'>>) => Promise<void>;
    deleteMenu: (id: number) => Promise<void>;
    recommendMenu: (tagFilter?: string[], categoryFilter?: MenuCategory, timeOfDayFilter?: TimeOfDay) => void;
    recordMeal: (menuId: number, menuName: string, category?: MenuCategory, timeOfDay?: TimeOfDay) => Promise<void>;
    loadMealRecords: () => Promise<void>;
    getMealRecordsByDateRange: (startDate: number, endDate: number) => Promise<DbMealRecord[]>;
    loadRecommendationRules: () => Promise<void>;
    addRecommendationRule: (rule: Omit<DbRecommendationRule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateRecommendationRule: (id: number, updates: Partial<Omit<DbRecommendationRule, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteRecommendationRule: (id: number) => Promise<void>;
    clearRecommendation: () => void;
};

export const useMenuSlice = create<MenuSlice>((set, get) => ({
    menus: [],
    isLoading: false,
    recommendedMenu: null,
    recentRecommendations: [],
    mealRecords: [],
    isLoadingMealRecords: false,
    recommendationRules: [],
    isLoadingRules: false,

    loadMenus: async () => {
        set({ isLoading: true });
        try {
            const items = await menuRepository.getAll();
            set({ menus: items as MenuItem[], isLoading: false });
        } catch (error) {
            console.error('Failed to load menus:', error);
            set({ isLoading: false });
        }
    },

    addMenu: async (menu) => {
        try {
            const now = Date.now();
            const newMenu: Omit<MenuItem, 'id'> = {
                ...menu,
                createdAt: now,
            };
            const newId = await menuRepository.add(newMenu);
            const { menus } = get();
            set({
                menus: [{ ...newMenu, id: newId } as MenuItem, ...menus],
            });
        } catch (error) {
            console.error('Failed to add menu:', error);
        }
    },

    updateMenu: async (id, updates) => {
        try {
            await menuRepository.update(id, updates);
            const { menus } = get();
            set({
                menus: menus.map((menu) => (menu.id === id ? { ...menu, ...updates } : menu)),
            });
        } catch (error) {
            console.error('Failed to update menu:', error);
        }
    },

    deleteMenu: async (id) => {
        try {
            await menuRepository.remove(id);
            const { menus, recommendedMenu, recentRecommendations } = get();
            set({
                menus: menus.filter((menu) => menu.id !== id),
                recommendedMenu: recommendedMenu?.id === id ? null : recommendedMenu,
                recentRecommendations: recentRecommendations.filter((menu) => menu.id !== id),
            });
        } catch (error) {
            console.error('Failed to delete menu:', error);
        }
    },

    recommendMenu: (tagFilter, categoryFilter, timeOfDayFilter) => {
        const { menus, recommendationRules } = get();
        let filteredMenus = menus;

        // 카테고리 필터 적용
        if (categoryFilter) {
            filteredMenus = filteredMenus.filter((menu) => menu.category === categoryFilter);
        }

        // 시간대 필터 적용
        if (timeOfDayFilter) {
            filteredMenus = filteredMenus.filter((menu) => 
                !menu.timeOfDay || menu.timeOfDay.length === 0 || menu.timeOfDay.includes(timeOfDayFilter)
            );
        }

        // 태그 필터 적용
        if (tagFilter && tagFilter.length > 0) {
            filteredMenus = filteredMenus.filter((menu) =>
                tagFilter.some((tag) => menu.tags.includes(tag))
            );
        }

        if (filteredMenus.length === 0) {
            return;
        }

        // 규칙 엔진 적용
        let recommended: MenuItem;
        if (recommendationRules.length > 0) {
            const currentDate = new Date();
            const currentDayOfWeek = currentDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
            const currentTimeOfDay = timeOfDayFilter || (() => {
                const hour = currentDate.getHours();
                if (hour >= 5 && hour < 10) return 'breakfast';
                if (hour >= 10 && hour < 15) return 'lunch';
                if (hour >= 15 && hour < 22) return 'dinner';
                return 'snack'; // 22시 이후 ~ 5시 이전: 야식
            })();

            // 규칙 기반 가중치 계산
            const weights = calculateMenuWeights(
                filteredMenus,
                recommendationRules,
                currentDayOfWeek,
                currentTimeOfDay
            );

            // 가중치 기반 랜덤 선택
            const selected = weightedRandomSelect(filteredMenus, weights);
            recommended = selected || filteredMenus[Math.floor(Math.random() * filteredMenus.length)];
        } else {
            // 규칙이 없으면 일반 랜덤 선택
            const randomIndex = Math.floor(Math.random() * filteredMenus.length);
            recommended = filteredMenus[randomIndex];
        }

        set((state) => ({
            recommendedMenu: recommended,
            recentRecommendations: [
                recommended,
                ...state.recentRecommendations.filter((m) => m.id !== recommended.id),
            ].slice(0, 5), // 최대 5개까지만 저장
        }));
    },

    recordMeal: async (menuId, menuName, category, timeOfDay) => {
        try {
            const now = Date.now();
            const mealRecord: Omit<DbMealRecord, 'id'> = {
                menuId,
                menuName,
                category,
                timeOfDay: timeOfDay || 'lunch',
                mealDate: now,
                createdAt: now,
            };
            await mealRecordRepository.add(mealRecord);
            
            // 상태 업데이트
            const { mealRecords } = get();
            set({
                mealRecords: [mealRecord as DbMealRecord, ...mealRecords].slice(0, 100), // 최대 100개까지만 메모리 유지
            });
        } catch (error) {
            console.error('Failed to record meal:', error);
        }
    },

    loadMealRecords: async () => {
        set({ isLoadingMealRecords: true });
        try {
            const records = await mealRecordRepository.getAll();
            set({ mealRecords: records, isLoadingMealRecords: false });
        } catch (error) {
            console.error('Failed to load meal records:', error);
            set({ isLoadingMealRecords: false });
        }
    },

    getMealRecordsByDateRange: async (startDate, endDate) => {
        try {
            return await mealRecordRepository.getByDateRange(startDate, endDate);
        } catch (error) {
            console.error('Failed to get meal records by date range:', error);
            return [];
        }
    },

    loadRecommendationRules: async () => {
        set({ isLoadingRules: true });
        try {
            const rules = await recommendationRuleRepository.getAll();
            set({ recommendationRules: rules, isLoadingRules: false });
        } catch (error) {
            console.error('Failed to load recommendation rules:', error);
            set({ isLoadingRules: false });
        }
    },

    addRecommendationRule: async (rule) => {
        try {
            const now = Date.now();
            const newRule: Omit<DbRecommendationRule, 'id'> = {
                ...rule,
                createdAt: now,
                updatedAt: now,
            };
            const newId = await recommendationRuleRepository.add(newRule);
            const { recommendationRules } = get();
            set({
                recommendationRules: [{ ...newRule, id: newId } as DbRecommendationRule, ...recommendationRules],
            });
        } catch (error) {
            console.error('Failed to add recommendation rule:', error);
        }
    },

    updateRecommendationRule: async (id, updates) => {
        try {
            const now = Date.now();
            await recommendationRuleRepository.update(id, { ...updates, updatedAt: now });
            const { recommendationRules } = get();
            set({
                recommendationRules: recommendationRules.map((rule) =>
                    rule.id === id ? { ...rule, ...updates, updatedAt: now } : rule
                ),
            });
        } catch (error) {
            console.error('Failed to update recommendation rule:', error);
        }
    },

    deleteRecommendationRule: async (id) => {
        try {
            await recommendationRuleRepository.remove(id);
            const { recommendationRules } = get();
            set({
                recommendationRules: recommendationRules.filter((rule) => rule.id !== id),
            });
        } catch (error) {
            console.error('Failed to delete recommendation rule:', error);
        }
    },

    clearRecommendation: () => {
        set({ recommendedMenu: null });
    },
}));
