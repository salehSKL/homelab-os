import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { StoreInitializer } from '@/components/layout/StoreInitializer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HomeLab OS — Server Build Manager',
  description: 'Professional SaaS dashboard for managing home server build projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <StoreInitializer />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-[240px] pt-16 lg:pt-0">
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
