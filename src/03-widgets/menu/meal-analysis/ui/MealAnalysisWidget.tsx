/**
 * MealAnalysisWidget Component
 * 식습관 분석 위젯 - 대시보드용
 */

'use client';

import React, { useEffect } from 'react';
import { useMenuSlice } from '@/features/menu';
import { Card } from '@/shared/ui';
import type { DbMealRecord } from '@/shared/lib/db/dexie';
import type { TimeOfDay } from '@/entities/menu/model/types';

export interface MealAnalysisWidgetProps {
    /** 추가 클래스명 */
    className?: string;
    /** 분석 기간 (일) */
    days?: number;
}

const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
    korean: { label: '한식', icon: '🍚', color: 'bg-semantic-success/15 text-semantic-success' },
    chinese: { label: '중식', icon: '🥢', color: 'bg-semantic-warning/15 text-semantic-warning' },
    japanese: { label: '일식', icon: '🍣', color: 'bg-toss-blue/10 text-toss-blue' },
    western: { label: '양식', icon: '🍝', color: 'bg-semantic-error/15 text-semantic-error' },
    snack: { label: '분식', icon: '🍢', color: 'bg-neutral-gray-200 text-text-secondary' },
    other: { label: '기타', icon: '🍽️', color: 'bg-neutral-gray-200 text-text-secondary' },
};

const timeOfDayLabels: Record<string, { label: string; icon: string }> = {
    breakfast: { label: '아침', icon: '🌅' },
    lunch: { label: '점심', icon: '☀️' },
    dinner: { label: '저녁', icon: '🌙' },
    snack: { label: '야식', icon: '🌙' },
};

const MealAnalysisWidget: React.FC<MealAnalysisWidgetProps> = ({ className = '', days = 7 }) => {
    const { mealRecords, getMealRecordsByDateRange } = useMenuSlice();
    const [analysisData, setAnalysisData] = React.useState<{
        categoryStats: Record<string, number>;
        timeOfDayStats: Record<string, number>;
        totalMeals: number;
        mostFrequentMenu: { name: string; count: number } | null;
    } | null>(null);

    // 실제 식사 시간(mealDate)을 기준으로 시간대 계산 (22시 이후는 야식)
    const getTimeOfDayFromDate = (timestamp: number): TimeOfDay => {
        const hour = new Date(timestamp).getHours();
        if (hour >= 5 && hour < 10) return 'breakfast';
        if (hour >= 10 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 22) return 'dinner';
        return 'snack'; // 22시 이후 ~ 5시 이전: 야식
    };

    useEffect(() => {
        const loadAnalysis = async () => {
            const endDate = Date.now();
            const startDate = endDate - days * 24 * 60 * 60 * 1000;
            const records = await getMealRecordsByDateRange(startDate, endDate);

            // 카테고리별 통계
            const categoryStats: Record<string, number> = {};
            records.forEach((record) => {
                if (record.category) {
                    categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
                }
            });

            // 시간대별 통계 - 실제 식사 시간(mealDate)을 기준으로 계산
            const timeOfDayStats: Record<string, number> = {};
            records.forEach((record) => {
                // mealDate를 기준으로 실제 시간대 계산
                const actualTimeOfDay = getTimeOfDayFromDate(record.mealDate);
                timeOfDayStats[actualTimeOfDay] = (timeOfDayStats[actualTimeOfDay] || 0) + 1;
            });

            // 가장 자주 먹은 메뉴
            const menuCounts: Record<string, number> = {};
            records.forEach((record) => {
                menuCounts[record.menuName] = (menuCounts[record.menuName] || 0) + 1;
            });

            const mostFrequentMenu = Object.entries(menuCounts).reduce(
                (max, [name, count]) => (count > max.count ? { name, count } : max),
                { name: '', count: 0 }
            );

            setAnalysisData({
                categoryStats,
                timeOfDayStats,
                totalMeals: records.length,
                mostFrequentMenu: mostFrequentMenu.count > 0 ? mostFrequentMenu : null,
            });
        };

        loadAnalysis();
    }, [getMealRecordsByDateRange, days]);

    if (!analysisData) {
        return (
            <Card padding="md" variant="default" className={className}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-tertiary">분석 중...</div>
                </div>
            </Card>
        );
    }

    if (analysisData.totalMeals === 0) {
        return (
            <Card padding="md" variant="default" className={className}>
                <h2 className="text-lg font-semibold text-text-primary mb-4">식습관 분석</h2>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-text-tertiary mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <p className="text-text-tertiary">최근 {days}일간 식사 기록이 없습니다</p>
                    <p className="text-sm text-text-tertiary mt-1">메뉴 추천 후 기록을 남겨보세요</p>
                </div>
            </Card>
        );
    }

    const categoryEntries = Object.entries(analysisData.categoryStats).sort((a, b) => b[1] - a[1]);
    const timeOfDayEntries = Object.entries(analysisData.timeOfDayStats).sort((a, b) => b[1] - a[1]);

    return (
        <Card padding="md" variant="default" className={className}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
                식습관 분석 (최근 {days}일)
            </h2>

            <div className="space-y-6">
                {/* 총 식사 횟수 */}
                <div className="text-center p-4 bg-toss-blue/10 rounded-lg">
                    <div className="text-3xl font-bold text-toss-blue mb-1">{analysisData.totalMeals}</div>
                    <div className="text-sm text-text-secondary">총 식사 횟수</div>
                </div>

                {/* 가장 자주 먹은 메뉴 */}
                {analysisData.mostFrequentMenu && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">가장 자주 먹은 메뉴</h3>
                        <div className="flex items-center justify-between p-3 bg-neutral-gray-50 rounded-lg">
                            <span className="font-semibold text-text-primary">
                                {analysisData.mostFrequentMenu.name}
                            </span>
                            <span className="text-sm text-text-secondary">
                                {analysisData.mostFrequentMenu.count}회
                            </span>
                        </div>
                    </div>
                )}

                {/* 카테고리별 통계 */}
                {categoryEntries.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">카테고리별 통계</h3>
                        <div className="space-y-2">
                            {categoryEntries.map(([category, count]) => {
                                const categoryInfo = categoryLabels[category];
                                const percentage = Math.round((count / analysisData.totalMeals) * 100);
                                return (
                                    <div key={category} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span>{categoryInfo.icon}</span>
                                                <span className="text-sm font-medium text-text-primary">
                                                    {categoryInfo.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-text-secondary">{count}회</span>
                                                <span className="text-xs text-text-tertiary">{percentage}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-neutral-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${categoryInfo.color}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 시간대별 통계 */}
                {timeOfDayEntries.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">시간대별 통계</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {timeOfDayEntries.map(([timeOfDay, count]) => {
                                const timeInfo = timeOfDayLabels[timeOfDay];
                                const percentage = Math.round((count / analysisData.totalMeals) * 100);
                                return (
                                    <div
                                        key={timeOfDay}
                                        className="p-3 bg-neutral-gray-50 rounded-lg text-center"
                                    >
                                        <div className="text-2xl mb-1">{timeInfo.icon}</div>
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
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MealAnalysisWidget;

