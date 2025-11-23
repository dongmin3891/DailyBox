/**
 * PeriodSelector Component
 * 주간/월간 기간 선택 컴포넌트
 */

import React from 'react';
import { Badge } from '@/shared/ui';

export type PeriodType = 'today' | 'week' | 'month';

export interface PeriodSelectorProps {
    /** 현재 선택된 기간 */
    selectedPeriod: PeriodType;
    /** 기간 변경 핸들러 */
    onPeriodChange: (period: PeriodType) => void;
    /** 추가 클래스명 */
    className?: string;
}

const periodLabels: Record<PeriodType, string> = {
    today: '오늘',
    week: '주간',
    month: '월간',
};

/**
 * PeriodSelector - 기간 선택 컴포넌트
 */
export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    selectedPeriod,
    onPeriodChange,
    className = '',
}) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            {(Object.keys(periodLabels) as PeriodType[]).map((period) => (
                <button
                    key={period}
                    onClick={() => onPeriodChange(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        selectedPeriod === period
                            ? 'bg-toss-blue text-white'
                            : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                    }`}
                >
                    {periodLabels[period]}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;

