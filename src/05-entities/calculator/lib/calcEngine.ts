/**
 * Calculator Engine (Entities Layer)
 * 
 * 연산 우선순위를 처리하는 계산 엔진
 * 괄호, 곱셈/나눗셈 우선순위 지원
 */

/**
 * 수식을 파싱하여 토큰 배열로 변환
 */
function tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let currentNumber = '';
    
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        
        if (char === ' ') {
            continue;
        }
        
        if (char === '(' || char === ')') {
            if (currentNumber) {
                tokens.push(currentNumber);
                currentNumber = '';
            }
            tokens.push(char);
        } else if (['+', '-', '×', '*', '÷', '/'].includes(char)) {
            if (currentNumber) {
                tokens.push(currentNumber);
                currentNumber = '';
            }
            // 연산자 정규화
            if (char === '*') tokens.push('×');
            else if (char === '/') tokens.push('÷');
            else tokens.push(char);
        } else {
            currentNumber += char;
        }
    }
    
    if (currentNumber) {
        tokens.push(currentNumber);
    }
    
    return tokens;
}

/**
 * 중위 표기법을 후위 표기법으로 변환 (Shunting Yard 알고리즘)
 */
function infixToPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const operators: string[] = [];
    
    const precedence: Record<string, number> = {
        '+': 1,
        '-': 1,
        '×': 2,
        '÷': 2,
    };
    
    for (const token of tokens) {
        if (!isNaN(Number(token))) {
            // 숫자
            output.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop()!);
            }
            operators.pop(); // '(' 제거
        } else if (['+', '-', '×', '÷'].includes(token)) {
            // 연산자
            while (
                operators.length > 0 &&
                operators[operators.length - 1] !== '(' &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                output.push(operators.pop()!);
            }
            operators.push(token);
        }
    }
    
    while (operators.length > 0) {
        output.push(operators.pop()!);
    }
    
    return output;
}

/**
 * 후위 표기법 수식을 계산
 */
function evaluatePostfix(postfix: string[]): number {
    const stack: number[] = [];
    
    for (const token of postfix) {
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
        } else {
            const b = stack.pop()!;
            const a = stack.pop()!;
            
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '×':
                    stack.push(a * b);
                    break;
                case '÷':
                    if (b === 0) {
                        throw new Error('0으로 나눌 수 없습니다');
                    }
                    stack.push(a / b);
                    break;
            }
        }
    }
    
    return stack[0];
}

/**
 * 수식을 계산 (연산 우선순위 처리)
 * 
 * @param expression - 계산할 수식 (예: "2 + 3 × 4", "(2 + 3) × 4")
 * @returns 계산 결과
 * @throws 수식이 잘못되었거나 0으로 나누는 경우 에러 발생
 */
export function evaluateExpression(expression: string): number {
    try {
        // 빈 수식 처리
        if (!expression || expression.trim() === '') {
            return 0;
        }
        
        // 토큰화
        const tokens = tokenize(expression);
        
        if (tokens.length === 0) {
            return 0;
        }
        
        // 단일 숫자인 경우
        if (tokens.length === 1 && !isNaN(Number(tokens[0]))) {
            return Number(tokens[0]);
        }
        
        // 후위 표기법으로 변환
        const postfix = infixToPostfix(tokens);
        
        // 계산
        return evaluatePostfix(postfix);
    } catch (error) {
        throw new Error(`계산 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
}

/**
 * 수식이 유효한지 검증
 */
export function isValidExpression(expression: string): boolean {
    try {
        if (!expression || expression.trim() === '') {
            return false;
        }
        
        const tokens = tokenize(expression);
        
        // 괄호 짝 검증
        let parenCount = 0;
        for (const token of tokens) {
            if (token === '(') parenCount++;
            if (token === ')') parenCount--;
            if (parenCount < 0) return false;
        }
        if (parenCount !== 0) return false;
        
        // 빈 토큰 배열 검증
        if (tokens.length === 0) return false;
        
        return true;
    } catch {
        return false;
    }
}

