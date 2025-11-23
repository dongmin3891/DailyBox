/**
 * Calculator Component (Entities Layer)
 *
 * 계산기 엔티티의 핵심 UI 컴포넌트입니다.
 * FSD 아키텍처의 Entities Layer에 위치하며, 순수한 계산기 도메인 로직과 UI를 담당합니다.
 *
 * @description
 * - 연산 우선순위 처리 (괄호, *, / 우선순위)
 * - 정산 모드 지원
 * - 부가세 계산 (VAT 10%)
 * - 단위 변환 (ml↔L, cm↔m, g↔kg)
 * - 연속 계산 지원
 * - 마지막 계산식 재편집
 * - 모바일 UI 최적화
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useCalcSlice } from '@/features/calculator/model/calc.slice';
import { CalcHistory, CalcHistoryType } from '../model/types';
import { evaluateExpression, isValidExpression } from '../lib/calcEngine';
import { calculateVATIncluded, calculateVATExcluded, createVATExpression } from '../lib/vatCalculator';
import { UNIT_CONVERSIONS, createUnitConversionExpression } from '../lib/unitConverter';
import { Button, Card } from '@/06-shared/ui';

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
 */
const Calculator: React.FC<CalculatorProps> = ({
    className = '',
    initialValue = '0',
    disableKeyboard = false,
    onCalculationComplete,
}) => {
    const {
        addToHistory,
        setCurrentCalculation,
        currentExpression,
        currentResult,
        settlementMode,
        settlementAmounts,
        setSettlementMode,
        addSettlementAmount,
        clearSettlementAmounts,
        loadHistory,
    } = useCalcSlice();

    const [display, setDisplay] = useState(initialValue);
    const [expression, setExpression] = useState('');
    const [lastExpression, setLastExpression] = useState('');
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [isEditingExpression, setIsEditingExpression] = useState(false);

    // currentExpression이 변경되면 수식 편집 모드로 전환
    useEffect(() => {
        if (currentExpression && currentExpression !== expression) {
            setExpression(currentExpression);
            setDisplay(currentResult);
            setIsEditingExpression(true);
            setWaitingForOperand(false);
        }
    }, [currentExpression, currentResult]);

    // 정산 모드: 여러 금액 합산
    const handleSettlementAdd = () => {
        const amount = parseFloat(display);
        if (!isNaN(amount)) {
            addSettlementAmount(amount);
            setDisplay('0');
            setWaitingForOperand(true);
        }
    };

    const handleSettlementSave = async () => {
        if (settlementAmounts.length === 0) return;

        const total = settlementAmounts.reduce((sum, amount) => sum + amount, 0);
        const expression = settlementAmounts.join(' + ');
        const fullExpression = `${expression} = ${total}`;

        const historyItem: CalcHistory = {
            expression: `정산: ${fullExpression}`,
            result: String(total),
            createdAt: Date.now(),
            type: 'settlement',
        };

        await addToHistory(historyItem);
        setCurrentCalculation(fullExpression, String(total));
        setDisplay(String(total));
        setExpression(fullExpression);
        clearSettlementAmounts();
        setSettlementMode(false);
        setWaitingForOperand(true);
        onCalculationComplete?.(String(total), fullExpression);
    };

    // 부가세 계산
    const handleVATCalculation = async (type: 'included' | 'excluded') => {
        const amount = parseFloat(display);
        if (isNaN(amount) || amount <= 0) return;

        let result: number;
        let expressionText: string;

        if (type === 'included') {
            result = calculateVATIncluded(amount);
            expressionText = createVATExpression(amount, 'included');
        } else {
            result = calculateVATExcluded(amount);
            expressionText = createVATExpression(amount, 'excluded');
        }

        const historyItem: CalcHistory = {
            expression: expressionText,
            result: String(result.toFixed(0)),
            createdAt: Date.now(),
            type: 'vat',
        };

        await addToHistory(historyItem);
        setCurrentCalculation(expressionText, String(result.toFixed(0)));
        setDisplay(String(result.toFixed(0)));
        setExpression(expressionText);
        setWaitingForOperand(true);
        onCalculationComplete?.(String(result.toFixed(0)), expressionText);
    };

    // 단위 변환
    const handleUnitConversion = async (unitKey: string, reverse: boolean = false) => {
        const value = parseFloat(display);
        if (isNaN(value)) return;

        const unitPair = UNIT_CONVERSIONS[unitKey];
        if (!unitPair) return;

        const expressionText = createUnitConversionExpression(value, unitPair, reverse);
        const result = reverse ? unitPair.reverse(value) : unitPair.convert(value);

        const historyItem: CalcHistory = {
            expression: expressionText,
            result: String(result),
            createdAt: Date.now(),
            type: 'unit-conversion',
        };

        await addToHistory(historyItem);
        setCurrentCalculation(expressionText, String(result));
        setDisplay(String(result));
        setExpression(expressionText);
        setWaitingForOperand(true);
        onCalculationComplete?.(String(result), expressionText);
    };

    // 숫자 입력
    const inputNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
            setIsEditingExpression(false);
        } else {
            if (isEditingExpression) {
                // 수식 편집 모드
                setExpression(expression + num);
                setDisplay(display === '0' ? num : display + num);
            } else {
                setDisplay(display === '0' ? num : display + num);
            }
        }
    };

    // 연산자 입력
    const inputOperation = (op: string) => {
        if (isEditingExpression) {
            setExpression(expression + ` ${op} `);
            setDisplay('0');
            setWaitingForOperand(true);
            return;
        }

        const currentValue = display;
        if (expression && !waitingForOperand) {
            // 연속 계산: 현재 수식에 연산자 추가
            setExpression(`${expression} ${op} `);
        } else {
            setExpression(`${currentValue} ${op} `);
        }
        setWaitingForOperand(true);
        setIsEditingExpression(true);
    };

    // 괄호 입력
    const inputParenthesis = (paren: '(' | ')') => {
        if (waitingForOperand || display === '0') {
            setExpression(paren);
            setDisplay('0');
            setWaitingForOperand(false);
        } else {
            setExpression(expression + paren);
        }
        setIsEditingExpression(true);
    };

    // 계산 실행
    const performCalculation = async () => {
        let expressionToEvaluate = expression.trim();

        // 수식 편집 모드가 아니면 현재 표시값을 사용
        if (!isEditingExpression && expressionToEvaluate) {
            // 마지막 연산자 뒤에 현재 값 추가
            expressionToEvaluate = expressionToEvaluate + display;
        } else if (!expressionToEvaluate) {
            // 수식이 없으면 현재 표시값만
            expressionToEvaluate = display;
        }

        if (!isValidExpression(expressionToEvaluate)) {
            alert('올바른 수식을 입력해주세요.');
            return;
        }

        try {
            const result = evaluateExpression(expressionToEvaluate);
            const fullExpression = `${expressionToEvaluate} = ${result}`;

            const historyItem: CalcHistory = {
                expression: expressionToEvaluate,
                result: String(result),
                createdAt: Date.now(),
                type: 'normal',
            };

            await addToHistory(historyItem);
            setCurrentCalculation(fullExpression, String(result));
            setLastExpression(expressionToEvaluate);
            setDisplay(String(result));
            setExpression(fullExpression);
            setWaitingForOperand(true);
            setIsEditingExpression(false);
            onCalculationComplete?.(String(result), fullExpression);
        } catch (error) {
            alert(error instanceof Error ? error.message : '계산 오류가 발생했습니다.');
        }
    };

    // 마지막 계산식 재편집
    const loadLastExpression = () => {
        if (lastExpression) {
            setExpression(lastExpression);
            setDisplay('0');
            setWaitingForOperand(false);
            setIsEditingExpression(true);
        }
    };

    // 연속 계산 (직전 결과를 다음 계산에 사용)
    const continueCalculation = () => {
        if (currentResult && currentResult !== '0') {
            setDisplay(currentResult);
            setExpression('');
            setWaitingForOperand(false);
            setIsEditingExpression(false);
        }
    };

    const clear = () => {
        setDisplay('0');
        setExpression('');
        setWaitingForOperand(false);
        setIsEditingExpression(false);
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

    // 키보드 지원
    useEffect(() => {
        if (disableKeyboard) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
                inputNumber(e.key);
            } else if (e.key === '+') {
                e.preventDefault();
                inputOperation('+');
            } else if (e.key === '-') {
                e.preventDefault();
                inputOperation('-');
            } else if (e.key === '*' || e.key === '×') {
                e.preventDefault();
                inputOperation('×');
            } else if (e.key === '/' || e.key === '÷') {
                e.preventDefault();
                inputOperation('÷');
            } else if (e.key === '.') {
                e.preventDefault();
                if (!display.includes('.')) {
                    inputNumber('.');
                }
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                performCalculation();
            } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                clear();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                if (display.length > 1) {
                    setDisplay(display.slice(0, -1));
                } else {
                    setDisplay('0');
                }
            } else if (e.key === '(') {
                e.preventDefault();
                inputParenthesis('(');
            } else if (e.key === ')') {
                e.preventDefault();
                inputParenthesis(')');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, expression, disableKeyboard, waitingForOperand, isEditingExpression]);

    return (
        <Card variant="elevated" padding="lg" className={`overflow-hidden ${className}`}>
            {/* 계산기 디스플레이 */}
            <Card variant="default" padding="lg" className="mb-4">
                <div className="text-right min-w-0">
                    {/* 정산 모드 표시 */}
                    {settlementMode && (
                        <div className="text-toss-blue text-sm mb-2">
                            정산 모드: {settlementAmounts.length}개 항목
                            {settlementAmounts.length > 0 && (
                                <span className="ml-2">({settlementAmounts.join(' + ')})</span>
                            )}
                        </div>
                    )}
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

            {/* 모드 전환 버튼 */}
            <div className="mb-4 flex gap-2 flex-wrap">
                <Button
                    onClick={() => setSettlementMode(!settlementMode)}
                    variant={settlementMode ? 'primary' : 'neutral'}
                    size="sm"
                    className="text-xs"
                >
                    {settlementMode ? '정산 모드 ON' : '정산 모드'}
                </Button>
                {lastExpression && (
                    <Button onClick={loadLastExpression} variant="neutral" size="sm" className="text-xs">
                        마지막 식 불러오기
                    </Button>
                )}
                {currentResult && currentResult !== '0' && (
                    <Button onClick={continueCalculation} variant="neutral" size="sm" className="text-xs">
                        연속 계산
                    </Button>
                )}
            </div>

            {/* 계산기 버튼 */}
            <div className="space-y-2 sm:space-y-3">
                {/* 첫 번째 행: C, CE, ±, %, ÷ */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <Button onClick={clear} variant="neutral" size="calculator" aria-label="모두 지우기 (ESC)">
                        C
                    </Button>
                    <Button onClick={clearEntry} variant="neutral" size="calculator" aria-label="현재 입력 지우기">
                        CE
                    </Button>
                    <Button onClick={toggleSign} variant="neutral" size="calculator" aria-label="부호 변경">
                        ±
                    </Button>
                    <Button onClick={() => inputOperation('÷')} variant="primary" size="calculator" aria-label="나누기">
                        ÷
                    </Button>
                </div>

                {/* 두 번째 행: 7, 8, 9, × */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
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
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
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
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
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

                {/* 다섯 번째 행: (, 0, ., = */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <Button
                        onClick={() => inputParenthesis('(')}
                        variant="neutral"
                        size="calculator"
                        aria-label="여는 괄호"
                    >
                        (
                    </Button>
                    <Button
                        onClick={() => inputNumber('0')}
                        variant="neutral"
                        size="calculator"
                        className="col-span-1"
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

                {/* 여섯 번째 행: ), %, 부가세 버튼들 */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <Button
                        onClick={() => inputParenthesis(')')}
                        variant="neutral"
                        size="calculator"
                        aria-label="닫는 괄호"
                    >
                        )
                    </Button>
                    <Button onClick={inputPercent} variant="neutral" size="calculator" aria-label="백분율">
                        %
                    </Button>
                    <Button
                        onClick={() => handleVATCalculation('excluded')}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                    >
                        부가세 제외
                    </Button>
                    <Button
                        onClick={() => handleVATCalculation('included')}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                    >
                        부가세 포함
                    </Button>
                </div>

                {/* 정산 모드 버튼 */}
                {settlementMode && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Button onClick={handleSettlementAdd} variant="secondary" size="md">
                            금액 추가
                        </Button>
                        <Button onClick={handleSettlementSave} variant="primary" size="md">
                            정산 저장
                        </Button>
                    </div>
                )}

                {/* 단위 변환 버튼 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Button
                        onClick={() => handleUnitConversion('ml-l', false)}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                    >
                        ml→L
                    </Button>
                    <Button
                        onClick={() => handleUnitConversion('cm-m', false)}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                    >
                        cm→m
                    </Button>
                    <Button
                        onClick={() => handleUnitConversion('g-kg', false)}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                    >
                        g→kg
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export { Calculator };
export default Calculator;
