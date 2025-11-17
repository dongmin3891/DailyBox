import { TodoDetailPage } from '@/pages/todo/detail';

interface TodoDetailRouteProps {
    params: {
        id: string;
    };
}

export default function TodoDetailRoute({ params }: TodoDetailRouteProps) {
    const todoId = parseInt(params.id, 10);
    
    if (isNaN(todoId)) {
        // 잘못된 ID인 경우 리스트로 리다이렉트
        return null;
    }

    return <TodoDetailPage todoId={todoId} />;
}

