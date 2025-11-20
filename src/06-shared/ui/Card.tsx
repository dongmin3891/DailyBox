/**
 * Card Component
 * Toss 디자인 시스템을 따르는 재사용 가능한 카드 컴포넌트
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 카드 내용 */
    children: React.ReactNode;
    /** 카드 변형 */
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    /** 패딩 크기 */
    padding?: 'sm' | 'md' | 'lg';
    /** 클릭 가능 여부 */
    clickable?: boolean;
    /** 호버 효과 여부 */
    hoverable?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 변형별 스타일 매핑
 */
const variantStyles = {
    default: 'bg-white border border-neutral-gray-200',
    elevated: 'bg-white shadow-md border border-neutral-gray-100',
    outlined: 'bg-white border-2 border-neutral-gray-300',
    gradient: 'bg-gradient-to-br from-toss-blue to-toss-blue-light border-0',
} as const;

/**
 * 패딩별 스타일 매핑
 */
const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
} as const;

/**
 * 기본 카드 스타일
 */
const baseStyles = `
    rounded-2xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50
`
    .replace(/\s+/g, ' ')
    .trim();

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    clickable = false,
    hoverable = false,
    className = '',
    onClick,
    ...props
}) => {
    const isInteractive = clickable || !!onClick || hoverable;

    const cardClasses = [
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        clickable || onClick ? 'cursor-pointer' : '',
        hoverable ? 'hover:shadow-lg hover:-translate-y-0.5' : '',
        isInteractive && !hoverable ? 'hover:opacity-90' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const Component = clickable || onClick ? 'div' : 'div';

    return (
        <Component className={cardClasses} onClick={onClick} {...props}>
            {children}
        </Component>
    );
};

export default Card;
