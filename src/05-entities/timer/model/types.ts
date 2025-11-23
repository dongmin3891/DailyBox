export type TimerCategory = 'work' | 'study' | 'exercise';

export type Timer = {
    id?: number;
    label: string;
    durationMs: number;
    category: TimerCategory;
    startedAt: number;
    endedAt?: number;
    createdAt: number;
};

export type PomodoroPreset = {
    work: number; // 작업 시간 (분)
    rest: number; // 휴식 시간 (분)
};
