/**
 * CalculatorLayoutWidget Component
 * 계산기 페이지의 전체 레이아웃을 관리하는 위젯
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, CalculatorHistory } from '@/entities/calculator';
import { CalculatorHeaderWidget } from '@/widgets/calculator';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';

export interface CalculatorLayoutWidgetProps {
    /** 추가 클래스명 */
    className?: string;
    /** 초기 기록 표시 상태 */
    initialShowHistory?: boolean;
}

const CalculatorLayoutWidget: React.FC<CalculatorLayoutWidgetProps> = ({
    className = '',
    initialShowHistory = false,
}) => {
    const [showHistory, setShowHistory] = useState(initialShowHistory);
    const { setCurrentCalculation } = useCalcSlice();

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    // 키보드 단축키 지원
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + H: 기록 토글
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                toggleHistory();
            }
            // ESC: 기록 숨기기
            if (e.key === 'Escape' && showHistory) {
                setShowHistory(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showHistory]);

    return (
        <div className={`min-h-screen bg-bg-secondary flex flex-col ${className}`}>
            {/* 헤더 위젯 */}
            <CalculatorHeaderWidget showHistory={showHistory} onToggleHistory={toggleHistory} />

            {/* 메인 컨텐츠 */}
            <main className="flex-1 overflow-hidden flex flex-col p-4 pb-6">
                <div className="max-w-md mx-auto w-full flex flex-col flex-1 overflow-hidden space-y-4">
                    {/* 계산기 (상단 고정) */}
                    <div className="flex-shrink-0">
                        <Calculator />
                    </div>

                    {/* 계산 기록 (아래 스크롤 영역) */}
                    {showHistory && (
                        <div className="flex-1 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                            <CalculatorHistory
                                className="h-full flex flex-col"
                                onItemClick={(expression, result) => {
                                    // 히스토리 항목 클릭 시 해당 수식을 불러옴
                                    setCurrentCalculation(expression, result);
                                }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CalculatorLayoutWidget;
