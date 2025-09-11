/**
 * HomeLayoutWidget Component
 * 홈페이지의 전체 레이아웃을 관리하는 위젯
 */

'use client';

import React from 'react';
import { AppHeader } from '@/shared/ui';
import { GreetingWidget, FeaturesGridWidget } from '@/widgets/home';

export interface HomeLayoutWidgetProps {
    /** 사용자 이름 (선택적) */
    userName?: string;
    /** 추가 클래스명 */
    className?: string;
}

const HomeLayoutWidget: React.FC<HomeLayoutWidgetProps> = ({ userName, className = '' }) => {
    return (
        <main className={`min-h-screen bg-toss-blue-light/30 px-5 py-6 ${className}`}>
            <div className="max-w-sm mx-auto space-y-4">
                {/* 앱 헤더 */}
                <AppHeader />

                {/* 인사말 위젯 */}
                <GreetingWidget userName={userName} />

                {/* 기능 그리드 위젯 */}
                <FeaturesGridWidget />

                {/* 하단 여백 */}
                <div className="h-8" />
            </div>
        </main>
    );
};

export default HomeLayoutWidget;
