'use client';
import { create } from 'zustand';
import { todoRepository } from '@/entities/todo/api/todo.repository';
import type { Todo } from '@/entities/todo/model/types';

type TodoItem = Todo & {
    id: number;
};

type TodoSlice = {
    todos: TodoItem[];
    isLoading: boolean;

    // Actions
    loadTodos: () => Promise<void>;
    addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateTodo: (id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
    toggleTodo: (id: number) => Promise<void>;
    clearCompleted: () => Promise<void>;
};

export const useTodoSlice = create<TodoSlice>((set, get) => ({
    todos: [],
    isLoading: false,

    loadTodos: async () => {
        set({ isLoading: true });
        try {
            const items = await todoRepository.getAll();
            // 기존 데이터 호환성: priority가 없으면 'medium'으로 설정
            const todosWithPriority = items.map((item) => ({
                ...item,
                priority: (item as any).priority || 'medium',
            })) as TodoItem[];
            set({ todos: todosWithPriority, isLoading: false });
        } catch (error) {
            console.error('Failed to load todos:', error);
            set({ isLoading: false });
        }
    },

    addTodo: async (todo) => {
        try {
            const now = Date.now();
            const newTodo: Omit<TodoItem, 'id'> = {
                ...todo,
                priority: todo.priority || 'medium',
                createdAt: now,
                updatedAt: now,
            };
            const newId = await todoRepository.add(newTodo);
            const { todos } = get();
            set({
                todos: [{ ...newTodo, id: newId } as TodoItem, ...todos],
            });
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    },

    updateTodo: async (id, updates) => {
        try {
            const now = Date.now();
            await todoRepository.update(id, {
                ...updates,
                updatedAt: now,
            });
            const { todos } = get();
            set({
                todos: todos.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: now } : todo)),
            });
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    },

    deleteTodo: async (id) => {
        try {
            await todoRepository.remove(id);
            const { todos } = get();
            set({
                todos: todos.filter((todo) => todo.id !== id),
            });
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    },

    toggleTodo: async (id) => {
        const { todos } = get();
        const todo = todos.find((t) => t.id === id);
        if (todo) {
            await get().updateTodo(id, { isDone: !todo.isDone });
        }
    },

    clearCompleted: async () => {
        const { todos } = get();
        const completedTodos = todos.filter((todo) => todo.isDone);
        await Promise.all(completedTodos.map((todo) => get().deleteTodo(todo.id)));
    },
}));
