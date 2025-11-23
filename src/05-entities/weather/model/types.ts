/**
 * Weather Entity Types
 * 날씨 데이터 타입 정의
 */

export type WeatherCondition =
    | 'clear'
    | 'clouds'
    | 'rain'
    | 'drizzle'
    | 'thunderstorm'
    | 'snow'
    | 'mist'
    | 'fog'
    | 'haze';

export interface WeatherData {
    /** 온도 (섭씨) */
    temperature: number;
    /** 체감 온도 (섭씨) */
    feelsLike: number;
    /** 날씨 조건 */
    condition: WeatherCondition;
    /** 날씨 설명 */
    description: string;
    /** 습도 (%) */
    humidity: number;
    /** 풍속 (m/s) */
    windSpeed: number;
    /** 도시 이름 */
    city: string;
    /** 국가 코드 */
    country: string;
    /** 데이터 업데이트 시간 (밀리초 타임스탬프) */
    updatedAt: number;
    /** 날씨 아이콘 코드 */
    icon?: string;
}

export interface WeatherForecastData {
    /** 현재 날씨 데이터 */
    current: WeatherData;
    /** 일별 예보 데이터 (최대 5일) */
    dailyForecast: DailyForecast[];
    /** 원본 예보 리스트 (3시간 간격) */
    forecastList: ForecastItem[];
}

// OpenWeatherMap Current Weather API 응답 타입
export interface OpenWeatherMapResponse {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    name: string;
    sys: {
        country: string;
    };
}

// OpenWeatherMap 5 Day Forecast API 응답 타입
export interface ForecastItem {
    dt: number; // Unix timestamp
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    visibility: number;
    pop: number; // Probability of precipitation
    rain?: {
        '3h': number;
    };
    snow?: {
        '3h': number;
    };
    sys: {
        pod: 'd' | 'n'; // Part of the day
    };
    dt_txt: string; // Date time text (YYYY-MM-DD HH:mm:ss)
}

export interface OpenWeatherMapForecastResponse {
    cod: string;
    message: number;
    cnt: number; // Number of timestamps returned
    list: ForecastItem[];
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

// 예보 데이터를 날짜별로 그룹화한 타입
export interface DailyForecast {
    date: string; // YYYY-MM-DD
    items: ForecastItem[];
    minTemp: number;
    maxTemp: number;
    condition: WeatherCondition;
    description: string;
    icon: string;
}

// WeatherAPI 응답 타입 (대안)
export interface WeatherApiResponse {
    current: {
        temp_c: number;
        feelslike_c: number;
        humidity: number;
        wind_kph: number;
        condition: {
            text: string;
            code: number;
        };
    };
    location: {
        name: string;
        country: string;
    };
}
