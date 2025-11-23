/**
 * MenuTop3Widget Component
 * 가장 많이 먹은 메뉴 TOP3를 표시하는 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuSlice } from '@/features/menu';
import { getTodayStart, getTodayEnd } from '@/shared/lib/utils/dateUtils';
import { Card } from '@/shared/ui';
import { Badge } from '@/shared/ui';

export interface MenuTop3WidgetProps {
    /** 추가 클래스명 */
    className?: string;
    /** 날짜 범위 (기본: 오늘) */
    startDate?: number;
    endDate?: number;
}

const MenuTop3Widget: React.FC<MenuTop3WidgetProps> = ({
    className = '',
    startDate,
    endDate,
}) => {
    const router = useRouter();
    const { mealRecords } = useMenuSlice();

    const top3Menus = useMemo(() => {
        const start = startDate || getTodayStart();
        const end = endDate || getTodayEnd();

        // 날짜 범위 내의 식사 기록 필터링
        const filteredRecords = mealRecords.filter(
            (record) => record.mealDate >= start && record.mealDate <= end
        );

        // 메뉴별 카운트 집계
        const menuCounts: Record<string, number> = {};
        filteredRecords.forEach((record) => {
            menuCounts[record.menuName] = (menuCounts[record.menuName] || 0) + 1;
        });

        // TOP3 추출
        const sortedMenus = Object.entries(menuCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return sortedMenus;
    }, [mealRecords, startDate, endDate]);

    if (top3Menus.length === 0) {
        return (
            <Card padding="md" variant="default" className={className}>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2" aria-hidden="true">
                        🍽️
                    </div>
                    <div className="text-sm text-text-tertiary">식사 기록이 없습니다</div>
                </div>
            </Card>
        );
    }

    const rankIcons = ['🥇', '🥈', '🥉'];
    const rankColors = [
        'bg-semantic-warning/20 border-semantic-warning/40',
        'bg-neutral-gray-100 border-neutral-gray-300',
        'bg-toss-blue-light/20 border-toss-blue-light/40',
    ];

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span>🏆</span> 가장 많이 먹은 메뉴 TOP3
                    </h2>
                    <button
                        onClick={() => router.push('/menu')}
                        className="text-sm text-toss-blue hover:underline"
                    >
                        전체 보기 →
                    </button>
                </div>

                <div className="space-y-3">
                    {top3Menus.map((menu, index) => (
                        <div
                            key={menu.name}
                            className={`p-4 rounded-lg border-2 ${rankColors[index]} transition-all hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl" aria-hidden="true">
                                        {rankIcons[index]}
                                    </span>
                                    <div>
                                        <div className="text-base font-bold text-text-primary">
                                            {menu.name}
                                        </div>
                                        <div className="text-xs text-text-tertiary mt-1">
                                            {index + 1}위
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-text-primary">
                                        {menu.count}
                                    </div>
                                    <div className="text-xs text-text-tertiary">회</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default MenuTop3Widget;

