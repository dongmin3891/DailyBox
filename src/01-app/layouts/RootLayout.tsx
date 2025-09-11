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
        <html lang="ko">
            <body className={fontVariables}>
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
};

export default RootLayout;
