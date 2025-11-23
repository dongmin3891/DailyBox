/**
 * PomodoroTimerWidget Component
 * 모도로 타이머 위젯 (25-5 / 50-10)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from '@/shared/ui';
import type { PomodoroPreset } from '@/entities/timer/model/types';

export interface PomodoroTimerWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const PRESETS: Record<string, PomodoroPreset> = {
    classic: { work: 25, rest: 5 },
    extended: { work: 50, rest: 10 },
};

/**
 * 밀리초를 분:초 형식으로 변환
 */
const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

type TimerPhase = 'idle' | 'work' | 'rest';

const PomodoroTimerWidget: React.FC<PomodoroTimerWidgetProps> = ({ className = '' }) => {
    const [preset, setPreset] = useState<keyof typeof PRESETS>('classic');
    const [phase, setPhase] = useState<TimerPhase>('idle');
    const [remainingMs, setRemainingMs] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && remainingMs > 0) {
            intervalRef.current = setInterval(() => {
                setRemainingMs((prev) => {
                    const newValue = prev - 1000;
                    if (newValue <= 0) {
                        setIsRunning(false);
                        // 작업 시간 종료 시 휴식 시간으로 전환
                        if (phase === 'work') {
                            const restMs = PRESETS[preset].rest * 60 * 1000;
                            setRemainingMs(restMs);
                            setPhase('rest');
                            // 알림 (선택사항)
                            if (typeof window !== 'undefined' && 'Notification' in window) {
                                new Notification('작업 시간 종료! 휴식 시간입니다.');
                            }
                        } else if (phase === 'rest') {
                            setPhase('idle');
                            // 알림 (선택사항)
                            if (typeof window !== 'undefined' && 'Notification' in window) {
                                new Notification('휴식 시간 종료! 다시 시작하세요.');
                            }
                        }
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
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
    }, [isRunning, remainingMs, phase, preset]);

    const handleStartWork = () => {
        const workMs = PRESETS[preset].work * 60 * 1000;
        setRemainingMs(workMs);
        setPhase('work');
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleResume = () => {
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setRemainingMs(0);
        setPhase('idle');
    };

    const handlePresetChange = (newPreset: keyof typeof PRESETS) => {
        if (phase === 'idle') {
            setPreset(newPreset);
        }
    };

    const getPhaseLabel = () => {
        switch (phase) {
            case 'work':
                return '작업 시간';
            case 'rest':
                return '휴식 시간';
            default:
                return '대기 중';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'work':
                return 'text-semantic-warning';
            case 'rest':
                return 'text-semantic-success';
            default:
                return 'text-text-secondary';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 프리셋 선택 */}
            {phase === 'idle' && (
                <Card padding="md" variant="default">
                    <h2 className="text-sm font-medium text-text-secondary mb-3">모도로 프리셋</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePresetChange('classic')}
                            className={`
                                flex-1 px-4 py-3 rounded-xl border-2 transition-all
                                ${preset === 'classic' ? 'bg-toss-blue/10 border-toss-blue/30 text-toss-blue' : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary'}
                                active:scale-95
                            `}
                        >
                            <div className="font-semibold">25-5</div>
                            <div className="text-xs mt-1">클래식</div>
                        </button>
                        <button
                            onClick={() => handlePresetChange('extended')}
                            className={`
                                flex-1 px-4 py-3 rounded-xl border-2 transition-all
                                ${preset === 'extended' ? 'bg-toss-blue/10 border-toss-blue/30 text-toss-blue' : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary'}
                                active:scale-95
                            `}
                        >
                            <div className="font-semibold">50-10</div>
                            <div className="text-xs mt-1">확장</div>
                        </button>
                    </div>
                </Card>
            )}

            {/* 타이머 표시 */}
            <Card padding="lg" variant="elevated">
                <div className="text-center">
                    <div className={`text-sm font-medium mb-2 ${getPhaseColor()}`}>{getPhaseLabel()}</div>
                    <div className={`text-7xl font-bold font-mono ${phase === 'work' ? 'text-semantic-warning' : phase === 'rest' ? 'text-semantic-success' : 'text-text-primary'}`}>
                        {formatTime(remainingMs)}
                    </div>
                    {phase !== 'idle' && (
                        <div className="mt-4 text-xs text-text-secondary">
                            {phase === 'work' && `💼 ${PRESETS[preset].work}분 집중`}
                            {phase === 'rest' && `☕ ${PRESETS[preset].rest}분 휴식`}
                        </div>
                    )}
                </div>
            </Card>

            {/* 컨트롤 버튼 */}
            <Card padding="md" variant="default">
                <div className="flex gap-3">
                    {phase === 'idle' ? (
                        <Button onClick={handleStartWork} variant="primary" size="lg" fullWidth>
                            시작
                        </Button>
                    ) : (
                        <>
                            {isRunning ? (
                                <Button onClick={handlePause} variant="warning" size="lg" fullWidth>
                                    일시정지
                                </Button>
                            ) : (
                                <Button onClick={handleResume} variant="primary" size="lg" fullWidth>
                                    재개
                                </Button>
                            )}
                            <Button onClick={handleReset} variant="neutral" size="lg" fullWidth>
                                리셋
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PomodoroTimerWidget;

