'use client';

import React, { useState } from 'react';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';
import { CalcHistory } from '../model/types';

interface CalculatorProps {
    className?: string;
}

const Calculator: React.FC<CalculatorProps> = ({ className = '' }) => {
    const { addToHistory, setCurrentCalculation } = useCalcSlice();
    const [display, setDisplay] = useState('0');
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

    // 키보드 지원 추가
    React.useEffect(() => {
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
    }, [display]);

    return (
        <div className={`bg-bg-primary rounded-2xl shadow-lg overflow-hidden ${className}`}>
            {/* 계산기 디스플레이 */}
            <div className="bg-bg-primary border border-neutral-gray-200 rounded-2xl p-6 mb-6">
                <div className="text-right">
                    <div className="text-text-secondary text-base mb-2 min-h-6" aria-label="계산 과정">
                        {expression || '\u00A0'}
                    </div>
                    <div
                        className="text-text-primary text-4xl font-bold leading-tight"
                        aria-label={`현재 값: ${display}`}
                        aria-live="polite"
                    >
                        {display}
                    </div>
                </div>
            </div>

            {/* 계산기 버튼 */}
            <div className="p-4 space-y-4">
                {/* 첫 번째 행: C, ±, %, ÷ */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={clear}
                        className="bg-neutral-gray-100 text-text-secondary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95 focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                        aria-label="모두 지우기 (ESC)"
                    >
                        C
                    </button>
                    <button
                        onClick={toggleSign}
                        className="bg-neutral-gray-100 text-text-secondary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        ±
                    </button>
                    <button
                        onClick={inputPercent}
                        className="bg-neutral-gray-100 text-text-secondary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        %
                    </button>
                    <button
                        onClick={() => inputOperation('÷')}
                        className="bg-toss-blue text-white w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-90 transition-opacity active:scale-95"
                    >
                        ÷
                    </button>
                </div>

                {/* 두 번째 행: 7, 8, 9, × */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => inputNumber('7')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        7
                    </button>
                    <button
                        onClick={() => inputNumber('8')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        8
                    </button>
                    <button
                        onClick={() => inputNumber('9')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        9
                    </button>
                    <button
                        onClick={() => inputOperation('×')}
                        className="bg-toss-blue text-white w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-90 transition-opacity active:scale-95"
                    >
                        ×
                    </button>
                </div>

                {/* 세 번째 행: 4, 5, 6, - */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => inputNumber('4')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        4
                    </button>
                    <button
                        onClick={() => inputNumber('5')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        5
                    </button>
                    <button
                        onClick={() => inputNumber('6')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        6
                    </button>
                    <button
                        onClick={() => inputOperation('-')}
                        className="bg-toss-blue text-white w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-90 transition-opacity active:scale-95"
                    >
                        -
                    </button>
                </div>

                {/* 네 번째 행: 1, 2, 3, + */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => inputNumber('1')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        1
                    </button>
                    <button
                        onClick={() => inputNumber('2')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        2
                    </button>
                    <button
                        onClick={() => inputNumber('3')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        3
                    </button>
                    <button
                        onClick={() => inputOperation('+')}
                        className="bg-toss-blue text-white w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-90 transition-opacity active:scale-95"
                    >
                        +
                    </button>
                </div>

                {/* 다섯 번째 행: 0, ., = */}
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => inputNumber('0')}
                        className="bg-neutral-gray-100 text-text-primary col-span-2 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        0
                    </button>
                    <button
                        onClick={() => inputNumber('.')}
                        className="bg-neutral-gray-100 text-text-primary w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-80 transition-opacity active:scale-95"
                    >
                        .
                    </button>
                    <button
                        onClick={performCalculation}
                        className="bg-toss-blue text-white w-16 h-16 rounded-2xl text-2xl font-semibold hover:opacity-90 transition-opacity active:scale-95 focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                        aria-label="계산 실행 (Enter)"
                    >
                        =
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
