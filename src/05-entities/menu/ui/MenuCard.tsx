/**
 * MenuCard Component
 * 개별 메뉴 카드 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { Menu } from '../model/types';

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

const MenuCard: React.FC<MenuCardProps> = ({
    menu,
    highlighted = false,
    onClick,
    onDelete,
    className = '',
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm(`"${menu.name}" 메뉴를 삭제하시겠습니까?`)) {
            onDelete();
        }
    };

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
                    <h3 className="text-xl font-bold text-text-primary mb-2">{menu.name}</h3>
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

