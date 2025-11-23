/**
 * TimerPageWidget Component
 * 스톱워치 페이지 전체 위젯
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, IconButton, CategorySelector } from '@/shared/ui';
import { useTimerSlice } from '@/features/timer/model/timer.slice';
import type { TimerCategory } from '@/entities/timer/model/types';
import PomodoroTimerWidget from '../../pomodoro-timer/ui/PomodoroTimerWidget';
import TimerStatsWidget from '../../timer-stats/ui/TimerStatsWidget';

export interface TimerPageWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

/**
 * 밀리초를 시:분:초.밀리초 형식으로 변환
 */
const formatStopwatch = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // 10ms 단위

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

/**
 * 밀리초를 시간 형식으로 변환 (예: 2시간 30분)
 */
const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
};

/**
 * 밀리초를 분 단위로 변환 (총 분 수)
 */
const formatTotalMinutes = (ms: number): number => {
    return Math.floor(ms / (1000 * 60));
};

/**
 * 밀리초를 성취감 있는 형식으로 변환 (분 + 시간)
 */
const formatDurationWithMinutes = (ms: number): { totalMinutes: number; hours: number; minutes: number } => {
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { totalMinutes, hours, minutes };
};

type TimerMode = 'stopwatch' | 'pomodoro' | 'stats';

