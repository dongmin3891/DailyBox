/**
 * Todo 통계 계산 유틸리티
 * 이번 주 성취도, 카테고리별 통계, 요일별 완료 수 등을 계산합니다.
 */

import type { Todo, TodoCategory } from '../model/types';

export interface WeekStats {
    /** 이번 주 완료된 Todo 개수 */
    completedCount: number;
    /** 이번 주 전체 Todo 개수 */
    totalCount: number;
    /** 달성률 (0-100) */
    completionRate: number;
    /** 카테고리별 통계 */
    categoryStats: Record<TodoCategory, { completed: number; total: number }>;
    /** 요일별 완료 수 (월=0, 일=6) */
    dailyCompletions: number[];
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
 * 날짜가 이번 주 범위 내에 있는지 확인합니다
 */
const isInThisWeek = (timestamp: number): boolean => {
    const { start, end } = getThisWeekRange();
    return timestamp >= start && timestamp <= end;
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
 * 이번 주 성취도 통계를 계산합니다
 * @param todos - 전체 Todo 목록
 * @returns 이번 주 통계
 */
export const calculateWeekStats = (todos: (Todo & { id: number })[]): WeekStats => {
    const { start, end } = getThisWeekRange();

    // 이번 주에 생성되거나 업데이트된 Todo 필터링
    const thisWeekTodos = todos.filter((todo) => {
        const createdThisWeek = todo.createdAt >= start && todo.createdAt <= end;
        const updatedThisWeek = todo.updatedAt >= start && todo.updatedAt <= end;
        return createdThisWeek || updatedThisWeek;
    });

    // 완료된 Todo 필터링 (이번 주에 완료된 것만)
    const completedThisWeek = thisWeekTodos.filter((todo) => {
        if (!todo.isDone) return false;
        // 완료된 Todo는 updatedAt이 완료 시점이므로 이번 주 범위 내인지 확인
        return isInThisWeek(todo.updatedAt);
    });

    // 카테고리별 통계
    const categoryStats: Record<TodoCategory, { completed: number; total: number }> = {
        work: { completed: 0, total: 0 },
        home: { completed: 0, total: 0 },
        personal: { completed: 0, total: 0 },
    };

    thisWeekTodos.forEach((todo) => {
        categoryStats[todo.category].total++;
        if (todo.isDone && isInThisWeek(todo.updatedAt)) {
            categoryStats[todo.category].completed++;
        }
    });

    // 요일별 완료 수 (월요일=0, 일요일=6)
    const dailyCompletions = new Array(7).fill(0);
    completedThisWeek.forEach((todo) => {
        const dayOfWeek = getDayOfWeek(todo.updatedAt);
        dailyCompletions[dayOfWeek]++;
    });

    const totalCount = thisWeekTodos.length;
    const completedCount = completedThisWeek.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
        completedCount,
        totalCount,
        completionRate,
        categoryStats,
        dailyCompletions,
    };
};

