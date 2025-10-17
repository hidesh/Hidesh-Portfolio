'use client'

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
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
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased ${isCMSRoute ? '' : 'flex flex-col'}`}>
        <ThemeProvider>
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
