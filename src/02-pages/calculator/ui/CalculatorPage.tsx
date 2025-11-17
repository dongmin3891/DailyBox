/**
 * CalculatorPage Component (Pages Layer)
 *
 * 계산기 페이지의 전체 구성과 레이아웃을 담당하는 최상위 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 *
 * @description
 * - CalculatorLayoutWidget을 통해 계산기 UI와 기능을 제공
 * - 키보드 단축키 지원 (Ctrl+H: 기록 토글, ESC: 기록 닫기)
 * - 반응형 디자인으로 모바일과 데스크톱 모두 지원
 * - Toss 디자인 시스템 색상과 컴포넌트 사용
 *
 * @example
 * ```tsx
 * // app/calculator/page.tsx에서 사용
 * import { CalculatorPage } from '@/pages/calculator';
 *
 * export default function CalculatorRoute() {
 *   return <CalculatorPage />;
 * }
 * ```
 *
 * @see {@link CalculatorLayoutWidget} - 실제 계산기 레이아웃 위젯
 * @see {@link CalculatorHeaderWidget} - 계산기 헤더 위젯
 * @see {@link Calculator} - 계산기 엔티티 컴포넌트
 */

import React from 'react';
import { CalculatorLayoutWidget } from '@/widgets/calculator';

export interface CalculatorPageProps {
    /** 추가 클래스명 */
    className?: string;
    /** 페이지 제목 (기본값: "계산기") */
    title?: string;
    /** 초기 기록 표시 상태 (기본값: false) */
    initialShowHistory?: boolean;
}

/**
 * CalculatorPage - 계산기 페이지 컴포넌트
 *
 * @param props - CalculatorPageProps
 * @returns JSX.Element
 */
export const CalculatorPage: React.FC<CalculatorPageProps> = ({
    className = '',
    title = '계산기',
    initialShowHistory = false,
}) => {
    return (
        <div className={`calculator-page ${className}`} role="main" aria-label={`${title} 페이지`}>
            <CalculatorLayoutWidget initialShowHistory={initialShowHistory} />
        </div>
    );
};

export default CalculatorPage;
