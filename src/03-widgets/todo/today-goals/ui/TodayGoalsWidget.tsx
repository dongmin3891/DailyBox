/**
 * TodayGoalsWidget Component
 * 오늘의 3대 목표를 추천하고 표시하는 위젯
 */

'use client';

import React, { useMemo } from 'react';
import { useTodoSlice } from '@/features/todo';
import { getTopPriorityTodos } from '@/entities/todo/lib/todoScore';
import { Card } from '@/shared/ui';
import type { TodoPriority } from '@/entities/todo/model/types';

export interface TodayGoalsWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

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

const TodayGoalsWidget: React.FC<TodayGoalsWidgetProps> = ({ className = '' }) => {
    const { todos, toggleTodo } = useTodoSlice();

    // 오늘의 3대 목표 추천
    const topGoals = useMemo(() => {
        return getTopPriorityTodos(todos, 3);
    }, [todos]);

    const handleToggle = async (id: number) => {
        await toggleTodo(id);
    };

    if (topGoals.length === 0) {
        return null;
    }

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-text-primary">오늘의 3대 목표</h2>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-toss-blue/20 text-toss-blue">
                        추천
                    </span>
                </div>

                <div className="space-y-2">
                    {topGoals.map((goal, index) => (
                        <div
                            key={goal.todo.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary border border-neutral-gray-200 hover:border-toss-blue/50 transition-all"
                        >
                            {/* 순위 배지 */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-toss-blue text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>

                            {/* 체크박스 */}
                            <button
                                onClick={() => handleToggle(goal.todo.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    goal.todo.isDone
                                        ? 'bg-semantic-success border-semantic-success'
                                        : 'border-neutral-gray-300 hover:border-semantic-success'
                                }`}
                                aria-label={goal.todo.isDone ? '완료 취소' : '완료 표시'}
                            >
                                {goal.todo.isDone && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>

                            {/* 내용 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3
                                        className={`text-base font-medium ${
                                            goal.todo.isDone
                                                ? 'text-text-tertiary line-through'
                                                : 'text-text-primary'
                                        }`}
                                    >
                                        {goal.todo.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[goal.todo.priority]}`}
                                    >
                                        {priorityLabels[goal.todo.priority]}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {goal.reasons.slice(0, 2).map((reason, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs text-text-secondary bg-neutral-gray-100 px-2 py-0.5 rounded"
                                        >
                                            {reason}
                                        </span>
                                    ))}
                                    {goal.reasons.length > 2 && (
                                        <span className="text-xs text-text-tertiary">+{goal.reasons.length - 2}</span>
                                    )}
                                </div>
                            </div>

                            {/* 점수 표시 */}
                            <div className="flex-shrink-0 text-right">
                                <div className="text-xs text-text-tertiary mb-0.5">점수</div>
                                <div className="text-sm font-bold text-toss-blue">{goal.score}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default TodayGoalsWidget;

