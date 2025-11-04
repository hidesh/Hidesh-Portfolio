import type { Metadata } from 'next'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn how we use cookies on this website to improve your experience and understand site usage.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/cookie-policy`,
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
          Cookie Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg">
            This website uses cookies to improve your experience and understand how the site is used.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">What are cookies?</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They help the website remember information about your visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Which cookies do we use?</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Necessary cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They cannot be disabled.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>cookie_consent_v1:</strong> Remembers your cookie preferences (expires after 1 year)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Analytics cookies (Microsoft Clarity)</h3>
            <p>
              With your consent, we use Microsoft Clarity to understand how visitors interact with the website. 
              Clarity collects information about:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Which pages you visit</li>
              <li>How you navigate the site</li>
              <li>How much time you spend on each page</li>
              <li>Technical information about your device and browser</li>
            </ul>
            <p>
              Clarity cookies are only loaded after you have given explicit consent via the cookie banner.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Marketing cookies</h3>
            <p>
              We currently do not use marketing cookies, but the option is prepared for future use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How do I manage cookies?</h2>
            <p>
              You can always change your cookie preferences by clicking "Cookie Settings" at the bottom of the page.
            </p>
            <p>
              You can also delete cookies in your browser settings. Note that if you delete cookies, 
              you may need to set your preferences again the next time you visit the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-party cookies</h2>
            <p>
              When you accept analytics cookies, Microsoft Clarity will set cookies on your device. 
              These cookies are subject to Microsoft&apos;s privacy policy.
            </p>
            <p>
              Learn more at:{' '}
              <a 
                href="https://privacy.microsoft.com/en-us/privacystatement" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-branding-600 hover:text-branding-700 underline"
              >
                Microsoft Privacy Statement
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
            <p>
              If you have questions about our use of cookies, feel free to contact me at:{' '}
              <a 
                href="mailto:hidesh@live.dk"
                className="text-branding-600 hover:text-branding-700 underline"
              >
                hidesh@live.dk
              </a>
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: October 2025
          </p>
        </div>
      </div>
    </div>
  )
}
