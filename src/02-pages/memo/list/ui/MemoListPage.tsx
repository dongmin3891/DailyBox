/**
 * MemoListPage Component (Pages Layer)
 *
 * 메모 리스트 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { MemoListWidget } from '@/widgets/memo';

export interface MemoListPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * MemoListPage - 메모 리스트 페이지 컴포넌트
 *
 * @param props - MemoListPageProps
 * @returns JSX.Element
 */
export const MemoListPage: React.FC<MemoListPageProps> = ({ className = '' }) => {
    return (
        <div className={`memo-list-page ${className}`} role="main" aria-label="메모 리스트 페이지">
            <MemoListWidget />
        </div>
    );
};

export default MemoListPage;

