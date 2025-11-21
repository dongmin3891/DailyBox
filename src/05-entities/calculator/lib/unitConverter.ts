/**
 * Unit Converter (Entities Layer)
 * 
 * 단위 변환 기능
 * ml ↔ L, cm ↔ m, g ↔ kg
 */

export type UnitType = 'volume' | 'length' | 'weight';

export type UnitPair = {
    from: string;
    to: string;
    fromLabel: string;
    toLabel: string;
    convert: (value: number) => number;
    reverse: (value: number) => number;
};

export const UNIT_CONVERSIONS: Record<string, UnitPair> = {
    'ml-l': {
        from: 'ml',
        to: 'L',
        fromLabel: 'ml',
        toLabel: 'L',
        convert: (value: number) => value / 1000,
        reverse: (value: number) => value * 1000,
    },
    'cm-m': {
        from: 'cm',
        to: 'm',
        fromLabel: 'cm',
        toLabel: 'm',
        convert: (value: number) => value / 100,
        reverse: (value: number) => value * 100,
    },
    'g-kg': {
        from: 'g',
        to: 'kg',
        fromLabel: 'g',
        toLabel: 'kg',
        convert: (value: number) => value / 1000,
        reverse: (value: number) => value * 1000,
    },
};

/**
 * 단위 변환 수행
 */
export function convertUnit(value: number, unitPair: UnitPair, reverse: boolean = false): number {
    if (reverse) {
        return unitPair.reverse(value);
    }
    return unitPair.convert(value);
}

/**
 * 단위 변환 수식 생성
 */
export function createUnitConversionExpression(
    value: number,
    unitPair: UnitPair,
    reverse: boolean = false
): string {
    const fromUnit = reverse ? unitPair.to : unitPair.from;
    const toUnit = reverse ? unitPair.from : unitPair.to;
    const result = convertUnit(value, unitPair, reverse);
    
    return `${value}${fromUnit} = ${result}${toUnit}`;
}

