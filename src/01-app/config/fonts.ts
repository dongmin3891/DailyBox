/**
 * Font Configuration
 * FSD App Layer - 앱 전역 폰트 설정
 */

import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

const fontVariables = `${geistSans.variable} ${geistMono.variable}`;

export { geistSans, geistMono, fontVariables };
