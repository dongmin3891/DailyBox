/**
 * WeatherForecastWidget Component
 * 현재 날씨와 5일 예보를 표시하는 위젯
 *
 * 표시 내용:
 * - 현재 날씨: 온도, 아이콘, 설명, 도시명
 * - 5일 예보: 날짜별 최고/최저 온도, 아이콘
 */

'use client';

import React, { useEffect } from 'react';
import { Card } from '@/shared/ui';
import { useWeatherSlice } from '@/features/weather';
import type { WeatherCondition } from '@/entities/weather';

export interface WeatherForecastWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

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

/**
 * 날짜 포맷팅 (오늘(요일)/내일(요일)/모레(요일) 또는 MM/DD (요일))
 */
const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00'); // 시간을 명시적으로 설정
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    // 오늘인지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `오늘(${weekday})`;
    } else if (diffDays === 1) {
        return `내일(${weekday})`;
    } else if (diffDays === 2) {
        return `모레(${weekday})`;
    }

    return `${month}/${day} (${weekday})`;
};

const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({ className = '' }) => {
    const { forecast, loadForecast, loadForecastByLocation, isLoading } = useWeatherSlice();

    useEffect(() => {
        // API 키는 서버에서 처리하므로 클라이언트에서는 전달하지 않음
        // 위치 정보가 있으면 위치 기반으로, 없으면 기본 도시로
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    loadForecastByLocation(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // 위치 권한 거부 시 기본 도시 사용
                    loadForecast();
                },
                { timeout: 5000 }
            );
        } else {
            // Geolocation 미지원 시 기본 도시 사용
            loadForecast();
        }
    }, [loadForecast, loadForecastByLocation]);

    if (isLoading) {
        return (
            <Card variant="default" padding="md" className={`mb-4 bg-bg-primary/50 ${className}`}>
                <div className="flex items-center justify-center py-4">
                    <span className="text-text-tertiary text-sm">날씨 정보를 불러오는 중...</span>
                </div>
            </Card>
        );
    }

    if (!forecast) {
        return null;
    }

    const { current, dailyForecast } = forecast;

    return (
        <Card variant="default" padding="md" className={`mb-4 bg-bg-primary/50 ${className}`}>
            {/* 현재 날씨 섹션 */}
            <div className="mb-4 pb-4 border-b border-border-secondary">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{getWeatherEmoji(current.condition)}</span>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-text-primary">{current.temperature}°</span>
                                <span className="text-sm text-text-tertiary">체감 {current.feelsLike}°</span>
                            </div>
                            <span className="text-xs text-text-tertiary mt-0.5">{current.description}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-text-tertiary">{current.city}</span>
                        <div className="text-xs text-text-tertiary mt-1">
                            습도 {current.humidity}% · 풍속 {current.windSpeed.toFixed(1)}m/s
                        </div>
                    </div>
                </div>
            </div>

            {/* 5일 예보 섹션 */}
            {dailyForecast.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-text-secondary mb-2">5일 예보</h3>
                    <div className="space-y-2">
                        {dailyForecast.slice(0, 5).map((day, index) => (
                            <div
                                key={day.date}
                                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-bg-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-xs text-text-tertiary font-medium w-20 flex-shrink-0">
                                        {formatDate(day.date)}
                                    </span>
                                    <span className="text-lg flex-shrink-0">{getWeatherEmoji(day.condition)}</span>
                                    <span className="text-xs text-text-tertiary flex-shrink-0 truncate">
                                        {day.description}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm font-semibold text-text-primary">{day.maxTemp}°</span>
                                    <span className="text-sm text-text-tertiary">{day.minTemp}°</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default WeatherForecastWidget;
