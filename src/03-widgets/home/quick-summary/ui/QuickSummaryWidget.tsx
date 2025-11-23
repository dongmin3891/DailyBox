/**
 * QuickSummaryWidget Component
 * 홈 화면에 표시할 오늘의 간단한 요약 정보 (투두, 집중시간, 식사 횟수)
 * 
 * 개선: 숫자 강조(15~16px bold), 레이블 12px, 여백 추가, 배경으로 섹션 구분
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useMenuSlice } from '@/features/menu';
import { calculateTodayStats } from '@/entities/summary/lib/todayStats';
import { msToHoursMinutes } from '@/shared/lib/utils/dateUtils';

export interface QuickSummaryWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const QuickSummaryWidget: React.FC<QuickSummaryWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { todos, loadTodos } = useTodoSlice();
    const { timers, loadTimers } = useTimerSlice();
    const { mealRecords, loadMenus } = useMenuSlice();

    useEffect(() => {
        loadTodos();
        loadTimers();
        loadMenus();
    }, [loadTodos, loadTimers, loadMenus]);

    const stats = useMemo(() => {
        return calculateTodayStats({
            todos,
            memos: [],
            timers,
            mealRecords,
            calcHistory: [],
        });
    }, [todos, timers, mealRecords]);

    const { hours: timerHours, minutes: timerMinutes } = msToHoursMinutes(stats.totalTimerMs);
    const timerDisplay = timerHours > 0 ? `${timerHours}시간 ${timerMinutes}분` : `${timerMinutes}분`;

    const summaryItems = [
        {
            icon: '✅',
            label: '투두',
            value: `${stats.completedTodos}개`,
            href: '/todo',
        },
        {
            icon: '⏰',
            label: '집중시간',
            value: timerDisplay,
            href: '/timer',
        },
        {
            icon: '🍽️',
            label: '식사',
            value: `${stats.todayMeals}회`,
            href: '/menu',
        },
    ];

    return (
        <Card variant="default" padding="md" className={`mb-4 bg-bg-primary/50 ${className}`}>
            <div className="flex items-center justify-between gap-3">
                {summaryItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => router.push(item.href)}
                        className="flex-1 flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl hover:bg-bg-secondary transition-colors active:scale-95"
                    >
                        <span className="text-base" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span className="text-[12px] text-text-tertiary font-medium leading-tight">{item.label}</span>
                        <span className="text-[15px] text-text-primary font-bold leading-tight">{item.value}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default QuickSummaryWidget;

