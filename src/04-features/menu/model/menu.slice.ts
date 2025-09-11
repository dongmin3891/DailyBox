'use client';
import { create } from 'zustand';
import { menuRepository } from '@/entities/menu/api/menu.repository';

type MenuItem = {
    id: number;
    name: string;
    tags: string[];
    createdAt: number;
};

type MenuSlice = {
    menus: MenuItem[];
    isLoading: boolean;
    loadMenus: () => Promise<void>;
};

export const useMenuSlice = create<MenuSlice>((set) => ({
    menus: [],
    isLoading: false,
    loadMenus: async () => {
        set({ isLoading: true });
        const items = await menuRepository.getAll();
        set({ menus: items as MenuItem[], isLoading: false });
    },
}));
