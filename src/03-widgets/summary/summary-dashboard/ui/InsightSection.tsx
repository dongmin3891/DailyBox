/**
 * InsightSection Component
 * 분석 섹션 - 최근 메모, 식습관 TOP3, 간소화된 통계, 인사이트
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { useMenuSlice } from '@/features/menu';
import { Card } from '@/shared/ui';
import { MenuTop3Widget } from '@/widgets/summary';
import { formatSmartDate } from '@/shared/lib/utils/dateUtils';
import { getTodayStart } from '@/shared/lib/utils/dateUtils';

export interface InsightSectionProps {
    /** 추가 클래스명 */
    className?: string;
}

const InsightSection: React.FC<InsightSectionProps> = ({ className = '' }) => {
    const router = useRouter();
    const { memos } = useMemoSlice();
    const { mealRecords } = useMenuSlice();

    // 최근 메모 2-3개
    const recentMemos = useMemo(() => {
        return memos
            .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
            .slice(0, 3);
    }, [memos]);

    // 이번 주 식사 기록 (간소화된 통계용)
    const weekMealStats = useMemo(() => {
        const weekStart = getTodayStart() - 7 * 24 * 60 * 60 * 1000;
        const weekRecords = mealRecords.filter((record) => record.mealDate >= weekStart);

        // 카테고리별 통계
        const categoryStats: Record<string, number> = {};
        weekRecords.forEach((record) => {
            if (record.category) {
                categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
            }
        });

        // 시간대별 통계
        const timeOfDayStats: Record<string, number> = {};
        weekRecords.forEach((record) => {
            const hour = new Date(record.mealDate).getHours();
            let timeOfDay: string;
            if (hour >= 5 && hour < 10) timeOfDay = 'breakfast';
            else if (hour >= 10 && hour < 15) timeOfDay = 'lunch';
            else if (hour >= 15 && hour < 22) timeOfDay = 'dinner';
            else timeOfDay = 'snack';

            timeOfDayStats[timeOfDay] = (timeOfDayStats[timeOfDay] || 0) + 1;
        });

        return {
            total: weekRecords.length,
            categoryStats,
            timeOfDayStats,
        };
    }, [mealRecords]);

    const categoryLabels: Record<string, { label: string; icon: string }> = {
        korean: { label: '한식', icon: '🍚' },
        chinese: { label: '중식', icon: '🥢' },
        japanese: { label: '일식', icon: '🍣' },
        western: { label: '양식', icon: '🍝' },
        snack: { label: '분식', icon: '🍢' },
        other: { label: '기타', icon: '🍽️' },
    };

    const timeOfDayLabels: Record<string, { label: string; icon: string }> = {
        breakfast: { label: '아침', icon: '🌅' },
        lunch: { label: '점심', icon: '☀️' },
        dinner: { label: '저녁', icon: '🌙' },
        snack: { label: '야식', icon: '🌙' },
    };

    // 이번 주 인사이트 생성 (간단한 구조만 준비)
    const insight = useMemo(() => {
        if (weekMealStats.total === 0) return null;

        const topCategory = Object.entries(weekMealStats.categoryStats).sort((a, b) => b[1] - a[1])[0];
        const topTime = Object.entries(weekMealStats.timeOfDayStats).sort((a, b) => b[1] - a[1])[0];

        if (!topCategory || !topTime) return null;

        const categoryInfo = categoryLabels[topCategory[0]] || { label: '기타', icon: '🍽️' };
        const timeInfo = timeOfDayLabels[topTime[0]] || { label: '기타', icon: '🍽️' };

        return {
            category: categoryInfo,
            timeOfDay: timeInfo,
            totalMeals: weekMealStats.total,
        };
    }, [weekMealStats]);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 최근 메모 */}
            {recentMemos.length > 0 && (
                <Card padding="md" variant="default">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <span>📝</span> 최근 메모
                        </h2>
                        <button
                            onClick={() => router.push('/memo')}
                            className="text-sm text-toss-blue hover:underline"
                        >
                            더보기 →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentMemos.map((memo) => (
                            <div
                                key={memo.id}
                                onClick={() => router.push(`/memo/${memo.id}`)}
                                className="p-3 bg-neutral-gray-50 rounded-lg hover:bg-neutral-gray-100 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-text-primary mb-1 line-clamp-1">
                                            {memo.title || '제목 없음'}
                                        </div>
                                        {memo.content && (
                                            <div className="text-sm text-text-tertiary line-clamp-2">
                                                {memo.content}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-text-tertiary flex-shrink-0">
                                        {formatSmartDate(memo.updatedAt || memo.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* 식습관 TOP3 */}
            <MenuTop3Widget
                startDate={getTodayStart() - 7 * 24 * 60 * 60 * 1000}
                endDate={getTodayStart() + 24 * 60 * 60 * 1000}
            />

            {/* 카테고리/시간대 통계 - small-card 스타일로 간소화 */}
            {weekMealStats.total > 0 && (
                <Card padding="md" variant="default">
                    <h3 className="text-base font-semibold text-text-primary mb-3">이번 주 식습관 통계</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {/* 카테고리별 통계 */}
                        {Object.entries(weekMealStats.categoryStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([category, count]) => {
                                const categoryInfo = categoryLabels[category] || {
                                    label: '기타',
                                    icon: '🍽️',
                                };
                                const percentage = Math.round((count / weekMealStats.total) * 100);
                                return (
                                    <div
                                        key={category}
                                        className="p-3 bg-neutral-gray-50 rounded-lg text-center"
                                    >
                                        <div className="text-xl mb-1">{categoryInfo.icon}</div>
                                        <div className="text-xs font-medium text-text-primary mb-1">
                                            {categoryInfo.label}
                                        </div>
                                        <div className="text-sm font-semibold text-text-secondary">
                                            {count}회 ({percentage}%)
                                        </div>
                                    </div>
                                );
                            })}

                        {/* 시간대별 통계 */}
                        {Object.entries(weekMealStats.timeOfDayStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([timeOfDay, count]) => {
                                const timeInfo = timeOfDayLabels[timeOfDay] || {
                                    label: '기타',
                                    icon: '🍽️',
                                };
                                const percentage = Math.round((count / weekMealStats.total) * 100);
                                return (
                                    <div
                                        key={timeOfDay}
                                        className="p-3 bg-neutral-gray-50 rounded-lg text-center"
                                    >
                                        <div className="text-xl mb-1">{timeInfo.icon}</div>
                                        <div className="text-xs font-medium text-text-primary mb-1">
                                            {timeInfo.label}
                                        </div>
                                        <div className="text-sm font-semibold text-text-secondary">
                                            {count}회 ({percentage}%)
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </Card>
            )}

            {/* 이번 주 인사이트 */}
            {insight && (
                <Card padding="md" variant="default" className="bg-toss-blue/5 border-toss-blue/20">
                    <h3 className="text-base font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <span>💡</span> 이번 주 인사이트
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        이번 주 총 <span className="font-semibold text-toss-blue">{insight.totalMeals}회</span>의
                        식사를 기록하셨네요. 가장 많이 드신 메뉴는{' '}
                        <span className="font-semibold text-toss-blue">{insight.category.label}</span>이고,{' '}
                        <span className="font-semibold text-toss-blue">{insight.timeOfDay.label}</span> 시간대에
                        가장 활발하게 식사하셨습니다.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default InsightSection;

