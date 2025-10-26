/**
 * Consent Management - Public API
 */

// Types
export type { ConsentPreferences, ConsentCategory, ConsentContextValue } from './types'

// Client-side utilities
export {
  getConsentCookie,
  setConsentCookie,
  deleteCookie,
  createDefaultPreferences,
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION
} from './cookie-utils'

// Server-side utilities
export { getServerConsent, shouldShowConsentBanner } from './server-utils'

// Clarity loader
export { loadClarity, stopClarity, isClarityLoaded } from './clarity-loader'

// React components and hooks
export { ConsentProvider, useConsent } from '@/components/consent/consent-provider'
export { ConsentManager } from '@/components/consent/consent-manager'
export { ConsentBanner } from '@/components/consent/consent-banner'
export { ConsentSettingsModal } from '@/components/consent/consent-settings-modal'
export { CookieSettingsButton } from '@/components/consent/cookie-settings-button'
