export default function Home() {
    return (
        <main className="min-h-screen bg-bg-secondary p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-primary mb-2">📦 일상함 All-in-one</h1>
                    <p className="text-text-secondary">일상에 필요한 모든 기능을 담은 만능 도구함</p>
                </header>

                {/* Tailwind 테스트 색상 */}
                <section className="bg-bg-primary rounded-lg p-6 mb-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">🎨 Tailwind 색상 테스트</h2>
                    <div className="flex flex-wrap gap-3">
                        <div className="bg-toss-blue text-white px-4 py-2 rounded-lg text-sm">Toss Blue</div>
                        <div className="bg-semantic-success text-white px-4 py-2 rounded-lg text-sm">Success</div>
                        <div className="bg-semantic-error text-white px-4 py-2 rounded-lg text-sm">Error</div>
                        <div className="bg-neutral-gray-600 text-white px-4 py-2 rounded-lg text-sm">Gray 600</div>
                    </div>
                </section>

                {/* 기능 목록 */}
                <section className="bg-bg-primary rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-text-primary mb-6">🛠️ 제공 기능</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-toss-blue-light border border-toss-blue/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">📝</div>
                            <h3 className="font-medium text-text-primary">메모</h3>
                            <p className="text-text-secondary text-sm">간단한 메모 기능</p>
                        </div>

                        <div className="bg-semantic-success/10 border border-semantic-success/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">✅</div>
                            <h3 className="font-medium text-text-primary">투두</h3>
                            <p className="text-text-secondary text-sm">할 일 관리</p>
                        </div>

                        <div className="bg-semantic-warning/10 border border-semantic-warning/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">⏰</div>
                            <h3 className="font-medium text-text-primary">타이머</h3>
                            <p className="text-text-secondary text-sm">시간 관리</p>
                        </div>

                        <div className="bg-neutral-gray-100 border border-neutral-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">🔢</div>
                            <h3 className="font-medium text-text-primary">계산기</h3>
                            <p className="text-text-secondary text-sm">간편한 계산</p>
                        </div>

                        <div className="bg-semantic-error/10 border border-semantic-error/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">🍽️</div>
                            <h3 className="font-medium text-text-primary">메뉴추천</h3>
                            <p className="text-text-secondary text-sm">오늘 뭐 먹지?</p>
                        </div>

                        <div className="bg-toss-blue/10 border border-toss-blue/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="text-2xl mb-2">🔮</div>
                            <h3 className="font-medium text-text-primary">오늘의 운세</h3>
                            <p className="text-text-secondary text-sm">행운을 불러와</p>
                        </div>
                    </div>
                </section>

                {/* 색상 가이드 링크 */}
                <div className="mt-8 text-center">
                    <a
                        href="/colors"
                        className="inline-flex items-center bg-toss-blue text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        🎨 색상 가이드 보기
                    </a>
                </div>
            </div>
        </main>
    );
}
