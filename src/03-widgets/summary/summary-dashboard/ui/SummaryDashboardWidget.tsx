/**
 * SummaryDashboardWidget Component
 * 요약 대시보드 위젯 - 각 페이지의 중요 내용을 대시보드 형태로 표시
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
import { IconButton } from '@/shared/ui';

export interface SummaryDashboardWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const SummaryDashboardWidget: React.FC<SummaryDashboardWidgetProps> = ({ className = '' }) => {
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
    const recentMemos = memos.slice(0, 3); // 최근 3개 메모
    const recentCalcs = history.slice(0, 5); // 최근 5개 계산
    const recentMenus = recentRecommendations.slice(0, 3); // 최근 3개 추천 메뉴

    const summaryCards = [
        {
            icon: '📝',
            title: '메모',
            count: memos.length,
            href: '/memo',
            color: 'bg-toss-blue-light/20 border-toss-blue/30',
            iconColor: 'text-toss-blue',
        },
        {
            icon: '✅',
            title: '투두',
            count: todos.length,
            href: '/todo',
            color: 'bg-semantic-success/15 border-semantic-success/30',
            iconColor: 'text-semantic-success',
        },
        {
            icon: '⏰',
            title: '타이머',
            count: timers.length,
            href: '/timer',
            color: 'bg-semantic-warning/15 border-semantic-warning/30',
            iconColor: 'text-semantic-warning',
        },
        {
            icon: '🔢',
            title: '계산기',
            count: history.length,
            href: '/calculator',
            color: 'bg-toss-blue/10 border-toss-blue/25',
            iconColor: 'text-toss-blue',
        },
        {
            icon: '🍽️',
            title: '메뉴추천',
            count: recentRecommendations.length,
            href: '/menu',
            color: 'bg-semantic-warning/15 border-semantic-warning/30',
            iconColor: 'text-semantic-warning',
        },
    ];

    return (
        <div className={`min-h-screen bg-bg-secondary pb-20 ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.back()}
                            aria-label="뒤로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">요약 대시보드</h1>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* 통계 카드 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {summaryCards.map((card) => (
                            <Card
                                key={card.href}
                                padding="md"
                                variant="default"
                                clickable
                                hoverable
                                onClick={() => router.push(card.href)}
                                className={`${card.color} border-2 cursor-pointer`}
                            >
                                <div className="text-center">
                                    <div className={`text-4xl mb-2 ${card.iconColor}`} aria-hidden="true">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-2xl font-bold text-text-primary">{card.count}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* 투두 상태 */}
                    {todos.length > 0 && (
                        <Card padding="md" variant="default">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                    <span>✅</span> 투두 상태
                                </h2>
                                <button
                                    onClick={() => router.push('/todo')}
                                    className="text-sm text-toss-blue hover:underline"
                                >
                                    전체 보기 →
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <div className="text-sm text-text-secondary mb-2">완료</div>
                                    <div className="text-2xl font-bold text-semantic-success">
                                        {completedTodos}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-text-secondary mb-2">미완료</div>
                                    <div className="text-2xl font-bold text-semantic-warning">
                                        {pendingTodos}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-text-secondary mb-2">전체</div>
                                    <div className="text-2xl font-bold text-text-primary">{todos.length}</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* 최근 메모 */}
                    {recentMemos.length > 0 && (
                        <Card padding="md" variant="default">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                    <span>📝</span> 최근 메모
                                </h2>
                                <button
                                    onClick={() => router.push('/memo')}
                                    className="text-sm text-toss-blue hover:underline"
                                >
                                    전체 보기 →
                                </button>
                            </div>
                            <div className="space-y-3">
                                {recentMemos.map((memo) => (
                                    <div
                                        key={memo.id}
                                        onClick={() => router.push(`/memo/${memo.id}`)}
                                        className="p-3 bg-neutral-gray-50 rounded-lg hover:bg-neutral-gray-100 cursor-pointer transition-colors"
                                    >
                                        <div className="font-medium text-text-primary mb-1">
                                            {memo.title || '제목 없음'}
                                        </div>
                                        {memo.content && (
                                            <div className="text-sm text-text-tertiary line-clamp-2">
                                                {memo.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* 최근 계산 기록 */}
                    {recentCalcs.length > 0 && (
                        <Card padding="md" variant="default">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                    <span>🔢</span> 최근 계산 기록
                                </h2>
                                <button
                                    onClick={() => router.push('/calculator')}
                                    className="text-sm text-toss-blue hover:underline"
                                >
                                    전체 보기 →
                                </button>
                            </div>
                            <div className="space-y-2">
                                {recentCalcs.map((calc) => (
                                    <div
                                        key={calc.id}
                                        className="p-3 bg-neutral-gray-50 rounded-lg font-mono text-sm"
                                    >
                                        <div className="text-text-primary">
                                            {calc.expression} = <span className="font-bold">{calc.result}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* 최근 추천 메뉴 */}
                    {recentMenus.length > 0 && (
                        <Card padding="md" variant="default">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                    <span>🍽️</span> 최근 추천 메뉴
                                </h2>
                                <button
                                    onClick={() => router.push('/menu')}
                                    className="text-sm text-toss-blue hover:underline"
                                >
                                    전체 보기 →
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentMenus.map((menu) => (
                                    <Badge
                                        key={menu.id}
                                        variant="secondary"
                                        size="md"
                                        className="cursor-pointer hover:opacity-80"
                                        onClick={() => router.push('/menu')}
                                    >
                                        {menu.name}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SummaryDashboardWidget;

