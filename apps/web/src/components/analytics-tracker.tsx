'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Dynamically import analytics to avoid SSR issues
    import('@/lib/analytics').then(({ analytics }) => {
      analytics.trackPageView(pathname);
    }).catch(error => {
      console.error('Failed to track page view:', error);
    });
  }, [pathname, isClient]);

  return null;
}