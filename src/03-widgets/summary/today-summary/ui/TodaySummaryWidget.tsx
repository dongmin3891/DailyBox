/**
 * TodaySummaryWidget Component
 * 오늘의 핵심 정보를 요약하여 표시하는 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useCalcSlice } from '@/features/calculator';
import { useMenuSlice } from '@/features/menu';
import { calculateTodayStats } from '@/entities/summary/lib/todayStats';
import { msToHoursMinutes } from '@/shared/lib/utils/dateUtils';
import { Card } from '@/shared/ui';

export interface TodaySummaryWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const TodaySummaryWidget: React.FC<TodaySummaryWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { memos } = useMemoSlice();
    const { todos } = useTodoSlice();
    const { timers } = useTimerSlice();
    const { mealRecords } = useMenuSlice();
    const { history } = useCalcSlice();

    const stats = useMemo(() => {
        return calculateTodayStats({
            todos,
            memos,
            timers,
            mealRecords,
            calcHistory: history,
        });
    }, [todos, memos, timers, mealRecords, history]);

    const { hours: timerHours, minutes: timerMinutes } = msToHoursMinutes(stats.totalTimerMs);

    const summaryItems = [
        {
            icon: '✅',
            label: '완료한 투두',
            value: `${stats.completedTodos}개`,
            href: '/todo',
            color: 'text-semantic-success',
            bgColor: 'bg-semantic-success/15',
        },
        {
            icon: '📝',
            label: '오늘 메모',
            value: `${stats.todayMemos}개`,
            href: '/memo',
            color: 'text-toss-blue',
            bgColor: 'bg-toss-blue-light/20',
        },
        {
            icon: '⏰',
            label: '집중 시간',
            value: timerHours > 0 ? `${timerHours}시간 ${timerMinutes}분` : `${timerMinutes}분`,
            href: '/timer',
            color: 'text-semantic-warning',
            bgColor: 'bg-semantic-warning/15',
        },
        {
            icon: '🍽️',
            label: '오늘 식사',
            value: `${stats.todayMeals}회`,
            href: '/menu',
            color: 'text-semantic-warning',
            bgColor: 'bg-semantic-warning/15',
        },
        {
            icon: '🔢',
            label: '계산 기록',
            value: `${stats.todayCalcs}회`,
            href: '/calculator',
            color: 'text-toss-blue',
            bgColor: 'bg-toss-blue/10',
        },
    ];

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>📊</span> 오늘의 요약
                    </h2>
                    <span className="text-sm text-text-tertiary">
                        {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* 주요 통계 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {summaryItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.href)}
                            className={`p-3 rounded-lg border-2 border-transparent hover:border-toss-blue/30 transition-all ${item.bgColor} text-left`}
                        >
                            <div className={`text-2xl mb-1 ${item.color}`} aria-hidden="true">
                                {item.icon}
                            </div>
                            <div className="text-xs text-text-secondary mb-1">{item.label}</div>
                            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                        </button>
                    ))}
                </div>

                {/* 중요 알림 */}
                {(stats.dueTodayTodos > 0 || stats.highPriorityPendingTodos > 0) && (
                    <div className="pt-3 border-t border-neutral-gray-200">
                        <div className="space-y-2">
                            {stats.dueTodayTodos > 0 && (
                                <div className="flex items-center justify-between p-2 bg-semantic-warning/10 rounded-lg">
                                    <span className="text-sm text-text-primary">⚠️ 오늘 마감인 투두</span>
                                    <span className="text-sm font-bold text-semantic-warning">
                                        {stats.dueTodayTodos}개
                                    </span>
                                </div>
                            )}
                            {stats.highPriorityPendingTodos > 0 && (
                                <div className="flex items-center justify-between p-2 bg-semantic-warning/10 rounded-lg">
                                    <span className="text-sm text-text-primary">🔥 우선순위 높은 미완료</span>
                                    <span className="text-sm font-bold text-semantic-warning">
                                        {stats.highPriorityPendingTodos}개
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TodaySummaryWidget;