const TimerPageWidget: React.FC<TimerPageWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { saveStopwatchSession, stats, loadTimers } = useTimerSlice();
    const [mode, setMode] = useState<TimerMode>('stopwatch');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [category, setCategory] = useState<TimerCategory>('work');
    const [records, setRecords] = useState<Array<{ time: string; elapsed: number }>>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const sessionStartTimeRef = useRef<number | null>(null);

    useEffect(() => {
        loadTimers();
    }, [loadTimers]);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - pausedTimeRef.current;
            intervalRef.current = setInterval(() => {
                setElapsedMs(Date.now() - startTimeRef.current);
            }, 10); // 10ms마다 업데이트 (부드러운 표시)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    // 일시정지 시 현재 시간 저장
    useEffect(() => {
        if (!isRunning && elapsedMs > 0) {
            pausedTimeRef.current = elapsedMs;
        }
    }, [isRunning, elapsedMs]);

    const handleStart = () => {
        if (!isRunning && sessionStartTimeRef.current === null) {
            // 새로운 세션 시작
            sessionStartTimeRef.current = Date.now();
        }
        setIsRunning(true);
    };

    const handleStop = async () => {
        setIsRunning(false);
        
        // 세션이 있고 경과 시간이 있으면 저장
        if (sessionStartTimeRef.current && elapsedMs > 0) {
            const endedAt = Date.now();
            await saveStopwatchSession(category, sessionStartTimeRef.current, endedAt);
            sessionStartTimeRef.current = null;
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedMs(0);
        pausedTimeRef.current = 0;
        setRecords([]);
        sessionStartTimeRef.current = null;
    };

    const handleRecord = () => {
        if (elapsedMs > 0) {
            const timeStr = formatStopwatch(elapsedMs);
            setRecords((prev) => [{ time: timeStr, elapsed: elapsedMs }, ...prev]);
        }
    };

    return (
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                }
                                variant="ghost"
                                size="md"
                                onClick={() => router.push('/')}
                                aria-label="홈으로 가기"
                            />
                            <h1 className="text-2xl font-bold text-text-primary">타이머</h1>
                        </div>
                    </div>
                    {/* 탭 전환 */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('stopwatch')}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-all
                                ${mode === 'stopwatch' ? 'bg-toss-blue text-white' : 'bg-neutral-gray-100 text-text-secondary'}
                            `}
                        >
                            스톱워치
                        </button>
                        <button
                            onClick={() => setMode('pomodoro')}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-all
                                ${mode === 'pomodoro' ? 'bg-toss-blue text-white' : 'bg-neutral-gray-100 text-text-secondary'}
                            `}
                        >
                            모도로
                        </button>
                        <button
                            onClick={() => setMode('stats')}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-all
                                ${mode === 'stats' ? 'bg-toss-blue text-white' : 'bg-neutral-gray-100 text-text-secondary'}
                            `}
                        >
                            통계
                        </button>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 오늘 시간 요약 */}
                    {mode === 'stopwatch' && stats.today.total > 0 && (
                        <Card padding="md" variant="default">
                            <h2 className="text-lg font-semibold text-text-primary mb-3">오늘 집중 시간</h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-secondary">총 시간</span>
                                    <div className="text-right">
                                        <div className="text-text-primary font-bold text-2xl">{formatTotalMinutes(stats.today.total)}분</div>
                                        {formatDurationWithMinutes(stats.today.total).hours > 0 && (
                                            <div className="text-text-secondary text-sm">
                                                ({formatDuration(stats.today.total)})
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-gray-200">
                                    {(['work', 'study', 'exercise'] as TimerCategory[]).map((cat) => {
                                        const duration = stats.today.byCategory[cat];
                                        const formatted = formatDurationWithMinutes(duration);
                                        const labels = { work: '💼 업무', study: '📚 공부', exercise: '🏃 운동' };
                                        
                                        return (
                                            <div key={cat} className="text-center">
                                                <div className="text-text-secondary text-xs mb-1">{labels[cat]}</div>
                                                <div className="text-text-primary font-bold text-lg">{formatted.totalMinutes}분</div>
                                                {formatted.hours > 0 && (
                                                    <div className="text-text-secondary text-xs">
                                                        ({formatDuration(duration)})
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* 모드별 컨텐츠 */}
                    {mode === 'stats' ? (
                        <TimerStatsWidget />
                    ) : mode === 'stopwatch' ? (
                        <>
                            {/* 카테고리 선택 */}
                            {!isRunning && (
                                <Card padding="md" variant="default">
                                    <h2 className="text-sm font-medium text-text-secondary mb-3">카테고리 선택</h2>
                                    <CategorySelector selectedCategory={category} onCategoryChange={setCategory} />
                                </Card>
                            )}

                            {/* 스톱워치 표시 */}
                            <Card padding="lg" variant="elevated">
                                <div className="text-center">
                                    {isRunning && (
                                        <div className="mb-2">
                                            <span className="inline-block px-3 py-1 rounded-full bg-semantic-success/15 text-semantic-success text-sm font-medium">
                                                {category === 'work' && '💼 업무'}
                                                {category === 'study' && '📚 공부'}
                                                {category === 'exercise' && '🏃 운동'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-7xl font-bold font-mono text-text-primary mb-2">
                                        {formatStopwatch(elapsedMs)}
                                    </div>
                                </div>
                            </Card>

                            {/* 컨트롤 버튼 */}
                            <Card padding="md" variant="default">
                                <div className="flex gap-3">
                                    {isRunning ? (
                                        <Button onClick={handleStop} variant="warning" size="lg" fullWidth>
                                            중지
                                        </Button>
                                    ) : (
                                        <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
                                            시작
                                        </Button>
                                    )}
                                    {elapsedMs > 0 && (
                                        <>
                                            <Button onClick={handleReset} variant="neutral" size="lg" fullWidth>
                                                리셋
                                            </Button>
                                            <Button onClick={handleRecord} variant="secondary" size="lg" fullWidth>
                                                기록
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card>

                            {/* 기록 목록 */}
                            {records.length > 0 && (
                                <Card padding="md" variant="default">
                                    <h2 className="text-lg font-semibold text-text-primary mb-4">기록</h2>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                        {records.map((record, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-neutral-gray-50 rounded-lg"
                                            >
                                                <span className="text-text-secondary text-sm font-medium">#{records.length - index}</span>
                                                <span className="text-text-primary font-mono font-semibold text-lg">{record.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </>
                    ) : (
                        <PomodoroTimerWidget />
                    )}
                </div>
            </main>
        </div>
    );
};

export default TimerPageWidget;

