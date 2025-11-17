/**
 * MemoDetailPage Component (Pages Layer)
 *
 * 메모 상세/수정 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { MemoEditorWidget } from '@/widgets/memo';

export interface MemoDetailPageProps {
    /** 메모 ID */
    memoId: number;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * MemoDetailPage - 메모 상세/수정 페이지 컴포넌트
 *
 * @param props - MemoDetailPageProps
 * @returns JSX.Element
 */
export const MemoDetailPage: React.FC<MemoDetailPageProps> = ({ memoId, className = '' }) => {
    return (
        <div className={`memo-detail-page ${className}`} role="main" aria-label="메모 상세 페이지">
            <MemoEditorWidget memoId={memoId} />
        </div>
    );
};

export default MemoDetailPage;

