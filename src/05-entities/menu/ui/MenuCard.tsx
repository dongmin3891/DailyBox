/**
 * MenuCard Component
 * 개별 메뉴 카드 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { Menu, MenuCategory, TimeOfDay } from '../model/types';

export interface MenuCardProps {
    /** 메뉴 데이터 */
    menu: Menu & { id: number };
    /** 강조 표시 여부 (추천된 메뉴) */
    highlighted?: boolean;
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 삭제 핸들러 */
    onDelete?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const categoryLabels: Record<MenuCategory, { label: string; icon: string }> = {
    korean: { label: '한식', icon: '🍚' },
    chinese: { label: '중식', icon: '🥢' },
    japanese: { label: '일식', icon: '🍣' },
    western: { label: '양식', icon: '🍝' },
    snack: { label: '분식', icon: '🍢' },
    other: { label: '기타', icon: '🍽️' },
};

const timeOfDayLabels: Record<TimeOfDay, { label: string; icon: string }> = {
    breakfast: { label: '아침', icon: '🌅' },
    lunch: { label: '점심', icon: '☀️' },
    dinner: { label: '저녁', icon: '🌙' },
    snack: { label: '야식', icon: '🌙' },
};

const MenuCard: React.FC<MenuCardProps> = ({ menu, highlighted = false, onClick, onDelete, className = '' }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm(`"${menu.name}" 메뉴를 삭제하시겠습니까?`)) {
            onDelete();
        }
    };

    const categoryInfo = menu.category ? categoryLabels[menu.category] : null;

    return (
        <Card
            className={`${className} ${highlighted ? 'ring-2 ring-toss-blue shadow-lg' : ''}`}
            padding="md"
            variant={highlighted ? 'elevated' : 'default'}
            clickable={!!onClick}
            onClick={onClick}
            hoverable
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text-primary">{menu.name}</h3>
                        {categoryInfo && (
                            <span className="text-sm text-text-secondary flex items-center gap-1">
                                <span>{categoryInfo.icon}</span>
                                <span>{categoryInfo.label}</span>
                            </span>
                        )}
                    </div>
                    {menu.timeOfDay && menu.timeOfDay.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {menu.timeOfDay.map((time, index) => {
                                const timeInfo = timeOfDayLabels[time];
                                return (
                                    <span key={index} className="text-xs text-text-tertiary flex items-center gap-1">
                                        <span>{timeInfo.icon}</span>
                                        <span>{timeInfo.label}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {menu.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {menu.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-toss-blue-light/30 text-toss-blue rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {onDelete && (
                    <IconButton
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        }
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        aria-label="메뉴 삭제"
                    />
                )}
            </div>
        </Card>
    );
};

export { MenuCard };
export default MenuCard;
