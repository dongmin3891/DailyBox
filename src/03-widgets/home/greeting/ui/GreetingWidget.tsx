/**
 * GreetingWidget Component
 * 시간대에 따른 맞춤형 인사말을 표시하는 위젯
 *
 * 개선: 높이 축소, 두 줄 구성, 오늘 요약 서브라인 추가, 실시간 날씨 표시
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { Card } from '@/shared/ui';
import { useTodoSlice } from '@/features/todo';
import { useTimerSlice } from '@/features/timer';
import { useMenuSlice } from '@/features/menu';
import { useWeatherSlice } from '@/features/weather';
import { calculateTodayStats } from '@/entities/summary/lib/todayStats';
import { msToHoursMinutes } from '@/shared/lib/utils/dateUtils';
import type { WeatherCondition } from '@/entities/weather';

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

/**
 * 날씨 조건에 따른 이모지 반환
 */
const getWeatherEmoji = (condition: WeatherCondition): string => {
    const emojiMap: Record<WeatherCondition, string> = {
        clear: '☀️',
        clouds: '☁️',
        rain: '🌧️',
        drizzle: '🌦️',
        thunderstorm: '⛈️',
        snow: '❄️',
        mist: '🌫️',
        fog: '🌫️',
        haze: '🌫️',
    };
    return emojiMap[condition] || '☀️';
};

const GreetingWidget: React.FC<GreetingWidgetProps> = ({ userName, className = '' }) => {
    const currentHour = new Date().getHours();
    const { message, emoji } = getGreetingMessage(currentHour);

    const { todos, loadTodos } = useTodoSlice();
    const { timers, loadTimers } = useTimerSlice();
    const { mealRecords, loadMenus } = useMenuSlice();
    const { weather, loadWeather, loadWeatherByLocation } = useWeatherSlice();

    useEffect(() => {
        loadTodos();
        loadTimers();
        loadMenus();
    }, [loadTodos, loadTimers, loadMenus]);

    // 날씨 데이터 로드 (위치 기반 또는 기본 도시)
    // API 키는 서버에서 처리하므로 클라이언트에서는 전달하지 않음
    useEffect(() => {
        // 위치 정보가 있으면 위치 기반으로, 없으면 기본 도시로
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    loadWeatherByLocation(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // 위치 권한 거부 시 기본 도시 사용
                    loadWeather();
                },
                { timeout: 5000 }
            );
        } else {
            // Geolocation 미지원 시 기본 도시 사용
            loadWeather();
        }
    }, [loadWeather, loadWeatherByLocation]);

    const stats = useMemo(() => {
        return calculateTodayStats({
            todos,
            memos: [],
            timers,
            mealRecords,
            calcHistory: [],
        });
    }, [todos, timers, mealRecords]);

    const { hours: timerHours, minutes: timerMinutes } = msToHoursMinutes(stats.totalTimerMs);
    const timerDisplay = timerHours > 0 ? `${timerHours}시간 ${timerMinutes}분` : `${timerMinutes}분`;

    // 서브라인 생성: "투두 1개 · 집중 1분 · 식사 2회"
    const subline = `투두 ${stats.completedTodos}개 · 집중 ${timerDisplay} · 식사 ${stats.todayMeals}회`;

    return (
        <Card variant="gradient" padding="sm" className={`mb-3 ${className}`}>
            <div className="flex flex-col items-center gap-1.5">
                {/* 첫 번째 줄: 인사말과 날씨 */}
                <div className="flex items-center justify-center gap-2 w-full">
                    <div className="flex items-center justify-center gap-2 flex-1">
                        <span className="text-xl">{emoji}</span>
                        <p className="text-white font-medium text-sm leading-tight">
                            {userName ? `${userName}님, ${message}` : message}
                        </p>
                    </div>
                    {/* 날씨 정보 */}
                    {weather && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg">{getWeatherEmoji(weather.condition)}</span>
                            <span className="text-white/90 text-xs font-medium">{weather.temperature}°</span>
                        </div>
                    )}
                </div>
                {/* 두 번째 줄: 오늘 요약 서브라인 */}
                {/* <p className="text-white/80 text-xs leading-tight">{subline}</p> */}
            </div>
        </Card>
    );
};

export default GreetingWidget;
