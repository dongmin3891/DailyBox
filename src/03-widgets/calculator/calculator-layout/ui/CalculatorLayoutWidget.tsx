/**
 * CalculatorLayoutWidget Component
 * 계산기 페이지의 전체 레이아웃을 관리하는 위젯
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, CalculatorHistory } from '@/entities/calculator';
import { CalculatorHeaderWidget } from '@/widgets/calculator';

export interface CalculatorLayoutWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const CalculatorLayoutWidget: React.FC<CalculatorLayoutWidgetProps> = ({ className = '' }) => {
    const [showHistory, setShowHistory] = useState(false);

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
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 위젯 */}
            <CalculatorHeaderWidget showHistory={showHistory} onToggleHistory={toggleHistory} />

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-md mx-auto space-y-5">
                    {/* 계산기 */}
                    <Calculator />

                    {/* 계산 기록 (조건부 렌더링) */}
                    {showHistory && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <CalculatorHistory />
                        </div>
                    )}
                </div>
            </main>

            {/* 키보드 단축키 안내 (하단) */}
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-text-primary text-bg-primary px-3 py-1 rounded-lg text-xs opacity-60 pointer-events-none">
                <kbd className="font-mono">Ctrl+H</kbd> 기록 • <kbd className="font-mono">ESC</kbd> 닫기
            </div>
        </div>
    );
};

export default CalculatorLayoutWidget;
