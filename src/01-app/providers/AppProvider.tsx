/**
 * App Provider
 * FSD App Layer - 모든 전역 Provider 조합
 */

'use client';

import React, { useLayoutEffect } from 'react';
import StoreProvider from './StoreProvider';
import { BottomNavigationBar } from '@/shared/ui';
import { useThemeSlice } from '@/shared/model/theme.slice';

interface AppProviderProps {
    children: React.ReactNode;
}

const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useThemeSlice();

    useLayoutEffect(() => {
        // 초기 테마 적용 (hydration 전에 실행)
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return <>{children}</>;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <StoreProvider>
            <ThemeInitializer>
                {children}
                <BottomNavigationBar />
            </ThemeInitializer>
        </StoreProvider>
    );
};

export default AppProvider;
