/**
 * HomePage Component (Pages Layer)
 * 홈페이지의 전체 구성과 레이아웃을 담당하는 페이지 컴포넌트
 *
 * FSD Layer: Pages
 * Purpose: entities, features, widgets를 조합하여 완전한 페이지 생성
 */

import React from 'react';
import { HomeLayoutWidget } from '@/widgets/home';

export interface HomePageProps {
    /** 사용자 이름 (선택적) */
    userName?: string;
    /** 추가 클래스명 */
    className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ userName, className }) => {
    return <HomeLayoutWidget userName={userName} className={className} />;
};

export default HomePage;
