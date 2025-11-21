export type CalcHistoryType = 'normal' | 'settlement' | 'vat' | 'unit-conversion';

export type CalcHistory = {
    id?: number;
    expression: string;
    result: string;
    createdAt: number;
    favorite?: boolean;
    type?: CalcHistoryType;
};
