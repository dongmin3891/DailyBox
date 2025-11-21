/**
 * TodoEditor Component
 * 투두 작성/수정을 위한 컴포넌트
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/shared/ui';
import { Card } from '@/shared/ui';
import type { Todo, TodoPriority, TodoCategory, TodoRepeat } from '../model/types';

export interface TodoEditorProps {
    /** 편집할 투두 (없으면 새 투두) */
    todo?: Todo & { id: number };
    /** 초기 마감일 (YYYY-MM-DD 형식) */
    initialDueDate?: string;
    /** 저장 핸들러 */
    onSave: (todo: {
        title: string;
        priority: TodoPriority;
        category: TodoCategory;
        dueDate?: number;
        repeat: TodoRepeat;
    }) => void;
    /** 취소 핸들러 */
    onCancel?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TodoEditor: React.FC<TodoEditorProps> = ({ todo, initialDueDate, onSave, onCancel, className = '' }) => {
    const [title, setTitle] = useState(todo?.title || '');
    const [priority, setPriority] = useState<TodoPriority>(todo?.priority || 'medium');
    const [category, setCategory] = useState<TodoCategory>(todo?.category || 'personal');
    const [dueDate, setDueDate] = useState<string>(
        todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : initialDueDate || ''
    );
    const [repeat, setRepeat] = useState<TodoRepeat>(todo?.repeat || 'none');

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setPriority(todo.priority);
            setCategory(todo.category);
            setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
            setRepeat(todo.repeat);
        } else {
            setTitle('');
            setPriority('medium');
            setCategory('personal');
            setDueDate(initialDueDate || '');
            setRepeat('none');
        }
    }, [todo, initialDueDate]);

    const handleSave = () => {
        if (title.trim()) {
            // 마감일이 있으면 해당 날짜의 23:59:59로 설정
            let dueDateTimestamp: number | undefined;
            if (dueDate) {
                const date = new Date(dueDate);
                date.setHours(23, 59, 59, 999); // 해당 날짜의 23:59:59.999로 설정
                dueDateTimestamp = date.getTime();
            }

            onSave({
                title: title.trim(),
                priority,
                category,
                dueDate: dueDateTimestamp,
                repeat,
            });
            if (!todo) {
                setTitle('');
                setPriority('medium');
                setCategory('personal');
                setDueDate('');
                setRepeat('none');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Enter: 저장
        if (e.key === 'Enter' && !e.shiftKey) {
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
                    placeholder="할 일을 입력하세요"
                    className="text-lg font-semibold"
                />

                {/* 우선순위 선택 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">우선순위</label>
                    <div className="flex gap-2">
                        {(['high', 'medium', 'low'] as TodoPriority[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                    priority === p
                                        ? p === 'high'
                                            ? 'bg-semantic-error/20 border-semantic-error text-semantic-error'
                                            : p === 'medium'
                                              ? 'bg-semantic-warning/20 border-semantic-warning text-semantic-warning'
                                              : 'bg-toss-blue/20 border-toss-blue text-toss-blue'
                                        : 'bg-transparent border-neutral-gray-300 text-text-secondary hover:border-neutral-gray-400'
                                }`}
                            >
                                {p === 'high' ? '높음' : p === 'medium' ? '중간' : '낮음'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 카테고리 선택 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">카테고리</label>
                    <div className="flex gap-2">
                        {(
                            [
                                { value: 'work', label: '업무' },
                                { value: 'home', label: '집' },
                                { value: 'personal', label: '개인' },
                            ] as { value: TodoCategory; label: string }[]
                        ).map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setCategory(c.value)}
                                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                    category === c.value
                                        ? 'bg-toss-blue/20 border-toss-blue text-toss-blue'
                                        : 'bg-transparent border-neutral-gray-300 text-text-secondary hover:border-neutral-gray-400'
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 마감일 선택 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">마감일</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-gray-300 text-text-primary bg-bg-primary focus:outline-none focus:border-toss-blue transition-all"
                    />
                    {dueDate && (
                        <button
                            type="button"
                            onClick={() => setDueDate('')}
                            className="text-sm text-semantic-error hover:underline"
                        >
                            마감일 제거
                        </button>
                    )}
                </div>

                {/* 반복 선택 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">반복</label>
                    <div className="flex gap-2">
                        {(
                            [
                                { value: 'none', label: '없음' },
                                { value: 'daily', label: '매일' },
                                { value: 'weekly', label: '매주' },
                            ] as { value: TodoRepeat; label: string }[]
                        ).map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRepeat(r.value)}
                                className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                    repeat === r.value
                                        ? 'bg-toss-blue/20 border-toss-blue text-toss-blue'
                                        : 'bg-transparent border-neutral-gray-300 text-text-secondary hover:border-neutral-gray-400'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

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
                        disabled={!title.trim()}
                        className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {todo ? '수정' : '추가'}
                    </button>
                </div>
            </div>
        </Card>
    );
};

export { TodoEditor };
export default TodoEditor;

