/**
 * MemoLayoutWidget Component
 * 메모장 페이지의 전체 레이아웃을 관리하는 위젯
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useMemoSlice } from '@/features/memo';
import { MemoList, MemoEditor } from '@/entities/memo';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';

export interface MemoLayoutWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const MemoLayoutWidget: React.FC<MemoLayoutWidgetProps> = ({ className = '' }) => {
    const { memos, isLoading, selectedMemoId, loadMemos, addMemo, updateMemo, deleteMemo, setSelectedMemoId } =
        useMemoSlice();
    const [isCreating, setIsCreating] = useState(false);
    const selectedMemo = memos.find((m) => m.id === selectedMemoId);

    useEffect(() => {
        loadMemos();
    }, [loadMemos]);

    const handleAddMemo = async (memo: { title: string; content: string }) => {
        await addMemo(memo);
        setIsCreating(false);
    };

    const handleUpdateMemo = async (memo: { title: string; content: string }) => {
        if (selectedMemoId) {
            await updateMemo(selectedMemoId, memo);
        }
    };

    const handleDeleteMemo = async (id: number) => {
        await deleteMemo(id);
    };

    const handleNewMemo = () => {
        setIsCreating(true);
        setSelectedMemoId(null);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    return (
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-text-primary">메모장</h1>
                    <Button onClick={handleNewMemo} variant="primary" size="md">
                        새 메모
                    </Button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* 왼쪽: 메모 목록 */}
                        <div className="space-y-4">
                            <Card padding="md" variant="default">
                                <MemoList
                                    memos={memos}
                                    selectedMemoId={selectedMemoId}
                                    onMemoClick={setSelectedMemoId}
                                    onMemoDelete={handleDeleteMemo}
                                    isLoading={isLoading}
                                />
                            </Card>
                        </div>

                        {/* 오른쪽: 메모 편집기 */}
                        <div className="space-y-4">
                            {isCreating ? (
                                <MemoEditor onSave={handleAddMemo} onCancel={handleCancelCreate} />
                            ) : selectedMemo ? (
                                <MemoEditor memo={selectedMemo} onSave={handleUpdateMemo} />
                            ) : (
                                <Card padding="lg" variant="default">
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-16 w-16 text-text-tertiary mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <p className="text-text-secondary text-lg mb-2">메모를 선택하거나</p>
                                        <p className="text-text-tertiary mb-4">새 메모를 추가해보세요</p>
                                        <Button onClick={handleNewMemo} variant="secondary" size="md">
                                            새 메모 작성
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemoLayoutWidget;
