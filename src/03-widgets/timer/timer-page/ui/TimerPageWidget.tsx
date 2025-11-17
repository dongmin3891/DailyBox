/**
 * TimerPageWidget Component
 * 스톱워치 페이지 전체 위젯
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';

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

const TimerPageWidget: React.FC<TimerPageWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const [elapsedMs, setElapsedMs] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [records, setRecords] = useState<Array<{ time: string; elapsed: number }>>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);

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
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedMs(0);
        pausedTimeRef.current = 0;
        setRecords([]);
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.push('/')}
                            aria-label="홈으로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">스톱워치</h1>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 스톱워치 표시 */}
                    <Card padding="lg" variant="elevated">
                        <div className="text-center">
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
                </div>
            </main>
        </div>
    );
};

export default TimerPageWidget;

