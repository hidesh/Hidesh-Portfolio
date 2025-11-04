'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCMSRoute = pathname?.startsWith('/cms') || pathname === '/login';

  return (
    <>
      {!isCMSRoute && <Header />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isCMSRoute && <Footer />}
    </>
  );
}
