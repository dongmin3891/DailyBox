export type TodoPriority = 'high' | 'medium' | 'low';

export type Todo = {
    id?: number;
    title: string;
    isDone: boolean;
    priority: TodoPriority;
    createdAt: number;
    updatedAt: number;
};
