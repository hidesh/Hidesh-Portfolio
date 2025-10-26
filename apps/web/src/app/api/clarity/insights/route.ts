import { NextResponse } from 'next/server'
import { getLatestAnalytics, saveAnalytics, getApiUsage, incrementApiUsage } from '@/lib/clarity/database'

/**
 * API Route: /api/clarity/insights
 * 
 * GET: Returns latest analytics from Supabase (no API call)
 * 
 * Flow:
 * 1. Always serve from Supabase database (instant, no rate limits)
 * 2. Manual sync via POST endpoint updates the database
 */

export async function GET() {
  try {
    // Get latest data from Supabase
    const latest = await getLatestAnalytics()

    if (!latest) {
      console.log('📊 No analytics data in database yet')
      return NextResponse.json(
        getMockData(),
        { 
          status: 200,
          headers: { 'X-Data-Source': 'MOCK' }
        }
      )
    }

    // Get API usage stats
    const usage = await getApiUsage()

    return NextResponse.json({
      ...latest.data,
      _metadata: {
        fetched_at: latest.fetched_at,
        age_minutes: Math.floor((Date.now() - new Date(latest.fetched_at).getTime()) / 1000 / 60),
        api_usage: usage
      }
    }, {
      headers: { 
        'X-Data-Source': 'DATABASE',
        'X-Data-Age': String(Math.floor((Date.now() - new Date(latest.fetched_at).getTime()) / 1000))
      }
    })
  } catch (error: any) {
    console.error('Error fetching analytics from database:', error)
    
    return NextResponse.json(
      getMockData(),
      { 
        status: 500,
        headers: { 'X-Data-Source': 'ERROR' }
      }
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
  const excessiveScrollMetric = data.find((m: any) => m.metricName === 'ExcessiveScroll')
  const quickbackMetric = data.find((m: any) => m.metricName === 'QuickbackClick')
  
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
        
        // Find matching scroll depth
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
  
  // Sort pages by sessions
  const sortedPages = topPages.sort((a, b) => b.sessions - a.sessions).slice(0, 5)
  
  // Calculate metrics
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
    // Main metrics
    activeSessions: Math.floor(totalSessions * 0.1),
    totalSessions,
    totalUsers,
    pageViewsLast24h: totalSessions,
    
    // Engagement metrics
    avgEngagementTime: totalSessions > 0 ? Math.floor(totalEngagementTime / totalSessions) : 0,
    avgActiveTime: totalSessions > 0 ? Math.floor(totalActiveTime / totalSessions) : 0,
    avgScrollDepth: Math.round(avgScrollDepth || 0),
    
    // User experience metrics
    deadClicks,
    rageClicks,
    scriptErrors,
    errorClicks,
    
    // Top pages
    topPagesLast24h: sortedPages,
    
    // Raw data for advanced metrics
    rawMetrics: data
  }
}

/**
 * Mock data fallback
 */
function getMockData() {
  return {
    activeSessions: 0,
    totalSessions: 0,
    totalUsers: 0,
    pageViewsLast24h: 0,
    avgEngagementTime: 0,
    avgActiveTime: 0,
    avgScrollDepth: 0,
    deadClicks: 0,
    rageClicks: 0,
    scriptErrors: 0,
    errorClicks: 0,
    topPagesLast24h: [],
    rawMetrics: []
  }
}
