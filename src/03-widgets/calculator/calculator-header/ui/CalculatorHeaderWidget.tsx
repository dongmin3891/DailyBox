/**
 * CalculatorHeaderWidget Component
 * 계산기 페이지 전용 헤더 위젯
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export interface CalculatorHeaderWidgetProps {
    /** 기록 표시 상태 */
    showHistory: boolean;
    /** 기록 토글 핸들러 */
    onToggleHistory: () => void;
    /** 추가 클래스명 */
    className?: string;
}

const CalculatorHeaderWidget: React.FC<CalculatorHeaderWidgetProps> = ({
    showHistory,
    onToggleHistory,
    className = '',
}) => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleCopyResult = () => {
        // 현재 디스플레이 값을 클립보드에 복사 (추후 구현)
        alert('결과 복사 기능은 준비 중입니다! 📋');
    };

    return (
        <header
            className={`bg-bg-primary px-5 py-4 flex items-center justify-between border-b border-neutral-gray-200 ${className}`}
        >
            {/* 뒤로가기 버튼 */}
            <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-text-secondary hover:text-text-primary hover:bg-neutral-gray-100 transition-all active:scale-95"
                aria-label="홈으로 돌아가기"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            {/* 제목 */}
            <h1 className="text-text-primary font-bold text-xl flex items-center gap-2">
                <span className="text-toss-blue">🔢</span>
                계산기
            </h1>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2">
                {/* 결과 복사 버튼 */}
                <button
                    onClick={handleCopyResult}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-text-secondary hover:text-text-primary hover:bg-neutral-gray-100 transition-all active:scale-95"
                    aria-label="결과 복사"
                    title="결과 복사"
                >
                    📋
                </button>

                {/* 기록 토글 버튼 */}
                <button
                    onClick={onToggleHistory}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-95 ${
                        showHistory
                            ? 'text-toss-blue bg-toss-blue/10'
                            : 'text-text-secondary hover:text-text-primary hover:bg-neutral-gray-100'
                    }`}
                    aria-label={showHistory ? '기록 숨기기' : '기록 보기'}
                    title={showHistory ? '기록 숨기기' : '기록 보기'}
                >
                    📜
                </button>
            </div>
        </header>
    );
};

export default CalculatorHeaderWidget;
