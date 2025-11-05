/**
 * Microsoft Clarity Dynamic Loader
 * Only loads Clarity after explicit user consent
 */

let clarityLoaded = false
let clarityInitialized = false

/**
 * Load Microsoft Clarity script dynamically
 */
export function loadClarity(): void {
  // Only run on client
  if (typeof window === 'undefined') return
  
  // Don't load in development
  if (process.env.NODE_ENV === 'development') {
    console.info('[Clarity] Disabled in development mode')
    return
  }
  
  // Idempotent: only load once
  if (clarityLoaded) return
  
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
  
  if (!clarityId) {
    console.warn('[Clarity] NEXT_PUBLIC_CLARITY_ID not set. Clarity will not be loaded.')
    return
  }
  
  clarityLoaded = true
  
  try {
    // Initialize Clarity
    ;(function(c: any, l: any, a: string, r: string, i: string, t?: any, y?: any) {
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments)
      }
      t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', clarityId)
    
    clarityInitialized = true
    // Script loaded successfully
  } catch (error) {
    console.error('[Clarity] Failed to load:', error)
    clarityLoaded = false
  }
}

/**
 * Stop Clarity tracking and clean up
 */
export function stopClarity(): void {
  if (typeof window === 'undefined') return
  
  // Attempt to stop Clarity
  if ((window as any).clarity) {
    try {
      (window as any).clarity('stop')
    } catch (error) {
      console.error('[Clarity] Failed to stop:', error)
    }
  }
  
  // Delete Clarity cookies
  deleteClarityCookies()
  
  // Reset state
  clarityLoaded = false
  clarityInitialized = false
  
  console.log('[Clarity] Tracking stopped and cookies removed')
}

/**
 * Delete all Clarity-related cookies
 */
function deleteClarityCookies(): void {
  if (typeof document === 'undefined') return
  
  const clarityPatterns = [
    '_clck',
    '_clsk',
    'CLID',
    'ANONCHK',
    'MR',
    'MUID',
    'SM'
  ]
  
  const cookies = document.cookie.split(';')
  
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim()
    
    // Check if it matches Clarity patterns
    const isClarityCookie = clarityPatterns.some(pattern => 
      cookieName.includes(pattern)
    )
    
    if (isClarityCookie) {
      // Delete for current domain
      document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      
      // Also try to delete for .domain.com
      const domain = window.location.hostname
      document.cookie = `${cookieName}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      
      // Try parent domain
      const parts = domain.split('.')
      if (parts.length > 2) {
        const parentDomain = '.' + parts.slice(-2).join('.')
        document.cookie = `${cookieName}=; Path=/; Domain=${parentDomain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
    }
  })
}

/**
 * Check if Clarity is loaded
 */
export function isClarityLoaded(): boolean {
  return clarityLoaded && clarityInitialized
}
