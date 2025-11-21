export type TodoPriority = 'high' | 'medium' | 'low';
export type TodoCategory = 'work' | 'home' | 'personal';
export type TodoRepeat = 'none' | 'daily' | 'weekly';

export type Todo = {
    id?: number;
    title: string;
    isDone: boolean;
    priority: TodoPriority;
    category: TodoCategory;
    dueDate?: number; // 마감일 (밀리초 타임스탬프)
    repeat: TodoRepeat;
    createdAt: number;
    updatedAt: number;
};
