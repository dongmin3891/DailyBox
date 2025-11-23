/**
 * CategorySelector Component
 * 카테고리 선택 컴포넌트 (운동/공부/업무)
 */

import React from 'react';
import type { TimerCategory } from '@/entities/timer/model/types';

export interface CategorySelectorProps {
    /** 선택된 카테고리 */
    selectedCategory: TimerCategory;
    /** 카테고리 변경 핸들러 */
    onCategoryChange: (category: TimerCategory) => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const categoryConfig: Record<TimerCategory, { label: string; icon: string; color: string }> = {
    work: {
        label: '업무',
        icon: '💼',
        color: 'bg-semantic-warning/15 border-semantic-warning/30 text-semantic-warning',
    },
    study: {
        label: '공부',
        icon: '📚',
        color: 'bg-toss-blue/10 border-toss-blue/25 text-toss-blue',
    },
    exercise: {
        label: '운동',
        icon: '🏃',
        color: 'bg-semantic-success/15 border-semantic-success/30 text-semantic-success',
    },
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
    selectedCategory,
    onCategoryChange,
    className = '',
}) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            {(Object.keys(categoryConfig) as TimerCategory[]).map((category) => {
                const config = categoryConfig[category];
                const isSelected = selectedCategory === category;

                return (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`
                            flex-1 flex flex-col items-center justify-center gap-1
                            px-4 py-3 rounded-xl border-2 transition-all
                            ${isSelected ? config.color : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary'}
                            ${isSelected ? 'scale-105' : 'hover:scale-102'}
                            active:scale-95
                        `}
                    >
                        <span className="text-2xl">{config.icon}</span>
                        <span className={`text-sm font-semibold ${isSelected ? '' : 'text-text-secondary'}`}>
                            {config.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategorySelector;

