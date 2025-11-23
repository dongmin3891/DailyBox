/**
 * 오늘 날짜 기준 통계 계산 유틸리티
 */

import { getTodayStart, getTodayEnd } from '@/shared/lib/utils/dateUtils';
import type { Todo } from '@/entities/todo/model/types';
import type { DbMemo } from '@/shared/lib/db/dexie';
import type { Timer } from '@/entities/timer/model/types';
import type { DbMealRecord } from '@/shared/lib/db/dexie';
import type { DbCalcHistory } from '@/shared/lib/db/dexie';

export interface TodayStats {
    /** 오늘 완료한 투두 개수 */
    completedTodos: number;
    /** 오늘 작성/수정한 메모 개수 */
    todayMemos: number;
    /** 오늘 총 타이머 시간 (밀리초) */
    totalTimerMs: number;
    /** 오늘 식사 기록 개수 */
    todayMeals: number;
    /** 오늘 계산 기록 개수 */
    todayCalcs: number;
    /** 오늘 dueDate인 투두 개수 */
    dueTodayTodos: number;
    /** 오늘 미완료 우선순위 높은 투두 개수 */
    highPriorityPendingTodos: number;
}

/**
 * 오늘 날짜 기준 투두 통계 계산
 */
export const calculateTodayTodoStats = (todos: (Todo & { id: number })[]): {
    completedTodos: number;
    dueTodayTodos: number;
    highPriorityPendingTodos: number;
} => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    // 오늘 완료한 투두
    const completedTodos = todos.filter(
        (todo) => todo.isDone && todo.updatedAt >= todayStart && todo.updatedAt <= todayEnd
    ).length;

    // 오늘 dueDate인 투두
    const dueTodayTodos = todos.filter(
        (todo) => todo.dueDate && todo.dueDate >= todayStart && todo.dueDate <= todayEnd && !todo.isDone
    ).length;

    // 오늘 미완료 우선순위 높은 투두
    const highPriorityPendingTodos = todos.filter(
        (todo) => !todo.isDone && todo.priority === 'high'
    ).length;

    return {
        completedTodos,
        dueTodayTodos,
        highPriorityPendingTodos,
    };
};

/**
 * 오늘 날짜 기준 메모 통계 계산
 */
export const calculateTodayMemoStats = (memos: DbMemo[]): number => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    // 오늘 작성하거나 수정한 메모
    return memos.filter(
        (memo) =>
            (memo.createdAt >= todayStart && memo.createdAt <= todayEnd) ||
            (memo.updatedAt >= todayStart && memo.updatedAt <= todayEnd)
    ).length;
};

/**
 * 오늘 날짜 기준 타이머 통계 계산
 */
export const calculateTodayTimerStats = (timers: (Timer & { id: number })[]): number => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    // 오늘 시작한 타이머 중 완료된 것들의 총 시간
    return timers
        .filter((timer) => timer.startedAt >= todayStart && timer.startedAt <= todayEnd && timer.endedAt)
        .reduce((total, timer) => {
            if (timer.endedAt) {
                return total + (timer.endedAt - timer.startedAt);
            }
            return total;
        }, 0);
};

/**
 * 오늘 날짜 기준 식사 기록 통계 계산
 */
export const calculateTodayMealStats = (mealRecords: DbMealRecord[]): number => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    // 오늘 식사 기록
    return mealRecords.filter(
        (record) => record.mealDate >= todayStart && record.mealDate <= todayEnd
    ).length;
};

/**
 * 오늘 날짜 기준 계산 기록 통계 계산
 */
export const calculateTodayCalcStats = (calcHistory: DbCalcHistory[]): number => {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    // 오늘 계산 기록
    return calcHistory.filter(
        (calc) => calc.createdAt >= todayStart && calc.createdAt <= todayEnd
    ).length;
};

/**
 * 오늘 날짜 기준 전체 통계 계산
 */
export const calculateTodayStats = (params: {
    todos: (Todo & { id: number })[];
    memos: DbMemo[];
    timers: (Timer & { id: number })[];
    mealRecords: DbMealRecord[];
    calcHistory: DbCalcHistory[];
}): TodayStats => {
    const todoStats = calculateTodayTodoStats(params.todos);
    const todayMemos = calculateTodayMemoStats(params.memos);
    const totalTimerMs = calculateTodayTimerStats(params.timers);
    const todayMeals = calculateTodayMealStats(params.mealRecords);
    const todayCalcs = calculateTodayCalcStats(params.calcHistory);

    return {
        ...todoStats,
        todayMemos,
        totalTimerMs,
        todayMeals,
        todayCalcs,
    };
};

