/**
 * Card Component
 * 공통으로 사용되는 카드 레이아웃을 위한 재사용 가능한 컴포넌트
 */

import React from 'react';

export interface CardProps {
    /** 카드 내용 */
    children: React.ReactNode;
    /** 카드 변형 */
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    /** 카드 패딩 */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** 라운드 모서리 크기 */
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /** 호버 효과 활성화 */
    hoverable?: boolean;
    /** 클릭 가능한 카드 */
    clickable?: boolean;
    /** 클릭 이벤트 핸들러 */
    onClick?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 변형별 스타일 매핑
 */
const variantStyles = {
    default: 'bg-bg-primary border border-neutral-gray-200',
    elevated: 'bg-bg-primary shadow-sm border border-neutral-gray-200',
    outlined: 'bg-transparent border-2 border-neutral-gray-300',
    gradient: 'bg-gradient-to-r from-toss-blue to-toss-blue-light text-white',
} as const;

/**
 * 패딩별 스타일 매핑
 */
const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
} as const;

/**
 * 라운드별 스타일 매핑
 */
const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
} as const;

/**
 * 기본 카드 스타일
 */
const baseStyles = `
    transition-all duration-200
`
    .replace(/\s+/g, ' ')
    .trim();

/**
 * 호버 및 클릭 효과
 */
const getInteractiveStyles = (hoverable?: boolean, clickable?: boolean) => {
    const styles: string[] = [];

    if (hoverable) {
        styles.push('hover:shadow-md');
    }

    if (clickable) {
        styles.push(
            'cursor-pointer',
            'hover:shadow-md',
            'active:scale-[0.98]',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-toss-blue',
            'focus:ring-opacity-50'
        );
    }

    return styles.join(' ');
};

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    rounded = '2xl',
    hoverable = false,
    clickable = false,
    onClick,
    className = '',
}) => {
    const isInteractive = clickable || !!onClick;

    const cardClasses = [
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        getInteractiveStyles(hoverable, isInteractive),
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className={cardClasses}
            onClick={isInteractive ? handleClick : undefined}
            onKeyDown={isInteractive ? handleKeyDown : undefined}
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            aria-label={isInteractive ? '클릭 가능한 카드' : undefined}
        >
            {children}
        </div>
    );
};

export default Card;
