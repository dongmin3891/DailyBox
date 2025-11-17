/**
 * Calculator Component (Entities Layer)
 *
 * 계산기 엔티티의 핵심 UI 컴포넌트입니다.
 * FSD 아키텍처의 Entities Layer에 위치하며, 순수한 계산기 도메인 로직과 UI를 담당합니다.
 *
 * @description
 * - 기본 사칙연산 (+, -, ×, ÷) 지원
 * - 키보드 입력 지원 (숫자, 연산자, Enter, ESC, Backspace)
 * - 계산 기록 자동 저장 (Zustand store 연동)
 * - Toss 디자인 시스템 색상과 컴포넌트 사용
 * - 접근성 고려 (ARIA 레이블, 키보드 네비게이션)
 *
 * @example
 * ```tsx
 * // widgets나 pages에서 사용
 * import { Calculator } from '@/entities/calculator';
 *
 * const CalculatorWidget = () => {
 *   return (
 *     <div className="calculator-container">
 *       <Calculator className="custom-calculator" />
 *     </div>
 *   );
 * };
 * ```
 *
 * @see {@link useCalcSlice} - 계산기 상태 관리 훅
 * @see {@link CalcHistory} - 계산 기록 타입
 */

'use client';

import React, { useState } from 'react';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';
import { CalcHistory } from '../model/types';
import { Button, Card } from '@/shared/ui';

export interface CalculatorProps {
    /** 추가 클래스명 */
    className?: string;
    /** 초기 표시 값 (기본값: "0") */
    initialValue?: string;
    /** 키보드 입력 비활성화 여부 (기본값: false) */
    disableKeyboard?: boolean;
    /** 계산 완료 시 콜백 함수 */
    onCalculationComplete?: (result: string, expression: string) => void;
}

/**
 * Calculator - 계산기 컴포넌트
 *
 * @param props - CalculatorProps
 * @returns JSX.Element
 */
