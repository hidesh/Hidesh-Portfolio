/**
 * Microsoft Clarity API Client
 * Server-side only - uses private API token
 */

export interface ClaritySession {
  sessionId: string
  startTime: string
  endTime: string
  pageViews: number
  userId?: string
  country?: string
  device?: string
}

export interface ClarityMetrics {
  totalSessions: number
  totalPageViews: number
  averageSessionDuration: number
  topPages: Array<{ url: string; views: number }>
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  countryBreakdown: Record<string, number>
}

export interface ClarityLiveInsights {
  activeSessions: number
  pageViewsLast24h: number
  topPagesLast24h: Array<{ url: string; views: number }>
}

/**
 * Fetch Clarity API data (Server-side only)
 * Uses CLARITY_API_TOKEN from environment variables
 * Clarity Export API Documentation: https://learn.microsoft.com/en-us/clarity/setup-and-installation/export-api
 */
async function fetchClarityAPI(endpoint: string, projectId?: string) {
  // Server-side environment variable (NOT prefixed with NEXT_PUBLIC_)
  const token = process.env.CLARITY_API_TOKEN
  const defaultProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  if (!token) {
    console.warn('CLARITY_API_TOKEN not configured - using mock data')
    throw new Error('CLARITY_API_TOKEN not configured in environment variables')
  }

  const pid = projectId || defaultProjectId
  
  if (!pid) {
    console.warn('NEXT_PUBLIC_CLARITY_PROJECT_ID not configured')
    throw new Error('NEXT_PUBLIC_CLARITY_PROJECT_ID not configured in environment variables')
  }

  // Clarity Export API uses this structure
  // https://www.clarity.ms/api/v1/...
  const baseUrl = 'https://www.clarity.ms/api/v1'
  const url = `${baseUrl}${endpoint}`
  
  console.log('Fetching Clarity API:', url)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    cache: 'no-store' // Don't cache during development
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Clarity API error: ${response.status} ${response.statusText}`)
    console.error('Response body:', errorText)
    console.error('Attempted URL:', url)
    throw new Error(`Clarity API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Clarity API response:', JSON.stringify(data, null, 2))
  return data
}

/**
 * Get live insights from Clarity
 * Microsoft Clarity Export API - Official Documentation
 * https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
 */
export async function getClarityLiveInsights(): Promise<ClarityLiveInsights> {
  const token = process.env.CLARITY_API_TOKEN
  
  if (!token) {
    console.warn('CLARITY_API_TOKEN not configured, using demo data')
    return getDemoData()
  }

  try {
    console.log('📊 Fetching Clarity Export API data...')
    
    // Official Clarity Export API endpoint
    // Parameters:
    // - numOfDays: 1, 2, or 3 (last 24, 48, or 72 hours)
    // - dimension1, dimension2, dimension3: Optional dimensions (URL, Device, Country, etc.)
    const url = 'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=URL'
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store' // No caching during development
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Clarity API error: ${response.status}`, errorText)
      
      if (response.status === 401) {
        console.error('Token is invalid or expired')
      } else if (response.status === 403) {
        console.error('Token not authorized for this operation')
      } else if (response.status === 429) {
        console.error('Rate limit exceeded (max 10 requests/day per project)')
      }
      
      throw new Error(`Clarity API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Clarity API response received:', JSON.stringify(data, null, 2))
    
    // Parse the response structure
    // Example response: [{ "metricName": "Traffic", "information": [...] }]
    const metrics = parseExportAPIResponse(data)
    
    return metrics
  } catch (error) {
    console.warn('⚠️ Clarity API unavailable, using demo data:', error)
    return getDemoData()
  }
}

/**
 * Parse Clarity Export API response
 * The API returns metrics grouped by metricName
 */
