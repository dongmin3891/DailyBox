/**
 * MemoEditor Component
 * 메모 편집을 위한 컴포넌트
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/shared/ui';
import { Card } from '@/shared/ui';
import type { Memo } from '../model/types';

export interface MemoEditorProps {
    /** 편집할 메모 (없으면 새 메모) */
    memo?: Memo & { id: number };
    /** 저장 핸들러 */
    onSave: (memo: { title: string; content: string }) => void;
    /** 취소 핸들러 */
    onCancel?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MemoEditor: React.FC<MemoEditorProps> = ({ memo, onSave, onCancel, className = '' }) => {
    const [title, setTitle] = useState(memo?.title || '');
    const [content, setContent] = useState(memo?.content || '');

    useEffect(() => {
        if (memo) {
            setTitle(memo.title);
            setContent(memo.content);
        } else {
            // 새 메모인 경우 초기화
            setTitle('');
            setContent('');
        }
    }, [memo]);

    const handleSave = () => {
        if (title.trim() || content.trim()) {
            onSave({ title: title.trim() || '제목 없음', content: content.trim() });
            if (!memo) {
                // 새 메모인 경우 초기화
                setTitle('');
                setContent('');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl/Cmd + Enter: 저장
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        // ESC: 취소
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
    };

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
                />

                {/* 내용 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메모 내용을 입력하세요"
                    className="w-full min-h-[300px] px-4 py-3 border border-neutral-gray-300 rounded-lg bg-neutral-white text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50 focus:border-toss-blue transition-all duration-200 resize-none"
                    rows={12}
                />

                {/* 저장/취소 버튼 */}
                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            취소
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!title.trim() && !content.trim()}
                        className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {memo ? '수정' : '추가'}
                    </button>
                </div>
            </div>
        </Card>
    );
};

export { MemoEditor };
export default MemoEditor;
