import { TodoDetailPage } from '@/pages/todo/detail';

interface TodoDetailRouteProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TodoDetailRoute({ params }: TodoDetailRouteProps) {
    const { id } = await params;
    const todoId = parseInt(id, 10);
    
    if (isNaN(todoId)) {
        // 잘못된 ID인 경우 리스트로 리다이렉트
        return null;
    }

    return <TodoDetailPage todoId={todoId} />;
}

