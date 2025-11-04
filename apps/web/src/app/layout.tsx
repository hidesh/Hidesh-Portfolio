import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { ConsentManager } from '@/components/consent/consent-manager';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LayoutContent } from '@/components/layout-content';
import { siteConfig, getOpenGraphMetadata, getTwitterMetadata, getPersonSchema, getWebsiteSchema } from '@/lib/seo';
import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Root metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: getOpenGraphMetadata(),
  twitter: getTwitterMetadata(),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    // Add your verification codes here after setting up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = getPersonSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased flex flex-col`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="hidesh-portfolio-theme">
          <ConsentProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
            <ConsentManager />
            <SpeedInsights />
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
