/**
 * TimerDisplay Component
 * 타이머 시간 표시 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';

export interface TimerDisplayProps {
    /** 남은 시간 (밀리초) */
    remainingMs: number;
    /** 타이머 라벨 */
    label?: string;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 밀리초를 시:분:초 형식으로 변환
 */
const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingMs, label, className = '' }) => {
    const isWarning = remainingMs <= 60000; // 1분 이하
    const isCritical = remainingMs <= 10000; // 10초 이하

    return (
        <Card className={className} padding="lg" variant="elevated">
            <div className="text-center">
                {label && (
                    <h2 className="text-lg font-semibold text-text-primary mb-4">{label}</h2>
                )}
                <div
                    className={`text-6xl font-bold font-mono transition-colors ${
                        isCritical
                            ? 'text-semantic-error'
                            : isWarning
                              ? 'text-semantic-warning'
                              : 'text-text-primary'
                    }`}
                >
                    {formatTime(remainingMs)}
                </div>
            </div>
        </Card>
    );
};

export { TimerDisplay };
export default TimerDisplay;

