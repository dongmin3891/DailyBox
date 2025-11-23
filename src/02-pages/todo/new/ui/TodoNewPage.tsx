/**
 * TodoNewPage Component (Pages Layer)
 *
 * 새 투두 작성 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

'use client';

import React, { Suspense } from 'react';
import { TodoEditorWidget } from '@/widgets/todo';

export interface TodoNewPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * TodoNewPage - 새 투두 작성 페이지 컴포넌트
 *
 * @param props - TodoNewPageProps
 * @returns JSX.Element
 */
export const TodoNewPage: React.FC<TodoNewPageProps> = ({ className = '' }) => {
    return (
        <div className={`todo-new-page ${className}`} role="main" aria-label="새 할 일 작성 페이지">
            <Suspense fallback={<div>로딩 중...</div>}>
                <TodoEditorWidget />
            </Suspense>
        </div>
    );
};

export default TodoNewPage;

