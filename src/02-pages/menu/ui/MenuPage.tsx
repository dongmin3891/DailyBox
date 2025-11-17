/**
 * MenuPage Component (Pages Layer)
 *
 * 메뉴추천 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { MenuPageWidget } from '@/widgets/menu';

export interface MenuPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * MenuPage - 메뉴추천 페이지 컴포넌트
 *
 * @param props - MenuPageProps
 * @returns JSX.Element
 */
export const MenuPage: React.FC<MenuPageProps> = ({ className = '' }) => {
    return (
        <div className={`menu-page ${className}`} role="main" aria-label="메뉴추천 페이지">
            <MenuPageWidget className={className} />
        </div>
    );
};

export default MenuPage;
