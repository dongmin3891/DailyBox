/**
 * MenuEditor Component
 * 메뉴 추가/수정을 위한 컴포넌트
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/shared/ui';
import type { Menu } from '../model/types';

export interface MenuEditorProps {
    /** 편집할 메뉴 (없으면 새 메뉴) */
    menu?: Menu & { id: number };
    /** 저장 핸들러 */
    onSave: (menu: { name: string; tags: string[] }) => void;
    /** 취소 핸들러 */
    onCancel?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const MenuEditor: React.FC<MenuEditorProps> = ({ menu, onSave, onCancel, className = '' }) => {
    const [name, setName] = useState(menu?.name || '');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(menu?.tags || []);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // 컴포넌트 마운트 시 또는 menu prop 변경 시 초기화
    useEffect(() => {
        if (menu) {
            setName(menu.name);
            setTags(menu.tags);
        } else {
            // 새 메뉴 추가 모드: 상태 초기화
            setName('');
            setTags([]);
            setTagInput('');
        }
    }, [menu]);

    // 새 메뉴 추가 모드일 때만 포커스
    useEffect(() => {
        if (!menu) {
            const timer = setTimeout(() => {
                nameInputRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [menu]);

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const isNameInput = target === nameInputRef.current;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (isNameInput && name.trim()) {
                // 메뉴 이름 입력 필드에서 Enter: 저장
                handleSave();
            } else if (!isNameInput && tagInput.trim()) {
                // 태그 입력 필드에서 Enter: 태그 추가
                handleAddTag();
            }
        }
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            return;
        }

        const menuData = { name: name.trim(), tags };

        // onSave가 Promise를 반환할 수 있으므로 await 처리
        try {
            await Promise.resolve(onSave(menuData));

            // 새 메뉴 추가인 경우에만 상태 초기화
            if (!menu) {
                setName('');
                setTags([]);
                setTagInput('');
            }
        } catch (error) {
            console.error('Failed to save menu:', error);
            // 에러는 상위에서 처리하므로 여기서는 로그만
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 메뉴 이름 입력 */}
            <Input
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메뉴 이름 (예: 치킨, 파스타)"
                className="text-lg font-semibold"
            />

            {/* 태그 입력 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">태그</label>
                <div className="flex gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="태그 입력 후 Enter"
                        className="flex-1"
                    />
                    <button
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        추가
                    </button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-toss-blue-light/30 text-toss-blue rounded-full text-sm font-medium"
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-semantic-error transition-colors"
                                    aria-label={`${tag} 태그 제거`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
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
                    disabled={!name.trim()}
                    className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {menu ? '수정' : '추가'}
                </button>
            </div>
        </div>
    );
};

export { MenuEditor };
export default MenuEditor;
