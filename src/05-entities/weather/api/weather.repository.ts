/**
 * Weather Repository
 * 날씨 API 호출 및 데이터 변환
 *
 * 사용 API: OpenWeather API
 * - 현재 날씨: OpenWeatherMap Current Weather API
 * - 5일 예보: OpenWeatherMap 5 Day Forecast API
 */

import type { WeatherData, WeatherForecastData, WeatherCondition, WeatherApiResponse } from '../model/types';

// 클라이언트에서는 Next.js API Route를 통해 호출
const API_BASE_URL = '/api/weather';

const DEFAULT_CITY = 'Seoul';
const DEFAULT_COUNTRY = 'KR';

/**
 * OpenWeather API를 사용한 현재 날씨 데이터 가져오기
 * Next.js API Route를 통해 서버에서 호출하여 CORS 문제 해결
 *
 * @param city - 도시 이름 (사용 안 함, 위치 기반 사용)
 */
export const fetchWeatherData = async (city: string = DEFAULT_CITY): Promise<WeatherData> => {
    // 위치 기반으로 날씨 가져오기 (서울 기본값)
    const latitude = 37.5665; // 서울 위도
    const longitude = 126.978; // 서울 경도

    try {
        const forecastData = await fetchWeatherForecast(city);
        return forecastData.current;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return {
            temperature: 20,
            feelsLike: 20,
            condition: 'clear',
            description: '데이터 없음',
            humidity: 50,
            windSpeed: 2.5,
            city: city || DEFAULT_CITY,
            country: DEFAULT_COUNTRY,
            updatedAt: Date.now(),
        };
    }
};

/**
 * OpenWeather API를 사용한 5일 예보 가져오기
 * Next.js API Route를 통해 서버에서 호출하여 CORS 문제 해결
 *
 * @param city - 도시 이름 (사용 안 함, 서울 기본값 사용)
 */
export const fetchWeatherForecast = async (city: string = DEFAULT_CITY): Promise<WeatherForecastData> => {
    // 서울 기본 좌표 사용
    const latitude = 37.5665;
    const longitude = 126.978;

    try {
        const url = new URL(
            API_BASE_URL,
            typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
        );
        url.searchParams.set('lat', latitude.toString());
        url.searchParams.set('lon', longitude.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data: WeatherForecastData = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch weather forecast:', error);
        const defaultCurrent: WeatherData = {
            temperature: 20,
            feelsLike: 20,
            condition: 'clear',
            description: '데이터 없음',
            humidity: 50,
            windSpeed: 2.5,
            city: city || DEFAULT_CITY,
            country: DEFAULT_COUNTRY,
            updatedAt: Date.now(),
            icon: '01d',
        };
        return {
            current: defaultCurrent,
            dailyForecast: [],
            forecastList: [],
        };
    }
};

/**
 * 사용자 위치 기반 현재 날씨 데이터 가져오기 (OpenWeather API)
 * Next.js API Route를 통해 서버에서 호출하여 CORS 문제 해결
 *
 * @param latitude - 위도
 * @param longitude - 경도
 */
export const fetchWeatherByLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
    try {
        const forecastData = await fetchWeatherForecastByLocation(latitude, longitude);
        return forecastData.current;
    } catch (error) {
        console.error('Failed to fetch weather by location:', error);
        return fetchWeatherData();
    }
};

/**
 * 위치 기반 5일 예보 API 호출 (OpenWeather API)
 * Next.js API Route를 통해 서버에서 호출하여 CORS 문제 해결
 *
 * @param latitude - 위도
 * @param longitude - 경도
 */
