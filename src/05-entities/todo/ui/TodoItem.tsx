/**
 * TodoItem Component
 * 개별 투두 아이템을 표시하는 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { Todo, TodoPriority } from '../model/types';
import { formatDate } from '@/shared/lib/utils/dateUtils';

const priorityColors: Record<TodoPriority, string> = {
    high: 'bg-semantic-error/20 border-semantic-error/50 text-semantic-error',
    medium: 'bg-semantic-warning/20 border-semantic-warning/50 text-semantic-warning',
    low: 'bg-toss-blue/20 border-toss-blue/50 text-toss-blue',
};

const priorityLabels: Record<TodoPriority, string> = {
    high: '높음',
    medium: '중간',
    low: '낮음',
};

export interface TodoItemProps {
    /** 투두 데이터 */
    todo: Todo & { id: number };
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 삭제 핸들러 */
    onDelete?: () => void;
    /** 완료 토글 핸들러 */
    onToggle?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onClick, onDelete, onToggle, className = '' }) => {
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle?.();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm('이 할 일을 삭제하시겠습니까?')) {
            onDelete();
        }
    };

    return (
        <Card
            className={`${className} ${todo.isDone ? 'opacity-60' : ''}`}
            padding="md"
            variant={todo.isDone ? 'outlined' : 'default'}
            clickable={!!onClick}
            onClick={onClick}
            hoverable
        >
            <div className="flex items-start gap-3">
                {/* 체크박스 */}
                <button
                    onClick={handleToggle}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.isDone
                            ? 'bg-semantic-success border-semantic-success'
                            : 'border-neutral-gray-300 hover:border-semantic-success'
                    }`}
                    aria-label={todo.isDone ? '완료 취소' : '완료 표시'}
                >
                    {todo.isDone && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className={`text-base font-medium ${
                                todo.isDone ? 'text-text-tertiary line-through' : 'text-text-primary'
                            }`}
                        >
                            {todo.title}
                        </h3>
                        <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[todo.priority]}`}
                        >
                            {priorityLabels[todo.priority]}
                        </span>
                    </div>
                    <p className="text-xs text-text-tertiary">{formatDate(todo.updatedAt)}</p>
                </div>

                {/* 삭제 버튼 */}
                {onDelete && (
                    <IconButton
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        }
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        aria-label="할 일 삭제"
                    />
                )}
            </div>
        </Card>
    );
};

export { TodoItem };
export default TodoItem;

