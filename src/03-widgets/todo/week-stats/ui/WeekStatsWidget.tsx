/**
 * WeekStatsWidget Component
 * 이번 주 성취도 분석 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useTodoSlice } from '@/features/todo';
import { calculateWeekStats } from '@/entities/todo/lib/todoStats';
import { Card } from '@/shared/ui';

export interface WeekStatsWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const categoryLabels: Record<'work' | 'home' | 'personal', string> = {
    work: '업무',
    home: '집',
    personal: '개인',
};

const WeekStatsWidget: React.FC<WeekStatsWidgetProps> = ({ className = '' }) => {
    const { todos } = useTodoSlice();

    const stats = useMemo(() => {
        return calculateWeekStats(todos);
    }, [todos]);

    // 요일별 완료 수의 최대값 (그래프 높이 계산용)
    const maxDailyCompletions = Math.max(...stats.dailyCompletions, 1);

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-text-primary">이번 주 성취도</h2>

                {/* 주요 통계 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-toss-blue">{stats.completedCount}</div>
                        <div className="text-xs text-text-tertiary mt-1">완료</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-text-primary">{stats.totalCount}</div>
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

                {/* 요일별 완료 수 그래프 */}
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

                {/* 카테고리별 통계 */}
                <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-2">카테고리별 통계</h3>
                    <div className="space-y-2">
                        {(Object.entries(stats.categoryStats) as [keyof typeof stats.categoryStats, typeof stats.categoryStats[keyof typeof stats.categoryStats]][]).map(
                            ([category, categoryStat]) => {
                                const rate = categoryStat.total > 0 ? Math.round((categoryStat.completed / categoryStat.total) * 100) : 0;
                                return (
                                    <div key={category}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-text-primary">{categoryLabels[category]}</span>
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
                            }
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default WeekStatsWidget;

