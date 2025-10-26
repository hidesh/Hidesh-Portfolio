'use client'

/**
 * Consent Provider
 * Manages consent state and cookie persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ConsentPreferences, ConsentContextValue } from '@/lib/consent/types'
import {
  getConsentCookie,
  setConsentCookie,
  createDefaultPreferences
} from '@/lib/consent/cookie-utils'
import { loadClarity, stopClarity, isClarityLoaded } from '@/lib/consent/clarity-loader'

const ConsentContext = createContext<ConsentContextValue | null>(null)

interface ConsentProviderProps {
  children: React.ReactNode
  initialPreferences?: ConsentPreferences | null
}

export function ConsentProvider({ children, initialPreferences }: ConsentProviderProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(initialPreferences || null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Load preferences from cookie on mount
  useEffect(() => {
    const savedPreferences = getConsentCookie()
    if (savedPreferences) {
      setPreferences(savedPreferences)
    }
    setIsLoading(false)
  }, [])

  // Handle Clarity loading based on analytics consent
  useEffect(() => {
    if (!preferences) return

    if (preferences.analytics && !isClarityLoaded()) {
      // Wait for interactive before loading
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loadClarity()
      } else {
        window.addEventListener('DOMContentLoaded', loadClarity, { once: true })
      }
    }
  }, [preferences?.analytics])

  const updateConsent = useCallback((updates: Partial<ConsentPreferences>) => {
    const newPreferences = createDefaultPreferences(
      updates.analytics ?? preferences?.analytics ?? false,
      updates.marketing ?? preferences?.marketing ?? false
    )

    // Check if analytics was disabled
    const wasAnalyticsEnabled = preferences?.analytics
    const isAnalyticsEnabled = newPreferences.analytics

    setPreferences(newPreferences)
    setConsentCookie(newPreferences)

    // If analytics was turned off, stop Clarity and reload page
    if (wasAnalyticsEnabled && !isAnalyticsEnabled) {
      stopClarity()
      
      // Reload page to ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
    
    // If analytics was just enabled, load Clarity
    if (!wasAnalyticsEnabled && isAnalyticsEnabled) {
      loadClarity()
    }

    setIsSettingsOpen(false)
  }, [preferences])

  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, marketing: true })
  }, [updateConsent])

  const rejectAll = useCallback(() => {
    updateConsent({ analytics: false, marketing: false })
  }, [updateConsent])

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true)
  }, [])

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const value: ConsentContextValue = {
    preferences,
    isLoading,
    updateConsent,
    acceptAll,
    rejectAll,
    openSettings,
    closeSettings,
    isSettingsOpen
  }

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext)
  
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  
  return context
}
