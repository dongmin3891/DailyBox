/**
 * TimerStatsWidget Component
 * 타이머 통계 위젯 (일/주/월 단위)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui';
import { useTimerSlice } from '@/features/timer/model/timer.slice';
import type { TimerCategory } from '@/entities/timer/model/types';

export interface TimerStatsWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

type StatsPeriod = 'day' | 'week' | 'month';

/**
 * 밀리초를 시간 형식으로 변환 (예: 2시간 30분)
 */
const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    }
    if (minutes > 0) {
        return `${minutes}분`;
    }
    return '0분';
};

/**
 * 밀리초를 총 분 수로 변환
 */
const formatTotalMinutes = (ms: number): number => {
    return Math.floor(ms / (1000 * 60));
};

/**
 * 밀리초를 성취감 있는 형식으로 변환 (분 + 시간)
 */
const formatDurationWithMinutes = (ms: number): { totalMinutes: number; hours: number; minutes: number } => {
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { totalMinutes, hours, minutes };
};

/**
 * 밀리초를 시간 단위로 변환 (소수점 1자리)
 */
const formatHours = (ms: number): string => {
    const hours = ms / (1000 * 60 * 60);
    return hours.toFixed(1);
};

const TimerStatsWidget: React.FC<TimerStatsWidgetProps> = ({ className = '' }) => {
    const { getStatsByDateRange } = useTimerSlice();
    const [period, setPeriod] = useState<StatsPeriod>('day');
    const [stats, setStats] = useState<{
        total: number;
        byCategory: Record<TimerCategory, number>;
    }>({
        total: 0,
        byCategory: {
            work: 0,
            study: 0,
            exercise: 0,
        },
    });

    useEffect(() => {
        const loadStats = async () => {
            const now = new Date();
            let startDate: Date;

            switch (period) {
                case 'day':
                    startDate = new Date(now);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'month':
                    startDate = new Date(now);
                    startDate.setMonth(now.getMonth() - 1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
            }

            const timers = await getStatsByDateRange(startDate, now);

            const newStats = {
                total: 0,
                byCategory: {
                    work: 0,
                    study: 0,
                    exercise: 0,
                } as Record<TimerCategory, number>,
            };

            timers.forEach((timer) => {
                if (timer.endedAt) {
                    const duration = timer.endedAt - timer.startedAt;
                    newStats.total += duration;
                    newStats.byCategory[timer.category] += duration;
                }
            });

            setStats(newStats);
        };

        loadStats();
    }, [period, getStatsByDateRange]);

    const getMaxDuration = () => {
        return Math.max(stats.total, ...Object.values(stats.byCategory));
    };

    const maxDuration = getMaxDuration();

    const categoryConfig: Record<TimerCategory, { label: string; icon: string; color: string }> = {
        work: {
            label: '업무',
            icon: '💼',
            color: 'bg-semantic-warning',
        },
        study: {
            label: '공부',
            icon: '📚',
            color: 'bg-toss-blue',
        },
        exercise: {
            label: '운동',
            icon: '🏃',
            color: 'bg-semantic-success',
        },
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 기간 선택 */}
            <Card padding="md" variant="default">
                <div className="flex gap-2">
                    {(['day', 'week', 'month'] as StatsPeriod[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-all
                                ${period === p ? 'bg-toss-blue text-white' : 'bg-neutral-gray-100 text-text-secondary'}
                            `}
                        >
                            {p === 'day' && '일'}
                            {p === 'week' && '주'}
                            {p === 'month' && '월'}
                        </button>
                    ))}
                </div>
            </Card>

            {/* 총 시간 */}
            <Card padding="md" variant="default">
                <h2 className="text-lg font-semibold text-text-primary mb-3">
                    {period === 'day' && '오늘'}
                    {period === 'week' && '이번 주'}
                    {period === 'month' && '이번 달'} 총 시간
                </h2>
                <div className="text-center">
                    <div className="text-5xl font-bold text-text-primary mb-1">{formatTotalMinutes(stats.total)}</div>
                    <div className="text-text-secondary text-lg font-medium mb-2">분</div>
                    {formatDurationWithMinutes(stats.total).hours > 0 && (
                        <div className="text-text-secondary text-sm">
                            ({formatDuration(stats.total)})
                        </div>
                    )}
                </div>
            </Card>

            {/* 카테고리별 통계 */}
            <Card padding="md" variant="default">
                <h2 className="text-lg font-semibold text-text-primary mb-4">카테고리별 통계</h2>
                <div className="space-y-4">
                    {(Object.keys(categoryConfig) as TimerCategory[]).map((category) => {
                        const config = categoryConfig[category];
                        const duration = stats.byCategory[category];
                        const formatted = formatDurationWithMinutes(duration);
                        const percentage = maxDuration > 0 ? (duration / maxDuration) * 100 : 0;

                        return (
                            <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{config.icon}</span>
                                        <span className="text-text-primary font-medium">{config.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-text-primary font-bold text-lg">{formatted.totalMinutes}분</div>
                                        {formatted.hours > 0 && (
                                            <div className="text-text-secondary text-xs">
                                                ({formatDuration(duration)})
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="h-2 bg-neutral-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${config.color} transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default TimerStatsWidget;

