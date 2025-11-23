/**
 * RecommendationRulesWidget Component
 * 추천 규칙 설정 위젯
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useMenuSlice } from '@/features/menu';
import { Card } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { IconButton } from '@/shared/ui';
import type { MenuCategory, TimeOfDay } from '@/entities/menu/model/types';
import type { DbRecommendationRule } from '@/shared/lib/db/dexie';

export interface RecommendationRulesWidgetProps {
    /** 추가 클래스명 */
    className?: string;
}

const categoryLabels: Record<MenuCategory, { label: string; icon: string }> = {
    korean: { label: '한식', icon: '🍚' },
    chinese: { label: '중식', icon: '🥢' },
    japanese: { label: '일식', icon: '🍣' },
    western: { label: '양식', icon: '🍝' },
    snack: { label: '분식', icon: '🍢' },
    other: { label: '기타', icon: '🍽️' },
};

const timeOfDayLabels: Record<TimeOfDay, { label: string; icon: string }> = {
    breakfast: { label: '아침', icon: '🌅' },
    lunch: { label: '점심', icon: '☀️' },
    dinner: { label: '저녁', icon: '🌙' },
    snack: { label: '야식', icon: '🌙' },
};

const dayOfWeekLabels: Record<number, string> = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
};

const RecommendationRulesWidget: React.FC<RecommendationRulesWidgetProps> = ({ className = '' }) => {
    const {
        recommendationRules,
        isLoadingRules,
        loadRecommendationRules,
        addRecommendationRule,
        updateRecommendationRule,
        deleteRecommendationRule,
    } = useMenuSlice();

    const [showEditor, setShowEditor] = useState(false);
    const [editingRule, setEditingRule] = useState<DbRecommendationRule | null>(null);

    useEffect(() => {
        loadRecommendationRules();
    }, [loadRecommendationRules]);

    const handleAddRule = () => {
        setEditingRule(null);
        setShowEditor(true);
    };

    const handleEditRule = (rule: DbRecommendationRule) => {
        setEditingRule(rule);
        setShowEditor(true);
    };

    const handleDeleteRule = async (id: number) => {
        if (confirm('이 규칙을 삭제하시겠습니까?')) {
            await deleteRecommendationRule(id);
        }
    };

    const handleToggleRule = async (rule: DbRecommendationRule) => {
        await updateRecommendationRule(rule.id!, { enabled: !rule.enabled });
    };

    const formatRuleConditions = (rule: DbRecommendationRule): string => {
        const conditions: string[] = [];

        if (rule.conditions.dayOfWeek && rule.conditions.dayOfWeek.length > 0) {
            const days = rule.conditions.dayOfWeek.map((d) => dayOfWeekLabels[d]).join(', ');
            conditions.push(`요일: ${days}`);
        }

        if (rule.conditions.timeOfDay && rule.conditions.timeOfDay.length > 0) {
            const times = rule.conditions.timeOfDay.map((t) => timeOfDayLabels[t].label).join(', ');
            conditions.push(`시간대: ${times}`);
        }

        return conditions.length > 0 ? conditions.join(' | ') : '조건 없음';
    };

    const formatRuleActions = (rule: DbRecommendationRule): string => {
        const actions: string[] = [];

        if (rule.actions.priorityCategories && rule.actions.priorityCategories.length > 0) {
            const categories = rule.actions.priorityCategories
                .map((c) => categoryLabels[c].label)
                .join(', ');
            actions.push(`우선: ${categories}`);
        }

        if (rule.actions.excludeCategories && rule.actions.excludeCategories.length > 0) {
            const categories = rule.actions.excludeCategories
                .map((c) => categoryLabels[c].label)
                .join(', ');
            actions.push(`제외: ${categories}`);
        }

        return actions.length > 0 ? actions.join(' | ') : '액션 없음';
    };

    if (isLoadingRules) {
        return (
            <Card padding="md" variant="default" className={className}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-text-tertiary">로딩 중...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="md" variant="default" className={className}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">추천 규칙</h2>
                <Button onClick={handleAddRule} variant="primary" size="sm">
                    규칙 추가
                </Button>
            </div>

            {recommendationRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-text-tertiary mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-text-tertiary">설정된 규칙이 없습니다</p>
                    <p className="text-sm text-text-tertiary mt-1">규칙을 추가하여 추천을 개인화하세요</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recommendationRules.map((rule) => (
                        <div
                            key={rule.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                rule.enabled
                                    ? 'bg-semantic-success/5 border-semantic-success/30'
                                    : 'bg-neutral-gray-50 border-neutral-gray-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-text-primary">{rule.name}</h3>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${
                                                rule.enabled
                                                    ? 'bg-semantic-success/20 text-semantic-success'
                                                    : 'bg-neutral-gray-200 text-text-tertiary'
                                            }`}
                                        >
                                            {rule.enabled ? '활성' : '비활성'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-text-secondary mb-1">
                                        조건: {formatRuleConditions(rule)}
                                    </div>
                                    <div className="text-sm text-text-secondary">
                                        액션: {formatRuleActions(rule)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <IconButton
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                            </svg>
                                        }
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditRule(rule)}
                                        aria-label="규칙 수정"
                                    />
                                    <IconButton
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        }
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => rule.id && handleDeleteRule(rule.id)}
                                        aria-label="규칙 삭제"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 규칙 에디터 모달 */}
            {showEditor && (
                <RuleEditorModal
                    rule={editingRule}
                    onSave={async (ruleData) => {
                        if (editingRule?.id) {
                            await updateRecommendationRule(editingRule.id, ruleData);
                        } else {
                            await addRecommendationRule({
                                ...ruleData,
                                enabled: true,
                            });
                        }
                        setShowEditor(false);
                        setEditingRule(null);
                    }}
                    onCancel={() => {
                        setShowEditor(false);
                        setEditingRule(null);
                    }}
                />
            )}
        </Card>
    );
};

// 규칙 에디터 모달 컴포넌트
interface RuleEditorModalProps {
    rule: DbRecommendationRule | null;
    onSave: (rule: Omit<DbRecommendationRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

const RuleEditorModal: React.FC<RuleEditorModalProps> = ({ rule, onSave, onCancel }) => {
    const [name, setName] = useState(rule?.name || '');
    const [enabled, setEnabled] = useState(rule?.enabled ?? true);
    const [selectedDays, setSelectedDays] = useState<number[]>(rule?.conditions.dayOfWeek || []);
    const [selectedTimes, setSelectedTimes] = useState<TimeOfDay[]>(rule?.conditions.timeOfDay || []);
    const [priorityCategories, setPriorityCategories] = useState<MenuCategory[]>(
        rule?.actions.priorityCategories || []
    );
    const [excludeCategories, setExcludeCategories] = useState<MenuCategory[]>(
        rule?.actions.excludeCategories || []
    );

    const handleSave = () => {
        if (!name.trim()) {
            alert('규칙 이름을 입력해주세요.');
            return;
        }

        onSave({
            name: name.trim(),
            enabled,
            conditions: {
                dayOfWeek: selectedDays.length > 0 ? selectedDays : undefined,
                timeOfDay: selectedTimes.length > 0 ? selectedTimes : undefined,
            },
            actions: {
                priorityCategories: priorityCategories.length > 0 ? priorityCategories : undefined,
                excludeCategories: excludeCategories.length > 0 ? excludeCategories : undefined,
            },
        });
    };

    const toggleDay = (day: number) => {
        setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    const toggleTime = (time: TimeOfDay) => {
        setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]));
    };

    const togglePriorityCategory = (category: MenuCategory) => {
        setPriorityCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const toggleExcludeCategory = (category: MenuCategory) => {
        setExcludeCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    return (
        <>
            {/* 오버레이 */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onCancel}
                aria-hidden="true"
            />
            {/* 모달 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="w-full max-w-2xl max-h-[90vh] pointer-events-auto animate-in zoom-in-95 duration-200 bg-bg-primary rounded-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card padding="lg" variant="elevated" className="overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-text-primary">
                                {rule ? '규칙 수정' : '규칙 추가'}
                            </h2>
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
                                onClick={onCancel}
                                aria-label="닫기"
                            />
                        </div>

                        <div className="space-y-6">
                            {/* 규칙 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    규칙 이름 *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="예: 평일 건강식 추천"
                                    className="w-full px-3 py-2 border border-neutral-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-toss-blue"
                                />
                            </div>

                            {/* 활성화 여부 */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={enabled}
                                    onChange={(e) => setEnabled(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="enabled" className="text-sm text-text-primary">
                                    규칙 활성화
                                </label>
                            </div>

                            {/* 조건: 요일 */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    조건: 요일 (선택사항)
                                </label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                selectedDays.includes(day)
                                                    ? 'bg-toss-blue text-white'
                                                    : 'bg-neutral-gray-100 text-text-secondary hover:bg-neutral-gray-200'
                                            }`}
                                        >
                                            {dayOfWeekLabels[day]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 조건: 시간대 */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    조건: 시간대 (선택사항)
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(Object.keys(timeOfDayLabels) as TimeOfDay[]).map((time) => {
                                        const timeInfo = timeOfDayLabels[time];
                                        const isSelected = selectedTimes.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => toggleTime(time)}
                                                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                                                    isSelected
                                                        ? 'bg-semantic-success/15 border-semantic-success/30 text-semantic-success'
                                                        : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary hover:border-neutral-gray-300'
                                                }`}
                                            >
                                                <span className="text-xl">{timeInfo.icon}</span>
                                                <span className="text-xs font-medium">{timeInfo.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 액션: 우선 카테고리 */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    액션: 우선 추천 카테고리 (선택사항)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(categoryLabels) as MenuCategory[]).map((category) => {
                                        const categoryInfo = categoryLabels[category];
                                        const isSelected = priorityCategories.includes(category);
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => togglePriorityCategory(category)}
                                                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                                                    isSelected
                                                        ? 'bg-toss-blue/10 border-toss-blue text-toss-blue'
                                                        : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary hover:border-neutral-gray-300'
                                                }`}
                                            >
                                                <span className="text-xl">{categoryInfo.icon}</span>
                                                <span className="text-xs font-medium">{categoryInfo.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 액션: 제외 카테고리 */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    액션: 제외할 카테고리 (선택사항)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(categoryLabels) as MenuCategory[]).map((category) => {
                                        const categoryInfo = categoryLabels[category];
                                        const isSelected = excludeCategories.includes(category);
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => toggleExcludeCategory(category)}
                                                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                                                    isSelected
                                                        ? 'bg-semantic-error/15 border-semantic-error/30 text-semantic-error'
                                                        : 'bg-neutral-gray-50 border-neutral-gray-200 text-text-secondary hover:border-neutral-gray-300'
                                                }`}
                                            >
                                                <span className="text-xl">{categoryInfo.icon}</span>
                                                <span className="text-xs font-medium">{categoryInfo.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 저장/취소 버튼 */}
                            <div className="flex justify-end gap-2">
                                <Button onClick={onCancel} variant="secondary" size="md">
                                    취소
                                </Button>
                                <Button onClick={handleSave} variant="primary" size="md">
                                    저장
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export { RecommendationRulesWidget };
export default RecommendationRulesWidget;

