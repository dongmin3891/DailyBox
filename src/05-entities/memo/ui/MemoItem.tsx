/**
 * MemoItem Component
 * 개별 메모 아이템을 표시하는 컴포넌트
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { Memo } from '../model/types';
import { formatDate } from '@/shared/lib/utils/dateUtils';

export interface MemoItemProps {
    /** 메모 데이터 */
    memo: Memo & { id: number };
    /** 선택 여부 */
    isSelected?: boolean;
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 삭제 핸들러 */
    onDelete?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MemoItem: React.FC<MemoItemProps> = ({
    memo,
    isSelected = false,
    onClick,
    onDelete,
    className = '',
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm('이 메모를 삭제하시겠습니까?')) {
            onDelete();
        }
    };

    return (
        <Card
            className={`${className} ${isSelected ? 'ring-2 ring-toss-blue' : ''}`}
            padding="md"
            variant={isSelected ? 'elevated' : 'default'}
            clickable={!!onClick}
            onClick={onClick}
            hoverable
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* 제목 */}
                    <h3 className="text-lg font-semibold text-text-primary mb-2 truncate">
                        {memo.title || '제목 없음'}
                    </h3>

                    {/* 내용 미리보기 */}
                    {memo.content && (
                        <p className="text-sm text-text-secondary line-clamp-3 mb-2 whitespace-pre-wrap break-words">
                            {memo.content}
                        </p>
                    )}

                    {/* 날짜 */}
                    <p className="text-xs text-text-tertiary">
                        {formatDate(memo.updatedAt)}
                    </p>
                </div>

                {/* 삭제 버튼 */}
                {onDelete && (
                    <IconButton
                        icon={
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        }
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        aria-label="메모 삭제"
                    />
                )}
            </div>
        </Card>
    );
};

export { MemoItem };
export default MemoItem;

