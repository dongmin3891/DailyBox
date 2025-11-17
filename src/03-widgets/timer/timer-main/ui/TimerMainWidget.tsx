/**
 * TimerMainWidget Component
 * 타이머 메인 위젯 (실시간 카운트다운)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TimerDisplay, TimerControls } from '@/entities/timer';
import { IconButton } from '@/shared/ui';
import { Card } from '@/shared/ui';

export interface TimerMainWidgetProps {
    /** 초기 시간 (밀리초) */
    initialDurationMs: number;
    /** 타이머 라벨 */
    label?: string;
    /** 타이머 완료 핸들러 */
    onComplete?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TimerMainWidget: React.FC<TimerMainWidgetProps> = ({
    initialDurationMs,
    label,
    onComplete,
    className = '',
}) => {
    const [remainingMs, setRemainingMs] = useState(initialDurationMs);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const remainingAtStartRef = useRef<number>(initialDurationMs);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setRemainingMs((prev) => {
                    const newValue = prev - 1000;
                    if (newValue <= 0) {
                        setIsRunning(false);
                        onComplete?.();
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
    }, [isRunning, onComplete]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setRemainingMs(initialDurationMs);
        remainingAtStartRef.current = initialDurationMs;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <TimerDisplay remainingMs={remainingMs} label={label} />
            <TimerControls
                isRunning={isRunning}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
            />
        </div>
    );
};

export default TimerMainWidget;

