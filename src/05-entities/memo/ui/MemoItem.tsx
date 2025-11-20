/**
 * MemoItem Component
 * 개별 메모 아이템을 표시하는 컴포넌트
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import { Badge } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
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
    /** 고정 토글 핸들러 */
    onTogglePin?: () => void;
    /** 잠금 해제 핸들러 */
    onUnlock?: (pin: string) => Promise<boolean>;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MemoItem: React.FC<MemoItemProps> = ({
    memo,
    isSelected = false,
    onClick,
    onDelete,
    onTogglePin,
    onUnlock,
    className = '',
}) => {
    const [showUnlockDialog, setShowUnlockDialog] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && confirm('이 메모를 삭제하시겠습니까?')) {
            onDelete();
        }
    };

    const handleTogglePin = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin?.();
    };

    const handleClick = () => {
        if (memo.isLocked) {
            if (onUnlock) {
                setShowUnlockDialog(true);
            }
            // 잠긴 메모이고 onUnlock이 없으면 아무 동작도 하지 않음
        } else {
            onClick?.();
        }
    };

    const handleUnlock = async () => {
        if (onUnlock && pinInput.trim()) {
            const success = await onUnlock(pinInput.trim());
            if (success) {
                setShowUnlockDialog(false);
                setPinInput('');
                // 잠금 해제 후 자동으로 메모 상세 페이지로 이동하지 않음
                // 사용자가 다시 클릭하면 잠금 해제된 메모로 이동 가능
            } else {
                alert('PIN이 올바르지 않습니다.');
                setPinInput('');
            }
        }
    };

    return (
        <>
            <Card
                className={`${className} ${isSelected ? 'ring-2 ring-toss-blue' : ''}`}
                padding="md"
                variant={isSelected ? 'elevated' : 'default'}
                clickable={!!onClick || (memo.isLocked && !!onUnlock)}
                onClick={handleClick}
                hoverable
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* 제목과 고정 아이콘 */}
                        <div className="flex items-center gap-2 mb-2">
                            {memo.isPinned && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-toss-blue flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M16 12V2H8v10l-4 4v2h16v-2l-4-4z" />
                                </svg>
                            )}
                            {memo.isLocked && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-semantic-warning flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                </svg>
                            )}
                            <h3 className="text-lg font-semibold text-text-primary truncate">
                                {memo.isLocked ? '🔒 잠긴 메모' : memo.title || '제목 없음'}
                            </h3>
                        </div>

                        {/* 내용 미리보기 */}
                        {memo.isLocked ? (
                            <p className="text-sm text-text-tertiary italic mb-2">이 메모는 잠겨 있습니다.</p>
                        ) : (
                            memo.content && (
                                <p className="text-sm text-text-secondary line-clamp-3 mb-2 whitespace-pre-wrap break-words">
                                    {memo.content}
                                </p>
                            )
                        )}

                        {/* 태그 */}
                        {memo.tags && memo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {memo.tags.slice(0, 5).map((tag, index) => (
                                    <Badge key={index} variant="secondary" size="sm">
                                        {tag}
                                    </Badge>
                                ))}
                                {memo.tags.length > 5 && (
                                    <Badge variant="neutral" size="sm">
                                        +{memo.tags.length - 5}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* 날짜 */}
                        <p className="text-xs text-text-tertiary">{formatDate(memo.updatedAt)}</p>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex items-center gap-1">
                        {onTogglePin && (
                            <IconButton
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 ${
                                            memo.isPinned ? 'text-toss-blue fill-current' : 'text-text-tertiary'
                                        }`}
                                        fill={memo.isPinned ? 'currentColor' : 'none'}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                        />
                                    </svg>
                                }
                                variant="ghost"
                                size="sm"
                                onClick={handleTogglePin}
                                aria-label={memo.isPinned ? '고정 해제' : '고정하기'}
                            />
                        )}
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
                </div>
            </Card>

            {/* 잠금 해제 다이얼로그 - React Portal로 body에 렌더링 */}
            {showUnlockDialog &&
                mounted &&
                typeof window !== 'undefined' &&
                createPortal(
                    <>
                        {/* 오버레이 - 기존 화면 위에 표시 */}
                        <div
                            className="fixed inset-0 bg-black/50 z-[9999]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowUnlockDialog(false);
                                setPinInput('');
                            }}
                            aria-hidden="true"
                        />
                        {/* 모달 - 기존 화면 위에 표시 */}
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                            <div
                                className="bg-bg-primary rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold text-text-primary mb-4">메모 잠금 해제</h3>
                                <Input
                                    type="password"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    placeholder="PIN을 입력하세요"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleUnlock();
                                        } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setShowUnlockDialog(false);
                                            setPinInput('');
                                        }
                                    }}
                                    className="mb-4"
                                    autoFocus
                                    autoComplete="new-password"
                                    data-form-type="other"
                                    data-lpignore="true"
                                    name={`unlock-pin-${memo.id}-${Date.now()}`}
                                    id={`unlock-pin-input-${memo.id}-${Date.now()}`}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUnlockDialog(false);
                                            setPinInput('');
                                        }}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnlock();
                                        }}
                                        disabled={!pinInput.trim()}
                                    >
                                        해제
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
};

export { MemoItem };
export default MemoItem;
