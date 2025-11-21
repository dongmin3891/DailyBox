/**
 * Todo 점수 계산 유틸리티
 * 중요도, 마감일, 미루고 있는 기간 등을 합산해 점수를 계산합니다.
 */

import type { Todo, TodoPriority } from '../model/types';

export interface TodoScore {
    todo: Todo & { id: number };
    score: number;
    reasons: string[];
}

/**
 * 우선순위에 따른 점수 가중치
 */
const priorityWeights: Record<TodoPriority, number> = {
    high: 30,
    medium: 15,
    low: 5,
};

/**
 * Todo의 우선순위 점수를 계산합니다
 */
const calculatePriorityScore = (priority: TodoPriority): number => {
    return priorityWeights[priority];
};

/**
 * 날짜만 비교하여 일 수 차이를 계산합니다 (시간 무시)
 */
const getDaysUntilDue = (dueDate: number): number => {
    const now = new Date();
    const due = new Date(dueDate);
    
    // 날짜만 비교 (시간 제거)
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    const diffMs = dueDateOnly.getTime() - nowDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * 마감일까지 남은 기간에 따른 점수를 계산합니다
 * 마감일이 가까울수록 높은 점수
 */
const calculateDueDateScore = (dueDate?: number): number => {
    if (!dueDate) return 0;

    const daysUntilDue = getDaysUntilDue(dueDate);

    // 마감일이 지났으면 높은 점수 (긴급)
    if (daysUntilDue < 0) {
        return 50 + Math.abs(daysUntilDue) * 5; // 지난 날짜만큼 추가 점수
    }

    // 마감일이 오늘이면 높은 점수
    if (daysUntilDue === 0) {
        return 40;
    }

    // 마감일이 내일이면 높은 점수
    if (daysUntilDue === 1) {
        return 30;
    }

    // 마감일이 이번 주면 중간 점수
    if (daysUntilDue <= 7) {
        return 20 - daysUntilDue * 2;
    }

    // 그 외는 낮은 점수
    return Math.max(0, 10 - daysUntilDue);
};

/**
 * 미루고 있는 기간에 따른 점수를 계산합니다
 * 오래 미뤄둘수록 높은 점수
 */
const calculateDelayScore = (createdAt: number, updatedAt: number): number => {
    const now = Date.now();
    const daysSinceCreated = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const daysSinceUpdated = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));

    // 생성된 지 오래되었고 업데이트도 안 된 경우 높은 점수
    if (daysSinceCreated >= 7 && daysSinceUpdated >= 3) {
        return Math.min(25, daysSinceCreated * 2);
    }

    // 생성된 지 3일 이상이고 업데이트가 안 된 경우
    if (daysSinceCreated >= 3 && daysSinceUpdated >= 1) {
        return Math.min(15, daysSinceCreated);
    }

    return 0;
};

/**
 * Todo의 총 점수를 계산합니다
 * @param todo - 점수를 계산할 Todo
 * @returns 점수와 이유를 포함한 객체
 */
export const calculateTodoScore = (todo: Todo & { id: number }): TodoScore => {
    const reasons: string[] = [];
    let score = 0;

    // 우선순위 점수
    const priorityScore = calculatePriorityScore(todo.priority);
    score += priorityScore;
    if (priorityScore > 0) {
        reasons.push(`우선순위: ${todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '중간' : '낮음'}`);
    }

    // 마감일 점수
    const dueDateScore = calculateDueDateScore(todo.dueDate);
    score += dueDateScore;
    if (todo.dueDate) {
        const daysUntilDue = getDaysUntilDue(todo.dueDate);
        if (daysUntilDue < 0) {
            reasons.push('마감일 지남');
        } else if (daysUntilDue === 0) {
            reasons.push('오늘 마감');
        } else if (daysUntilDue === 1) {
            reasons.push('내일 마감');
        } else if (daysUntilDue <= 7) {
            reasons.push(`${daysUntilDue}일 후 마감`);
        }
    }

    // 미루고 있는 기간 점수
    const delayScore = calculateDelayScore(todo.createdAt, todo.updatedAt);
    score += delayScore;
    if (delayScore > 0) {
        const daysSinceCreated = Math.floor((Date.now() - todo.createdAt) / (1000 * 60 * 60 * 24));
        reasons.push(`${daysSinceCreated}일째 미루는 중`);
    }

    return {
        todo,
        score,
        reasons,
    };
};

/**
 * 완료되지 않은 Todo 목록에서 점수가 높은 상위 N개를 추천합니다
 * @param todos - Todo 목록
 * @param count - 추천할 개수 (기본값: 3)
 * @returns 점수가 높은 Todo 목록
 */
export const getTopPriorityTodos = (
    todos: (Todo & { id: number })[],
    count: number = 3
): TodoScore[] => {
    // 완료되지 않은 Todo만 필터링
    const activeTodos = todos.filter((todo) => !todo.isDone);

    // 각 Todo의 점수 계산
    const scoredTodos = activeTodos.map(calculateTodoScore);

    // 점수 순으로 정렬 (높은 점수 우선)
    scoredTodos.sort((a, b) => b.score - a.score);

    // 상위 N개 반환
    return scoredTodos.slice(0, count);
};

