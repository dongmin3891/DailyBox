/**
 * TodoListWidget Component
 * 투두 리스트만 표시하는 위젯
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTodoSlice } from '@/features/todo';
import { TodoList } from '@/entities/todo';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import { Input } from '@/shared/ui';
import type { TodoPriority } from '@/entities/todo/model/types';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'newest' | 'oldest' | 'title' | 'priority';

export interface TodoListWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const TodoListWidget: React.FC<TodoListWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { todos, isLoading, loadTodos, deleteTodo, toggleTodo, clearCompleted } = useTodoSlice();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sort, setSort] = useState<SortType>('newest');

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    // 필터링 및 정렬된 투두 목록
    const filteredAndSortedTodos = useMemo(() => {
        let result = [...todos];

        // 검색 필터
        if (searchQuery.trim()) {
            result = result.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // 상태 필터
        if (filter === 'active') {
            result = result.filter((todo) => !todo.isDone);
        } else if (filter === 'completed') {
            result = result.filter((todo) => todo.isDone);
        }

        // 정렬
        result.sort((a, b) => {
            switch (sort) {
                case 'newest':
                    return b.updatedAt - a.updatedAt;
                case 'oldest':
                    return a.updatedAt - b.updatedAt;
                case 'title':
                    return a.title.localeCompare(b.title, 'ko');
                case 'priority': {
                    const priorityOrder: Record<TodoPriority, number> = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [todos, searchQuery, filter, sort]);

    const handleTodoClick = (id: number) => {
        router.push(`/todo/${id}`);
    };

    const handleNewTodo = () => {
        router.push('/todo/new');
    };

    const handleDeleteTodo = async (id: number) => {
        await deleteTodo(id);
    };

    const handleToggleTodo = async (id: number) => {
        await toggleTodo(id);
    };

    const handleClearCompleted = async () => {
        if (confirm('완료된 모든 할 일을 삭제하시겠습니까?')) {
            await clearCompleted();
        }
    };

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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.push('/')}
                            aria-label="홈으로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">할 일</h1>
                    </div>
                    <Button onClick={handleNewTodo} variant="primary" size="md">
                        새 할 일
                    </Button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 검색 및 필터/정렬 */}
                    <Card padding="md" variant="default">
                        <div className="space-y-4">
                            {/* 검색 */}
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="할 일 검색..."
                                prefix={
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                }
                            />

                            {/* 필터 및 정렬 */}
                            <div className="space-y-3">
                                {/* 필터 버튼 */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">필터</label>
                                    <div className="flex gap-2">
                                        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                                    filter === f
                                                        ? 'bg-toss-blue text-white'
                                                        : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                                }`}
                                            >
                                                {f === 'all' ? '전체' : f === 'active' ? '진행중' : '완료'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 정렬 버튼 */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">정렬</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(
                                            [
                                                { value: 'newest', label: '최신순' },
                                                { value: 'oldest', label: '오래된순' },
                                                { value: 'title', label: '제목순' },
                                                { value: 'priority', label: '우선순위순' },
                                            ] as { value: SortType; label: string }[]
                                        ).map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => setSort(s.value)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                                    sort === s.value
                                                        ? 'bg-toss-blue text-white'
                                                        : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 완료된 항목 일괄 삭제 */}
                            {todos.some((todo) => todo.isDone) && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClearCompleted}
                                        className="px-3 py-1.5 text-sm font-medium text-semantic-error hover:bg-semantic-error/10 rounded-lg transition-all"
                                    >
                                        완료된 항목 모두 삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 투두 리스트 */}
                    <Card padding="md" variant="default">
                        <TodoList
                            todos={filteredAndSortedTodos}
                            onTodoClick={handleTodoClick}
                            onTodoDelete={handleDeleteTodo}
                            onTodoToggle={handleToggleTodo}
                            isLoading={isLoading}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default TodoListWidget;
