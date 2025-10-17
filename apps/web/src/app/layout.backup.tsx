import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import AnalyticsTracker from '@/components/analytics-tracker';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Metadata moved to root page since this is now a client component

'use client'

import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isCMSRoute = pathname?.startsWith('/cms') || pathname === '/login'

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased ${isCMSRoute ? '' : 'flex flex-col'}`}>
        <ThemeProvider>
          <AnalyticsTracker />
          {!isCMSRoute && <Header />}
          <main id="main-content" className={isCMSRoute ? '' : 'flex-1'}>
            {children}
          </main>
          {!isCMSRoute && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
