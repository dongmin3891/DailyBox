/**
 * Weather API Route
 * OpenWeather API를 서버에서 호출하여 CORS 문제 해결
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
    WeatherForecastData,
    WeatherData,
    OpenWeatherMapResponse,
    OpenWeatherMapForecastResponse,
    WeatherCondition,
    DailyForecast,
    ForecastItem,
} from '@/entities/weather';

const DEFAULT_CITY = 'Seoul';
const DEFAULT_COUNTRY = 'KR';

/**
 * OpenWeather 날씨 코드를 WeatherCondition으로 변환
 */
const mapWeatherCondition = (main: string): WeatherCondition => {
    const conditionMap: Record<string, WeatherCondition> = {
        Clear: 'clear',
        Clouds: 'clouds',
        Rain: 'rain',
        Drizzle: 'drizzle',
        Thunderstorm: 'thunderstorm',
        Snow: 'snow',
        Mist: 'mist',
        Fog: 'fog',
        Haze: 'haze',
    };
    return conditionMap[main] || 'clear';
};

/**
 * 예보 데이터를 일별로 그룹화
 */
const groupForecastByDate = (forecastList: ForecastItem[]): DailyForecast[] => {
    const grouped = new Map<string, ForecastItem[]>();

    forecastList.forEach((item) => {
        const date = item.dt_txt.split(' ')[0]; // YYYY-MM-DD 추출
        if (!grouped.has(date)) {
            grouped.set(date, []);
        }
        grouped.get(date)!.push(item);
    });

    return Array.from(grouped.entries()).map(([date, items]) => {
        const temps = items.map((item) => item.main.temp);
        const minTemp = Math.round(Math.min(...temps));
        const maxTemp = Math.round(Math.max(...temps));

        // 가장 많은 시간대의 날씨를 대표로 사용 (보통 낮 시간대)
        const dayItem = items.find((item) => item.sys.pod === 'd') || items[Math.floor(items.length / 2)];

        return {
            date,
            items,
            minTemp,
            maxTemp,
            condition: mapWeatherCondition(dayItem.weather[0].main),
            description: dayItem.weather[0].description,
            icon: dayItem.weather[0].icon,
        };
    });
};

/**
 * OpenWeather API를 사용한 현재 날씨 + 5일 예보 가져오기
 */
const fetchOpenWeatherForecast = async (
    latitude: number,
    longitude: number,
    apiKey: string
): Promise<WeatherForecastData> => {
    // 현재 날씨와 5일 예보를 병렬로 호출
    const [currentResponse, forecastResponse] = await Promise.all([
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
        ),
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
        ),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error(`OpenWeather API error: ${currentResponse.status} / ${forecastResponse.status}`);
    }

    const currentData: OpenWeatherMapResponse = await currentResponse.json();
    const forecastData: OpenWeatherMapForecastResponse = await forecastResponse.json();

    // 현재 날씨 데이터 변환
    const current: WeatherData = {
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        condition: mapWeatherCondition(currentData.weather[0].main),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        city: currentData.name || DEFAULT_CITY,
        country: currentData.sys.country || DEFAULT_COUNTRY,
        updatedAt: Date.now(),
        icon: currentData.weather[0].icon || '01d',
    };

    // 예보 데이터를 일별로 그룹화
    const dailyForecast = groupForecastByDate(forecastData.list).slice(0, 5);

    return {
        current,
        dailyForecast,
        forecastList: forecastData.list,
    };
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const latitude = parseFloat(searchParams.get('lat') || '37.5665');
        const longitude = parseFloat(searchParams.get('lon') || '126.978');

        console.log('[Weather API Route] 요청:', { latitude, longitude });

        const apiKey =
            process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY ||
            process.env.OPENWEATHER_API_KEY ||
            process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
            console.error('[Weather API Route] OpenWeather API Key not configured');
            return NextResponse.json({ error: 'OpenWeather API Key not configured' }, { status: 500 });
        }

        console.log('[Weather API Route] OpenWeather API 호출 시작...');
        const forecastData = await fetchOpenWeatherForecast(latitude, longitude, apiKey);
        console.log('[Weather API Route] OpenWeather API 호출 성공');

        return NextResponse.json(forecastData);
    } catch (error) {
        console.error('[Weather API Route] Error:', error);
        console.error('[Weather API Route] Error stack:', error instanceof Error ? error.stack : 'No stack');

        // 에러 상세 정보 반환
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
        const errorDetails =
            error instanceof Error
                ? {
                      name: error.name,
                      message: error.message,
                      stack: error.stack,
                  }
                : {};

        return NextResponse.json(
            {
                error: errorMessage,
                details: errorDetails,
            },
            { status: 500 }
        );
    }
}
