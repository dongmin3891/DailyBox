/**
 * Toss Design System Color Guide Component
 * Figma Design System의 색상을 Tailwind CSS로 구현한 가이드
 */

import React from 'react';

interface ColorCardProps {
    name: string;
    className: string;
    hex: string;
    textColor?: string;
}

const ColorCard: React.FC<ColorCardProps> = ({ name, className, hex, textColor = 'text-neutral-gray-700' }) => (
    <div className={`${className} rounded-lg p-4 shadow-sm border border-neutral-gray-200`}>
        <div className={`${textColor} font-semibold text-sm`}>{name}</div>
        <div className={`${textColor} text-xs opacity-70 mt-1`}>{hex}</div>
    </div>
);

export const TossColorGuide: React.FC = () => {
    return (
        <div className="p-8 bg-bg-secondary min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-text-primary mb-2">🎨 Toss Design System Colors</h1>
                <p className="text-text-secondary mb-8">
                    Figma에서 가져온 Toss 디자인 시스템 색상을 Tailwind CSS로 구현
                </p>

                {/* Primary Colors */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Primary Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ColorCard
                            name="Primary Blue"
                            className="bg-primary-blue"
                            hex="#0066FF"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Primary Blue Light"
                            className="bg-primary-blue-light"
                            hex="#E6F2FF"
                            textColor="text-primary-blue"
                        />
                    </div>
                </section>

                {/* Neutral Colors */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Neutral Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <ColorCard name="White" className="bg-neutral-white border-2" hex="#FFFFFF" />
                        <ColorCard name="Gray 50" className="bg-neutral-gray-50" hex="#F8F9FA" />
                        <ColorCard name="Gray 100" className="bg-neutral-gray-100" hex="#F1F3F4" />
                        <ColorCard name="Gray 200" className="bg-neutral-gray-200" hex="#E8EAED" />
                        <ColorCard name="Gray 300" className="bg-neutral-gray-300" hex="#DADCE0" />
                        <ColorCard name="Gray 400" className="bg-neutral-gray-400" hex="#BDC1C6" />
                        <ColorCard
                            name="Gray 500"
                            className="bg-neutral-gray-500"
                            hex="#9AA0A6"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Gray 600"
                            className="bg-neutral-gray-600"
                            hex="#5F6368"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Gray 700"
                            className="bg-neutral-gray-700"
                            hex="#3C4043"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Gray 800"
                            className="bg-neutral-gray-800"
                            hex="#202124"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Gray 900"
                            className="bg-neutral-gray-900"
                            hex="#000000"
                            textColor="text-white"
                        />
                    </div>
                </section>

                {/* Semantic Colors */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Semantic Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorCard
                            name="Success"
                            className="bg-semantic-success"
                            hex="#00C853"
                            textColor="text-white"
                        />
                        <ColorCard
                            name="Warning"
                            className="bg-semantic-warning"
                            hex="#FF9800"
                            textColor="text-white"
                        />
                        <ColorCard name="Error" className="bg-semantic-error" hex="#F44336" textColor="text-white" />
                    </div>
                </section>

                {/* Typography Colors */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Typography Colors</h2>
                    <div className="bg-white rounded-lg p-6 space-y-4">
                        <div className="text-text-primary text-lg font-semibold">
                            Primary Text - 주요 텍스트 (text-text-primary)
                        </div>
                        <div className="text-text-secondary">Secondary Text - 보조 텍스트 (text-text-secondary)</div>
                        <div className="text-text-tertiary">Tertiary Text - 3차 텍스트 (text-text-tertiary)</div>
                        <div className="bg-neutral-gray-800 text-text-inverse p-3 rounded">
                            Inverse Text - 반전 텍스트 (text-text-inverse)
                        </div>
                    </div>
                </section>

                {/* Toss Brand Aliases */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Toss Brand Aliases</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ColorCard name="Toss Blue" className="bg-toss-blue" hex="#0066FF" textColor="text-white" />
                        <ColorCard
                            name="Toss Blue Light"
                            className="bg-toss-blue-light"
                            hex="#E6F2FF"
                            textColor="text-toss-blue"
                        />
                        <ColorCard
                            name="Toss Success"
                            className="bg-toss-success"
                            hex="#00C853"
                            textColor="text-white"
                        />
                        <ColorCard name="Toss Error" className="bg-toss-error" hex="#F44336" textColor="text-white" />
                    </div>
                </section>

                {/* Usage Examples */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Usage Examples</h2>
                    <div className="space-y-4">
                        {/* 버튼 예시 */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-medium text-text-primary mb-4">Buttons</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-toss-blue text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                                    Primary Button
                                </button>
                                <button className="bg-toss-blue-light text-toss-blue px-6 py-3 rounded-lg font-medium hover:bg-opacity-80 transition-all">
                                    Secondary Button
                                </button>
                                <button className="bg-semantic-success text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                                    Success Button
                                </button>
                                <button className="bg-semantic-error text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                                    Error Button
                                </button>
                            </div>
                        </div>

                        {/* 카드 예시 */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-medium text-text-primary mb-4">Cards</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-bg-secondary border border-neutral-gray-200 rounded-lg p-4">
                                    <div className="w-10 h-10 bg-toss-blue rounded-full mb-3"></div>
                                    <h4 className="text-text-primary font-medium mb-1">토스머니</h4>
                                    <p className="text-text-secondary text-sm">125,000원</p>
                                </div>
                                <div className="bg-gradient-to-r from-toss-blue to-toss-blue-light text-white rounded-lg p-4">
                                    <h4 className="font-medium mb-1">Premium Card</h4>
                                    <p className="text-sm opacity-90">Special Benefits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CSS Classes Reference */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">CSS Classes Reference</h2>
                    <div className="bg-neutral-gray-900 text-neutral-gray-100 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-sm">
                            {`/* Primary Colors */
bg-primary-blue, text-primary-blue, border-primary-blue
bg-primary-blue-light, text-primary-blue-light, border-primary-blue-light

/* Neutral Colors */
bg-neutral-white, text-neutral-white, border-neutral-white
bg-neutral-gray-50 ~ bg-neutral-gray-900
text-neutral-gray-50 ~ text-neutral-gray-900
border-neutral-gray-50 ~ border-neutral-gray-900

/* Semantic Colors */
bg-semantic-success, text-semantic-success, border-semantic-success
bg-semantic-warning, text-semantic-warning, border-semantic-warning
bg-semantic-error, text-semantic-error, border-semantic-error

/* Toss Brand Aliases */
bg-toss-blue, text-toss-blue, border-toss-blue
bg-toss-blue-light, text-toss-blue-light, border-toss-blue-light
bg-toss-success, text-toss-success, border-toss-success
bg-toss-error, text-toss-error, border-toss-error

/* Typography & Background */
text-text-primary, text-text-secondary, text-text-tertiary, text-text-inverse
bg-bg-primary, bg-bg-secondary, bg-bg-tertiary`}
                        </pre>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TossColorGuide;
