/**
 * VAT Calculator (Entities Layer)
 * 
 * 부가세 계산 기능 (VAT 10%)
 */

const VAT_RATE = 0.1; // 10%

/**
 * 부가세 포함 금액 계산
 * 
 * @param amount - 부가세 미포함 금액
 * @returns 부가세 포함 금액
 */
export function calculateVATIncluded(amount: number): number {
    return amount * (1 + VAT_RATE);
}

/**
 * 부가세 제외 금액 계산
 * 
 * @param amount - 부가세 포함 금액
 * @returns 부가세 제외 금액
 */
export function calculateVATExcluded(amount: number): number {
    return amount / (1 + VAT_RATE);
}

/**
 * 부가세 금액 계산
 * 
 * @param amount - 기준 금액
 * @param isIncluded - 부가세 포함 여부 (true: 포함, false: 제외)
 * @returns 부가세 금액
 */
export function calculateVATAmount(amount: number, isIncluded: boolean): number {
    if (isIncluded) {
        return amount - calculateVATExcluded(amount);
    }
    return amount * VAT_RATE;
}

/**
 * 부가세 계산 수식 생성
 */
export function createVATExpression(amount: number, type: 'included' | 'excluded'): string {
    if (type === 'included') {
        const excluded = calculateVATExcluded(amount);
        const vat = calculateVATAmount(amount, true);
        return `부가세 포함: ${amount}원 = 공급가액 ${excluded.toFixed(0)}원 + 부가세 ${vat.toFixed(0)}원`;
    } else {
        const included = calculateVATIncluded(amount);
        const vat = calculateVATAmount(amount, false);
        return `부가세 제외: ${amount}원 = 공급가액 ${amount}원 + 부가세 ${vat.toFixed(0)}원 = 총액 ${included.toFixed(0)}원`;
    }
}

