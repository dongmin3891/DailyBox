/**
 * 투두 달성률 통계 계산 유틸리티
 * 오늘, 주간, 월간 달성률을 계산합니다.
 */

import { getTodayStart, getTodayEnd } from '@/shared/lib/utils/dateUtils';
import type { Todo } from '@/entities/todo/model/types';

export interface CompletionStats {
    /** 완료된 투두 개수 */
    completed: number;
    /** 전체 투두 개수 */
    total: number;
    /** 달성률 (0-100) */
    completionRate: number;
}

export interface TodoCompletionDashboard {
    /** 오늘 달성률 */
    today: CompletionStats;
    /** 이번 주 달성률 */
    week: CompletionStats;
    /** 이번 달 달성률 */
    month: CompletionStats;
}

/**
 * 이번 주의 시작일(월요일)과 종료일(일요일)을 계산합니다
 */
const getThisWeekRange = (): { start: number; end: number } => {
    const now = new Date();
    const day = now.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const diff = day === 0 ? -6 : 1 - day; // 월요일로 맞춤

    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
        start: monday.getTime(),
        end: sunday.getTime(),
    };
};

/**
 * 이번 달의 시작일과 종료일을 계산합니다
 */
const getThisMonthRange = (): { start: number; end: number } => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return {
        start: start.getTime(),
        end: end.getTime(),
    };
};

/**
 * 날짜 범위 내의 투두 달성률 계산
 */
const calculateCompletionInRange = (
    todos: (Todo & { id: number })[],
    start: number,
    end: number
): CompletionStats => {
    // 범위 내에 생성되거나 업데이트된 투두 필터링
    const rangeTodos = todos.filter(
        (todo) =>
            (todo.createdAt >= start && todo.createdAt <= end) ||
            (todo.updatedAt >= start && todo.updatedAt <= end)
    );

    // 범위 내에 완료된 투두 필터링
    const completedTodos = rangeTodos.filter(
        (todo) => todo.isDone && todo.updatedAt >= start && todo.updatedAt <= end
    );

    const total = rangeTodos.length;
    const completed = completedTodos.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        completed,
        total,
        completionRate,
    };
};

/**
 * 오늘 날짜 기준 투두 달성률 계산
 */
export const calculateTodayCompletion = (
    todos: (Todo & { id: number })[]
): CompletionStats => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    return calculateCompletionInRange(todos, todayStart, todayEnd);
};

/**
 * 이번 주 기준 투두 달성률 계산
 */
export const calculateWeekCompletion = (
    todos: (Todo & { id: number })[]
): CompletionStats => {
    const { start, end } = getThisWeekRange();
    return calculateCompletionInRange(todos, start, end);
};

/**
 * 이번 달 기준 투두 달성률 계산
 */
export const calculateMonthCompletion = (
    todos: (Todo & { id: number })[]
): CompletionStats => {
    const { start, end } = getThisMonthRange();
    return calculateCompletionInRange(todos, start, end);
};

/**
 * 투두 달성률 대시보드 데이터 계산
 */
export const calculateTodoCompletionDashboard = (
    todos: (Todo & { id: number })[]
): TodoCompletionDashboard => {
    return {
        today: calculateTodayCompletion(todos),
        week: calculateWeekCompletion(todos),
        month: calculateMonthCompletion(todos),
    };
};

