/**
 * Toss Design System Color Types
 * Figma Design System에서 정의된 색상 타입들
 */

export interface TossColors {
    primary: {
        blue: string;
        blueLight: string;
    };

    neutral: {
        white: string;
        gray50: string;
        gray100: string;
        gray200: string;
        gray300: string;
        gray400: string;
        gray500: string;
        gray600: string;
        gray700: string;
        gray800: string;
        gray900: string;
    };

    semantic: {
        success: string;
        warning: string;
        error: string;
    };

    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
    };

    background: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
}

/**
 * Toss Design System에서 정의된 색상 값들
 */
export const TOSS_COLORS: TossColors = {
    primary: {
        blue: '#0066FF',
        blueLight: '#E6F2FF',
    },

    neutral: {
        white: '#FFFFFF',
        gray50: '#F8F9FA',
        gray100: '#F1F3F4',
        gray200: '#E8EAED',
        gray300: '#DADCE0',
        gray400: '#BDC1C6',
        gray500: '#9AA0A6',
        gray600: '#5F6368',
        gray700: '#3C4043',
        gray800: '#202124',
        gray900: '#000000',
    },

    semantic: {
        success: '#00C853',
        warning: '#FF9800',
        error: '#F44336',
    },

    text: {
        primary: '#202124',
        secondary: '#5F6368',
        tertiary: '#9AA0A6',
        inverse: '#FFFFFF',
    },

    background: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        tertiary: '#F1F3F4',
    },
};

/**
 * Tailwind CSS 클래스명 타입
 */
export type TailwindColorClass =
    // Primary
    | 'bg-primary-blue'
    | 'text-primary-blue'
    | 'border-primary-blue'
    | 'bg-primary-blue-light'
    | 'text-primary-blue-light'
    | 'border-primary-blue-light'

    // Neutral
    | 'bg-neutral-white'
    | 'text-neutral-white'
    | 'border-neutral-white'
    | 'bg-neutral-gray-50'
    | 'text-neutral-gray-50'
    | 'border-neutral-gray-50'
    | 'bg-neutral-gray-100'
    | 'text-neutral-gray-100'
    | 'border-neutral-gray-100'
    | 'bg-neutral-gray-200'
    | 'text-neutral-gray-200'
    | 'border-neutral-gray-200'
    | 'bg-neutral-gray-300'
    | 'text-neutral-gray-300'
    | 'border-neutral-gray-300'
    | 'bg-neutral-gray-400'
    | 'text-neutral-gray-400'
    | 'border-neutral-gray-400'
    | 'bg-neutral-gray-500'
    | 'text-neutral-gray-500'
    | 'border-neutral-gray-500'
    | 'bg-neutral-gray-600'
    | 'text-neutral-gray-600'
    | 'border-neutral-gray-600'
    | 'bg-neutral-gray-700'
    | 'text-neutral-gray-700'
    | 'border-neutral-gray-700'
    | 'bg-neutral-gray-800'
    | 'text-neutral-gray-800'
    | 'border-neutral-gray-800'
    | 'bg-neutral-gray-900'
    | 'text-neutral-gray-900'
    | 'border-neutral-gray-900'

    // Semantic
    | 'bg-semantic-success'
    | 'text-semantic-success'
    | 'border-semantic-success'
    | 'bg-semantic-warning'
    | 'text-semantic-warning'
    | 'border-semantic-warning'
    | 'bg-semantic-error'
    | 'text-semantic-error'
    | 'border-semantic-error'

    // Toss Brand Aliases
    | 'bg-toss-blue'
    | 'text-toss-blue'
    | 'border-toss-blue'
    | 'bg-toss-blue-light'
    | 'text-toss-blue-light'
    | 'border-toss-blue-light'
    | 'bg-toss-success'
    | 'text-toss-success'
    | 'border-toss-success'
    | 'bg-toss-error'
    | 'text-toss-error'
    | 'border-toss-error'

    // Typography & Background
    | 'text-text-primary'
    | 'text-text-secondary'
    | 'text-text-tertiary'
    | 'text-text-inverse'
    | 'bg-bg-primary'
    | 'bg-bg-secondary'
    | 'bg-bg-tertiary';

/**
 * 색상 유틸리티 함수들
 */
export const colorUtils = {
    /**
     * HEX 색상을 RGB로 변환
     */
    hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    },

    /**
     * RGB를 HEX로 변환
     */
    rgbToHex: (r: number, g: number, b: number): string => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },

    /**
     * 색상의 명도 계산 (0-255)
     */
    getLuminance: (hex: string): number => {
        const rgb = colorUtils.hexToRgb(hex);
        if (!rgb) return 0;

        // Relative luminance formula
        const { r, g, b } = rgb;
        return 0.299 * r + 0.587 * g + 0.114 * b;
    },

    /**
     * 색상이 어두운지 판단 (텍스트 색상 결정에 유용)
     */
    isDark: (hex: string): boolean => {
        return colorUtils.getLuminance(hex) < 128;
    },
};
