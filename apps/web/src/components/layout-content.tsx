'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCMSRoute = pathname?.startsWith('/cms') || pathname === '/login';

  return (
    <div className="relative z-10">
      {!isCMSRoute && <Header />}
      <main id="main-content" className="flex-1 relative z-10">
        {children}
      </main>
      {!isCMSRoute && <Footer />}
    </div>
  );
}
