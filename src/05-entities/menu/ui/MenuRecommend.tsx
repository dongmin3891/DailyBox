/**
 * MenuRecommend Component
 * 메뉴 추천 표시 컴포넌트
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui';
import { MenuCard } from './MenuCard';
import type { Menu } from '../model/types';

export interface MenuRecommendProps {
    /** 추천된 메뉴 */
    menu: Menu & { id: number } | null;
    /** 추천 중 여부 (애니메이션용) */
    isRecommending?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MenuRecommend: React.FC<MenuRecommendProps> = ({
    menu,
    isRecommending = false,
    className = '',
}) => {
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (menu) {
            setShowAnimation(true);
            const timer = setTimeout(() => setShowAnimation(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [menu]);

    if (!menu) {
        return (
            <Card padding="xl" variant="default" className={`text-center ${className}`}>
                <div className="flex flex-col items-center justify-center py-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-text-tertiary mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <p className="text-text-secondary text-lg mb-2">추천 버튼을 눌러보세요!</p>
                    <p className="text-text-tertiary">오늘 먹을 메뉴를 추천해드립니다</p>
                </div>
            </Card>
        );
    }

    return (
        <div className={`${className} ${showAnimation ? 'animate-in zoom-in-95 duration-500' : ''}`}>
            <Card padding="xl" variant="elevated" className="bg-gradient-to-br from-toss-blue/10 to-toss-blue-light/20">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-toss-blue rounded-full mb-4 animate-bounce">
                        <span className="text-3xl">🍽️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">오늘의 추천 메뉴</h2>
                    <p className="text-text-secondary">이 메뉴는 어떠세요?</p>
                </div>
                <MenuCard menu={menu} highlighted />
            </Card>
        </div>
    );
};

export { MenuRecommend };
export default MenuRecommend;

