'use client';

import React, { useEffect } from 'react';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';
import { formatRelativeTime } from '@/shared/lib/utils/dateUtils';

interface CalculatorHistoryProps {
    className?: string;
}

const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({ className = '' }) => {
    const { history, isLoading, loadHistory, clearHistory } = useCalcSlice();

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleClearHistory = async () => {
        if (confirm('계산 기록을 모두 삭제하시겠습니까?')) {
            await clearHistory();
        }
    };

    if (isLoading) {
        return (
            <div className={`bg-bg-primary rounded-2xl p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-secondary">기록을 불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className={`bg-bg-primary rounded-2xl p-6 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary font-semibold text-lg flex items-center gap-2">
                        <span className="text-xl">🕐</span>
                        계산 기록
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-text-tertiary">
                    <div className="text-5xl mb-3 opacity-30">🕐</div>
                    <p>계산 기록이 없습니다</p>
                    <p className="text-sm mt-1">계산을 시작해보세요!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-bg-primary rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-primary font-semibold text-lg flex items-center gap-2">
                    <span className="text-xl">🕐</span>
                    계산 기록
                </h3>
                <button
                    onClick={handleClearHistory}
                    className="text-text-tertiary hover:text-semantic-error transition-colors p-1 text-lg"
                    title="기록 삭제"
                >
                    🗑️
                </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item) => (
                    <div key={item.id} className="bg-bg-secondary rounded-lg p-4 border border-neutral-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <div className="text-text-secondary text-sm">{item.expression}</div>
                                <div className="text-text-primary font-semibold text-lg">= {item.result}</div>
                            </div>
                        </div>
                        <div className="text-text-tertiary text-xs">{formatRelativeTime(item.createdAt)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalculatorHistory;
