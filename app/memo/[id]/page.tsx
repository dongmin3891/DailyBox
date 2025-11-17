import { MemoDetailPage } from '@/pages/memo/detail';

interface MemoDetailRouteProps {
    params: {
        id: string;
    };
}

export default function MemoDetailRoute({ params }: MemoDetailRouteProps) {
    const memoId = parseInt(params.id, 10);
    
    if (isNaN(memoId)) {
        // 잘못된 ID인 경우 리스트로 리다이렉트
        return null;
    }

    return <MemoDetailPage memoId={memoId} />;
}

