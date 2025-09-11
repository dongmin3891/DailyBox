/**
 * Calculator Entity Public API
 * 계산기 도메인의 외부 접근 인터페이스
 */

// UI Components
export { default as Calculator } from './ui/Calculator';
export { default as CalculatorHistory } from './ui/CalculatorHistory';

// Types
export type * from './model/types';

// Repository (for features layer)
export { calcHistoryRepository } from './api/calc.repository';
