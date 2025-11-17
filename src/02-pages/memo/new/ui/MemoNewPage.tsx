/**
 * MemoNewPage Component (Pages Layer)
 *
 * 새 메모 작성 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { MemoEditorWidget } from '@/widgets/memo';

export interface MemoNewPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * MemoNewPage - 새 메모 작성 페이지 컴포넌트
 *
 * @param props - MemoNewPageProps
 * @returns JSX.Element
 */
export const MemoNewPage: React.FC<MemoNewPageProps> = ({ className = '' }) => {
    return (
        <div className={`memo-new-page ${className}`} role="main" aria-label="새 메모 작성 페이지">
            <MemoEditorWidget />
        </div>
    );
};

export default MemoNewPage;

