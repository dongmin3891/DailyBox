/**
 * SummaryPage Component (Pages Layer)
 *
 * 요약 대시보드 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { SummaryDashboardWidget } from '@/widgets/summary';

export interface SummaryPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * SummaryPage - 요약 대시보드 페이지 컴포넌트
 *
 * @param props - SummaryPageProps
 * @returns JSX.Element
 */
export const SummaryPage: React.FC<SummaryPageProps> = ({ className = '' }) => {
    return (
        <div className={`summary-page ${className}`} role="main" aria-label="요약 대시보드 페이지">
            <SummaryDashboardWidget />
        </div>
    );
};

export default SummaryPage;

