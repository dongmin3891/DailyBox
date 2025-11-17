/**
 * MemoEditorWidget Component
 * 메모 작성/수정을 위한 위젯
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { MemoEditor } from '@/entities/memo';
import { Button } from '@/shared/ui';
import { IconButton } from '@/shared/ui';

export interface MemoEditorWidgetProps {
    /** 편집할 메모 ID (없으면 새 메모) */
    memoId?: number;
    /** 추가 클래스명 */
    className?: string;
}

const MemoEditorWidget: React.FC<MemoEditorWidgetProps> = ({ memoId, className = '' }) => {
    const router = useRouter();
    const { memos, loadMemos, addMemo, updateMemo } = useMemoSlice();
    const memo = memoId ? memos.find((m) => m.id === memoId) : undefined;

    useEffect(() => {
        loadMemos();
    }, [loadMemos]);

    const handleSave = async (memoData: { title: string; content: string }) => {
        if (memoId) {
            // 수정
            await updateMemo(memoId, memoData);
        } else {
            // 새 메모 추가
            await addMemo(memoData);
        }
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    // ESC 키로 취소
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                            onClick={handleCancel}
                            aria-label="뒤로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">{memoId ? '메모 수정' : '새 메모'}</h1>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto">
                    <MemoEditor memo={memo} onSave={handleSave} onCancel={handleCancel} />
                </div>
            </main>
        </div>
    );
};

export default MemoEditorWidget;

