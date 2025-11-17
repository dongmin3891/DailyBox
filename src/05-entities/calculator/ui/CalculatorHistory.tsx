/**
 * CalculatorHistory Component (Entities Layer)
 *
 * 계산기 기록을 표시하는 엔티티 컴포넌트입니다.
 * FSD 아키텍처의 Entities Layer에 위치하며, 계산 기록의 표시와 관리 기능을 담당합니다.
 *
 * @description
 * - 계산 기록 목록 표시 (표현식, 결과, 시간)
 * - 기록 삭제 기능 (개별/전체)
 * - 로딩 상태 및 빈 상태 처리
 * - 상대 시간 표시 (예: "2분 전", "1시간 전")
 * - Toss 디자인 시스템 색상과 컴포넌트 사용
 * - 접근성 고려 (ARIA 레이블, 키보드 네비게이션)
 *
 * @example
 * ```tsx
 * // widgets나 pages에서 사용
 * import { CalculatorHistory } from '@/entities/calculator';
 *
 * const HistoryWidget = () => {
 *   return (
 *     <div className="history-container">
 *       <CalculatorHistory
 *         className="custom-history"
 *         maxItems={50}
 *         showTimestamps={true}
 *       />
 *     </div>
 *   );
 * };
 * ```
 *
 * @see {@link useCalcSlice} - 계산기 상태 관리 훅
 * @see {@link formatRelativeTime} - 상대 시간 포맷 유틸리티
 */

'use client';

import React, { useEffect } from 'react';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';
import { formatRelativeTime } from '@/shared/lib/utils/dateUtils';
import { Card, IconButton } from '@/shared/ui';

export interface CalculatorHistoryProps {
    /** 추가 클래스명 */
    className?: string;
    /** 최대 표시할 기록 수 (기본값: 100) */
    maxItems?: number;
    /** 타임스탬프 표시 여부 (기본값: true) */
    showTimestamps?: boolean;
    /** 기록 삭제 확인 메시지 (기본값: "계산 기록을 모두 삭제하시겠습니까?") */
    clearConfirmMessage?: string;
    /** 기록이 없을 때 표시할 메시지 */
    emptyMessage?: string;
    /** 기록 삭제 시 콜백 함수 */
    onHistoryCleared?: () => void;
}

/**
 * CalculatorHistory - 계산기 기록 컴포넌트
 *
 * @param props - CalculatorHistoryProps
 * @returns JSX.Element
 */
const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
    className = '',
    maxItems = 100,
    showTimestamps = true,
    clearConfirmMessage = '계산 기록을 모두 삭제하시겠습니까?',
    emptyMessage = '계산 기록이 없습니다',
    onHistoryCleared,
}) => {
    const { history, isLoading, loadHistory, clearHistory } = useCalcSlice();

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleClearHistory = async () => {
        if (confirm(clearConfirmMessage)) {
            await clearHistory();
            onHistoryCleared?.();
        }
    };

    // 최대 개수 제한 적용
    const displayHistory = history.slice(0, maxItems);

    if (isLoading) {
        return (
            <Card variant="default" padding="lg" rounded="2xl" className={className}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-secondary">기록을 불러오는 중...</div>
                </div>
            </Card>
        );
    }

    if (displayHistory.length === 0) {
        return (
            <div role="region" aria-label="계산 기록">
                <Card variant="default" padding="lg" rounded="2xl" className={className}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-primary font-semibold text-lg flex items-center gap-2">
                            <span className="text-xl" aria-hidden="true">
                                🕐
                            </span>
                            계산 기록
                        </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-text-tertiary">
                        <div className="text-5xl mb-3 opacity-30" aria-hidden="true">
                            🕐
                        </div>
                        <p>{emptyMessage}</p>
                        <p className="text-sm mt-1">계산을 시작해보세요!</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div role="region" aria-label="계산 기록">
            <Card variant="default" padding="lg" rounded="2xl" className={className}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary font-semibold text-lg flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                            🕐
                        </span>
                        계산 기록
                    </h3>
                    <IconButton
                        icon={<span aria-hidden="true">🗑️</span>}
                        variant="ghost"
                        size="md"
                        onClick={handleClearHistory}
                        aria-label="모든 계산 기록 삭제"
                    />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto" role="list" aria-label="계산 기록 목록">
                    {displayHistory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-bg-secondary rounded-lg p-4 border border-neutral-gray-200"
                            role="listitem"
                            aria-label={`계산: ${item.expression} = ${item.result}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="text-text-secondary text-sm" aria-label="계산 표현식">
                                        {item.expression}
                                    </div>
                                    <div className="text-text-primary font-semibold text-lg" aria-label="계산 결과">
                                        = {item.result}
                                    </div>
                                </div>
                            </div>
                            {showTimestamps && (
                                <div className="text-text-tertiary text-xs" aria-label="계산 시간">
                                    {formatRelativeTime(item.createdAt)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export { CalculatorHistory };
export default CalculatorHistory;
