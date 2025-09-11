/**
 * Badge Component
 * 상태 표시나 라벨을 위한 재사용 가능한 배지 컴포넌트
 */

import React from 'react';

export interface BadgeProps {
    /** 배지 텍스트 */
    children: React.ReactNode;
    /** 배지 변형 */
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
    /** 배지 크기 */
    size?: 'sm' | 'md' | 'lg';
    /** 점 형태 (텍스트 없이) */
    dot?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 변형별 스타일 매핑
 */
const variantStyles = {
    primary: 'bg-toss-blue text-white',
    secondary: 'bg-toss-blue-light text-toss-blue',
    success: 'bg-semantic-success/15 text-semantic-success border border-semantic-success/30',
    warning: 'bg-semantic-warning/15 text-semantic-warning border border-semantic-warning/30',
    error: 'bg-semantic-error/15 text-semantic-error border border-semantic-error/30',
    neutral: 'bg-neutral-gray-100 text-neutral-gray-700',
} as const;

/**
 * 크기별 스타일 매핑
 */
const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
} as const;

/**
 * 점 형태 크기별 스타일
 */
const dotSizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
} as const;

/**
 * 기본 배지 스타일
 */
const baseStyles = `
    inline-flex 
    items-center 
    justify-center 
    font-medium 
    rounded-full
    transition-all duration-200
`
    .replace(/\s+/g, ' ')
    .trim();

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'md', dot = false, className = '' }) => {
    if (dot) {
        const dotClasses = ['rounded-full', variantStyles[variant], dotSizeStyles[size], className]
            .filter(Boolean)
            .join(' ');

        return <span className={dotClasses} aria-hidden="true" />;
    }

    const badgeClasses = [baseStyles, variantStyles[variant], sizeStyles[size], className].filter(Boolean).join(' ');

    return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
