/**
 * 투두 기간별 통계 계산 유틸리티
 * 주간/월간 통계를 계산합니다.
 */

import { getTodayStart, getTodayEnd } from '@/shared/lib/utils/dateUtils';
import type { Todo } from '@/entities/todo/model/types';

export interface PeriodStats {
    /** 완료된 투두 개수 */
    completed: number;
    /** 전체 투두 개수 */
    total: number;
    /** 달성률 (0-100) */
    completionRate: number;
    /** 요일별 완료 수 (주간만) */
    dailyCompletions?: number[];
    /** 카테고리별 통계 */
    categoryStats: Record<'work' | 'home' | 'personal', { completed: number; total: number }>;
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
 * 타임스탬프가 속한 요일을 반환합니다 (0=월요일, 6=일요일)
 */
const getDayOfWeek = (timestamp: number): number => {
    const date = new Date(timestamp);
    const day = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    return day === 0 ? 6 : day - 1; // 월요일을 0으로 변환
};

/**
 * 주간 통계 계산
 */
export const calculateWeekPeriodStats = (
    todos: (Todo & { id: number })[]
): PeriodStats => {
    const { start, end } = getThisWeekRange();

    // 이번 주에 생성되거나 업데이트된 Todo 필터링
    const weekTodos = todos.filter(
        (todo) =>
            (todo.createdAt >= start && todo.createdAt <= end) ||
            (todo.updatedAt >= start && todo.updatedAt <= end)
    );

    // 완료된 Todo 필터링
    const completedTodos = weekTodos.filter(
        (todo) => todo.isDone && todo.updatedAt >= start && todo.updatedAt <= end
    );

    // 카테고리별 통계
    const categoryStats: Record<'work' | 'home' | 'personal', { completed: number; total: number }> =
        {
            work: { completed: 0, total: 0 },
            home: { completed: 0, total: 0 },
            personal: { completed: 0, total: 0 },
        };

    weekTodos.forEach((todo) => {
        categoryStats[todo.category].total++;
        if (todo.isDone && todo.updatedAt >= start && todo.updatedAt <= end) {
            categoryStats[todo.category].completed++;
        }
    });

    // 요일별 완료 수 (월요일=0, 일요일=6)
    const dailyCompletions = new Array(7).fill(0);
    completedTodos.forEach((todo) => {
        const dayOfWeek = getDayOfWeek(todo.updatedAt);
        dailyCompletions[dayOfWeek]++;
    });

    const total = weekTodos.length;
    const completed = completedTodos.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        completed,
        total,
        completionRate,
        dailyCompletions,
        categoryStats,
    };
};

/**
 * 월간 통계 계산
 */
export const calculateMonthPeriodStats = (
    todos: (Todo & { id: number })[]
): PeriodStats => {
    const { start, end } = getThisMonthRange();

    // 이번 달에 생성되거나 업데이트된 Todo 필터링
    const monthTodos = todos.filter(
        (todo) =>
            (todo.createdAt >= start && todo.createdAt <= end) ||
            (todo.updatedAt >= start && todo.updatedAt <= end)
    );

    // 완료된 Todo 필터링
    const completedTodos = monthTodos.filter(
        (todo) => todo.isDone && todo.updatedAt >= start && todo.updatedAt <= end
    );

    // 카테고리별 통계
    const categoryStats: Record<'work' | 'home' | 'personal', { completed: number; total: number }> =
        {
            work: { completed: 0, total: 0 },
            home: { completed: 0, total: 0 },
            personal: { completed: 0, total: 0 },
        };

    monthTodos.forEach((todo) => {
        categoryStats[todo.category].total++;
        if (todo.isDone && todo.updatedAt >= start && todo.updatedAt <= end) {
            categoryStats[todo.category].completed++;
        }
    });

    const total = monthTodos.length;
    const completed = completedTodos.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        completed,
        total,
        completionRate,
        categoryStats,
    };
};

