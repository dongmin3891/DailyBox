/**
 * AppHeader Component
 * 앱의 메인 헤더 컴포넌트
 */

import React from 'react';

export interface AppHeaderProps {
    /** 헤더 아이콘 (이모지) */
    icon?: string;
    /** 앱 타이틀 */
    title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ icon = '🗂️', title = '일상함!' }) => {
    return (
        <header className="bg-bg-primary rounded-2xl px-4 py-4 mb-4 shadow-sm">
            <div className="flex items-center">
                <div className="text-[28px] mr-3">{icon}</div>
                <h1 className="text-[20px] font-bold text-neutral-gray-800">{title}</h1>
            </div>
        </header>
    );
};

export default AppHeader;
