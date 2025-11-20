/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        // Next.js App Router
        './app/**/*.{js,ts,jsx,tsx,mdx}',

        // FSD Layers
        './src/01-app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/02-pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/03-widgets/**/*.{js,ts,jsx,tsx,mdx}',
        './src/04-features/**/*.{js,ts,jsx,tsx,mdx}',
        './src/05-entities/**/*.{js,ts,jsx,tsx,mdx}',
        './src/06-shared/**/*.{js,ts,jsx,tsx,mdx}',

        // Legacy paths (if any remaining)
        './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
        './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
        './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                'primary-blue': '#0066FF',
                'primary-blue-light': '#E6F2FF',

                // Neutral Colors
                'neutral-white': '#FFFFFF',
                'neutral-gray-50': '#F8F9FA',
                'neutral-gray-100': '#F1F3F4',
                'neutral-gray-200': '#E8EAED',
                'neutral-gray-300': '#DADCE0',
                'neutral-gray-400': '#BDC1C6',
                'neutral-gray-500': '#9AA0A6',
                'neutral-gray-600': '#5F6368',
                'neutral-gray-700': '#3C4043',
                'neutral-gray-800': '#202124',
                'neutral-gray-900': '#000000',

                // Semantic Colors
                'semantic-success': '#00C853',
                'semantic-warning': '#FF9800',
                'semantic-error': '#F44336',

                // Toss Brand Aliases
                'toss-blue': '#0066FF',
                'toss-blue-light': '#E6F2FF',
                'toss-success': '#00C853',
                'toss-warning': '#FF9800',
                'toss-error': '#F44336',

                // Typography Colors
                'text-primary': '#202124',
                'text-secondary': '#5F6368',
                'text-tertiary': '#9AA0A6',
                'text-inverse': '#FFFFFF',

                // Background Colors
                'bg-primary': '#FFFFFF',
                'bg-secondary': '#F8F9FA',
                'bg-tertiary': '#F1F3F4',
            },
        },
    },
    plugins: [],
};
