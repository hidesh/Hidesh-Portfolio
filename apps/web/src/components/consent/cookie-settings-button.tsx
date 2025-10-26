'use client'

/**
 * Cookie Settings Button
 * Can be placed anywhere (e.g., footer) to open settings modal
 */

import React from 'react'
import { useConsent } from './consent-provider'
import { Cookie } from 'lucide-react'

interface CookieSettingsButtonProps {
  variant?: 'text' | 'button' | 'icon'
  className?: string
}

export function CookieSettingsButton({ variant = 'text', className = '' }: CookieSettingsButtonProps) {
  const { openSettings } = useConsent()

  if (variant === 'icon') {
    return (
      <button
        onClick={openSettings}
        aria-label="Cookie Settings"
        className={`p-2 text-muted-foreground hover:text-branding-600 transition-colors focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2 rounded ${className}`}
      >
        <Cookie className="h-5 w-5" />
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        onClick={openSettings}
        className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2 ${className}`}
      >
        Cookie Settings
      </button>
    )
  }

  return (
    <button
      onClick={openSettings}
      className={`text-muted-foreground hover:text-branding-600 transition-colors underline focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2 rounded ${className}`}
    >
      Cookie Settings
    </button>
  )
}
