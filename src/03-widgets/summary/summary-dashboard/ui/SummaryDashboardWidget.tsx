/**
 * SummaryDashboardWidget Component
 * 요약 대시보드 위젯 - '오늘 → 이번주 → 분석' 흐름으로 재구성된 대시보드
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useCalcSlice } from '@/features/calculator';
import { useMenuSlice } from '@/features/menu';
import { IconButton } from '@/shared/ui';
import TopSection from './TopSection';
import WeeklySection from './WeeklySection';
import InsightSection from './InsightSection';

export interface SummaryDashboardWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const SummaryDashboardWidget: React.FC<SummaryDashboardWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { loadMemos } = useMemoSlice();
    const { loadTodos } = useTodoSlice();
    const { loadTimers } = useTimerSlice();
    const { loadHistory } = useCalcSlice();
    const { loadMenus, loadMealRecords } = useMenuSlice();

    useEffect(() => {
        // 모든 데이터 로드
        loadMemos();
        loadTodos();
        loadTimers();
        loadHistory();
        loadMenus();
        loadMealRecords();
    }, [loadMemos, loadTodos, loadTimers, loadHistory, loadMenus, loadMealRecords]);

    return (
        <div className={`min-h-screen bg-bg-secondary pb-20 ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.back()}
                            aria-label="뒤로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">요약 대시보드</h1>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* 오늘 섹션 */}
                    <TopSection />

                    {/* 이번주 섹션 */}
                    <WeeklySection />

                    {/* 분석 섹션 */}
                    <InsightSection />
                </div>
            </main>
        </div>
    );
};

export default SummaryDashboardWidget;
