/**
 * HomeLayoutWidget Component
 * 홈페이지의 전체 레이아웃을 관리하는 위젯
 *
 * 역할: 도구함(Utility Center) - 기능 진입에 집중
 *
 * 구조:
 * - Header: 앱 타이틀
 * - WelcomeSection: 인사말 + 오늘 요약 서브라인
 * - TodaySummarySection: 오늘 요약 3개 (투두, 집중시간, 식사)
 * - UtilityGridSection: 기능 카드 그리드
 */

'use client';

import React from 'react';
import { AppHeader, Divider } from '@/shared/ui';
import { GreetingWidget, FeaturesGridWidget, QuickSummaryWidget, WeatherForecastWidget } from '@/widgets/home';

export interface HomeLayoutWidgetProps {
    /** 사용자 이름 (선택적) */
    userName?: string;
    /** 추가 클래스명 */
    className?: string;
}

const HomeLayoutWidget: React.FC<HomeLayoutWidgetProps> = ({ userName, className = '' }) => {
    return (
        <main className={`min-h-screen bg-toss-blue-light/30 px-4 py-5 ${className}`}>
            <div className="max-w-sm mx-auto">
                {/* Header Section */}
                <div className="mb-4">
                    <AppHeader />
                </div>

                {/* Welcome Section */}
                <div className="mb-4">
                    <GreetingWidget userName={userName} />
                </div>

                {/* Weather Forecast Section */}
                <div className="mb-4">
                    <WeatherForecastWidget />
                </div>

                {/* Today Summary Section */}
                <div className="mb-4">
                    <QuickSummaryWidget />
                </div>

                {/* Divider: 오늘 요약과 기능 카드 사이 구분 */}
                <Divider orientation="horizontal" color="light" thickness="thin" spacing="md" className="mb-4" />

                {/* Utility Grid Section */}
                <div className="mb-6">
                    <FeaturesGridWidget />
                </div>
            </div>
        </main>
    );
};

export default HomeLayoutWidget;
