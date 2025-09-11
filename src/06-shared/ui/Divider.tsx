/**
 * Divider Component
 * 섹션 구분을 위한 재사용 가능한 구분선 컴포넌트
 */

import React from 'react';

export interface DividerProps {
    /** 구분선 방향 */
    orientation?: 'horizontal' | 'vertical';
    /** 구분선 색상 */
    color?: 'light' | 'medium' | 'dark';
    /** 구분선 두께 */
    thickness?: 'thin' | 'medium' | 'thick';
    /** 여백 설정 */
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    /** 중앙에 텍스트 표시 */
    label?: string;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 색상별 스타일 매핑
 */
const colorStyles = {
    light: 'border-neutral-gray-200',
    medium: 'border-neutral-gray-300',
    dark: 'border-neutral-gray-400',
} as const;

/**
 * 두께별 스타일 매핑
 */
const thicknessStyles = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4',
} as const;

/**
 * 세로 방향 두께별 스타일
 */
const verticalThicknessStyles = {
    thin: 'border-l',
    medium: 'border-l-2',
    thick: 'border-l-4',
} as const;

/**
 * 여백별 스타일 매핑
 */
const spacingStyles = {
    none: '',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
} as const;

/**
 * 세로 방향 여백별 스타일
 */
const verticalSpacingStyles = {
    none: '',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
} as const;

const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    color = 'light',
    thickness = 'thin',
    spacing = 'md',
    label,
    className = '',
}) => {
    if (label && orientation === 'horizontal') {
        // 라벨이 있는 가로 구분선
        return (
            <div className={`relative flex items-center ${spacingStyles[spacing]} ${className}`}>
                <div className={`flex-grow ${thicknessStyles[thickness]} ${colorStyles[color]}`} />
                <span className="px-3 text-sm text-text-tertiary bg-bg-primary">{label}</span>
                <div className={`flex-grow ${thicknessStyles[thickness]} ${colorStyles[color]}`} />
            </div>
        );
    }

    if (orientation === 'vertical') {
        // 세로 구분선
        const verticalClasses = [
            'h-full',
            verticalThicknessStyles[thickness],
            colorStyles[color],
            verticalSpacingStyles[spacing],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return <div className={verticalClasses} role="separator" aria-orientation="vertical" />;
    }

    // 기본 가로 구분선
    const horizontalClasses = [
        'w-full',
        thicknessStyles[thickness],
        colorStyles[color],
        spacingStyles[spacing],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <hr className={horizontalClasses} role="separator" aria-orientation="horizontal" />;
};

export default Divider;
