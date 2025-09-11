/**
 * App Metadata Configuration
 * FSD App Layer - 앱 전역 메타데이터 설정
 */

import type { Metadata } from 'next';

const appMetadata: Metadata = {
    title: 'DailyBox - 일상을 정리하는 스마트 도구',
    description: '계산기, 메모, 타이머, 운세 등 일상에 필요한 도구들을 한 곳에서',
    keywords: ['계산기', '메모', '타이머', '운세', '일상도구', '생산성'],
    authors: [{ name: 'DailyBox Team' }],
};

const appViewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0066FF', // Toss Blue
};

export { appMetadata, appViewport };
