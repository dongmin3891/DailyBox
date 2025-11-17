/**
 * TimerHistory Component
 * 타이머 기록 목록 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { Timer } from '../model/types';
import { formatDate } from '@/shared/lib/utils/dateUtils';

export interface TimerHistoryProps {
    /** 타이머 기록 목록 */
    timers: (Timer & { id: number })[];
    /** 타이머 삭제 핸들러 */
    onDelete?: (id: number) => void;
    /** 타이머 클릭 핸들러 (기록에서 선택) */
    onClick?: (id: number) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 밀리초를 읽기 쉬운 형식으로 변환
 */
const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    }
    if (minutes > 0) {
        return `${minutes}분 ${seconds}초`;
    }
    return `${seconds}초`;
};

const TimerHistory: React.FC<TimerHistoryProps> = ({
    timers,
    onDelete,
    onClick,
    isLoading = false,
    className = '',
}) => {
    if (isLoading) {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <div className="text-text-tertiary">로딩 중...</div>
            </div>
        );
    }

    if (timers.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-text-tertiary mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-text-tertiary">타이머 기록이 없습니다</p>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {timers.map((timer) => (
                <Card
                    key={timer.id}
                    padding="md"
                    variant="default"
                    clickable={!!onClick}
                    onClick={() => onClick?.(timer.id)}
                    hoverable
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-text-primary mb-1">{timer.label}</h3>
                            <div className="flex items-center gap-4 text-sm text-text-tertiary">
                                <span>{formatDuration(timer.durationMs)}</span>
                                <span>{formatDate(timer.createdAt)}</span>
                            </div>
                        </div>
                        {onDelete && (
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                }
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('이 타이머 기록을 삭제하시겠습니까?')) {
                                        onDelete(timer.id);
                                    }
                                }}
                                aria-label="타이머 기록 삭제"
                            />
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export { TimerHistory };
export default TimerHistory;

