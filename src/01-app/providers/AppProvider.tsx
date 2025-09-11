/**
 * App Provider
 * FSD App Layer - 모든 전역 Provider 조합
 */

'use client';

import React from 'react';
import StoreProvider from './StoreProvider';

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <StoreProvider>
            {/* 필요한 다른 Provider들 추가 가능 */}
            {/* <ThemeProvider> */}
            {/* <ErrorBoundary> */}
            {children}
        </StoreProvider>
    );
};

export default AppProvider;
