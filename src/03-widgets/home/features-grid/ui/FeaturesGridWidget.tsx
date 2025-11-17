/**
 * FeaturesGridWidget Component
 * 홈페이지 기능들을 그리드 형태로 표시하는 위젯
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui';

export interface FeatureItem {
    /** 기능 아이콘 */
    icon: string;
    /** 기능 제목 */
    title: string;
    /** 기능 설명 */
    description: string;
    /** 테마 색상 */
    theme: 'blue' | 'success' | 'warning' | 'secondary';
    /** 링크 URL */
    href?: string;
    /** 활성화 상태 */
    enabled?: boolean;
}

export interface FeaturesGridWidgetProps {
    /** 기능 목록 */
    features?: FeatureItem[];
    /** 추가 클래스명 */
    className?: string;
}

/**
 * 기본 기능 목록
 */
const defaultFeatures: FeatureItem[] = [
    {
        icon: '📝',
        title: '메모',
        description: '빠른 메모 작성',
        theme: 'secondary',
        href: '/memo',
        enabled: true,
    },
    {
        icon: '✅',
        title: '투두',
        description: '할 일 관리',
        theme: 'success',
        href: '/todo',
        enabled: true,
    },
    {
        icon: '⏰',
        title: '타이머',
        description: '시간 관리',
        theme: 'warning',
        href: '/timer',
        enabled: true,
    },
    {
        icon: '🔢',
        title: '계산기',
        description: '빠른 계산',
        theme: 'blue',
        href: '/calculator',
        enabled: true,
    },
    {
        icon: '🍽️',
        title: '메뉴추천',
        description: '오늘 뭐 먹지?',
        theme: 'warning',
        href: '/menu',
        enabled: true,
    },
    {
        icon: '🔮',
        title: '오늘의 운세',
        description: '운세 확인하기',
        theme: 'blue',
        href: '/fortune',
        enabled: false,
    },
    {
        icon: '🎨',
        title: '디자인 시스템',
        description: 'UI 컴포넌트 가이드',
        theme: 'secondary',
        href: '/design-system',
        enabled: true,
    },
    {
        icon: '🌈',
        title: '컬러 가이드',
        description: 'Toss 색상 시스템',
        theme: 'warning',
        href: '/colors',
        enabled: true,
    },
];

/**
 * 준비중 기능 클릭 핸들러
 */
const handleComingSoon = (title: string) => {
    alert(`${title} 기능은 준비 중입니다! 🚧`);
};

/**
 * 개별 기능 카드 컴포넌트
 */
const FeatureItem: React.FC<{ feature: FeatureItem }> = ({ feature }) => {
    const themeColors = {
        blue: 'bg-toss-blue/10 border-toss-blue/25',
        success: 'bg-semantic-success/15 border-semantic-success/30',
        warning: 'bg-semantic-warning/15 border-semantic-warning/30',
        secondary: 'bg-toss-blue-light/40 border-toss-blue/20',
    } as const;

    const cardContent = (
        <Card
            variant="outlined"
            padding="md"
            clickable={true}
            hoverable={true}
            onClick={!feature.enabled ? () => handleComingSoon(feature.title) : undefined}
            className={`${themeColors[feature.theme]} border-2 min-h-[120px] flex flex-col justify-center`}
        >
            <div className="text-center">
                <div className="text-4xl mb-3" aria-hidden="true">
                    {feature.icon}
                </div>
                <h3 className="text-neutral-gray-700 font-semibold mb-1 text-sm">{feature.title}</h3>
                <p className="text-neutral-gray-500 text-xs">{feature.description}</p>
            </div>
        </Card>
    );

    // 활성화된 기능은 Link로 감싸기
    if (feature.enabled && feature.href) {
        return (
            <Link
                href={feature.href}
                className="focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50 rounded-2xl"
                aria-label={`${feature.title} 페이지로 이동: ${feature.description}`}
            >
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};

const FeaturesGridWidget: React.FC<FeaturesGridWidgetProps> = ({ features = defaultFeatures, className = '' }) => {
    return (
        <Card variant="elevated" padding="md" className={className}>
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {features.map((feature, index) => (
                    <FeatureItem key={`${feature.title}-${index}`} feature={feature} />
                ))}
            </div>
        </Card>
    );
};

export default FeaturesGridWidget;
