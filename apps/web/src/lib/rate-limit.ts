/**
 * Rate limiting for contact form submissions
 * Tracks submissions by email address with in-memory cache
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store for rate limiting
// For production with multiple instances, use Redis or Upstash
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration
const MAX_SUBMISSIONS = 5 // Max submissions per window
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpired() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every minute
setInterval(cleanupExpired, 60 * 1000)

/**
 * Check if email has exceeded rate limit
 * @param email - Email address to check
 * @returns Object with allowed status and remaining count
 */
export function checkRateLimit(email: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const key = email.toLowerCase().trim()
  const now = Date.now()
  
  // Clean up expired entries
  cleanupExpired()
  
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetAt < now) {
    // No entry or expired - create new entry
    const resetAt = now + WINDOW_MS
    rateLimitStore.set(key, { count: 1, resetAt })
    
    return {
      allowed: true,
      remaining: MAX_SUBMISSIONS - 1,
      resetAt,
    }
  }
  
  // Entry exists and is valid
  if (entry.count >= MAX_SUBMISSIONS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }
  
  // Increment count
  entry.count += 1
  rateLimitStore.set(key, entry)
  
  return {
    allowed: true,
    remaining: MAX_SUBMISSIONS - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Get time remaining until rate limit reset
 */
export function getResetTime(resetAt: number): string {
  const now = Date.now()
  const diff = resetAt - now
  
  if (diff <= 0) return '0 seconds'
  
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}
