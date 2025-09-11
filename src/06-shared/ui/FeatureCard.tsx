/**
 * FeatureCard Component
 * 홈페이지 기능 카드들을 위한 재사용 가능한 컴포넌트
 */

import React from 'react';
import Link from 'next/link';

export interface FeatureCardProps {
    /** 카드 아이콘 (이모지) */
    icon: string;
    /** 카드 제목 */
    title: string;
    /** 카드 설명 */
    description: string;
    /** 카드 테마 색상 */
    theme: 'blue' | 'success' | 'warning' | 'secondary';
    /** 링크 URL (선택적) */
    href?: string;
    /** 클릭 이벤트 핸들러 (선택적) */
    onClick?: () => void;
}

/**
 * 테마별 스타일 매핑
 */
const themeStyles = {
    blue: 'bg-toss-blue/10 border-toss-blue/25',
    success: 'bg-semantic-success/15 border-semantic-success/30',
    warning: 'bg-semantic-warning/15 border-semantic-warning/30',
    secondary: 'bg-toss-blue-light/40 border-toss-blue/20',
} as const;

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, theme, href, onClick }) => {
    const cardContent = (
        <div
            className={`
                ${themeStyles[theme]} 
                border rounded-2xl p-5 
                hover:shadow-md transition-all cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50
                active:scale-95 transform
            `}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-label={`${title}: ${description}`}
        >
            <div className="text-4xl mb-4" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-neutral-gray-700 font-semibold mb-1">{title}</h3>
            <p className="text-neutral-gray-500 text-xs">{description}</p>
        </div>
    );

    // href가 있으면 Link로 감싸기, 없으면 그대로 반환
    if (href) {
        return (
            <Link
                href={href}
                className="focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50 rounded-2xl"
                aria-label={`${title} 페이지로 이동: ${description}`}
            >
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};

export default FeatureCard;
