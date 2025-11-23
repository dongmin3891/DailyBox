/**
 * TodoCompletionDashboardWidget Component
 * 투두 달성률을 오늘/주간/월간으로 비교하여 표시하는 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTodoSlice } from '@/features/todo';
import { calculateTodoCompletionDashboard } from '@/entities/todo/lib/todoCompletionStats';
import { Card } from '@/shared/ui';

export interface TodoCompletionDashboardWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const TodoCompletionDashboardWidget: React.FC<TodoCompletionDashboardWidgetProps> = ({
    className = '',
}) => {
    const router = useRouter();
    const { todos } = useTodoSlice();

    const dashboard = useMemo(() => {
        return calculateTodoCompletionDashboard(todos);
    }, [todos]);

    const periods = [
        {
            label: '오늘',
            stats: dashboard.today,
            icon: '📅',
            color: 'text-toss-blue',
            bgColor: 'bg-toss-blue/10',
            barColor: 'bg-toss-blue',
        },
        {
            label: '이번 주',
            stats: dashboard.week,
            icon: '📆',
            color: 'text-semantic-success',
            bgColor: 'bg-semantic-success/15',
            barColor: 'bg-semantic-success',
        },
        {
            label: '이번 달',
            stats: dashboard.month,
            icon: '🗓️',
            color: 'text-semantic-warning',
            bgColor: 'bg-semantic-warning/15',
            barColor: 'bg-semantic-warning',
        },
    ];

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>✅</span> 투두 달성률
                    </h2>
                    <button
                        onClick={() => router.push('/todo')}
                        className="text-sm text-toss-blue hover:underline"
                    >
                        전체 보기 →
                    </button>
                </div>

                {/* 기간별 달성률 */}
                <div className="space-y-4">
                    {periods.map((period) => (
                        <div key={period.label} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg" aria-hidden="true">
                                        {period.icon}
                                    </span>
                                    <span className="text-sm font-medium text-text-primary">
                                        {period.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-tertiary">
                                        {period.stats.completed}/{period.stats.total}
                                    </span>
                                    <span className={`text-lg font-bold ${period.color}`}>
                                        {period.stats.completionRate}%
                                    </span>
                                </div>
                            </div>

                            {/* 프로그레스 바 */}
                            <div className="w-full h-3 bg-neutral-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${period.barColor} transition-all duration-500`}
                                    style={{ width: `${period.stats.completionRate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 요약 통계 */}
                <div className="pt-4 border-t border-neutral-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {periods.map((period) => (
                            <div key={period.label} className="space-y-1">
                                <div className="text-xs text-text-tertiary">{period.label}</div>
                                <div className={`text-xl font-bold ${period.color}`}>
                                    {period.stats.completionRate}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TodoCompletionDashboardWidget;

