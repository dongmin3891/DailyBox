/**
 * TimerEditor Component
 * 타이머 설정을 위한 컴포넌트
 */

'use client';

import React, { useState } from 'react';
import { Input } from '@/shared/ui';
import { Card } from '@/shared/ui';

export interface TimerEditorProps {
    /** 저장 핸들러 */
    onSave: (timer: { label: string; durationMs: number }) => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

const TimerEditor: React.FC<TimerEditorProps> = ({ onSave, className = '' }) => {
    const [label, setLabel] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const handleSave = () => {
        const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
        if (durationMs > 0 && label.trim()) {
            onSave({ label: label.trim(), durationMs });
            setLabel('');
            setHours(0);
            setMinutes(0);
            setSeconds(0);
        }
    };

    const handleNumberChange = (value: string, setter: (val: number) => void) => {
        const num = parseInt(value, 10) || 0;
        setter(Math.max(0, num));
    };

    return (
        <Card className={className} padding="md" variant="default">
            <div className="space-y-4">
                {/* 라벨 입력 */}
                <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="타이머 이름 (예: 집중 시간)"
                    className="text-lg font-semibold"
                />

                {/* 시간 설정 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">시간 설정</label>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">시간</label>
                            <Input
                                type="number"
                                value={hours}
                                onChange={(e) => handleNumberChange(e.target.value, setHours)}
                                min="0"
                                max="23"
                                className="text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">분</label>
                            <Input
                                type="number"
                                value={minutes}
                                onChange={(e) => handleNumberChange(e.target.value, setMinutes)}
                                min="0"
                                max="59"
                                className="text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">초</label>
                            <Input
                                type="number"
                                value={seconds}
                                onChange={(e) => handleNumberChange(e.target.value, setSeconds)}
                                min="0"
                                max="59"
                                className="text-center"
                            />
                        </div>
                    </div>
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!label.trim() || (hours === 0 && minutes === 0 && seconds === 0)}
                        className="px-4 py-2 text-sm font-semibold bg-toss-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        추가
                    </button>
                </div>
            </div>
        </Card>
    );
};

export { TimerEditor };
export default TimerEditor;

