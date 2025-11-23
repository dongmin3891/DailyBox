/**
 * PeriodStatsWidget Component
 * 주간/월간 통계를 기간 선택과 함께 표시하는 위젯
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useTodoSlice } from '@/features/todo';
import { calculateWeekPeriodStats, calculateMonthPeriodStats } from '@/entities/todo/lib/todoPeriodStats';
import { PeriodSelector, type PeriodType } from '@/widgets/summary/period-selector';
import { Card } from '@/shared/ui';

export interface PeriodStatsWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const categoryLabels: Record<'work' | 'home' | 'personal', string> = {
    work: '업무',
    home: '집',
    personal: '개인',
};

const PeriodStatsWidget: React.FC<PeriodStatsWidgetProps> = ({ className = '' }) => {
    const { todos } = useTodoSlice();
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');

    const stats = useMemo(() => {
        if (selectedPeriod === 'week') {
            return calculateWeekPeriodStats(todos);
        } else {
            return calculateMonthPeriodStats(todos);
        }
    }, [todos, selectedPeriod]);

    const maxDailyCompletions = stats.dailyCompletions
        ? Math.max(...stats.dailyCompletions, 1)
        : 1;

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>📈</span> 기간별 통계
                    </h2>
                    <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
                </div>

                {/* 주요 통계 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-toss-blue">{stats.completed}</div>
                        <div className="text-xs text-text-tertiary mt-1">완료</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
                        <div className="text-xs text-text-tertiary mt-1">전체</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-semantic-success">{stats.completionRate}%</div>
                        <div className="text-xs text-text-tertiary mt-1">달성률</div>
                    </div>
                </div>

                {/* 달성률 프로그레스 바 */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-text-secondary">진행률</span>
                        <span className="text-sm font-medium text-text-secondary">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-toss-blue transition-all duration-300"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                </div>

                {/* 요일별 완료 수 그래프 (주간만) */}
                {selectedPeriod === 'week' && stats.dailyCompletions && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">요일별 완료 수</h3>
                        <div className="flex items-end justify-between gap-1 h-24">
                            {stats.dailyCompletions.map((count, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-toss-blue/30 rounded-t transition-all duration-300 hover:bg-toss-blue/50"
                                        style={{
                                            height: `${(count / maxDailyCompletions) * 100}%`,
                                            minHeight: count > 0 ? '4px' : '0',
                                        }}
                                    />
                                    <div className="text-xs text-text-tertiary">{dayLabels[index]}</div>
                                    {count > 0 && (
                                        <div className="text-xs font-medium text-toss-blue">{count}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 카테고리별 통계 */}
                <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-2">카테고리별 통계</h3>
                    <div className="space-y-2">
                        {(
                            Object.entries(stats.categoryStats) as [
                                keyof typeof stats.categoryStats,
                                typeof stats.categoryStats[keyof typeof stats.categoryStats]
                            ][]
                        ).map(([category, categoryStat]) => {
                            const rate =
                                categoryStat.total > 0
                                    ? Math.round((categoryStat.completed / categoryStat.total) * 100)
                                    : 0;
                            return (
                                <div key={category}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-text-primary">
                                            {categoryLabels[category]}
                                        </span>
                                        <span className="text-xs text-text-secondary">
                                            {categoryStat.completed}/{categoryStat.total} ({rate}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-neutral-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-toss-blue transition-all duration-300"
                                            style={{ width: `${rate}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PeriodStatsWidget;

