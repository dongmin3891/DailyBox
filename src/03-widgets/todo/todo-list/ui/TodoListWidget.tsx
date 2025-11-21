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
import { TodayGoalsWidget } from '@/widgets/todo/today-goals';
import { TodoCalendarWidget } from '@/widgets/todo/todo-calendar';
import type { TodoPriority, TodoCategory } from '@/entities/todo/model/types';
import { getDateGroup, getDateGroupLabel } from '@/shared/lib/utils/dateUtils';

type FilterType = 'all' | 'active' | 'completed';
type CategoryFilterType = 'all' | TodoCategory;
type SortType = 'newest' | 'oldest' | 'title' | 'priority' | 'dueDate';
type GroupByType = 'none' | 'date' | 'category';
type ViewType = 'list' | 'calendar';

export interface TodoListWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const TodoListWidget: React.FC<TodoListWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { todos, isLoading, loadTodos, deleteTodo, toggleTodo, clearCompleted } = useTodoSlice();
    const [viewType, setViewType] = useState<ViewType>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>('all');
    const [sort, setSort] = useState<SortType>('newest');
    const [groupBy, setGroupBy] = useState<GroupByType>('date');

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

        // 카테고리 필터
        if (categoryFilter !== 'all') {
            result = result.filter((todo) => todo.category === categoryFilter);
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
                case 'dueDate': {
                    // 마감일이 있는 것 우선, 그 다음 마감일 순서
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return a.dueDate - b.dueDate;
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [todos, searchQuery, filter, categoryFilter, sort]);

    // 그룹화된 투두 목록
    const groupedTodos = useMemo(() => {
        if (groupBy === 'none') {
            return { 전체: filteredAndSortedTodos };
        }

        if (groupBy === 'date') {
            const groups: Record<string, typeof filteredAndSortedTodos> = {
                오늘: [],
                내일: [],
                '이번 주': [],
                나중: [],
                '마감일 없음': [],
            };

            filteredAndSortedTodos.forEach((todo) => {
                if (todo.dueDate) {
                    const group = getDateGroup(todo.dueDate);
                    const label = getDateGroupLabel(group);
                    if (groups[label]) {
                        groups[label].push(todo);
                    }
                } else {
                    groups['마감일 없음'].push(todo);
                }
            });

            // 빈 그룹 제거
            return Object.fromEntries(Object.entries(groups).filter(([_, todos]) => todos.length > 0));
        }

        if (groupBy === 'category') {
            const groups: Record<string, typeof filteredAndSortedTodos> = {
                업무: [],
                집: [],
                개인: [],
            };

            filteredAndSortedTodos.forEach((todo) => {
                const categoryLabels: Record<TodoCategory, string> = {
                    work: '업무',
                    home: '집',
                    personal: '개인',
                };
                const label = categoryLabels[todo.category];
                if (groups[label]) {
                    groups[label].push(todo);
                }
            });

            return groups;
        }

        return { 전체: filteredAndSortedTodos };
    }, [filteredAndSortedTodos, groupBy]);

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
                    <div className="flex items-center gap-2">
                        {/* 뷰 전환 버튼 */}
                        <div className="flex gap-1 bg-neutral-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewType('list')}
                                className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                                    viewType === 'list'
                                        ? 'bg-white text-toss-blue shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                리스트
                            </button>
                            <button
                                onClick={() => setViewType('calendar')}
                                className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                                    viewType === 'calendar'
                                        ? 'bg-white text-toss-blue shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                캘린더
                            </button>
                        </div>
                        <Button onClick={handleNewTodo} variant="primary" size="md">
                            새 할 일
                        </Button>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 오늘의 3대 목표 (리스트 뷰에서만 표시) */}
                    {viewType === 'list' && <TodayGoalsWidget />}

                    {/* 캘린더 뷰 */}
                    {viewType === 'calendar' && <TodoCalendarWidget />}

                    {/* 리스트 뷰 */}
                    {viewType === 'list' && (
                        <>
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
                                        {/* 상태 필터 버튼 */}
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                상태 필터
                                            </label>
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

                                        {/* 카테고리 필터 버튼 */}
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                카테고리
                                            </label>
                                            <div className="flex gap-2">
                                                {(
                                                    [
                                                        { value: 'all', label: '전체' },
                                                        { value: 'work', label: '업무' },
                                                        { value: 'home', label: '집' },
                                                        { value: 'personal', label: '개인' },
                                                    ] as { value: CategoryFilterType; label: string }[]
                                                ).map((c) => (
                                                    <button
                                                        key={c.value}
                                                        onClick={() => setCategoryFilter(c.value)}
                                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                                            categoryFilter === c.value
                                                                ? 'bg-toss-blue text-white'
                                                                : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                                        }`}
                                                    >
                                                        {c.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 정렬 버튼 */}
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                정렬
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(
                                                    [
                                                        { value: 'newest', label: '최신순' },
                                                        { value: 'oldest', label: '오래된순' },
                                                        { value: 'title', label: '제목순' },
                                                        { value: 'priority', label: '우선순위순' },
                                                        { value: 'dueDate', label: '마감일순' },
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

                                        {/* 그룹화 옵션 */}
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                그룹화
                                            </label>
                                            <div className="flex gap-2">
                                                {(
                                                    [
                                                        { value: 'none', label: '없음' },
                                                        { value: 'date', label: '날짜별' },
                                                        { value: 'category', label: '카테고리별' },
                                                    ] as { value: GroupByType; label: string }[]
                                                ).map((g) => (
                                                    <button
                                                        key={g.value}
                                                        onClick={() => setGroupBy(g.value)}
                                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                                            groupBy === g.value
                                                                ? 'bg-toss-blue text-white'
                                                                : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                                        }`}
                                                    >
                                                        {g.label}
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
                            {groupBy === 'none' ? (
                                <Card padding="md" variant="default">
                                    <TodoList
                                        todos={filteredAndSortedTodos}
                                        onTodoClick={handleTodoClick}
                                        onTodoDelete={handleDeleteTodo}
                                        onTodoToggle={handleToggleTodo}
                                        isLoading={isLoading}
                                    />
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(groupedTodos).map(([groupName, groupTodos]) => (
                                        <Card key={groupName} padding="md" variant="default">
                                            <h3 className="text-lg font-semibold text-text-primary mb-3">
                                                {groupName}
                                            </h3>
                                            <TodoList
                                                todos={groupTodos}
                                                onTodoClick={handleTodoClick}
                                                onTodoDelete={handleDeleteTodo}
                                                onTodoToggle={handleToggleTodo}
                                                isLoading={false}
                                            />
                                        </Card>
                                    ))}
                                    {Object.keys(groupedTodos).length === 0 && !isLoading && (
                                        <Card padding="md" variant="default">
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                                                <p className="text-sm text-text-tertiary mt-1">
                                                    새 할 일을 추가해보세요
                                                </p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TodoListWidget;