const Calculator: React.FC<CalculatorProps> = ({
    className = '',
    initialValue = '0',
    disableKeyboard = false,
    onCalculationComplete,
}) => {
    const { addToHistory, setCurrentCalculation } = useCalcSlice();
    const [display, setDisplay] = useState(initialValue);
    const [expression, setExpression] = useState('');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const inputOperation = (nextOperation: string) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
        setExpression(`${previousValue || inputValue} ${nextOperation}`);
    };

    const calculate = (firstValue: number, secondValue: number, operation: string): number => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return firstValue / secondValue;
            case '=':
                return secondValue;
            default:
                return secondValue;
        }
    };

    const performCalculation = async () => {
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            const fullExpression = `${previousValue} ${operation} ${inputValue}`;

            // 계산 기록 저장
            const historyItem: CalcHistory = {
                expression: fullExpression,
                result: String(newValue),
                createdAt: Date.now(),
            };

            // Zustand store를 통해 저장
            await addToHistory(historyItem);

            // 현재 계산 상태 업데이트
            setCurrentCalculation(`${fullExpression} =`, String(newValue));

            setDisplay(String(newValue));
            setExpression(`${fullExpression} =`);
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);

            // 계산 완료 콜백 호출
            onCalculationComplete?.(String(newValue), `${fullExpression} =`);
        }
    };

    const clear = () => {
        setDisplay('0');
        setExpression('');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const clearEntry = () => {
        setDisplay('0');
    };

    const inputPercent = () => {
        const value = parseFloat(display) / 100;
        setDisplay(String(value));
    };

    const toggleSign = () => {
        const value = parseFloat(display);
        setDisplay(String(-value));
    };

    // 키보드 지원 추가 (조건부)
    React.useEffect(() => {
        if (disableKeyboard) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // 숫자 키
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
                inputNumber(e.key);
            }
            // 연산자 키
            else if (e.key === '+') {
                e.preventDefault();
                inputOperation('+');
            } else if (e.key === '-') {
                e.preventDefault();
                inputOperation('-');
            } else if (e.key === '*') {
                e.preventDefault();
                inputOperation('×');
            } else if (e.key === '/') {
                e.preventDefault();
                inputOperation('÷');
            }
            // 소수점
            else if (e.key === '.') {
                e.preventDefault();
                inputNumber('.');
            }
            // 계산 실행
            else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                performCalculation();
            }
            // 초기화
            else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                clear();
            }
            // 백스페이스 (마지막 숫자 삭제)
            else if (e.key === 'Backspace') {
                e.preventDefault();
                if (display.length > 1) {
                    setDisplay(display.slice(0, -1));
                } else {
                    setDisplay('0');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, disableKeyboard]);

    return (
        <Card variant="elevated" padding="lg" rounded="2xl" className={`overflow-hidden ${className}`}>
            {/* 계산기 디스플레이 */}
            <Card variant="default" padding="lg" rounded="2xl" className="mb-6">
                <div className="text-right min-w-0">
                    <div className="text-text-secondary text-base mb-2 min-h-6 break-words" aria-label="계산 과정">
                        {expression || '\u00A0'}
                    </div>
                    <div
                        className="text-text-primary text-4xl font-bold leading-tight break-all"
                        style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                        aria-label={`현재 값: ${display}`}
                        aria-live="polite"
                    >
                        {display}
                    </div>
                </div>
            </Card>

            {/* 계산기 버튼 */}
            <div className="p-4 space-y-4">
                {/* 첫 번째 행: C, ±, %, ÷ */}
                <div className="grid grid-cols-4 gap-4">
                    <Button onClick={clear} variant="neutral" size="calculator" aria-label="모두 지우기 (ESC)">
                        C
                    </Button>
                    <Button onClick={toggleSign} variant="neutral" size="calculator" aria-label="부호 변경">
                        ±
                    </Button>
                    <Button onClick={inputPercent} variant="neutral" size="calculator" aria-label="백분율">
                        %
                    </Button>
                    <Button onClick={() => inputOperation('÷')} variant="primary" size="calculator" aria-label="나누기">
                        ÷
                    </Button>
                </div>

                {/* 두 번째 행: 7, 8, 9, × */}
                <div className="grid grid-cols-4 gap-4">
                    <Button onClick={() => inputNumber('7')} variant="neutral" size="calculator" aria-label="7">
                        7
                    </Button>
                    <Button onClick={() => inputNumber('8')} variant="neutral" size="calculator" aria-label="8">
                        8
                    </Button>
                    <Button onClick={() => inputNumber('9')} variant="neutral" size="calculator" aria-label="9">
                        9
                    </Button>
                    <Button onClick={() => inputOperation('×')} variant="primary" size="calculator" aria-label="곱하기">
                        ×
                    </Button>
                </div>

                {/* 세 번째 행: 4, 5, 6, - */}
                <div className="grid grid-cols-4 gap-4">
                    <Button onClick={() => inputNumber('4')} variant="neutral" size="calculator" aria-label="4">
                        4
                    </Button>
                    <Button onClick={() => inputNumber('5')} variant="neutral" size="calculator" aria-label="5">
                        5
                    </Button>
                    <Button onClick={() => inputNumber('6')} variant="neutral" size="calculator" aria-label="6">
                        6
                    </Button>
                    <Button onClick={() => inputOperation('-')} variant="primary" size="calculator" aria-label="빼기">
                        -
                    </Button>
                </div>

                {/* 네 번째 행: 1, 2, 3, + */}
                <div className="grid grid-cols-4 gap-4">
                    <Button onClick={() => inputNumber('1')} variant="neutral" size="calculator" aria-label="1">
                        1
                    </Button>
                    <Button onClick={() => inputNumber('2')} variant="neutral" size="calculator" aria-label="2">
                        2
                    </Button>
                    <Button onClick={() => inputNumber('3')} variant="neutral" size="calculator" aria-label="3">
                        3
                    </Button>
                    <Button onClick={() => inputOperation('+')} variant="primary" size="calculator" aria-label="더하기">
                        +
                    </Button>
                </div>

                {/* 다섯 번째 행: 0, ., = */}
                <div className="grid grid-cols-4 gap-4">
                    <Button
                        onClick={() => inputNumber('0')}
                        variant="neutral"
                        size="calculator"
                        className="col-span-2"
                        aria-label="0"
                    >
                        0
                    </Button>
                    <Button onClick={() => inputNumber('.')} variant="neutral" size="calculator" aria-label="소수점">
                        .
                    </Button>
                    <Button
                        onClick={performCalculation}
                        variant="primary"
                        size="calculator"
                        aria-label="계산 실행 (Enter)"
                    >
                        =
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export { Calculator };
export default Calculator;
