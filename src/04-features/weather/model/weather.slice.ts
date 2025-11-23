/**
 * Weather Feature Slice
 * 날씨 데이터 상태 관리
 */

'use client';

import { create } from 'zustand';
import {
    fetchWeatherData,
    fetchWeatherByLocation,
    fetchWeatherForecast,
    fetchWeatherForecastByLocation,
} from '@/entities/weather';
import type { WeatherData, WeatherForecastData } from '@/entities/weather';

type WeatherSlice = {
    weather: WeatherData | null;
    forecast: WeatherForecastData | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;

    // Actions
    // API 키는 서버에서 처리하므로 클라이언트에서는 전달하지 않음
    loadWeather: (city?: string) => Promise<void>;
    loadWeatherByLocation: (latitude: number, longitude: number) => Promise<void>;
    loadForecast: (city?: string) => Promise<void>;
    loadForecastByLocation: (latitude: number, longitude: number) => Promise<void>;
    clearWeather: () => void;
};

// OpenWeather API는 10분마다 업데이트되므로 10분 캐시 설정
const CACHE_DURATION = 10 * 60 * 1000; // 10분 캐시

export const useWeatherSlice = create<WeatherSlice>((set, get) => ({
    weather: null,
    forecast: null,
    isLoading: false,
    error: null,
    lastUpdated: null,

    loadWeather: async (city) => {
        const { lastUpdated, weather } = get();
        const now = Date.now();

        // 캐시된 데이터가 있고 10분 이내라면 재요청하지 않음
        if (weather && lastUpdated && now - lastUpdated < CACHE_DURATION) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await fetchWeatherData(city);
            set({
                weather: data,
                isLoading: false,
                lastUpdated: now,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load weather:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : '날씨 데이터를 불러올 수 없습니다.',
            });
        }
    },

    loadWeatherByLocation: async (latitude, longitude) => {
        const { lastUpdated, weather } = get();
        const now = Date.now();

        // 캐시된 데이터가 있고 10분 이내라면 재요청하지 않음
        if (weather && lastUpdated && now - lastUpdated < CACHE_DURATION) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await fetchWeatherByLocation(latitude, longitude);
            set({
                weather: data,
                isLoading: false,
                lastUpdated: now,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load weather by location:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : '날씨 데이터를 불러올 수 없습니다.',
            });
        }
    },

    loadForecast: async (city) => {
        const { lastUpdated, forecast } = get();
        const now = Date.now();

        // 캐시된 데이터가 있고 10분 이내라면 재요청하지 않음
        if (forecast && lastUpdated && now - lastUpdated < CACHE_DURATION) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await fetchWeatherForecast(city);
            set({
                forecast: data,
                weather: data.current, // 현재 날씨도 함께 업데이트
                isLoading: false,
                lastUpdated: now,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load forecast:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : '예보 데이터를 불러올 수 없습니다.',
            });
        }
    },

    loadForecastByLocation: async (latitude, longitude) => {
        const { lastUpdated, forecast } = get();
        const now = Date.now();

        // 캐시된 데이터가 있고 10분 이내라면 재요청하지 않음
        if (forecast && lastUpdated && now - lastUpdated < CACHE_DURATION) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await fetchWeatherForecastByLocation(latitude, longitude);
            set({
                forecast: data,
                weather: data.current, // 현재 날씨도 함께 업데이트
                isLoading: false,
                lastUpdated: now,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load forecast by location:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : '예보 데이터를 불러올 수 없습니다.',
            });
        }
    },

    clearWeather: () => {
        set({
            weather: null,
            forecast: null,
            isLoading: false,
            error: null,
            lastUpdated: null,
        });
    },
}));
