/**
 * MemoList Component
 * 메모 목록을 표시하는 컴포넌트
 */

'use client';

import React from 'react';
import { MemoItem } from './MemoItem';
import type { Memo } from '../model/types';

export interface MemoListProps {
    /** 메모 목록 */
    memos: (Memo & { id: number })[];
    /** 선택된 메모 ID */
    selectedMemoId?: number | null;
    /** 메모 클릭 핸들러 */
    onMemoClick?: (id: number) => void;
    /** 메모 삭제 핸들러 */
    onMemoDelete?: (id: number) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MemoList: React.FC<MemoListProps> = ({
    memos,
    selectedMemoId,
    onMemoClick,
    onMemoDelete,
    isLoading = false,
    className = '',
}) => {
    if (isLoading) {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <div className="text-text-tertiary">로딩 중...</div>
            </div>
        );
    }

    if (memos.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-text-tertiary mb-3"
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
                <p className="text-text-tertiary">메모가 없습니다</p>
                <p className="text-sm text-text-tertiary mt-1">새 메모를 추가해보세요</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {memos.map((memo) => (
                <MemoItem
                    key={memo.id}
                    memo={memo}
                    isSelected={selectedMemoId === memo.id}
                    onClick={() => onMemoClick?.(memo.id)}
                    onDelete={() => onMemoDelete?.(memo.id)}
                />
            ))}
        </div>
    );
};

export { MemoList };
export default MemoList;

