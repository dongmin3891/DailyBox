/**
 * MenuPageWidget Component
 * 메뉴추천 페이지 전체 위젯
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuSlice } from '@/features/menu';
import { MenuRecommend, MenuList, MenuEditor, MenuCard } from '@/entities/menu';
import type { MenuCategory, TimeOfDay } from '@/entities/menu/model/types';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import { MenuHistoryWidget, RecommendationRulesWidget } from '@/widgets/menu';

export interface MenuPageWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

// 기본 메뉴 데이터
const defaultMenus: Array<{ name: string; tags: string[]; category?: MenuCategory; timeOfDay?: TimeOfDay[] }> = [
    { name: '치킨', tags: ['치킨', '양념', '후라이드'], category: 'korean', timeOfDay: ['dinner', 'snack'] },
    { name: '피자', tags: ['피자', '도우', '토핑'], category: 'western', timeOfDay: ['dinner'] },
    { name: '햄버거', tags: ['햄버거', '패스트푸드'], category: 'western', timeOfDay: ['lunch', 'dinner'] },
    { name: '파스타', tags: ['파스타', '이탈리안', '면'], category: 'western', timeOfDay: ['lunch', 'dinner'] },
    { name: '초밥', tags: ['일식', '회', '초밥'], category: 'japanese', timeOfDay: ['lunch', 'dinner'] },
    { name: '삼겹살', tags: ['고기', '구이', '한식'], category: 'korean', timeOfDay: ['dinner'] },
    { name: '김치찌개', tags: ['찌개', '한식', '매운맛'], category: 'korean', timeOfDay: ['lunch', 'dinner'] },
    { name: '라면', tags: ['라면', '간편식'], category: 'snack', timeOfDay: ['snack'] },
    { name: '떡볶이', tags: ['분식', '매운맛'], category: 'snack', timeOfDay: ['snack'] },
    { name: '짜장면', tags: ['중식', '면'], category: 'chinese', timeOfDay: ['lunch', 'dinner'] },
    { name: '볶음밥', tags: ['중식', '밥'], category: 'chinese', timeOfDay: ['lunch', 'dinner'] },
    { name: '돈까스', tags: ['일식', '튀김'], category: 'japanese', timeOfDay: ['lunch', 'dinner'] },
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
        recordMeal,
        clearRecommendation,
        loadRecommendationRules,
    } = useMenuSlice();
    const [showEditor, setShowEditor] = useState(false);
    const [isRecommending, setIsRecommending] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | undefined>(undefined);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay | undefined>(undefined);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        const initializeMenus = async () => {
            await loadMenus();
            await loadRecommendationRules();
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

    // 카테고리 옵션
    const categoryOptions: Array<{ value: MenuCategory; label: string; icon: string }> = [
        { value: 'korean', label: '한식', icon: '🍚' },
        { value: 'chinese', label: '중식', icon: '🥢' },
        { value: 'japanese', label: '일식', icon: '🍣' },
        { value: 'western', label: '양식', icon: '🍝' },
        { value: 'snack', label: '분식', icon: '🍢' },
        { value: 'other', label: '기타', icon: '🍽️' },
    ];

    // 시간대 옵션
    const timeOfDayOptions: Array<{ value: TimeOfDay; label: string; icon: string }> = [
        { value: 'breakfast', label: '아침', icon: '🌅' },
        { value: 'lunch', label: '점심', icon: '☀️' },
        { value: 'dinner', label: '저녁', icon: '🌙' },
        { value: 'snack', label: '야식', icon: '🌙' },
    ];

    // 현재 시간대 자동 감지 (22시 이후는 야식)
    const getCurrentTimeOfDay = (): TimeOfDay | undefined => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) return 'breakfast';
        if (hour >= 10 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 22) return 'dinner';
        return 'snack'; // 22시 이후 ~ 5시 이전: 야식
    };

    const handleRecommend = () => {
        // 필터링된 메뉴가 있는지 먼저 확인
        let filteredMenus = menus;

        // 카테고리 필터 적용
        if (selectedCategory) {
            filteredMenus = filteredMenus.filter((menu) => menu.category === selectedCategory);
        }

        // 시간대 필터 적용 (선택하지 않으면 현재 시간대 자동 적용)
        const timeFilter = selectedTimeOfDay || getCurrentTimeOfDay();
        if (timeFilter) {
            filteredMenus = filteredMenus.filter(
                (menu) => !menu.timeOfDay || menu.timeOfDay.length === 0 || menu.timeOfDay.includes(timeFilter)
            );
        }

        // 태그 필터 적용
        if (selectedTags.length > 0) {
            filteredMenus = filteredMenus.filter((menu) => selectedTags.some((tag) => menu.tags.includes(tag)));
        }

        if (filteredMenus.length === 0) {
            alert('추천할 수 있는 메뉴가 없습니다. 카테고리, 시간대, 태그를 선택하거나 메뉴를 추가해주세요.');
            return;
        }

        setIsRecommending(true);
        clearRecommendation();

        // 애니메이션을 위한 딜레이
        setTimeout(() => {
            recommendMenu(selectedTags.length > 0 ? selectedTags : undefined, selectedCategory, timeFilter);
            setIsRecommending(false);
        }, 300);
    };

    // 추천된 메뉴를 식사 기록으로 저장
    const handleRecordMeal = async () => {
        if (!recommendedMenu) return;

        const timeFilter = selectedTimeOfDay || getCurrentTimeOfDay();
        await recordMeal(recommendedMenu.id, recommendedMenu.name, recommendedMenu.category, timeFilter);

        alert(`"${recommendedMenu.name}" 식사 기록이 저장되었습니다!`);
    };

    const handleAddMenu = async (menu: {
        name: string;
        tags: string[];
        category?: MenuCategory;
        timeOfDay?: TimeOfDay[];
    }) => {
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
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
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
                    <div className="space-y-3">
                        <MenuRecommend menu={recommendedMenu} isRecommending={isRecommending} />
                        {recommendedMenu && (
                            <Button onClick={handleRecordMeal} variant="secondary" size="md" fullWidth>
                                📝 이 메뉴로 식사 기록하기
                            </Button>
                        )}
                    </div>

                    {/* 추천 버튼 및 필터 */}
                    <Card padding="md" variant="default">
                        <div className="space-y-4">
                            {/* 카테고리 필터 */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    카테고리 선택 (선택사항)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categoryOptions.map((option) => {
                                        const isSelected = selectedCategory === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    setSelectedCategory(isSelected ? undefined : option.value)
                                                }
                                                className={`
                                                    flex flex-col items-center justify-center gap-1
                                                    px-3 py-2 rounded-lg border-2 transition-all
                                                    ${
                                                        isSelected
                                                            ? 'bg-toss-blue/10 border-toss-blue text-toss-blue'
                                                            : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary hover:border-neutral-gray-300'
                                                    }
                                                `}
                                            >
                                                <span className="text-xl">{option.icon}</span>
                                                <span className="text-xs font-medium">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 시간대 필터 */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    시간대 선택 (선택사항, 미선택 시 현재 시간대 자동 적용)
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeOfDayOptions.map((option) => {
                                        const isSelected = selectedTimeOfDay === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    setSelectedTimeOfDay(isSelected ? undefined : option.value)
                                                }
                                                className={`
                                                    flex flex-col items-center justify-center gap-1
                                                    px-3 py-2 rounded-lg border-2 transition-all
                                                    ${
                                                        isSelected
                                                            ? 'bg-semantic-success/15 border-semantic-success/30 text-semantic-success'
                                                            : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary hover:border-neutral-gray-300'
                                                    }
                                                `}
                                            >
                                                <span className="text-xl">{option.icon}</span>
                                                <span className="text-xs font-medium">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {!selectedTimeOfDay && (
                                    <p className="mt-1 text-xs text-text-tertiary">
                                        현재 시간대:{' '}
                                        {timeOfDayOptions.find((o) => o.value === getCurrentTimeOfDay())?.label ||
                                            '야식'}
                                    </p>
                                )}
                            </div>

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
                                </div>
                            )}

                            {/* 필터 초기화 */}
                            {(selectedTags.length > 0 || selectedCategory || selectedTimeOfDay) && (
                                <button
                                    onClick={() => {
                                        setSelectedTags([]);
                                        setSelectedCategory(undefined);
                                        setSelectedTimeOfDay(undefined);
                                    }}
                                    className="text-xs text-text-tertiary hover:text-text-primary"
                                >
                                    필터 초기화
                                </button>
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

                    {/* 식사 기록 히스토리 */}
                    <MenuHistoryWidget maxItems={10} />

                    {/* 추천 규칙 설정 */}
                    <RecommendationRulesWidget />

                    {/* 최근 추천 기록 */}
                    {recentRecommendations.length > 0 && (
                        <Card padding="md" variant="default">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">최근 추천</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recentRecommendations.map((menu) => (
                                    <MenuCard key={menu.id} menu={menu} onClick={() => recommendMenu(menu.tags)} />
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
                                    <Card padding="lg" variant="elevated" className="overflow-y-auto">
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
