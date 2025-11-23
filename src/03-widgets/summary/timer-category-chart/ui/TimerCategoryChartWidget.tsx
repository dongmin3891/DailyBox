/**
 * TimerCategoryChartWidget Component
 * 타이머 카테고리별 시간 분배를 파이 차트로 표시하는 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTimerSlice } from '@/features/timer';
import { getTodayStart, getTodayEnd, msToHoursMinutes } from '@/shared/lib/utils/dateUtils';
import { PieChart, type PieChartData } from '@/shared/ui/PieChart';
import { Card } from '@/shared/ui';

export interface TimerCategoryChartWidgetProps {
    /** 추가 클래스명 */
    className?: string;
    /** 날짜 범위 (기본: 오늘) */
    startDate?: number;
    endDate?: number;
}

const categoryColors: Record<'work' | 'study' | 'exercise', string> = {
    work: '#0066FF', // toss-blue
    study: '#00D9FF', // toss-blue-light
    exercise: '#FF6B6B', // semantic-error
};

const categoryLabels: Record<'work' | 'study' | 'exercise', string> = {
    work: '업무',
    study: '공부',
    exercise: '운동',
};

const TimerCategoryChartWidget: React.FC<TimerCategoryChartWidgetProps> = ({
    className = '',
    startDate,
    endDate,
}) => {
    const router = useRouter();
    const { timers } = useTimerSlice();

    const chartData = useMemo(() => {
        const start = startDate || getTodayStart();
        const end = endDate || getTodayEnd();

        // 날짜 범위 내의 완료된 타이머 필터링
        const filteredTimers = timers.filter(
            (timer) => timer.startedAt >= start && timer.startedAt <= end && timer.endedAt
        );

        // 카테고리별 시간 집계
        const categoryTotals: Record<'work' | 'study' | 'exercise', number> = {
            work: 0,
            study: 0,
            exercise: 0,
        };

        filteredTimers.forEach((timer) => {
            if (timer.endedAt) {
                const duration = timer.endedAt - timer.startedAt;
                categoryTotals[timer.category] += duration;
            }
        });

        // 총 시간 계산
        const totalMs = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

        // 파이 차트 데이터 생성
        const data: PieChartData[] = Object.entries(categoryTotals)
            .filter(([, value]) => value > 0)
            .map(([category, value]) => ({
                label: categoryLabels[category as keyof typeof categoryLabels],
                value,
                color: categoryColors[category as keyof typeof categoryColors],
            }));

        return {
            data,
            totalMs,
            categoryTotals,
        };
    }, [timers, startDate, endDate]);

    const { hours: totalHours, minutes: totalMinutes } = msToHoursMinutes(chartData.totalMs);

    if (chartData.data.length === 0) {
        return (
            <Card padding="md" variant="default" className={className}>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2" aria-hidden="true">
                        ⏰
                    </div>
                    <div className="text-sm text-text-tertiary">타이머 기록이 없습니다</div>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>📊</span> 카테고리별 시간 분배
                    </h2>
                    <button
                        onClick={() => router.push('/timer')}
                        className="text-sm text-toss-blue hover:underline"
                    >
                        전체 보기 →
                    </button>
                </div>

                {/* 파이 차트 */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <PieChart
                            data={chartData.data}
                            size={180}
                            centerText={`${totalHours > 0 ? `${totalHours}h` : ''}${totalMinutes}m`}
                        />
                    </div>

                    {/* 범례 */}
                    <div className="flex-1 space-y-2">
                        {chartData.data.map((item) => {
                            const { hours, minutes } = msToHoursMinutes(
                                chartData.categoryTotals[item.label === '업무' ? 'work' : item.label === '공부' ? 'study' : 'exercise']
                            );
                            const percentage = Math.round((item.value / chartData.totalMs) * 100);

                            return (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-text-primary">{item.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-text-primary">
                                            {hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`}
                                        </div>
                                        <div className="text-xs text-text-tertiary">{percentage}%</div>
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

export default TimerCategoryChartWidget;

