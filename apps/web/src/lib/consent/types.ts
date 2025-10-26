/**
 * Cookie Consent Types
 */

export interface ConsentPreferences {
  version: number
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

export interface ConsentContextValue {
  preferences: ConsentPreferences | null
  isLoading: boolean
  updateConsent: (preferences: Partial<ConsentPreferences>) => void
  acceptAll: () => void
  rejectAll: () => void
  openSettings: () => void
  closeSettings: () => void
  isSettingsOpen: boolean
}
