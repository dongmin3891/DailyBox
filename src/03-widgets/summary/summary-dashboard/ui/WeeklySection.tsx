/**
 * WeeklySection Component
 * 이번주 섹션 - 성취도 완료율을 크게 표시하고 요일별/카테고리별 통계 제공
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useTodoSlice } from '@/features/todo';
import { calculateWeekPeriodStats, calculateMonthPeriodStats } from '@/entities/todo/lib/todoPeriodStats';
import { Card } from '@/shared/ui';

export interface WeeklySectionProps {
    /** 추가 클래스명 */
    className?: string;
}

type PeriodType = 'week' | 'month';

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const categoryLabels: Record<'work' | 'home' | 'personal', string> = {
    work: '업무',
    home: '집',
    personal: '개인',
};

const WeeklySection: React.FC<WeeklySectionProps> = ({ className = '' }) => {
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
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>📈</span> 이번 주 성취도
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedPeriod('week')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'week'
                                    ? 'bg-toss-blue text-white'
                                    : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                            }`}
                        >
                            주간
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('month')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === 'month'
                                    ? 'bg-toss-blue text-white'
                                    : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                            }`}
                        >
                            월간
                        </button>
                    </div>
                </div>

                {/* 성취도 완료율 - 크게 표시 */}
                <div className="text-center py-6 bg-toss-blue/5 rounded-lg">
                    <div className="text-5xl font-bold text-toss-blue mb-2">{stats.completionRate}%</div>
                    <div className="text-sm text-text-secondary mb-3">달성률</div>
                    <div className="flex items-center justify-center gap-4 text-sm text-text-tertiary">
                        <span>완료 {stats.completed}개</span>
                        <span>•</span>
                        <span>전체 {stats.total}개</span>
                    </div>
                </div>

                {/* 달성률 프로그레스 바 */}
                <div>
                    <div className="w-full h-4 bg-neutral-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-toss-blue transition-all duration-300"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                </div>

                {/* 요일별 완료 그래프 (주간만) */}
                {selectedPeriod === 'week' && stats.dailyCompletions && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-3">요일별 완료 수</h3>
                        <div className="flex items-end justify-between gap-1 h-28">
                            {stats.dailyCompletions.map((count, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-toss-blue/30 rounded-t transition-all duration-300 hover:bg-toss-blue/50"
                                        style={{
                                            height: `${(count / maxDailyCompletions) * 100}%`,
                                            minHeight: count > 0 ? '4px' : '0',
                                        }}
                                    />
                                    <div className="text-xs text-text-tertiary font-medium">{dayLabels[index]}</div>
                                    {count > 0 && (
                                        <div className="text-xs font-bold text-toss-blue">{count}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 카테고리별 분포 - 간단한 bar 형태 */}
                <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-3">카테고리별 분포</h3>
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
                                        <span className="text-sm text-text-primary font-medium">
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

export default WeeklySection;

