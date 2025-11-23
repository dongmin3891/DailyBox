/**
 * PieChart Component
 * 간단한 파이 차트 컴포넌트 (SVG 기반)
 */

import React from 'react';

export interface PieChartData {
    /** 데이터 라벨 */
    label: string;
    /** 데이터 값 */
    value: number;
    /** 색상 */
    color: string;
}

export interface PieChartProps {
    /** 차트 데이터 */
    data: PieChartData[];
    /** 차트 크기 (픽셀) */
    size?: number;
    /** 중앙에 표시할 텍스트 */
    centerText?: string;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * PieChart - SVG 기반 파이 차트 컴포넌트
 */
export const PieChart: React.FC<PieChartProps> = ({
    data,
    size = 200,
    centerText,
    className = '',
}) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = size / 2 - 10;
    const center = size / 2;

    // 각 데이터의 각도 계산
    let currentAngle = -90; // 12시 방향부터 시작
    const segments = data.map((item) => {
        const percentage = total > 0 ? item.value / total : 0;
        const angle = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        // SVG path 생성 (원호)
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);
        const largeArcFlag = angle > 180 ? 1 : 0;

        const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        return {
            ...item,
            path,
            percentage: Math.round(percentage * 100),
        };
    });

    return (
        <div className={`pie-chart ${className}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((segment, index) => (
                    <path
                        key={index}
                        d={segment.path}
                        fill={segment.color}
                        stroke="white"
                        strokeWidth="2"
                        className="transition-opacity hover:opacity-80"
                    />
                ))}
                {centerText && (
                    <text
                        x={center}
                        y={center}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm font-bold fill-text-primary"
                    >
                        {centerText}
                    </text>
                )}
            </svg>
        </div>
    );
};

export default PieChart;

