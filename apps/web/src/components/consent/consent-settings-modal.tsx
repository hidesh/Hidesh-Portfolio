'use client'

/**
 * Consent Settings Modal
 * Allows users to customize their consent preferences
 */

import React, { useEffect, useRef, useState } from 'react'
import { useConsent } from './consent-provider'
import { X } from 'lucide-react'

export function ConsentSettingsModal() {
  const { preferences, isSettingsOpen, closeSettings, updateConsent } = useConsent()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [analytics, setAnalytics] = useState(preferences?.analytics ?? false)
  const [marketing, setMarketing] = useState(preferences?.marketing ?? false)

  // Update local state when preferences change
  useEffect(() => {
    if (preferences) {
      setAnalytics(preferences.analytics)
      setMarketing(preferences.marketing)
    }
  }, [preferences])

  // Handle ESC key
  useEffect(() => {
    if (!isSettingsOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSettings()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSettingsOpen, closeSettings])

  // Trap focus within modal
  useEffect(() => {
    if (!isSettingsOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll<HTMLElement>(
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

    modal.addEventListener('keydown', handleTab)
    
    // Focus close button on open
    closeButtonRef.current?.focus()

    return () => {
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isSettingsOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSettingsOpen])

  if (!isSettingsOpen) {
    return null
  }

  const handleSave = () => {
    updateConsent({ analytics, marketing })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={closeSettings}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-labelledby="consent-settings-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2
            id="consent-settings-title"
            className="text-2xl font-bold text-foreground"
          >
            Cookie Settings
          </h2>
          <button
            ref={closeButtonRef}
            onClick={closeSettings}
            aria-label="Close settings"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-branding-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Intro */}
          <p className="text-muted-foreground">
            Choose which cookies you want to allow. You can always change your preferences later.{' '}
            <a
              href="/cookie-policy"
              className="text-branding-600 hover:text-branding-700 underline focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2 rounded"
            >
              Learn more about our cookie policy
            </a>
          </p>

          {/* Necessary Cookies */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Necessary cookies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Required for basic functionality. Cannot be disabled.
                </p>
              </div>
              <div className="flex items-center">
                <div className="relative inline-flex items-center cursor-not-allowed">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only"
                    aria-label="Necessary cookies"
                  />
                  <div className="w-11 h-6 bg-branding-600 rounded-full opacity-50"></div>
                  <div className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Analytics cookies (Microsoft Clarity)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Helps us understand how the site is used. Only loaded after your consent.
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Analytics cookies"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-branding-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-branding-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Marketing cookies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Used for personalized marketing.
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Marketing cookies"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-branding-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-branding-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-background">
          <button
            onClick={closeSettings}
            className="px-6 py-2 text-sm font-medium text-foreground border border-border hover:bg-muted/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-branding-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
