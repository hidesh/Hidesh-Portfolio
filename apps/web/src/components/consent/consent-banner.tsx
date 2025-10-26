'use client'

/**
 * Consent Banner
 * Bottom sheet that appears on first visit
 */

import React, { useEffect, useRef } from 'react'
import { useConsent } from './consent-provider'

export function ConsentBanner() {
  const { preferences, acceptAll, rejectAll, openSettings } = useConsent()
  const bannerRef = useRef<HTMLDivElement>(null)

  // Trap focus within banner
  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    const focusableElements = banner.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    banner.addEventListener('keydown', handleTab)
    
    // Focus first button on mount
    firstElement?.focus()

    return () => {
      banner.removeEventListener('keydown', handleTab)
    }
  }, [])

  // Don't render if preferences already set
  if (preferences !== null) {
    return null
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="consent-banner-title"
      aria-describedby="consent-banner-description"
      aria-modal="true"
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl animate-slide-up"
    >
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Text Content */}
          <div className="flex-1">
            <h2
              id="consent-banner-title"
              className="text-lg md:text-xl font-bold text-foreground mb-2"
            >
              Cookies on this site
            </h2>
            <p
              id="consent-banner-description"
              className="text-sm md:text-base text-muted-foreground"
            >
              We use necessary cookies for the site to function. With your consent, we also use cookies for analytics (Microsoft Clarity).{' '}
              <a
                href="/cookie-policy"
                className="text-branding-600 hover:text-branding-700 underline focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2 rounded"
              >
                Learn more
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 min-w-fit">
            <button
              onClick={openSettings}
              className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2"
            >
              Customize
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-foreground border border-border hover:bg-muted/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2"
            >
              Reject All
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
