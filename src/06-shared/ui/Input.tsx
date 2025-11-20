/**
 * Input Component
 * Toss 디자인 시스템을 따르는 재사용 가능한 입력 컴포넌트
 */

import React, { forwardRef, useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    /** 입력 필드 라벨 */
    label?: string;
    /** 도움말 텍스트 */
    helperText?: string;
    /** 에러 메시지 */
    error?: string;
    /** 성공 상태 */
    success?: boolean;
    /** 입력 크기 */
    size?: 'sm' | 'md' | 'lg';
    /** 전체 너비 사용 여부 */
    fullWidth?: boolean;
    /** 접두사 아이콘 또는 텍스트 */
    prefix?: React.ReactNode;
    /** 접미사 아이콘 또는 텍스트 */
    suffix?: React.ReactNode;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 크기별 스타일 매핑
 */
const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
} as const;

/**
 * 상태별 스타일 매핑
 */
const getStateStyles = (error?: string, success?: boolean) => {
    if (error) {
        return 'border-semantic-error focus:ring-semantic-error';
    }
    if (success) {
        return 'border-semantic-success focus:ring-semantic-success';
    }
    return 'border-neutral-gray-300 focus:ring-toss-blue focus:border-toss-blue';
};

/**
 * 기본 입력 스타일
 */
const baseInputStyles = `
    w-full 
    border 
    rounded-lg 
    bg-neutral-white 
    text-text-primary 
    placeholder-text-tertiary
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-neutral-gray-100 disabled:cursor-not-allowed disabled:opacity-50
`
    .replace(/\s+/g, ' ')
    .trim();

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, helperText, error, success, size = 'md', fullWidth = true, prefix, suffix, className = '', ...props },
        ref
    ) => {
        const generatedId = useId();
        const inputId = props.id || generatedId;

        const inputClasses = [
            baseInputStyles,
            sizeStyles[size],
            getStateStyles(error, success),
            fullWidth ? 'w-full' : '',
            prefix ? 'pl-10' : '',
            suffix ? 'pr-10' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={fullWidth ? 'w-full' : 'inline-block'}>
                {/* 라벨 */}
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-2">
                        {label}
                    </label>
                )}

                {/* 입력 컨테이너 */}
                <div className="relative">
                    {/* 접두사 */}
                    {prefix && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-text-tertiary">{prefix}</span>
                        </div>
                    )}

                    {/* 입력 필드 */}
                    <input ref={ref} id={inputId} className={inputClasses} {...props} />

                    {/* 접미사 */}
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-text-tertiary">{suffix}</span>
                        </div>
                    )}
                </div>

                {/* 헬퍼 텍스트 또는 에러 메시지 */}
                {(helperText || error) && (
                    <div className="mt-1">
                        {error ? (
                            <p className="text-semantic-error text-xs font-medium" role="alert">
                                {error}
                            </p>
                        ) : helperText ? (
                            <p className="text-text-tertiary text-xs">{helperText}</p>
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