export const fetchWeatherForecastByLocation = async (
    latitude: number,
    longitude: number
): Promise<WeatherForecastData> => {
    try {
        const url = new URL(
            API_BASE_URL,
            typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
        );
        url.searchParams.set('lat', latitude.toString());
        url.searchParams.set('lon', longitude.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data: WeatherForecastData = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch weather forecast by location:', error);
        return fetchWeatherForecast();
    }
};

/**
 * WeatherAPI를 사용한 날씨 데이터 가져오기 (대안)
 *
 * API 키 발급 방법:
 * 1. https://www.weatherapi.com/ 접속
 * 2. "Sign Up" 클릭하여 무료 계정 생성
 * 3. 이메일 인증 완료
 * 4. Dashboard에서 API 키 복사
 * 5. .env.local에 NEXT_PUBLIC_WEATHER_API_KEY=your_api_key 추가
 *
 * 사용 방법:
 * - fetchWeatherData 함수를 이 함수로 교체하거나
 * - 환경변수로 API 제공자를 선택하도록 구현
 *
 * @param city - 도시 이름
 * @param apiKey - WeatherAPI 키
 */
export const fetchWeatherDataByWeatherAPI = async (
    city: string = DEFAULT_CITY,
    apiKey?: string
): Promise<WeatherData> => {
    if (!apiKey) {
        return fetchWeatherData(city);
    }

    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=ko`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`WeatherAPI error: ${response.status}`);
        }

        const data: WeatherApiResponse = await response.json();

        // WeatherAPI 코드를 WeatherCondition으로 변환
        const codeToCondition: Record<number, WeatherCondition> = {
            1000: 'clear', // Sunny
            1003: 'clouds', // Partly cloudy
            1006: 'clouds', // Cloudy
            1009: 'clouds', // Overcast
            1030: 'mist', // Mist
            1063: 'rain', // Patchy rain
            1066: 'snow', // Patchy snow
            1087: 'thunderstorm', // Thundery outbreaks
            1114: 'snow', // Blowing snow
            1117: 'snow', // Blizzard
            1135: 'fog', // Fog
            1147: 'fog', // Freezing fog
            1150: 'drizzle', // Patchy light drizzle
            1153: 'drizzle', // Light drizzle
            1168: 'drizzle', // Freezing drizzle
            1171: 'drizzle', // Heavy freezing drizzle
            1180: 'rain', // Patchy light rain
            1183: 'rain', // Light rain
            1186: 'rain', // Moderate rain
            1189: 'rain', // Moderate rain
            1192: 'rain', // Heavy rain
            1195: 'rain', // Heavy rain
            1198: 'rain', // Light freezing rain
            1201: 'rain', // Moderate or heavy freezing rain
            1204: 'drizzle', // Light sleet
            1207: 'drizzle', // Moderate or heavy sleet
            1210: 'snow', // Patchy light snow
            1213: 'snow', // Light snow
            1216: 'snow', // Moderate snow
            1219: 'snow', // Moderate snow
            1222: 'snow', // Patchy heavy snow
            1225: 'snow', // Heavy snow
            1237: 'snow', // Ice pellets
            1240: 'rain', // Light rain shower
            1243: 'rain', // Moderate or heavy rain shower
            1246: 'rain', // Torrential rain shower
            1249: 'drizzle', // Light sleet showers
            1252: 'drizzle', // Moderate or heavy sleet showers
            1255: 'snow', // Light snow showers
            1258: 'snow', // Moderate or heavy snow showers
            1261: 'snow', // Light showers of ice pellets
            1264: 'snow', // Moderate or heavy showers of ice pellets
            1273: 'thunderstorm', // Patchy light rain with thunder
            1276: 'thunderstorm', // Moderate or heavy rain with thunder
            1279: 'thunderstorm', // Patchy light snow with thunder
            1282: 'thunderstorm', // Moderate or heavy snow with thunder
        };

        const condition = codeToCondition[data.current.condition.code] || 'clear';

        return {
            temperature: Math.round(data.current.temp_c),
            feelsLike: Math.round(data.current.feelslike_c),
            condition,
            description: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph / 3.6, // km/h를 m/s로 변환
            city: data.location.name,
            country: data.location.country,
            updatedAt: Date.now(),
        };
    } catch (error) {
        console.error('Failed to fetch weather data from WeatherAPI:', error);
        return fetchWeatherData(city);
    }
};
