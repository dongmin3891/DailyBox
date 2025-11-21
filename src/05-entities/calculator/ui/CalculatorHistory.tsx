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
import { formatRelativeTime } from '@/06-shared/lib/utils/dateUtils';
import { Card, IconButton, Input } from '@/06-shared/ui';

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
    /** 기록 항목 클릭 시 콜백 함수 (재편집용) */
    onItemClick?: (expression: string, result: string) => void;
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
    onItemClick,
}) => {
    const {
        history,
        isLoading,
        searchQuery,
        loadHistory,
        clearHistory,
        removeFromHistory,
        toggleFavorite,
        setSearchQuery,
        getFilteredHistory,
    } = useCalcSlice();

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleClearHistory = async () => {
        if (confirm(clearConfirmMessage)) {
            try {
                await clearHistory();
                // 히스토리 삭제 후 다시 로드하여 UI 업데이트 보장
                await loadHistory();
                onHistoryCleared?.();
            } catch (error) {
                console.error('Failed to clear history:', error);
                alert('기록 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleRemoveItem = async (id: number) => {
        if (confirm('이 계산 기록을 삭제하시겠습니까?')) {
            await removeFromHistory(id);
        }
    };

    const handleToggleFavorite = async (id: number) => {
        await toggleFavorite(id);
    };

    // 즐겨찾기와 일반 히스토리 분리
    const filteredHistory = getFilteredHistory();
    const favorites = filteredHistory.filter((item) => item.favorite).slice(0, maxItems);
    const regularHistory = filteredHistory.filter((item) => !item.favorite).slice(0, maxItems);

    if (isLoading) {
        return (
            <Card variant="default" padding="lg" rounded="2xl" className={className}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-secondary">기록을 불러오는 중...</div>
                </div>
            </Card>
        );
    }

    const hasHistory = favorites.length > 0 || regularHistory.length > 0;

    if (!hasHistory && !isLoading) {
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
        <div role="region" aria-label="계산 기록" className={`flex flex-col h-full ${className}`}>
            <Card variant="default" padding="lg" rounded="2xl" className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
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

                {/* 검색 입력 */}
                <div className="mb-4 flex-shrink-0">
                    <Input
                        type="text"
                        placeholder="검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* 스크롤 가능한 히스토리 영역 */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* 즐겨찾기 히스토리 (상단 고정) */}
                    {favorites.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-text-secondary text-sm font-semibold mb-2 flex items-center gap-2 sticky top-0 bg-bg-primary py-1 z-10">
                                <span>⭐</span>
                                즐겨찾기
                            </h4>
                            <div className="space-y-2" role="list" aria-label="즐겨찾기 계산 기록">
                            {favorites.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-toss-blue-light/20 rounded-lg p-3 border border-toss-blue/30 cursor-pointer hover:bg-toss-blue-light/30 transition-colors"
                                    role="listitem"
                                    aria-label={`계산: ${item.expression} = ${item.result}`}
                                    onClick={() => onItemClick?.(item.expression, item.result)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-text-secondary text-sm break-words" aria-label="계산 표현식">
                                                {item.expression}
                                            </div>
                                            <div className="text-text-primary font-semibold text-base break-words" aria-label="계산 결과">
                                                = {item.result}
                                            </div>
                                            {showTimestamps && (
                                                <div className="text-text-tertiary text-xs mt-1" aria-label="계산 시간">
                                                    {formatRelativeTime(item.createdAt)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleToggleFavorite(item.id!)}
                                                className="text-toss-blue text-lg hover:scale-110 transition-transform"
                                                aria-label="즐겨찾기 해제"
                                            >
                                                ⭐
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.id!)}
                                                className="text-text-tertiary text-sm hover:text-text-primary transition-colors"
                                                aria-label="삭제"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                    {/* 일반 히스토리 */}
                    {regularHistory.length > 0 && (
                        <div>
                            {favorites.length > 0 && (
                                <h4 className="text-text-secondary text-sm font-semibold mb-2">전체 기록</h4>
                            )}
                            <div className="space-y-2" role="list" aria-label="계산 기록 목록">
                            {regularHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-bg-secondary rounded-lg p-3 border border-neutral-gray-200 cursor-pointer hover:bg-neutral-gray-50 transition-colors"
                                    role="listitem"
                                    aria-label={`계산: ${item.expression} = ${item.result}`}
                                    onClick={() => onItemClick?.(item.expression, item.result)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-text-secondary text-sm break-words" aria-label="계산 표현식">
                                                {item.expression}
                                            </div>
                                            <div className="text-text-primary font-semibold text-base break-words" aria-label="계산 결과">
                                                = {item.result}
                                            </div>
                                            {showTimestamps && (
                                                <div className="text-text-tertiary text-xs mt-1" aria-label="계산 시간">
                                                    {formatRelativeTime(item.createdAt)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleToggleFavorite(item.id!)}
                                                className="text-text-tertiary text-sm hover:text-toss-blue transition-colors"
                                                aria-label="즐겨찾기 추가"
                                            >
                                                ⭐
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.id!)}
                                                className="text-text-tertiary text-sm hover:text-text-primary transition-colors"
                                                aria-label="삭제"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export { CalculatorHistory };
export default CalculatorHistory;
