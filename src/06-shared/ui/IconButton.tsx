/**
 * IconButton Component
 * 아이콘만 포함하는 원형 또는 정사각형 버튼 컴포넌트
 */

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** 아이콘 컴포넌트 */
    icon: React.ReactNode;
    /** 버튼 변형 */
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    /** 버튼 크기 */
    size?: 'sm' | 'md' | 'lg';
    /** 버튼 모양 */
    shape?: 'square' | 'circle';
    /** 비활성 상태 */
    disabled?: boolean;
    /** 접근성을 위한 라벨 */
    'aria-label': string;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 변형별 스타일 매핑
 */
const variantStyles = {
    primary: 'bg-toss-blue text-white hover:opacity-90',
    secondary: 'bg-toss-blue-light text-toss-blue hover:bg-opacity-80',
    ghost: 'bg-transparent text-text-primary hover:bg-neutral-gray-100',
    outline: 'bg-transparent text-text-primary border border-neutral-gray-300 hover:bg-neutral-gray-50',
} as const;

/**
 * 크기별 스타일 매핑
 */
const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
} as const;

/**
 * 모양별 스타일 매핑
 */
const shapeStyles = {
    square: 'rounded-lg',
    circle: 'rounded-full',
} as const;

/**
 * 기본 아이콘 버튼 스타일
 */
const baseStyles = `
    inline-flex 
    items-center 
    justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50
    active:scale-95 transform
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
`
    .replace(/\s+/g, ' ')
    .trim();

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    variant = 'ghost',
    size = 'md',
    shape = 'circle',
    disabled = false,
    className = '',
    ...props
}) => {
    const buttonClasses = [baseStyles, variantStyles[variant], sizeStyles[size], shapeStyles[shape], className]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={buttonClasses} disabled={disabled} {...props}>
            {icon}
        </button>
    );
};

export default IconButton;








