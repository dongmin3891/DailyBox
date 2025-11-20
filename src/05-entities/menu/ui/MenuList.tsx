/**
 * MenuList Component
 * 메뉴 목록 컴포넌트
 */

'use client';

import React from 'react';
import { MenuCard } from './MenuCard';
import type { Menu } from '../model/types';

export interface MenuListProps {
    /** 메뉴 목록 */
    menus: (Menu & { id: number })[];
    /** 강조할 메뉴 ID */
    highlightedId?: number | null;
    /** 메뉴 클릭 핸들러 */
    onMenuClick?: (id: number) => void;
    /** 메뉴 삭제 핸들러 */
    onMenuDelete?: (id: number) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MenuList: React.FC<MenuListProps> = ({
    menus,
    highlightedId,
    onMenuClick,
    onMenuDelete,
    isLoading = false,
    className = '',
}) => {
    if (isLoading) {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <div className="text-text-tertiary">로딩 중...</div>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                <p className="text-text-tertiary">메뉴가 없습니다</p>
                <p className="text-sm text-text-tertiary mt-1">새 메뉴를 추가해보세요</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {menus.map((menu) => (
                <MenuCard
                    key={menu.id}
                    menu={menu}
                    highlighted={highlightedId === menu.id}
                    onClick={() => onMenuClick?.(menu.id)}
                    onDelete={() => onMenuDelete?.(menu.id)}
                />
            ))}
        </div>
    );
};

export { MenuList };
export default MenuList;


