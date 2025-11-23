/**
 * MenuHistoryWidget Component
 * 식사 기록 히스토리 위젯
 */

'use client';

import React, { useEffect } from 'react';
import { useMenuSlice } from '@/features/menu';
import { Card } from '@/shared/ui';
import type { DbMealRecord } from '@/shared/lib/db/dexie';

export interface MenuHistoryWidgetProps {
    /** 추가 클래스명 */
    className?: string;
    /** 표시할 최대 개수 */
    maxItems?: number;
}

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

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return `오늘 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (isYesterday) {
        return `어제 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const MenuHistoryWidget: React.FC<MenuHistoryWidgetProps> = ({ className = '', maxItems = 10 }) => {
    const { mealRecords, isLoadingMealRecords, loadMealRecords } = useMenuSlice();

    useEffect(() => {
        loadMealRecords();
    }, [loadMealRecords]);

    const displayRecords = mealRecords.slice(0, maxItems);

    if (isLoadingMealRecords) {
        return (
            <Card padding="md" variant="default" className={className}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-tertiary">로딩 중...</div>
                </div>
            </Card>
        );
    }

    if (displayRecords.length === 0) {
        return (
            <Card padding="md" variant="default" className={className}>
                <h2 className="text-lg font-semibold text-text-primary mb-4">식사 기록</h2>
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="text-text-tertiary">아직 식사 기록이 없습니다</p>
                    <p className="text-sm text-text-tertiary mt-1">메뉴 추천 후 기록을 남겨보세요</p>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="md" variant="default" className={className}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
                식사 기록 ({mealRecords.length}개)
            </h2>
            <div className="space-y-2">
                {displayRecords.map((record) => {
                    const categoryInfo = record.category ? categoryLabels[record.category] : null;
                    const timeInfo = timeOfDayLabels[record.timeOfDay];

                    return (
                        <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-neutral-gray-50 rounded-lg hover:bg-neutral-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="text-2xl flex-shrink-0">{timeInfo.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-text-primary">{record.menuName}</span>
                                        {categoryInfo && (
                                            <span className="text-xs text-text-secondary flex items-center gap-1">
                                                <span>{categoryInfo.icon}</span>
                                                <span>{categoryInfo.label}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-text-tertiary">
                                        {formatDate(record.mealDate)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {mealRecords.length > maxItems && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-text-tertiary">
                        외 {mealRecords.length - maxItems}개의 기록이 더 있습니다
                    </p>
                </div>
            )}
        </Card>
    );
};

export default MenuHistoryWidget;

