'use client';
import { create } from 'zustand';
import { menuRepository } from '@/entities/menu/api/menu.repository';
import type { Menu } from '@/entities/menu/model/types';

type MenuItem = Menu & {
    id: number;
};

type MenuSlice = {
    menus: MenuItem[];
    isLoading: boolean;
    recommendedMenu: MenuItem | null;
    recentRecommendations: MenuItem[];

    // Actions
    loadMenus: () => Promise<void>;
    addMenu: (menu: Omit<Menu, 'id' | 'createdAt'>) => Promise<void>;
    updateMenu: (id: number, updates: Partial<Omit<Menu, 'id' | 'createdAt'>>) => Promise<void>;
    deleteMenu: (id: number) => Promise<void>;
    recommendMenu: (tagFilter?: string[]) => void;
    clearRecommendation: () => void;
};

export const useMenuSlice = create<MenuSlice>((set, get) => ({
    menus: [],
    isLoading: false,
    recommendedMenu: null,
    recentRecommendations: [],

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

    recommendMenu: (tagFilter) => {
        const { menus } = get();
        let filteredMenus = menus;

        // 태그 필터 적용
        if (tagFilter && tagFilter.length > 0) {
            filteredMenus = menus.filter((menu) =>
                tagFilter.some((tag) => menu.tags.includes(tag))
            );
        }

        if (filteredMenus.length === 0) {
            return;
        }

        // 랜덤 선택
        const randomIndex = Math.floor(Math.random() * filteredMenus.length);
        const recommended = filteredMenus[randomIndex];

        set((state) => ({
            recommendedMenu: recommended,
            recentRecommendations: [
                recommended,
                ...state.recentRecommendations.filter((m) => m.id !== recommended.id),
            ].slice(0, 5), // 최대 5개까지만 저장
        }));
    },

    clearRecommendation: () => {
        set({ recommendedMenu: null });
    },
}));
