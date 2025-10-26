/**
 * Server-side Consent Utilities
 * For reading consent cookie in Server Components
 */

import { cookies } from 'next/headers'
import type { ConsentPreferences } from './types'
import { CONSENT_COOKIE_NAME, parseConsentCookie } from './cookie-utils'

/**
 * Get consent preferences from server-side cookies
 */
export async function getServerConsent(): Promise<ConsentPreferences | null> {
  const cookieStore = await cookies()
  const consentCookie = cookieStore.get(CONSENT_COOKIE_NAME)
  
  if (!consentCookie) {
    return null
  }
  
  return parseConsentCookie(consentCookie.value)
}

/**
 * Check if consent banner should be shown
 */
export async function shouldShowConsentBanner(): Promise<boolean> {
  const preferences = await getServerConsent()
  return preferences === null
}
