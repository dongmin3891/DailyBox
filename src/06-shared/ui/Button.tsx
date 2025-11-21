/**
 * Button Component
 * Toss 디자인 시스템을 따르는 재사용 가능한 버튼 컴포넌트
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** 버튼 텍스트 또는 아이콘 */
    children: React.ReactNode;
    /** 버튼 변형 */
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
    /** 버튼 크기 */
    size?: 'sm' | 'md' | 'lg' | 'calculator';
    /** 전체 너비 사용 여부 */
    fullWidth?: boolean;
    /** 비활성 상태 */
    disabled?: boolean;
    /** 로딩 상태 */
    loading?: boolean;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 변형별 스타일 매핑
 */
const variantStyles = {
    primary: 'bg-toss-blue text-white hover:opacity-90',
    secondary: 'bg-toss-blue-light text-toss-blue hover:bg-opacity-80',
    success: 'bg-semantic-success text-white hover:opacity-90',
    warning: 'bg-semantic-warning text-white hover:opacity-90',
    error: 'bg-semantic-error text-white hover:opacity-90',
    neutral: 'bg-neutral-gray-100 text-text-primary hover:opacity-80',
} as const;

/**
 * 크기별 스타일 매핑
 */
const sizeStyles = {
    sm: 'px-3 py-2 text-sm rounded-lg min-h-[36px]',
    md: 'px-6 py-3 text-base rounded-lg min-h-[44px]',
    lg: 'px-6 py-4 text-lg rounded-xl min-h-[56px]',
    calculator: 'w-16 h-16 text-2xl rounded-2xl min-h-[64px]',
} as const;

/**
 * 기본 버튼 스타일
 */
const baseStyles = `
    font-semibold 
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50
    active:scale-95 transform
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
`
    .replace(/\s+/g, ' ')
    .trim();

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const isDisabled = disabled || loading;

    const buttonClasses = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        size === 'calculator' ? 'flex items-center justify-center' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={buttonClasses} disabled={isDisabled} {...props}>
            {loading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>로딩중...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
