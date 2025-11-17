/**
 * HomeSummaryWidget Component
 * 홈 페이지의 각 기능별 중요 내용을 요약하여 보여주는 위젯
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useCalcSlice } from '@/features/calculator';
import { useMenuSlice } from '@/features/menu';
import { Card } from '@/shared/ui';
import { Badge } from '@/shared/ui';

export interface HomeSummaryWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const HomeSummaryWidget: React.FC<HomeSummaryWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { memos, loadMemos } = useMemoSlice();
    const { todos, loadTodos } = useTodoSlice();
    const { timers, loadTimers } = useTimerSlice();
    const { history, loadHistory } = useCalcSlice();
    const { recentRecommendations, loadMenus } = useMenuSlice();

    useEffect(() => {
        // 모든 데이터 로드
        loadMemos();
        loadTodos();
        loadTimers();
        loadHistory();
        loadMenus();
    }, [loadMemos, loadTodos, loadTimers, loadHistory, loadMenus]);

    const completedTodos = todos.filter((todo) => todo.isDone).length;
    const pendingTodos = todos.filter((todo) => !todo.isDone).length;
    const recentMemo = memos[0]; // 가장 최근 메모
    const recentCalc = history[0]; // 가장 최근 계산
    const recentMenu = recentRecommendations[0]; // 가장 최근 추천 메뉴

    const summaryItems = [
        {
            icon: '📝',
            title: '메모',
            href: '/memo',
            content: memos.length > 0 ? (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-text-primary">
                        {memos.length}개의 메모
                    </div>
                    {recentMemo && (
                        <div className="text-xs text-text-tertiary truncate">
                            최근: {recentMemo.title || '제목 없음'}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-sm text-text-tertiary">메모가 없습니다</div>
            ),
        },
        {
            icon: '✅',
            title: '투두',
            href: '/todo',
            content: todos.length > 0 ? (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-text-primary">
                        총 {todos.length}개
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="success" size="sm">
                            완료 {completedTodos}
                        </Badge>
                        <Badge variant="warning" size="sm">
                            미완료 {pendingTodos}
                        </Badge>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-text-tertiary">할 일이 없습니다</div>
            ),
        },
        {
            icon: '⏰',
            title: '타이머',
            href: '/timer',
            content: (
                <div className="text-sm font-medium text-text-primary">
                    {timers.length}개의 타이머
                </div>
            ),
        },
        {
            icon: '🔢',
            title: '계산기',
            href: '/calculator',
            content: recentCalc ? (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-text-primary">최근 계산</div>
                    <div className="text-xs text-text-tertiary font-mono">
                        {recentCalc.expression} = {recentCalc.result}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-text-tertiary">계산 기록이 없습니다</div>
            ),
        },
        {
            icon: '🍽️',
            title: '메뉴추천',
            href: '/menu',
            content: recentMenu ? (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-text-primary">최근 추천</div>
                    <div className="text-xs text-text-tertiary">{recentMenu.name}</div>
                </div>
            ) : (
                <div className="text-sm text-text-tertiary">추천 기록이 없습니다</div>
            ),
        },
    ];

    return (
        <div className={`space-y-3 ${className}`}>
            {summaryItems.map((item) => (
                <Card
                    key={item.href}
                    padding="md"
                    variant="default"
                    clickable
                    hoverable
                    onClick={() => router.push(item.href)}
                    className="cursor-pointer"
                >
                    <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0" aria-hidden="true">
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-text-primary mb-2">
                                {item.title}
                            </h3>
                            {item.content}
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-text-tertiary flex-shrink-0 mt-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default HomeSummaryWidget;

