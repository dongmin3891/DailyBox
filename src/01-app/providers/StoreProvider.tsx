/**
 * Store Provider
 * FSD App Layer - Zustand 스토어 전역 제공
 */

'use client';

import React from 'react';
import { useAppStore } from '@/shared/model/store';

interface StoreProviderProps {
    children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    // 스토어 초기화 로직이 필요한 경우 여기에 추가
    React.useEffect(() => {
        // 앱 시작 시 필요한 전역 초기화 로직
        console.log('DailyBox Store initialized');
    }, []);

    return <>{children}</>;
};

export default StoreProvider;
