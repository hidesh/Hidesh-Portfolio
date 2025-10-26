'use client'

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { ConsentManager } from '@/components/consent/consent-manager';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()
  const isCMSRoute = pathname?.startsWith('/cms') || pathname === '/login'

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased flex flex-col`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="hidesh-portfolio-theme">
          <ConsentProvider>
            {!isCMSRoute && <Header />}
            <main id="main-content" className="flex-1">
              {children}
            </main>
            {!isCMSRoute && <Footer />}
            <ConsentManager />
            <SpeedInsights />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
