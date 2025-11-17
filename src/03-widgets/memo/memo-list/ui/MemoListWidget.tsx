/**
 * MemoListWidget Component
 * 메모 리스트만 표시하는 위젯
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { MemoList } from '@/entities/memo';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';

export interface MemoListWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const MemoListWidget: React.FC<MemoListWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const { memos, isLoading, loadMemos, deleteMemo } = useMemoSlice();

    useEffect(() => {
        loadMemos();
    }, [loadMemos]);

    const handleMemoClick = (id: number) => {
        router.push(`/memo/${id}`);
    };

    const handleNewMemo = () => {
        router.push('/memo/new');
    };

    const handleDeleteMemo = async (id: number) => {
        await deleteMemo(id);
    };

    return (
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.push('/')}
                            aria-label="홈으로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">메모장</h1>
                    </div>
                    <Button onClick={handleNewMemo} variant="primary" size="md">
                        새 메모
                    </Button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto">
                    <Card padding="md" variant="default">
                        <MemoList
                            memos={memos}
                            onMemoClick={handleMemoClick}
                            onMemoDelete={handleDeleteMemo}
                            isLoading={isLoading}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default MemoListWidget;

