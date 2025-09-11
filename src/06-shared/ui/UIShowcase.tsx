'use client';
/**
 * UIShowcase Component
 * 새로 만든 공통 UI 컴포넌트들의 사용 예시를 보여주는 컴포넌트
 */

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Badge from './Badge';
import IconButton from './IconButton';
import Divider from './Divider';

export const UIShowcase: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // 간단한 유효성 검사 예시
        if (value.length > 0 && value.length < 3) {
            setInputError('3글자 이상 입력해주세요');
        } else {
            setInputError('');
        }
    };

    return (
        <div className="p-8 bg-bg-secondary min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">🧩 Shared UI Components</h1>
                    <p className="text-text-secondary">DailyBox 프로젝트에서 사용할 수 있는 공통 UI 컴포넌트들</p>
                </div>

                {/* Button 컴포넌트 예시 */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Button 컴포넌트</h2>
                    <div className="space-y-4">
                        {/* 변형별 버튼 */}
                        <div>
                            <h3 className="text-sm font-medium text-text-secondary mb-2">변형 (Variants)</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="warning">Warning</Button>
                                <Button variant="error">Error</Button>
                                <Button variant="neutral">Neutral</Button>
                            </div>
                        </div>

                        {/* 크기별 버튼 */}
                        <div>
                            <h3 className="text-sm font-medium text-text-secondary mb-2">크기 (Sizes)</h3>
                            <div className="flex items-center gap-3">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                                <Button size="calculator">🔢</Button>
                            </div>
                        </div>

                        {/* 상태별 버튼 */}
                        <div>
                            <h3 className="text-sm font-medium text-text-secondary mb-2">상태 (States)</h3>
                            <div className="flex gap-3">
                                <Button>Normal</Button>
                                <Button disabled>Disabled</Button>
                                <Button loading>Loading</Button>
                                <Button fullWidth>Full Width</Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Input 컴포넌트 예시 */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Input 컴포넌트</h2>
                    <div className="space-y-4 max-w-md">
                        <Input label="기본 입력" placeholder="내용을 입력하세요" helperText="도움말 텍스트입니다" />

                        <Input
                            label="유효성 검사 입력"
                            value={inputValue}
                            onChange={handleInputChange}
                            error={inputError}
                            placeholder="3글자 이상 입력하세요"
                        />

                        <Input
                            label="성공 상태 입력"
                            defaultValue="올바른 입력"
                            success
                            helperText="입력이 완료되었습니다"
                        />

                        <Input label="접두사/접미사 포함" prefix="💰" suffix="원" placeholder="0" type="number" />

                        <div className="flex gap-2">
                            <Input size="sm" placeholder="Small" />
                            <Input size="md" placeholder="Medium" />
                            <Input size="lg" placeholder="Large" />
                        </div>
                    </div>
                </Card>

                {/* Card 컴포넌트 예시 */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Card 컴포넌트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="default">
                            <h3 className="font-medium mb-2">기본 카드</h3>
                            <p className="text-text-secondary text-sm">기본 스타일의 카드입니다.</p>
                        </Card>

                        <Card variant="elevated" hoverable>
                            <h3 className="font-medium mb-2">Elevated 카드</h3>
                            <p className="text-text-secondary text-sm">그림자와 호버 효과가 있는 카드입니다.</p>
                        </Card>

                        <Card variant="outlined">
                            <h3 className="font-medium mb-2">Outlined 카드</h3>
                            <p className="text-text-secondary text-sm">외곽선 스타일의 카드입니다.</p>
                        </Card>

                        <Card variant="gradient" clickable onClick={() => alert('카드가 클릭되었습니다!')}>
                            <h3 className="font-medium mb-2">클릭 가능한 그라데이션 카드</h3>
                            <p className="text-white/90 text-sm">클릭해보세요!</p>
                        </Card>
                    </div>
                </Card>

                {/* Badge와 IconButton 예시 */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Badge & IconButton</h2>

                    <div className="space-y-4">
                        {/* Badge 예시 */}
                        <div>
                            <h3 className="text-sm font-medium text-text-secondary mb-2">Badge 컴포넌트</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="primary">New</Badge>
                                <Badge variant="success">Active</Badge>
                                <Badge variant="warning">Pending</Badge>
                                <Badge variant="error">Error</Badge>
                                <Badge variant="neutral">Draft</Badge>
                                {/* <Badge dot variant="success" /> */}
                                <span className="text-sm">온라인</span>
                            </div>
                        </div>

                        {/* IconButton 예시 */}
                        <div>
                            <h3 className="text-sm font-medium text-text-secondary mb-2">IconButton 컴포넌트</h3>
                            <div className="flex gap-2">
                                <IconButton
                                    icon="❤️"
                                    variant="primary"
                                    aria-label="좋아요"
                                    onClick={() => alert('좋아요!')}
                                />
                                <IconButton icon="⚙️" variant="secondary" aria-label="설정" />
                                <IconButton icon="📝" variant="ghost" aria-label="편집" />
                                <IconButton icon="🗑️" variant="outline" aria-label="삭제" />
                                <IconButton icon="➕" variant="primary" shape="square" aria-label="추가" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Divider 예시 */}
                <Card>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Divider 컴포넌트</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-text-secondary mb-2">기본 구분선</p>
                            <Divider />
                            <p className="text-text-secondary mt-2">구분선 아래</p>
                        </div>

                        <div>
                            <p className="text-text-secondary mb-2">라벨이 있는 구분선</p>
                            <Divider label="또는" />
                            <p className="text-text-secondary mt-2">라벨 구분선 아래</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span>왼쪽</span>
                            <Divider orientation="vertical" color="medium" className="h-8" />
                            <span>오른쪽</span>
                        </div>
                    </div>
                </Card>

                <Divider label="사용 방법" color="medium" />

                {/* 사용 방법 */}
                <Card variant="outlined">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">🔧 사용 방법</h2>
                    <div className="bg-neutral-gray-900 text-neutral-gray-100 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm">
                            {`// shared/ui에서 필요한 컴포넌트들을 import
import { Button, Input, Card, Badge, IconButton, Divider } from '@/shared/ui';

// 또는 개별 import
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

// 사용 예시
<Button variant="primary" size="lg" onClick={handleClick}>
  클릭하세요
</Button>

<Input 
  label="이메일" 
  type="email" 
  error={errors.email}
  onChange={handleInputChange}
/>

<Card variant="elevated" hoverable onClick={handleCardClick}>
  <h3>카드 제목</h3>
  <p>카드 내용...</p>
</Card>`}
                        </pre>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UIShowcase;
