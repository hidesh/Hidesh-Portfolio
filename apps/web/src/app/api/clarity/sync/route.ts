import { NextResponse } from 'next/server'
import { saveAnalytics, getApiUsage, incrementApiUsage } from '@/lib/clarity/database'

/**
 * API Route: /api/clarity/sync
 * 
 * POST: Manually fetch fresh data from Clarity API and save to database
 * 
 * Rate Limits:
 * - Max 10 requests per day
 * - Tracked in Supabase
 */

export async function POST() {
  try {
    // Check if we have API calls remaining
    const usage = await getApiUsage()
    
    if (usage.requests_remaining <= 0) {
      return NextResponse.json(
        { 
          error: 'Daily API limit reached',
          requests_today: usage.requests_today,
          requests_remaining: 0,
          message: 'You have used all 10 API requests for today. Please try again tomorrow.'
        },
        { status: 429 }
      )
    }

    // Verify API token is configured
    if (!process.env.CLARITY_API_TOKEN) {
      return NextResponse.json(
        { 
          error: 'CLARITY_API_TOKEN not configured',
          message: 'Please add CLARITY_API_TOKEN to your Vercel environment variables. Get your token from: https://clarity.microsoft.com/projects → Settings → Export API',
          requests_remaining: usage.requests_remaining
        },
        { status: 503 }
      )
    }

    console.log(`🔄 Manual sync requested (${usage.requests_remaining} requests remaining)`)
    
    // Fetch from Clarity API
    const url = 'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=URL'
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CLARITY_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Clarity API error: ${response.status}`, errorText)
      
      return NextResponse.json(
        { 
          error: `Clarity API returned ${response.status}`,
          details: errorText,
          requests_remaining: usage.requests_remaining
        },
        { status: response.status }
      )
    }

    const rawData = await response.json()
    console.log('✅ Clarity API response received')
    
    // Parse and structure the data
    const insights = parseClarityData(rawData)
    
    // Save to Supabase
    await saveAnalytics(insights)
    console.log('💾 Saved to Supabase database')
    
    // Increment usage counter
    const newCount = await incrementApiUsage()
    console.log(`📊 API usage: ${newCount}/10 requests today`)
    
    return NextResponse.json({
      success: true,
      data: insights,
      api_usage: {
        requests_today: newCount,
        requests_remaining: Math.max(10 - newCount, 0)
      },
      message: 'Analytics data synced successfully'
    })
  } catch (error: any) {
    console.error('Error syncing Clarity data:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to sync analytics data',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * Parse raw Clarity API data into structured insights
 */
function parseClarityData(data: any) {
  const trafficMetric = data.find((m: any) => m.metricName === 'Traffic')
  const engagementMetric = data.find((m: any) => m.metricName === 'EngagementTime')
  const scrollMetric = data.find((m: any) => m.metricName === 'ScrollDepth')
  const deadClickMetric = data.find((m: any) => m.metricName === 'DeadClickCount')
  const rageClickMetric = data.find((m: any) => m.metricName === 'RageClickCount')
  const scriptErrorMetric = data.find((m: any) => m.metricName === 'ScriptErrorCount')
  const errorClickMetric = data.find((m: any) => m.metricName === 'ErrorClickCount')
  
  let totalSessions = 0
  let totalUsers = 0
  let totalEngagementTime = 0
  let totalActiveTime = 0
  const topPages: Array<{ url: string; sessions: number; avgScrollDepth: number; engagementTime: number }> = []
  
  // Process Traffic data
  if (trafficMetric?.information) {
    trafficMetric.information.forEach((item: any) => {
      if (item.Url) {
        const sessions = parseInt(item.totalSessionCount || '0', 10)
        totalSessions += sessions
        totalUsers = Math.max(totalUsers, parseInt(item.distinctUserCount || '0', 10))
        
        const scrollInfo = scrollMetric?.information?.find((s: any) => s.Url === item.Url)
        const engagementInfo = engagementMetric?.information?.find((e: any) => e.Url === item.Url)
        
        topPages.push({
          url: item.Url,
          sessions: sessions,
          avgScrollDepth: scrollInfo?.averageScrollDepth || 0,
          engagementTime: parseInt(engagementInfo?.totalTime || '0', 10)
        })
      }
    })
  }
  
  // Calculate total engagement time
  if (engagementMetric?.information) {
    engagementMetric.information.forEach((item: any) => {
      totalEngagementTime += parseInt(item.totalTime || '0', 10)
      totalActiveTime += parseInt(item.activeTime || '0', 10)
    })
  }
  
  const sortedPages = topPages.sort((a, b) => b.sessions - a.sessions).slice(0, 5)
  
  const avgScrollDepth = scrollMetric?.information?.reduce((sum: number, item: any) => 
    sum + (item.averageScrollDepth || 0), 0) / (scrollMetric?.information?.length || 1)
  
  const deadClicks = deadClickMetric?.information?.reduce((sum: number, item: any) => 
    sum + parseInt(item.subTotal || '0', 10), 0) || 0
    
  const rageClicks = rageClickMetric?.information?.reduce((sum: number, item: any) => 
    sum + parseInt(item.subTotal || '0', 10), 0) || 0
    
  const scriptErrors = scriptErrorMetric?.information?.reduce((sum: number, item: any) => 
    sum + parseInt(item.subTotal || '0', 10), 0) || 0
    
  const errorClicks = errorClickMetric?.information?.reduce((sum: number, item: any) => 
    sum + parseInt(item.subTotal || '0', 10), 0) || 0
  
  return {
    activeSessions: Math.floor(totalSessions * 0.1),
    totalSessions,
    totalUsers,
    pageViewsLast24h: totalSessions,
    avgEngagementTime: totalSessions > 0 ? Math.floor(totalEngagementTime / totalSessions) : 0,
    avgActiveTime: totalSessions > 0 ? Math.floor(totalActiveTime / totalSessions) : 0,
    avgScrollDepth: Math.round(avgScrollDepth || 0),
    deadClicks,
    rageClicks,
    scriptErrors,
    errorClicks,
    topPagesLast24h: sortedPages,
    rawMetrics: data
  }
}
