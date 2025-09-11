/**
 * 시간 관련 유틸리티 함수들
 */

/**
 * 상대적 시간을 포맷팅합니다
 * @param timestamp - 타임스탬프 (밀리초)
 * @returns 상대적 시간 문자열 (예: "2분 전", "1시간 전")
 */
export const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return '방금 전';
    } else if (minutes < 60) {
        return `${minutes}분 전`;
    } else if (hours < 24) {
        return `${hours}시간 전`;
    } else if (days < 7) {
        return `${days}일 전`;
    } else if (weeks < 4) {
        return `${weeks}주 전`;
    } else if (months < 12) {
        return `${months}개월 전`;
    } else {
        return `${years}년 전`;
    }
};

/**
 * 날짜를 로컬 문자열로 포맷팅합니다
 * @param timestamp - 타임스탬프 (밀리초)
 * @param options - Intl.DateTimeFormat 옵션
 * @returns 포맷된 날짜 문자열
 */
export const formatDate = (
    timestamp: number,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
): string => {
    return new Date(timestamp).toLocaleDateString('ko-KR', options);
};

/**
 * 시간을 HH:MM 형식으로 포맷팅합니다
 * @param timestamp - 타임스탬프 (밀리초)
 * @returns HH:MM 형식의 시간 문자열
 */
export const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

/**
 * 오늘, 어제, 그 외의 날짜를 구분하여 포맷팅합니다
 * @param timestamp - 타임스탬프 (밀리초)
 * @returns 포맷된 날짜 문자열
 */
export const formatSmartDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return `오늘 ${formatTime(timestamp)}`;
    } else if (isYesterday) {
        return `어제 ${formatTime(timestamp)}`;
    } else {
        return formatDate(timestamp, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
};
