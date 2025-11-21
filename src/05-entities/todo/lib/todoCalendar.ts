/**
 * Todo 캘린더 관련 유틸리티
 * 날짜별 Todo 그룹화 및 캘린더 데이터 생성
 */

import type { Todo } from '../model/types';

export interface CalendarDay {
    date: Date;
    todos: (Todo & { id: number })[];
    completedCount: number;
    totalCount: number;
    completionRate: number;
}

export interface CalendarMonth {
    year: number;
    month: number; // 0-11
    days: CalendarDay[];
}

/**
 * 날짜를 YYYY-MM-DD 형식의 키로 변환합니다
 */
const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 타임스탬프를 날짜 키로 변환합니다
 */
const timestampToDateKey = (timestamp: number): string => {
    return getDateKey(new Date(timestamp));
};

/**
 * 날짜 키를 Date 객체로 변환합니다
 */
const dateKeyToDate = (dateKey: string): Date => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
};

/**
 * Todo를 날짜별로 그룹화합니다
 * @param todos - Todo 목록
 * @returns 날짜 키를 키로 하는 Todo 맵
 */
export const groupTodosByDate = (
    todos: (Todo & { id: number })[]
): Map<string, (Todo & { id: number })[]> => {
    const map = new Map<string, (Todo & { id: number })[]>();

    todos.forEach((todo) => {
        // 마감일이 있으면 마감일 기준, 없으면 생성일 기준
        const dateKey = todo.dueDate
            ? timestampToDateKey(todo.dueDate)
            : timestampToDateKey(todo.createdAt);

        if (!map.has(dateKey)) {
            map.set(dateKey, []);
        }
        map.get(dateKey)!.push(todo);
    });

    return map;
};

/**
 * 특정 월의 캘린더 데이터를 생성합니다
 * @param todos - Todo 목록
 * @param year - 연도
 * @param month - 월 (0-11)
 * @returns 캘린더 월 데이터
 */
export const createCalendarMonth = (
    todos: (Todo & { id: number })[],
    year: number,
    month: number
): CalendarMonth => {
    const dateMap = groupTodosByDate(todos);

    // 해당 월의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 캘린더에 표시할 첫 날 (월요일부터 시작하도록)
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay(); // 0=일요일, 1=월요일, ...
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 월요일로 맞춤
    startDate.setDate(firstDay.getDate() + diff);

    // 캘린더에 표시할 마지막 날 (일요일로 끝나도록)
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const diffEnd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endDate.setDate(lastDay.getDate() + diffEnd);

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dateKey = getDateKey(currentDate);
        const dayTodos = dateMap.get(dateKey) || [];
        const completedCount = dayTodos.filter((todo) => todo.isDone).length;
        const totalCount = dayTodos.length;
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        days.push({
            date: new Date(currentDate),
            todos: dayTodos,
            completedCount,
            totalCount,
            completionRate,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        year,
        month,
        days,
    };
};

/**
 * 날짜가 오늘인지 확인합니다
 */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

/**
 * 날짜가 현재 월에 속하는지 확인합니다
 */
export const isCurrentMonth = (date: Date, year: number, month: number): boolean => {
    return date.getFullYear() === year && date.getMonth() === month;
};

