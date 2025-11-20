/**
 * MemoEditor Component
 * 메모 편집을 위한 컴포넌트
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { Badge } from '@/shared/ui';
import type { Memo } from '../model/types';

export interface MemoEditorProps {
    /** 편집할 메모 (없으면 새 메모) */
    memo?: Memo & { id: number };
    /** 저장 핸들러 */
    onSave: (memo: { title: string; content: string; tags?: string[] }) => void;
    /** 잠금 핸들러 */
    onLock?: (pin: string) => void;
    /** 취소 핸들러 */
    onCancel?: () => void;
    /** 제목 (제어 컴포넌트용) */
    title?: string;
    /** 내용 (제어 컴포넌트용) */
    content?: string;
    /** 태그 (제어 컴포넌트용) */
    tags?: string[];
    /** 제목 변경 핸들러 (제어 컴포넌트용) */
    onTitleChange?: (title: string) => void;
    /** 내용 변경 핸들러 (제어 컴포넌트용) */
    onContentChange?: (content: string) => void;
    /** 태그 변경 핸들러 (제어 컴포넌트용) */
    onTagsChange?: (tags: string[]) => void;
    /** 사용 가능한 모든 태그 목록 (자동완성용) */
    allTags?: string[];
    /** 추가 CSS 클래스 */
    className?: string;
}

const MemoEditor: React.FC<MemoEditorProps> = ({
    memo,
    onSave,
    onLock,
    onCancel,
    title: controlledTitle,
    content: controlledContent,
    tags: controlledTags,
    onTitleChange,
    onContentChange,
    onTagsChange,
    allTags = [],
    className = '',
}) => {
    const [internalTitle, setInternalTitle] = useState(memo?.title || '');
    const [internalContent, setInternalContent] = useState(memo?.content || '');
    const [internalTags, setInternalTags] = useState<string[]>(memo?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [showLockDialog, setShowLockDialog] = useState(false);
    const [lockPin, setLockPin] = useState('');
    const tagInputRef = useRef<HTMLInputElement>(null);
    const lockPinInputRef = useRef<HTMLInputElement>(null);

    // 제어 컴포넌트 모드인지 확인
    const isControlled = controlledTitle !== undefined && controlledContent !== undefined;
    const title = isControlled ? controlledTitle : internalTitle;
    const content = isControlled ? controlledContent : internalContent;
    const tags = isControlled && controlledTags !== undefined ? controlledTags : internalTags;

    const setTitle = isControlled && onTitleChange ? onTitleChange : setInternalTitle;
    const setContent = isControlled && onContentChange ? onContentChange : setInternalContent;
    const setTags = isControlled && onTagsChange ? onTagsChange : setInternalTags;

    useEffect(() => {
        if (memo) {
            setTitle(memo.title);
            setContent(memo.content);
            setTags(memo.tags || []);
        } else {
            // 새 메모인 경우 초기화
            setTitle('');
            setContent('');
            setTags([]);
            setTagInput('');
        }
    }, [memo]);

    const handleAddTag = (tagToAdd?: string) => {
        const tag = (tagToAdd || tagInput.trim()).toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleLock = () => {
        if (lockPin.trim()) {
            onLock?.(lockPin.trim());
            setShowLockDialog(false);
            setLockPin('');
        }
    };

    const handleSave = () => {
        if (title.trim() || content.trim()) {
            onSave({
                title: title.trim() || '제목 없음',
                content: content.trim(),
                tags: tags,
            });
            if (!memo) {
                // 새 메모인 경우 초기화
                setTitle('');
                setContent('');
                setTags([]);
                setTagInput('');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isTagInput = target === tagInputRef.current;

        // Ctrl/Cmd + Enter: 저장
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        // 태그 입력 필드에서 Enter: 태그 추가
        if (e.key === 'Enter' && isTagInput && tagInput.trim()) {
            e.preventDefault();
            handleAddTag();
        }
        // ESC: 취소
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
    };

    // 태그 자동완성 필터링
    const filteredTags = allTags.filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
    );

    return (
        <Card className={className} padding="md" variant="default">
            <div className="space-y-4">
                {/* 제목 입력 */}
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="제목을 입력하세요"
                    className="text-lg font-semibold"
                    autoComplete="new-password"
                    data-form-type="other"
                    data-lpignore="true"
                    name="memo-title-input"
                    id="memo-title-input-field"
                />

                {/* 내용 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메모 내용을 입력하세요"
                    className="w-full min-h-[300px] px-4 py-3 border border-neutral-gray-300 rounded-lg bg-neutral-white text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50 focus:border-toss-blue transition-all duration-200 resize-none"
                    rows={12}
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    name="memo-content-textarea"
                    id="memo-content-textarea-field"
                />

                {/* 태그 입력 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">태그</label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                ref={tagInputRef}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="태그 입력 후 Enter"
                                className="w-full"
                                autoComplete="new-password"
                                data-form-type="other"
                                data-lpignore="true"
                                name="memo-tag-input"
                                id="memo-tag-input-field"
                            />
                            {/* 태그 자동완성 드롭다운 */}
                            {tagInput.trim() && filteredTags.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-bg-primary border border-neutral-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {filteredTags.slice(0, 5).map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleAddTag(tag)}
                                            className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleAddTag()}
                            disabled={!tagInput.trim()}
                            className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            추가
                        </button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" size="sm">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-semantic-error transition-colors"
                                        aria-label={`${tag} 태그 제거`}
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* 저장/취소 버튼 */}
                <div className="flex justify-between items-center">
                    <div>
                        {onLock && memo && !memo.isLocked && (
                            <button
                                type="button"
                                onClick={() => setShowLockDialog(true)}
                                className="px-4 py-2 text-sm font-medium text-semantic-warning hover:bg-semantic-warning/10 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                잠금
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                            >
                                취소
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!title.trim() && !content.trim()}
                            className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {memo ? '수정' : '추가'}
                        </button>
                    </div>
                </div>

                {/* 잠금 다이얼로그 */}
                {showLockDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLockDialog(false)}>
                        <div className="bg-bg-primary rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">메모 잠금</h3>
                            <Input
                                ref={lockPinInputRef}
                                type="password"
                                value={lockPin}
                                onChange={(e) => setLockPin(e.target.value)}
                                placeholder="PIN을 입력하세요"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLock();
                                    } else if (e.key === 'Escape') {
                                        setShowLockDialog(false);
                                        setLockPin('');
                                    }
                                }}
                                className="mb-4"
                                autoFocus
                                autoComplete="new-password"
                                data-form-type="other"
                                data-lpignore="true"
                                name={`memo-lock-pin-${Date.now()}`}
                                id={`memo-lock-pin-input-${Date.now()}`}
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLockDialog(false);
                                        setLockPin('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLock}
                                    disabled={!lockPin.trim()}
                                    className="px-4 py-2 text-sm font-semibold bg-semantic-warning text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    잠금
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export { MemoEditor };
export default MemoEditor;
