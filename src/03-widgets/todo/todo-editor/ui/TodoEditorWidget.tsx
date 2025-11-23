/**
 * TodoEditorWidget Component
 * 투두 작성/수정을 위한 위젯
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTodoSlice } from '@/features/todo';
import { TodoEditor } from '@/entities/todo';
import { IconButton } from '@/shared/ui';
import type { TodoPriority, TodoCategory, TodoRepeat } from '@/entities/todo/model/types';

export interface TodoEditorWidgetProps {
    /** 편집할 투두 ID (없으면 새 투두) */
    todoId?: number;
    /** 추가 클래스명 */
    className?: string;
}

const TodoEditorWidget: React.FC<TodoEditorWidgetProps> = ({ todoId, className = '' }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { todos, loadTodos, addTodo, updateTodo } = useTodoSlice();
    const todo = todoId ? todos.find((t) => t.id === todoId) : undefined;
    
    // URL 쿼리 파라미터에서 마감일 읽기
    const dueDateFromUrl = searchParams ? searchParams.get('dueDate') : null;
    const [initialDueDate, setInitialDueDate] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    useEffect(() => {
        // URL에서 마감일이 있고, 기존 todo가 없으면 (새 할 일인 경우) 마감일 설정
        if (dueDateFromUrl && !todoId) {
            setInitialDueDate(dueDateFromUrl);
        }
    }, [dueDateFromUrl, todoId]);

    const handleSave = async (todoData: {
        title: string;
        priority: TodoPriority;
        category: TodoCategory;
        dueDate?: number;
        repeat: TodoRepeat;
    }) => {
        if (todoId) {
            // 수정
            await updateTodo(todoId, todoData);
        } else {
            // 새 투두 추가
            await addTodo({ ...todoData, isDone: false });
        }
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    // ESC 키로 취소
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={handleCancel}
                            aria-label="뒤로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">{todoId ? '할 일 수정' : '새 할 일'}</h1>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto">
                    <TodoEditor 
                        todo={todo} 
                        initialDueDate={initialDueDate}
                        onSave={handleSave} 
                        onCancel={handleCancel} 
                    />
                </div>
            </main>
        </div>
    );
};

export default TodoEditorWidget;

