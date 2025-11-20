'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

type ThemeSlice = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

export const useThemeSlice = create<ThemeSlice>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (theme) => {
                set({ theme });
                // HTML 클래스 업데이트
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(theme);
                }
            },
            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    // HTML 클래스 업데이트
                    if (typeof window !== 'undefined') {
                        document.documentElement.classList.remove('light', 'dark');
                        document.documentElement.classList.add(newTheme);
                    }
                    return { theme: newTheme };
                });
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // 초기화 시 HTML 클래스 설정
                if (state && typeof window !== 'undefined') {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(state.theme);
                }
            },
        }
    )
);

