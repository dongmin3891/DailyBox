/**
 * TopSection Component
 * 오늘 섹션 - 핵심 정보를 크게 표시하고 보조 정보는 작게 표시
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useCalcSlice } from '@/features/calculator';
import { useMenuSlice } from '@/features/menu';
import { calculateTodayStats } from '@/entities/summary/lib/todayStats';
import { msToHoursMinutes } from '@/shared/lib/utils/dateUtils';
import { Card } from '@/shared/ui';
import { TodayGoalsWidget } from '@/widgets/todo';

export interface TopSectionProps {
    /** 추가 클래스명 */
    className?: string;
}

const TopSection: React.FC<TopSectionProps> = ({ className = '' }) => {
    const router = useRouter();
    const { memos } = useMemoSlice();
    const { todos } = useTodoSlice();
    const { timers } = useTimerSlice();
    const { mealRecords } = useMenuSlice();
    const { history } = useCalcSlice();

    const stats = useMemo(() => {
        return calculateTodayStats({
            todos,
            memos,
            timers,
            mealRecords,
            calcHistory: history,
        });
    }, [todos, memos, timers, mealRecords, history]);

    const { hours: timerHours, minutes: timerMinutes } = msToHoursMinutes(stats.totalTimerMs);
    const timerDisplay = timerHours > 0 ? `${timerHours}시간 ${timerMinutes}분` : `${timerMinutes}분`;

    // 오늘의 집중 시간 상세 (포모도로 기록 포함)
    const todayTimers = useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return timers.filter(
            (timer) =>
                timer.startedAt >= todayStart.getTime() &&
                timer.startedAt <= todayEnd.getTime() &&
                timer.endedAt
        );
    }, [timers]);

    const pomodoroCount = todayTimers.filter((timer) => timer.category === 'work').length;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 오늘의 요약 카드 - 3가지 핵심 정보 */}
            <Card padding="lg" variant="default">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <span>📊</span> 오늘의 요약
                        </h2>
                        <span className="text-sm text-text-tertiary">
                            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    {/* 주요 통계 3가지 - 크게 표시 */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/todo')}
                            className="p-4 rounded-lg border-2 border-transparent hover:border-semantic-success/30 transition-all bg-semantic-success/15 text-center"
                        >
                            <div className="text-3xl mb-2" aria-hidden="true">
                                ✅
                            </div>
                            <div className="text-xs text-text-secondary mb-1">완료한 투두</div>
                            <div className="text-2xl font-bold text-semantic-success">{stats.completedTodos}개</div>
                        </button>

                        <button
                            onClick={() => router.push('/timer')}
                            className="p-4 rounded-lg border-2 border-transparent hover:border-semantic-warning/30 transition-all bg-semantic-warning/15 text-center"
                        >
                            <div className="text-3xl mb-2" aria-hidden="true">
                                ⏰
                            </div>
                            <div className="text-xs text-text-secondary mb-1">집중 시간</div>
                            <div className="text-2xl font-bold text-semantic-warning">{timerDisplay}</div>
                        </button>

                        <button
                            onClick={() => router.push('/menu')}
                            className="p-4 rounded-lg border-2 border-transparent hover:border-semantic-warning/30 transition-all bg-semantic-warning/15 text-center"
                        >
                            <div className="text-3xl mb-2" aria-hidden="true">
                                🍽️
                            </div>
                            <div className="text-xs text-text-secondary mb-1">식사 횟수</div>
                            <div className="text-2xl font-bold text-semantic-warning">{stats.todayMeals}회</div>
                        </button>
                    </div>

                    {/* 보조 정보 - 작게 표시 */}
                    <div className="pt-3 border-t border-neutral-gray-200">
                        <div className="flex items-center justify-center gap-4 text-sm text-text-tertiary">
                            <button
                                onClick={() => router.push('/memo')}
                                className="hover:text-toss-blue transition-colors"
                            >
                                📝 메모 {stats.todayMemos}개
                            </button>
                            <span>•</span>
                            <button
                                onClick={() => router.push('/calculator')}
                                className="hover:text-toss-blue transition-colors"
                            >
                                🔢 계산 {stats.todayCalcs}회
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 오늘의 집중 시간 카드 */}
            {todayTimers.length > 0 && (
                <Card padding="md" variant="default">
                    <div className="space-y-3">
                        <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                            <span>⏰</span> 오늘의 집중 시간
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-semantic-warning/10 rounded-lg text-center">
                                <div className="text-2xl font-bold text-semantic-warning">{timerDisplay}</div>
                                <div className="text-xs text-text-secondary mt-1">총 집중 시간</div>
                            </div>
                            {pomodoroCount > 0 && (
                                <div className="p-3 bg-toss-blue/10 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-toss-blue">{pomodoroCount}회</div>
                                    <div className="text-xs text-text-secondary mt-1">포모도로</div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* 오늘의 3대 목표 */}
            <TodayGoalsWidget />
        </div>
    );
};

export default TopSection;

