/**
 * TimerControls Component
 * 타이머 제어 버튼 컴포넌트
 */

'use client';

import React from 'react';
import { Button } from '@/shared/ui';

export interface TimerControlsProps {
    /** 타이머 실행 중 여부 */
    isRunning: boolean;
    /** 시작 핸들러 */
    onStart: () => void;
    /** 일시정지 핸들러 */
    onPause: () => void;
    /** 리셋 핸들러 */
    onReset: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TimerControls: React.FC<TimerControlsProps> = ({
    isRunning,
    onStart,
    onPause,
    onReset,
    className = '',
}) => {
    return (
        <div className={`flex gap-3 justify-center ${className}`}>
            {isRunning ? (
                <Button onClick={onPause} variant="warning" size="lg" fullWidth>
                    일시정지
                </Button>
            ) : (
                <Button onClick={onStart} variant="primary" size="lg" fullWidth>
                    시작
                </Button>
            )}
            <Button onClick={onReset} variant="neutral" size="lg" fullWidth>
                리셋
            </Button>
        </div>
    );
};

export { TimerControls };
export default TimerControls;

