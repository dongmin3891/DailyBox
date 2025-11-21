/**
 * TodoCalendarWidget Component
 * 캘린더 뷰로 Todo를 표시하는 위젯
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTodoSlice } from '@/features/todo';
import { createCalendarMonth, isToday, isCurrentMonth } from '@/entities/todo/lib/todoCalendar';
import { TodoList } from '@/entities/todo';
import { Card } from '@/shared/ui';
import { Button } from '@/shared/ui';

export interface TodoCalendarWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

const TodoCalendarWidget: React.FC<TodoCalendarWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { todos, loadTodos, deleteTodo, toggleTodo } = useTodoSlice();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarMonth = useMemo(() => {
        return createCalendarMonth(todos, year, month);
    }, [todos, year, month]);

    // 선택된 날짜의 Todo 목록
    const selectedDateTodos = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        return calendarMonth.days.find((day) => {
            const dayKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
            return dayKey === dateKey;
        })?.todos || [];
    }, [selectedDate, calendarMonth]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(null);
    };

    const handleDateClick = (date: Date) => {
        if (isCurrentMonth(date, year, month)) {
            setSelectedDate(date);
        }
    };

    const handleAddTodoForDate = (date: Date) => {
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        router.push(`/todo/new?dueDate=${dateStr}`);
    };

    const monthLabel = `${year}년 ${month + 1}월`;

    return (
        <div className={`space-y-4 ${className}`}>
            <Card padding="md" variant="default">
                <div className="space-y-4">
                    {/* 캘린더 헤더 */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 rounded-lg hover:bg-neutral-gray-100 transition-colors"
                            aria-label="이전 달"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-text-primary">{monthLabel}</h2>
                            <button
                                onClick={handleToday}
                                className="px-3 py-1 text-sm font-medium text-toss-blue hover:bg-toss-blue/10 rounded-lg transition-colors"
                            >
                                오늘
                            </button>
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg hover:bg-neutral-gray-100 transition-colors"
                            aria-label="다음 달"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 gap-1">
                        {dayLabels.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 캘린더 그리드 */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarMonth.days.map((day, index) => {
                            const isCurrentMonthDay = isCurrentMonth(day.date, year, month);
                            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                            const isTodayDate = isToday(day.date);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(day.date)}
                                    className={`p-2 rounded-lg transition-all min-h-[60px] flex flex-col items-center justify-start ${
                                        isCurrentMonthDay
                                            ? isSelected
                                                ? 'bg-toss-blue text-white'
                                                : isTodayDate
                                                  ? 'bg-toss-blue/10 border-2 border-toss-blue'
                                                  : 'hover:bg-neutral-gray-100'
                                            : 'opacity-30'
                                    }`}
                                >
                                    <span
                                        className={`text-sm font-medium mb-1 ${
                                            isSelected ? 'text-white' : isCurrentMonthDay ? 'text-text-primary' : 'text-text-tertiary'
                                        }`}
                                    >
                                        {day.date.getDate()}
                                    </span>
                                    {day.totalCount > 0 && (
                                        <div className="flex items-center gap-1 flex-wrap justify-center">
                                            {/* 완료 비율에 따른 점 표시 */}
                                            {day.completionRate === 100 ? (
                                                <div className="w-2 h-2 rounded-full bg-semantic-success" />
                                            ) : day.completionRate > 0 ? (
                                                <div className="w-2 h-2 rounded-full bg-semantic-warning" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-neutral-gray-400" />
                                            )}
                                            {/* Todo 개수 */}
                                            <span
                                                className={`text-xs ${
                                                    isSelected ? 'text-white' : isCurrentMonthDay ? 'text-text-secondary' : 'text-text-tertiary'
                                                }`}
                                            >
                                                {day.totalCount}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* 선택된 날짜의 Todo 리스트 */}
            {selectedDate && (
                <Card padding="md" variant="default">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-text-primary">
                                {selectedDate.toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'long',
                                })}
                            </h3>
                            <Button
                                onClick={() => handleAddTodoForDate(selectedDate)}
                                variant="primary"
                                size="sm"
                            >
                                이 날짜에 할 일 추가
                            </Button>
                        </div>
                        {selectedDateTodos.length > 0 ? (
                            <TodoList
                                todos={selectedDateTodos}
                                onTodoClick={(id) => {
                                    router.push(`/todo/${id}`);
                                }}
                                onTodoDelete={async (id) => {
                                    await deleteTodo(id);
                                }}
                                onTodoToggle={async (id) => {
                                    await toggleTodo(id);
                                }}
                            />
                        ) : (
                            <div className="text-center py-8 text-text-tertiary">
                                <p>이 날짜에는 할 일이 없습니다</p>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TodoCalendarWidget;

