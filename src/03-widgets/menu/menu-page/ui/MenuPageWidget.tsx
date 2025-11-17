/**
 * MenuPageWidget Component
 * 메뉴추천 페이지 전체 위젯
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuSlice } from '@/features/menu';
import { MenuRecommend, MenuList, MenuEditor, MenuCard } from '@/entities/menu';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';

export interface MenuPageWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

// 기본 메뉴 데이터
const defaultMenus = [
    { name: '치킨', tags: ['치킨', '양념', '후라이드'] },
    { name: '피자', tags: ['피자', '도우', '토핑'] },
    { name: '햄버거', tags: ['햄버거', '패스트푸드'] },
    { name: '파스타', tags: ['파스타', '이탈리안', '면'] },
    { name: '초밥', tags: ['일식', '회', '초밥'] },
    { name: '삼겹살', tags: ['고기', '구이', '한식'] },
    { name: '김치찌개', tags: ['찌개', '한식', '매운맛'] },
    { name: '라면', tags: ['라면', '간편식'] },
    { name: '떡볶이', tags: ['분식', '매운맛'] },
    { name: '짜장면', tags: ['중식', '면'] },
    { name: '볶음밥', tags: ['중식', '밥'] },
    { name: '돈까스', tags: ['일식', '튀김'] },
];

const MenuPageWidget: React.FC<MenuPageWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const {
        menus,
        isLoading,
        recommendedMenu,
        recentRecommendations,
        loadMenus,
        addMenu,
        deleteMenu,
        recommendMenu,
        clearRecommendation,
    } = useMenuSlice();
    const [showEditor, setShowEditor] = useState(false);
    const [isRecommending, setIsRecommending] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        const initializeMenus = async () => {
            await loadMenus();
        };
        initializeMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 기본 메뉴 초기화 (한 번만 실행)
    useEffect(() => {
        if (!isLoading && menus.length === 0 && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            // 기본 메뉴를 순차적으로 추가
            const initializeDefaultMenus = async () => {
                for (const menu of defaultMenus) {
                    await addMenu(menu);
                }
            };
            initializeDefaultMenus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, menus.length]);

    // 모든 태그 추출
    const allTags = Array.from(new Set(menus.flatMap((menu) => menu.tags))).sort();

    const handleRecommend = () => {
        // 필터링된 메뉴가 있는지 먼저 확인
        let filteredMenus = menus;
        if (selectedTags.length > 0) {
            filteredMenus = menus.filter((menu) =>
                selectedTags.some((tag) => menu.tags.includes(tag))
            );
        }

        if (filteredMenus.length === 0) {
            alert('추천할 수 있는 메뉴가 없습니다. 태그를 선택하거나 메뉴를 추가해주세요.');
            return;
        }

        setIsRecommending(true);
        clearRecommendation();

        // 애니메이션을 위한 딜레이
        setTimeout(() => {
            recommendMenu(selectedTags.length > 0 ? selectedTags : undefined);
            setIsRecommending(false);
        }, 300);
    };

    const handleAddMenu = async (menu: { name: string; tags: string[] }) => {
        try {
            // 중복 메뉴 이름 체크
            const isDuplicate = menus.some((m) => m.name.toLowerCase() === menu.name.toLowerCase().trim());
            if (isDuplicate) {
                alert(`"${menu.name}" 메뉴가 이미 존재합니다.`);
                throw new Error('Duplicate menu name');
            }

            await addMenu(menu);
            setShowEditor(false);
        } catch (error) {
            // 중복 에러는 이미 alert로 표시했으므로 다시 표시하지 않음
            if (error instanceof Error && error.message !== 'Duplicate menu name') {
                console.error('Failed to add menu:', error);
                alert('메뉴 추가에 실패했습니다. 다시 시도해주세요.');
            }
            // 에러가 발생해도 모달은 열어둠 (사용자가 수정할 수 있도록)
        }
    };

    // ESC 키로 에디터 닫기 및 body 스크롤 제어
    useEffect(() => {
        if (!showEditor) return;

        // body 스크롤 잠금
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowEditor(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [showEditor]);

    const handleDeleteMenu = async (id: number) => {
        await deleteMenu(id);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className={`min-h-screen bg-bg-secondary ${className}`}>
            {/* 헤더 */}
            <div className="bg-bg-primary border-b border-neutral-gray-200 px-5 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            }
                            variant="ghost"
                            size="md"
                            onClick={() => router.push('/')}
                            aria-label="홈으로 가기"
                        />
                        <h1 className="text-2xl font-bold text-text-primary">메뉴추천</h1>
                    </div>
                    <Button onClick={() => setShowEditor(true)} variant="primary" size="md">
                        메뉴 추가
                    </Button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* 추천 영역 */}
                    <MenuRecommend menu={recommendedMenu} isRecommending={isRecommending} />

                    {/* 추천 버튼 및 태그 필터 */}
                    <Card padding="md" variant="default">
                        <div className="space-y-4">
                            {/* 태그 필터 */}
                            {allTags.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        태그로 필터링 (선택사항)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => handleTagToggle(tag)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                                    selectedTags.includes(tag)
                                                        ? 'bg-toss-blue text-white'
                                                        : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTags([])}
                                            className="mt-2 text-xs text-text-tertiary hover:text-text-primary"
                                        >
                                            필터 초기화
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* 추천 버튼 */}
                            <Button
                                onClick={handleRecommend}
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={menus.length === 0 || isRecommending}
                                loading={isRecommending}
                            >
                                {isRecommending ? '추천 중...' : '🍽️ 메뉴 추천하기'}
                            </Button>
                        </div>
                    </Card>

                    {/* 최근 추천 기록 */}
                    {recentRecommendations.length > 0 && (
                        <Card padding="md" variant="default">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">최근 추천</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recentRecommendations.map((menu) => (
                                    <MenuCard
                                        key={menu.id}
                                        menu={menu}
                                        onClick={() => recommendMenu(menu.tags)}
                                    />
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* 메뉴 에디터 모달 */}
                    {showEditor && (
                        <>
                            {/* 오버레이 */}
                            <div
                                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                                onClick={() => setShowEditor(false)}
                                aria-hidden="true"
                            />
                            {/* 모달 */}
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                                <div
                                    className="w-full max-w-2xl max-h-[90vh] pointer-events-auto animate-in zoom-in-95 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Card
                                        padding="lg"
                                        variant="elevated"
                                        className="overflow-y-auto"
                                    >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-text-primary">메뉴 추가</h2>
                                        <IconButton
                                            icon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            }
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowEditor(false)}
                                            aria-label="닫기"
                                        />
                                    </div>
                                    {showEditor && (
                                        <MenuEditor
                                            key="new-menu-editor"
                                            onSave={handleAddMenu}
                                            onCancel={() => setShowEditor(false)}
                                        />
                                    )}
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 메뉴 목록 */}
                    {menus.length > 0 && (
                        <Card padding="md" variant="default">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                전체 메뉴 ({menus.length}개)
                            </h2>
                            <MenuList
                                menus={menus}
                                highlightedId={recommendedMenu?.id}
                                onMenuDelete={handleDeleteMenu}
                                isLoading={isLoading}
                            />
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MenuPageWidget;

