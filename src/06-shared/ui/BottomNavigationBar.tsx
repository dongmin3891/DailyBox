/**
 * BottomNavigationBar Component
 * 하단 고정 네비게이션 바 컴포넌트
 * 모든 페이지에서 표시되며 홈으로 이동할 수 있는 버튼과 각 페이지의 중요 요소를 모아서 볼 수 있는 버튼을 제공합니다.
 */

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface BottomNavigationBarProps {
    /** 추가 클래스명 */
    className?: string;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ className = '' }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isSummary = pathname === '/summary';

    const handleHomeClick = () => {
        if (!isHome) {
            router.push('/');
        }
    };

    const handleSummaryClick = () => {
        if (!isSummary) {
            router.push('/summary');
        }
    };

    return (
        <>
            {/* 하단 네비게이션 바 */}
            <nav
                className={`fixed bottom-0 left-0 right-0 z-50 bg-bg-primary border-t border-neutral-gray-200 shadow-lg ${className}`}
                role="navigation"
                aria-label="하단 네비게이션"
            >
                <div className="max-w-sm mx-auto px-4 py-3">
                    <div className="flex gap-3">
                        {/* 홈 버튼 */}
                        <button
                            onClick={handleHomeClick}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isHome
                                    ? 'bg-toss-blue text-white'
                                    : 'bg-neutral-gray-100 text-text-primary hover:bg-neutral-gray-200'
                            }`}
                            aria-label="홈으로 이동"
                        >
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <span className="font-semibold text-sm">홈</span>
                        </button>

                        {/* 요약 버튼 */}
                        <button
                            onClick={handleSummaryClick}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isSummary
                                    ? 'bg-toss-blue text-white'
                                    : 'bg-neutral-gray-100 text-text-primary hover:bg-neutral-gray-200'
                            }`}
                            aria-label="요약 보기"
                        >
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <span className="font-semibold text-sm">요약</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* 하단 여백 (GNB 높이만큼) */}
            <div className="h-20" />
        </>
    );
};

export default BottomNavigationBar;

