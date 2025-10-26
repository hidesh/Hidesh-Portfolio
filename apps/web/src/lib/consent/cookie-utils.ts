/**
 * Cookie Utilities for Consent Management
 */

import type { ConsentPreferences } from './types'

export const CONSENT_COOKIE_NAME = 'cookie_consent_v1'
export const CONSENT_VERSION = 1
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

/**
 * Parse consent cookie from string
 */
export function parseConsentCookie(cookieValue: string | undefined): ConsentPreferences | null {
  if (!cookieValue) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue))
    
    // Validate structure
    if (
      typeof parsed === 'object' &&
      parsed.version === CONSENT_VERSION &&
      parsed.necessary === true &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.marketing === 'boolean' &&
      typeof parsed.timestamp === 'string'
    ) {
      return parsed as ConsentPreferences
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Serialize consent preferences to cookie string
 */
export function serializeConsentCookie(preferences: ConsentPreferences): string {
  const value = encodeURIComponent(JSON.stringify(preferences))
  const maxAge = COOKIE_MAX_AGE
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : ''
  
  return `${CONSENT_COOKIE_NAME}=${value}; Path=/; SameSite=Lax; ${secure} Max-Age=${maxAge}`
}

/**
 * Get consent cookie value (client-side only)
 */
export function getConsentCookie(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const consentCookie = cookies.find(c => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`))
  
  if (!consentCookie) return null
  
  const value = consentCookie.split('=')[1]
  return parseConsentCookie(value)
}

/**
 * Set consent cookie (client-side only)
 */
export function setConsentCookie(preferences: ConsentPreferences): void {
  if (typeof document === 'undefined') return
  
  document.cookie = serializeConsentCookie(preferences)
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

/**
 * Create default consent preferences
 */
export function createDefaultPreferences(analytics = false, marketing = false): ConsentPreferences {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString()
  }
}
