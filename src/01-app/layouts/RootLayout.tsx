/**
 * Root Layout Component
 * FSD App Layer - 앱의 최상위 레이아웃 구성
 */
import '../styles';
import { AppProvider } from '../providers';
import { fontVariables } from '../config';
import { appMetadata, appViewport } from '../config';
interface RootLayoutProps {
    children: React.ReactNode;
}

export const metadata = appMetadata;
export const viewport = appViewport;

export const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    const theme = localStorage.getItem('theme-storage');
                                    if (theme) {
                                        const parsed = JSON.parse(theme);
                                        const currentTheme = parsed?.state?.theme || 'light';
                                        document.documentElement.classList.remove('light', 'dark');
                                        document.documentElement.classList.add(currentTheme);
                                    } else {
                                        document.documentElement.classList.add('light');
                                    }
                                } catch (e) {
                                    document.documentElement.classList.add('light');
                                }
                            })();
                        `,
                    }}
                />
            </head>
            <body className={fontVariables}>
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
};

export default RootLayout;
