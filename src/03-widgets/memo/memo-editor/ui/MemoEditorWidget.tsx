/**
 * MemoEditorWidget Component
 * 메모 작성/수정을 위한 위젯
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
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

const AUTO_SAVE_DELAY = 2000; // 2초

const MemoEditorWidget: React.FC<MemoEditorWidgetProps> = ({ memoId, className = '' }) => {
    const router = useRouter();
    const { memos, loadMemos, addMemo, updateMemo, lockMemo, selectedMemoId } = useMemoSlice();
    const memo = memoId ? memos.find((m) => m.id === memoId) : undefined;

    const [title, setTitle] = useState(memo?.title || '');
    const [content, setContent] = useState(memo?.content || '');
    const [tags, setTags] = useState<string[]>(memo?.tags || []);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const createdMemoIdRef = useRef<number | null>(null);
    const { allTags, loadTags } = useMemoSlice();

    useEffect(() => {
        loadMemos();
        loadTags();
    }, [loadMemos, loadTags]);

    useEffect(() => {
        if (memo) {
            setTitle(memo.title);
            setContent(memo.content);
            setTags(memo.tags || []);
        } else {
            setTitle('');
            setContent('');
            setTags([]);
        }
    }, [memo]);

    // 자동 저장 로직
    useEffect(() => {
        // 새 메모이고 내용이 없으면 자동 저장하지 않음
        if (!memoId && !title.trim() && !content.trim()) {
            return;
        }

        // 기존 타이머 클리어
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // 새 타이머 설정
        autoSaveTimerRef.current = setTimeout(async () => {
            if (title.trim() || content.trim()) {
                setIsSaving(true);
                try {
                    if (memoId || createdMemoIdRef.current) {
                        // 수정
                        const id = memoId || createdMemoIdRef.current!;
                        await updateMemo(id, {
                            title: title.trim() || '제목 없음',
                            content: content.trim(),
                            tags: tags,
                        });
                    } else {
                        // 새 메모 생성
                        await addMemo({
                            title: title.trim() || '제목 없음',
                            content: content.trim(),
                            tags: tags,
                        });
                        // addMemo 후 selectedMemoId에 새로 생성된 ID가 설정됨
                        const newId = useMemoSlice.getState().selectedMemoId;
                        if (newId && !createdMemoIdRef.current) {
                            createdMemoIdRef.current = newId;
                        }
                    }
                    setLastSaved(new Date());
                } catch (error) {
                    console.error('Auto-save failed:', error);
                } finally {
                    setIsSaving(false);
                }
            }
        }, AUTO_SAVE_DELAY);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [title, content, tags, memoId, addMemo, updateMemo]);

    const handleSave = async (memoData: { title: string; content: string }) => {
        // 타이머 클리어하고 즉시 저장
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        setIsSaving(true);
        try {
            if (memoId || createdMemoIdRef.current) {
                // 수정
                const id = memoId || createdMemoIdRef.current!;
                await updateMemo(id, { ...memoData, tags });
            } else {
                // 새 메모 추가
                await addMemo({ ...memoData, tags });
            }
            setLastSaved(new Date());
            router.back();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const handleLock = async (pin: string) => {
        if (memoId || createdMemoIdRef.current) {
            const id = memoId || createdMemoIdRef.current!;
            await lockMemo(id, pin);
        }
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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={handleCancel}
                            aria-label="뒤로 가기"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">{memoId ? '메모 수정' : '새 메모'}</h1>
                            {lastSaved && (
                                <p className="text-xs text-text-tertiary mt-1">
                                    {isSaving ? '저장 중...' : `마지막 저장: ${lastSaved.toLocaleTimeString('ko-KR')}`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto">
                    <MemoEditor
                        memo={memo ? { ...memo, title, content, tags } : undefined}
                        onSave={handleSave}
                        onLock={handleLock}
                        onCancel={handleCancel}
                        title={title}
                        content={content}
                        tags={tags}
                        onTitleChange={setTitle}
                        onContentChange={setContent}
                        onTagsChange={setTags}
                        allTags={allTags}
                    />
                </div>
            </main>
        </div>
    );
};

export default MemoEditorWidget;
