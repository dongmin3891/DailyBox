/**
 * TodoDetailPage Component (Pages Layer)
 *
 * 투두 상세/수정 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { TodoEditorWidget } from '@/widgets/todo';

export interface TodoDetailPageProps {
    /** 투두 ID */
    todoId: number;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * TodoDetailPage - 투두 상세/수정 페이지 컴포넌트
 *
 * @param props - TodoDetailPageProps
 * @returns JSX.Element
 */
export const TodoDetailPage: React.FC<TodoDetailPageProps> = ({ todoId, className = '' }) => {
    return (
        <div className={`todo-detail-page ${className}`} role="main" aria-label="할 일 상세 페이지">
            <TodoEditorWidget todoId={todoId} />
        </div>
    );
};

export default TodoDetailPage;

