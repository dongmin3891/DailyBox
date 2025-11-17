/**
 * TodoList Component
 * 투두 목록을 표시하는 컴포넌트
 */

'use client';

import React from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../model/types';

export interface TodoListProps {
    /** 투두 목록 */
    todos: (Todo & { id: number })[];
    /** 투두 클릭 핸들러 */
    onTodoClick?: (id: number) => void;
    /** 투두 삭제 핸들러 */
    onTodoDelete?: (id: number) => void;
    /** 투두 완료 토글 핸들러 */
    onTodoToggle?: (id: number) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
    onTodoClick,
    onTodoDelete,
    onTodoToggle,
    isLoading = false,
    className = '',
}) => {
    if (isLoading) {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <div className="text-text-tertiary">로딩 중...</div>
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-text-tertiary mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
                <p className="text-text-tertiary">할 일이 없습니다</p>
                <p className="text-sm text-text-tertiary mt-1">새 할 일을 추가해보세요</p>
            </div>
        );
    }

    // 완료되지 않은 할 일과 완료된 할 일 분리
    const activeTodos = todos.filter((todo) => !todo.isDone);
    const completedTodos = todos.filter((todo) => todo.isDone);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 완료되지 않은 할 일 */}
            {activeTodos.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary mb-3">진행 중 ({activeTodos.length})</h3>
                    <div className="space-y-2">
                        {activeTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onClick={() => onTodoClick?.(todo.id)}
                                onDelete={() => onTodoDelete?.(todo.id)}
                                onToggle={() => onTodoToggle?.(todo.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 완료된 할 일 */}
            {completedTodos.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary mb-3">
                        완료됨 ({completedTodos.length})
                    </h3>
                    <div className="space-y-2">
                        {completedTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onClick={() => onTodoClick?.(todo.id)}
                                onDelete={() => onTodoDelete?.(todo.id)}
                                onToggle={() => onTodoToggle?.(todo.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { TodoList };
export default TodoList;

