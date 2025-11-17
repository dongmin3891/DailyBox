/**
 * TimerPage Component (Pages Layer)
 *
 * 타이머 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { TimerPageWidget } from '@/widgets/timer';

export interface TimerPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * TimerPage - 타이머 페이지 컴포넌트
 *
 * @param props - TimerPageProps
 * @returns JSX.Element
 */
export const TimerPage: React.FC<TimerPageProps> = ({ className = '' }) => {
    return (
        <div className={`timer-page ${className}`} role="main" aria-label="타이머 페이지">
            <TimerPageWidget />
        </div>
    );
};

export default TimerPage;

