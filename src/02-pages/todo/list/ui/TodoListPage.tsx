/**
 * TodoListPage Component (Pages Layer)
 *
 * 투두 리스트 페이지의 전체 구성을 담당하는 페이지 컴포넌트입니다.
 * FSD 아키텍처의 Pages Layer에 위치하며, widgets를 조합하여 완전한 페이지를 구성합니다.
 */

import React from 'react';
import { TodoListWidget } from '@/widgets/todo';

export interface TodoListPageProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * TodoListPage - 투두 리스트 페이지 컴포넌트
 *
 * @param props - TodoListPageProps
 * @returns JSX.Element
 */
export const TodoListPage: React.FC<TodoListPageProps> = ({ className = '' }) => {
    return (
        <div className={`todo-list-page ${className}`} role="main" aria-label="할 일 리스트 페이지">
            <TodoListWidget />
        </div>
    );
};

export default TodoListPage;

