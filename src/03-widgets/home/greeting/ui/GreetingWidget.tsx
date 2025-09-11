/**
 * GreetingWidget Component
 * 시간대에 따른 맞춤형 인사말을 표시하는 위젯
 */

'use client';

import React from 'react';

export interface GreetingWidgetProps {
    /** 사용자 이름 (선택적) */
    userName?: string;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * 현재 시간에 따른 인사말 생성
 */
const getGreetingMessage = (hour: number): { message: string; emoji: string } => {
    if (hour >= 5 && hour < 12) {
        return { message: '좋은 아침이에요!', emoji: '🌅' };
    } else if (hour >= 12 && hour < 18) {
        return { message: '좋은 오후에요!', emoji: '☀️' };
    } else if (hour >= 18 && hour < 22) {
        return { message: '좋은 저녁이에요!', emoji: '🌆' };
    } else {
        return { message: '안녕하세요!', emoji: '🌙' };
    }
};

const GreetingWidget: React.FC<GreetingWidgetProps> = ({ userName, className = '' }) => {
    const currentHour = new Date().getHours();
    const { message, emoji } = getGreetingMessage(currentHour);

    return (
        <div className={`text-center mb-6 ${className}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{emoji}</span>
                <p className="text-neutral-gray-600 font-medium">{userName ? `${userName}님, ${message}` : message}</p>
            </div>
            <p className="text-neutral-gray-500 text-sm">오늘 하루도 힘내세요 ✨</p>
        </div>
    );
};

export default GreetingWidget;
