/**
 * MemoListWidget Component
 * 메모 리스트만 표시하는 위젯
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoSlice } from '@/features/memo';
import { MemoList } from '@/entities/memo';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import { Input } from '@/shared/ui';
import type { MemoSortOption, MemoGroupOption } from '@/entities/memo/api/memo.repository';
import { groupMemosByDate } from '@/entities/memo/api/memo.repository';
import type { Memo } from '@/entities/memo/model/types';
import { useThemeSlice } from '@/shared/model/theme.slice';

export interface MemoListWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const MemoListWidget: React.FC<MemoListWidgetProps> = ({ className = '' }) => {
    const router = useRouter();
    const {
        memos,
        isLoading,
        loadMemos,
        loadAllMemos,
        allMemos,
        deleteMemo,
        togglePin,
        unlockMemo,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filters,
        exportMemos,
        importMemos,
    } = useMemoSlice();
    const { theme, toggleTheme } = useThemeSlice();
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showBackupMenu, setShowBackupMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const backupMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadMemos();
        loadAllMemos();
    }, [loadMemos, loadAllMemos]);

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setShowSortMenu(false);
            }
            if (backupMenuRef.current && !backupMenuRef.current.contains(event.target as Node)) {
                setShowBackupMenu(false);
            }
        };

        if (showSortMenu || showBackupMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortMenu, showBackupMenu]);

    const handleMemoClick = (id: number) => {
        router.push(`/memo/${id}`);
    };

    const handleNewMemo = () => {
        router.push('/memo/new');
    };

    const handleDeleteMemo = async (id: number) => {
        await deleteMemo(id);
    };

    const handleTogglePin = async (id: number) => {
        await togglePin(id);
    };

    const handleUnlock = async (id: number, pin: string) => {
        return await unlockMemo(id, pin);
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // 자동완성으로 인한 이메일 형식 입력 감지 및 차단
        if (newValue.includes('@') && !searchQuery.includes('@')) {
            console.warn('🚫 Autocomplete detected and blocked:', newValue);
            // 자동완성 시도를 무시하고 이전 값 유지
            e.target.value = searchQuery;
            return;
        }

        await setSearchQuery(newValue);
    };

    const handleSortChange = async (newSort: MemoSortOption) => {
        await setSortBy(newSort);
        setShowSortMenu(false);
    };

    const handleExport = async () => {
        try {
            const jsonData = await exportMemos();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `memos-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setShowBackupMenu(false);
            alert('백업 파일이 다운로드되었습니다.');
        } catch (error) {
            console.error('Export failed:', error);
            alert('백업에 실패했습니다.');
        }
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            if (confirm('기존 메모와 병합됩니다. 계속하시겠습니까?')) {
                await importMemos(text);
                alert('복원이 완료되었습니다.');
            }
        } catch (error) {
            console.error('Import failed:', error);
            alert('복원에 실패했습니다. 파일 형식을 확인해주세요.');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setShowBackupMenu(false);
        }
    };

    const sortLabels: Record<MemoSortOption, string> = {
        updatedAt: '수정 날짜',
        title: '제목',
        createdAt: '생성 날짜',
        tag: '태그',
        favorite: '즐겨찾기 우선',
    };

    // 필터링 함수 (각 그룹 내에서 적용)
    const filterMemos = (memoList: (Memo & { id: number })[]): (Memo & { id: number })[] => {
        let filtered = memoList;

        // 검색어 필터
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (memo) =>
                    memo.title.toLowerCase().includes(lowerQuery) ||
                    memo.content.toLowerCase().includes(lowerQuery) ||
                    memo.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
            );
        }

        // 태그 필터
        if (filters?.tags && filters.tags.length > 0) {
            filtered = filtered.filter((memo) => memo.tags?.some((tag) => filters.tags!.includes(tag)));
        }

        return filtered;
    };

    // 정렬 함수 (updatedAt 내림차순 기본)
    const sortMemos = (memoList: (Memo & { id: number })[]): (Memo & { id: number })[] => {
        const sorted = [...memoList];

        // 즐겨찾기 우선 정렬
        const pinnedMemos = sorted.filter((m) => m.isPinned);
        const unpinnedMemos = sorted.filter((m) => !m.isPinned);

        const sortFn = (a: Memo & { id: number }, b: Memo & { id: number }) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title, 'ko');
            }
            if (sortBy === 'createdAt') {
                return b.createdAt - a.createdAt;
            }
            if (sortBy === 'tag') {
                const aTag = a.tags?.[0] || '';
                const bTag = b.tags?.[0] || '';
                return aTag.localeCompare(bTag, 'ko');
            }
            if (sortBy === 'favorite') {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.updatedAt - a.updatedAt;
            }
            // updatedAt (기본값)
            return b.updatedAt - a.updatedAt;
        };

        pinnedMemos.sort(sortFn);
        unpinnedMemos.sort(sortFn);

        return [...pinnedMemos, ...unpinnedMemos];
    };

    // 그룹핑된 메모 (항상 thisMonth 그룹핑으로 표시)
    // allMemos를 우선 사용 (필터링되지 않은 전체 메모)
    // allMemos가 비어있고 memos가 있으면 memos 사용 (초기 로딩 시)
    const memosToGroup = allMemos.length > 0 ? allMemos : memos.length > 0 ? memos : [];
    const groupedMemos = groupMemosByDate(memosToGroup, 'thisMonth');

    // 각 그룹 내에서 필터링 및 정렬 적용
    const convertAndFilter = (memoList: typeof groupedMemos.today): (Memo & { id: number })[] => {
        const filtered = (memoList || []).filter((m): m is typeof m & { id: number } => m.id !== undefined) as (Memo & {
            id: number;
        })[];
        return sortMemos(filterMemos(filtered));
    };

    const processedGroupedMemos = {
        today: convertAndFilter(groupedMemos.today),
        thisWeek: convertAndFilter(groupedMemos.thisWeek),
        thisMonth: convertAndFilter(groupedMemos.thisMonth),
        older: convertAndFilter(groupedMemos.older),
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
                        <h1 className="text-2xl font-bold text-text-primary">메모장</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 다크모드 토글 */}
                        <IconButton
                            icon={
                                theme === 'dark' ? (
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
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ) : (
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
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )
                            }
                            variant="ghost"
                            size="md"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? '라이트 모드' : '다크 모드'}
                        />
                        <div className="relative" ref={backupMenuRef}>
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                }
                                variant="ghost"
                                size="md"
                                onClick={() => setShowBackupMenu(!showBackupMenu)}
                                aria-label="백업/복원"
                            />
                            {showBackupMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-bg-primary border border-neutral-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={handleExport}
                                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary transition-colors rounded-t-lg"
                                    >
                                        백업하기
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-secondary transition-colors rounded-b-lg"
                                    >
                                        복원하기
                                    </button>
                                </div>
                            )}
                        </div>
                        <Button onClick={handleNewMemo} variant="primary" size="md">
                            새 메모
                        </Button>
                    </div>
                </div>
            </div>

            {/* 검색 및 정렬 바 */}
            <div className="sticky top-0 z-20 bg-bg-primary border-b border-neutral-gray-200 px-5 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="flex-1">
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="제목 또는 내용으로 검색..."
                            className="w-full"
                            autoComplete="new-password"
                            data-form-type="other"
                            data-lpignore="true"
                            name="search-memo-query"
                            id="search-memo-query-input"
                        />
                    </div>
                    <div className="relative" ref={sortMenuRef}>
                        <Button variant="secondary" size="md" onClick={() => setShowSortMenu(!showSortMenu)}>
                            정렬: {sortLabels[sortBy]}
                        </Button>
                        {showSortMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-bg-primary border border-neutral-gray-200 rounded-lg shadow-lg z-50">
                                {(['updatedAt', 'title', 'createdAt', 'tag', 'favorite'] as MemoSortOption[]).map(
                                    (option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleSortChange(option)}
                                            className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                                sortBy === option
                                                    ? 'bg-toss-blue/10 text-toss-blue font-semibold'
                                                    : 'text-text-primary hover:bg-bg-secondary'
                                            } ${option === 'updatedAt' ? 'rounded-t-lg' : ''} ${
                                                option === 'createdAt' ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {sortLabels[option]}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto">
                    {processedGroupedMemos && (
                        <div className="space-y-6">
                            {processedGroupedMemos.today && processedGroupedMemos.today.length > 0 && (
                                <div>
                                    <h2 className="sticky top-[73px] z-10 bg-bg-secondary py-3 text-lg font-semibold text-text-primary border-b border-neutral-gray-200">
                                        오늘
                                    </h2>
                                    <Card padding="md" variant="default" className="mt-3">
                                        <MemoList
                                            memos={processedGroupedMemos.today}
                                            onMemoClick={handleMemoClick}
                                            onMemoDelete={handleDeleteMemo}
                                            onMemoTogglePin={handleTogglePin}
                                            onMemoUnlock={handleUnlock}
                                            isLoading={isLoading}
                                        />
                                    </Card>
                                </div>
                            )}
                            {processedGroupedMemos.thisWeek && processedGroupedMemos.thisWeek.length > 0 && (
                                <div>
                                    <h2 className="sticky top-[73px] z-10 bg-bg-secondary py-3 text-lg font-semibold text-text-primary border-b border-neutral-gray-200">
                                        이번주
                                    </h2>
                                    <Card padding="md" variant="default" className="mt-3">
                                        <MemoList
                                            memos={processedGroupedMemos.thisWeek}
                                            onMemoClick={handleMemoClick}
                                            onMemoDelete={handleDeleteMemo}
                                            onMemoTogglePin={handleTogglePin}
                                            onMemoUnlock={handleUnlock}
                                            isLoading={isLoading}
                                        />
                                    </Card>
                                </div>
                            )}
                            {processedGroupedMemos.thisMonth && processedGroupedMemos.thisMonth.length > 0 && (
                                <div>
                                    <h2 className="sticky top-[73px] z-10 bg-bg-secondary py-3 text-lg font-semibold text-text-primary border-b border-neutral-gray-200">
                                        이번달
                                    </h2>
                                    <Card padding="md" variant="default" className="mt-3">
                                        <MemoList
                                            memos={processedGroupedMemos.thisMonth}
                                            onMemoClick={handleMemoClick}
                                            onMemoDelete={handleDeleteMemo}
                                            onMemoTogglePin={handleTogglePin}
                                            onMemoUnlock={handleUnlock}
                                            isLoading={isLoading}
                                        />
                                    </Card>
                                </div>
                            )}
                            {processedGroupedMemos.older && processedGroupedMemos.older.length > 0 && (
                                <div>
                                    <h2 className="sticky top-[73px] z-10 bg-bg-secondary py-3 text-lg font-semibold text-text-primary border-b border-neutral-gray-200">
                                        이전
                                    </h2>
                                    <Card padding="md" variant="default" className="mt-3">
                                        <MemoList
                                            memos={processedGroupedMemos.older}
                                            onMemoClick={handleMemoClick}
                                            onMemoDelete={handleDeleteMemo}
                                            onMemoTogglePin={handleTogglePin}
                                            onMemoUnlock={handleUnlock}
                                            isLoading={isLoading}
                                        />
                                    </Card>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* 숨겨진 파일 입력 */}
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </div>
    );
};

export default MemoListWidget;