function parseExportAPIResponse(data: any): ClarityLiveInsights {
  try {
    // Extract all metrics
    const trafficMetric = data.find((m: any) => m.metricName === 'Traffic')
    const engagementMetric = data.find((m: any) => m.metricName === 'EngagementTime')
    const scrollMetric = data.find((m: any) => m.metricName === 'ScrollDepth')
    const deadClickMetric = data.find((m: any) => m.metricName === 'DeadClickCount')
    const rageClickMetric = data.find((m: any) => m.metricName === 'RageClickCount')
    const scriptErrorMetric = data.find((m: any) => m.metricName === 'ScriptErrorCount')
    
    let totalSessions = 0
    let totalUsers = 0
    const topPages: Array<{ url: string; views: number }> = []
    
    // Calculate totals from Traffic metric
    if (trafficMetric?.information) {
      trafficMetric.information.forEach((item: any) => {
        if (item.Url) { // Only count items with URLs
          const sessions = parseInt(item.totalSessionCount || '0', 10)
          const users = parseInt(item.distinctUserCount || '0', 10)
          
          totalSessions += sessions
          totalUsers = Math.max(totalUsers, users)
          
          topPages.push({
            url: item.Url,
            views: sessions
          })
        }
      })
    }
    
    // Sort and limit top pages
    const sortedPages = topPages
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
    
    return {
      activeSessions: Math.floor(totalSessions * 0.1), // Estimate ~10% active
      pageViewsLast24h: topPages.reduce((sum, p) => sum + p.views, 0),
      topPagesLast24h: sortedPages
    }
  } catch (error) {
    console.error('Error parsing Clarity response:', error)
    return getDemoData()
  }
}

/**
 * Calculate top pages from sessions data
 */
function calculateTopPages(sessions: any[]): Array<{ url: string; views: number }> {
  const pageMap = new Map<string, number>()
  
  sessions.forEach(session => {
    const pages = session.pages || []
    pages.forEach((page: any) => {
      const url = page.url || page.path || '/'
      pageMap.set(url, (pageMap.get(url) || 0) + 1)
    })
  })
  
  return Array.from(pageMap.entries())
    .map(([url, views]) => ({ url, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
}

/**
 * Return demo data for development
 */
function getDemoData(): ClarityLiveInsights {
  return {
    activeSessions: 12,
    pageViewsLast24h: 347,
    topPagesLast24h: [
      { url: '/', views: 156 },
      { url: '/projects', views: 89 },
      { url: '/about', views: 45 },
      { url: '/blog', views: 32 },
      { url: '/contact', views: 25 }
    ]
  }
}

/**
 * Get sessions for a date range
 */
export async function getClaritySessions(
  startDate: string,
  endDate: string
): Promise<ClaritySession[]> {
  try {
    const data = await fetchClarityAPI(
      `/sessions?startDate=${startDate}&endDate=${endDate}`
    )
    
    return data.sessions || []
  } catch (error) {
    console.error('Failed to fetch Clarity sessions:', error)
    return []
  }
}

/**
 * Calculate metrics from sessions
 */
export function calculateMetrics(sessions: ClaritySession[]): ClarityMetrics {
  const totalSessions = sessions.length
  const totalPageViews = sessions.reduce((sum, s) => sum + (s.pageViews || 0), 0)
  
  // Calculate average session duration
  const totalDuration = sessions.reduce((sum, session) => {
    const start = new Date(session.startTime).getTime()
    const end = new Date(session.endTime).getTime()
    return sum + (end - start)
  }, 0)
  const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0

  // Device breakdown
  const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 }
  sessions.forEach(s => {
    const device = s.device?.toLowerCase() || 'desktop'
    if (device.includes('mobile')) deviceBreakdown.mobile++
    else if (device.includes('tablet')) deviceBreakdown.tablet++
    else deviceBreakdown.desktop++
  })

  // Country breakdown
  const countryBreakdown: Record<string, number> = {}
  sessions.forEach(s => {
    const country = s.country || 'Unknown'
    countryBreakdown[country] = (countryBreakdown[country] || 0) + 1
  })

  // Top pages (mock - would need page-level data from API)
  const topPages: Array<{ url: string; views: number }> = []

  return {
    totalSessions,
    totalPageViews,
    averageSessionDuration,
    topPages,
    deviceBreakdown,
    countryBreakdown
  }
}
