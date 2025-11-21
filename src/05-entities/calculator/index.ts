/**
 * Calculator Entity Public API
 * 계산기 도메인의 외부 접근 인터페이스
 */

// UI Components
export { Calculator, default as CalculatorDefault } from './ui/Calculator';
export { CalculatorHistory, default as CalculatorHistoryDefault } from './ui/CalculatorHistory';

// Component Props Types
export type { CalculatorProps } from './ui/Calculator';
export type { CalculatorHistoryProps } from './ui/CalculatorHistory';

// Types
export type * from './model/types';

// Repository (for features layer)
export { calcHistoryRepository } from './api/calc.repository';

// Calculator Engine
export { evaluateExpression, isValidExpression } from './lib/calcEngine';

// VAT Calculator
export { calculateVATIncluded, calculateVATExcluded, createVATExpression } from './lib/vatCalculator';

// Unit Converter
export { UNIT_CONVERSIONS, convertUnit, createUnitConversionExpression } from './lib/unitConverter';
export type { UnitType, UnitPair } from './lib/unitConverter';
