/**
 * FeaturesGridWidget Component
 * 홈페이지 기능들을 그리드 형태로 표시하는 위젯
 */

'use client';

import React from 'react';
import { FeatureCard } from '@/shared/ui';

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
        enabled: false,
    },
    {
        icon: '✅',
        title: '투두',
        description: '할 일 관리',
        theme: 'success',
        href: '/todo',
        enabled: false,
    },
    {
        icon: '⏰',
        title: '타이머',
        description: '시간 관리',
        theme: 'warning',
        href: '/timer',
        enabled: false,
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
        enabled: false,
    },
    {
        icon: '🔮',
        title: '오늘의 운세',
        description: '운세 확인하기',
        theme: 'blue',
        href: '/fortune',
        enabled: false,
    },
];

/**
 * 준비중 기능 클릭 핸들러
 */
const handleComingSoon = (title: string) => {
    alert(`${title} 기능은 준비 중입니다! 🚧`);
};

const FeaturesGridWidget: React.FC<FeaturesGridWidgetProps> = ({ features = defaultFeatures, className = '' }) => {
    return (
        <div className={`bg-bg-primary rounded-2xl p-5 shadow-sm ${className}`}>
            <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        theme={feature.theme}
                        href={feature.enabled ? feature.href : undefined}
                        onClick={!feature.enabled ? () => handleComingSoon(feature.title) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturesGridWidget;
