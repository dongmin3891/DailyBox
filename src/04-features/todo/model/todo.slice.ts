'use client';
import { create } from 'zustand';
import { todoRepository } from '@/entities/todo/api/todo.repository';

type TodoItem = {
    id: number;
    title: string;
    isDone: boolean;
    createdAt: number;
    updatedAt: number;
};

type TodoSlice = {
    todos: TodoItem[];
    isLoading: boolean;
    loadTodos: () => Promise<void>;
};

export const useTodoSlice = create<TodoSlice>((set) => ({
    todos: [],
    isLoading: false,
    loadTodos: async () => {
        set({ isLoading: true });
        const items = await todoRepository.getAll();
        set({ todos: items as TodoItem[], isLoading: false });
    },
}));
