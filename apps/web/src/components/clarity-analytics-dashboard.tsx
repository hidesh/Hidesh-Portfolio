'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Users, Activity, TrendingUp, Eye, MousePointer, AlertTriangle, Zap, Clock, BarChart3, ChevronDown, ChevronUp, RefreshCw, Database } from 'lucide-react'

interface AnalyticsData {
  activeSessions: number
  totalSessions: number
  totalUsers: number
  pageViewsLast24h: number
  avgEngagementTime: number
  avgActiveTime: number
  avgScrollDepth: number
  deadClicks: number
  rageClicks: number
  scriptErrors: number
  errorClicks: number
  topPagesLast24h: Array<{
    url: string
    sessions: number
    avgScrollDepth: number
    engagementTime: number
  }>
  rawMetrics: any[]
  _metadata?: {
    fetched_at: string
    age_minutes: number
    api_usage: {
      requests_today: number
      requests_remaining: number
      last_request: string | null
    }
  }
}

export function ClarityAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clarity/insights')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err: any) {
      console.error('Analytics fetch error:', err)
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncFromClarity = async () => {
    if (syncing) return
    
    try {
      setSyncing(true)
      setSyncMessage(null)
      setError(null)
      
      const response = await fetch('/api/clarity/sync', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        // Show helpful error message
        if (response.status === 503 && result.error?.includes('CLARITY_API_TOKEN')) {
          throw new Error('⚠️ Setup Required: Add CLARITY_API_TOKEN to Vercel environment variables. Get your token from Clarity dashboard → Settings → Export API.')
        }
        throw new Error(result.error || result.message || 'Sync failed')
      }
      
      setSyncMessage(`✅ ${result.message}`)
      
      // Refresh data
      await fetchAnalytics()
      
      // Clear message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000)
    } catch (err: any) {
      console.error('Sync error:', err)
      setError(err.message || 'Failed to sync data')
      setSyncMessage(null)
    } finally {
      setSyncing(false)
    }
  }

  const formatDataAge = () => {
    if (!data?._metadata) return null
    
    const fetchedAt = new Date(data._metadata.fetched_at)
    const now = new Date()
    const ageMinutes = data._metadata.age_minutes
    
    // Format the date
    const dateStr = fetchedAt.toLocaleDateString('da-DK', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
    const timeStr = fetchedAt.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    // Age string
    let ageStr = ''
    if (ageMinutes < 60) {
      ageStr = `${ageMinutes}m gammel`
    } else if (ageMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(ageMinutes / 60)
      ageStr = `${hours}t gammel`
    } else {
      const days = Math.floor(ageMinutes / 1440)
      ageStr = `${days}d gammel`
    }
    
    return { dateStr, timeStr, ageStr }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error || 'No data available'}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const primaryMetrics = [
    { label: 'Total Sessions', value: data.totalSessions, icon: Activity, color: 'blue' },
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'green' },
    { label: 'Page Views', value: data.pageViewsLast24h, icon: Eye, color: 'purple' },
    { label: 'Avg Engagement', value: formatTime(data.avgEngagementTime), icon: Clock, color: 'orange' }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          
          {/* Data Info - Date, Time & Age */}
          {data?._metadata && formatDataAge() && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <div className="text-xs">
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {formatDataAge()!.dateStr} kl. {formatDataAge()!.timeStr}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {formatDataAge()!.ageStr}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* API Usage Counter */}
          {data?._metadata?.api_usage && (
            <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Clarity API Quota</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {data._metadata.api_usage.requests_remaining}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/10 remaining</span>
              </div>
            </div>
          )}

          {/* Sync from Clarity API - Fetches NEW data */}
          <button
            onClick={handleSyncFromClarity}
            disabled={syncing || (data?._metadata?.api_usage?.requests_remaining === 0)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow flex items-center gap-2"
            title={
              data?._metadata?.api_usage?.requests_remaining === 0 
                ? 'Daily API limit reached (10/10 used). Resets tomorrow.' 
                : 'Fetch fresh data from Clarity API and save to database'
            }
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {syncing ? 'Syncing from API...' : 'Sync from Clarity API'}
            </span>
            <span className="sm:hidden">Sync API</span>
          </button>

          {/* Open in Clarity Dashboard */}
          <a
            href="https://clarity.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow"
            title="Open Microsoft Clarity dashboard in new tab"
          >
            <span className="hidden sm:inline">Open Clarity</span>
            <span className="sm:hidden">Clarity</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Sync Message */}
      {syncMessage && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-800 dark:text-green-200">
          {syncMessage}
        </div>
      )}

      {/* PRIMARY METRICS - Most Important */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryMetrics.map((metric) => {
          const Icon = metric.icon
          const colorClasses = {
            blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            green: 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
            purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            orange: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
          }
          
          return (
            <div key={metric.label} className={`border rounded-lg p-6 ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-6 h-6" />
                <TrendingUp className="w-4 h-4 opacity-50" />
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm opacity-75">{metric.label}</div>
            </div>
          )
        })}
      </div>

      {/* ENGAGEMENT CHART */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Engagement Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Scroll Depth</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.avgScrollDepth}%</div>
            <div className="mt-2 bg-blue-200 dark:bg-blue-900/50 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${data.avgScrollDepth}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Active Time</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatTime(data.avgActiveTime)}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Per session average</div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Active Sessions</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{data.activeSessions}</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Currently browsing</div>
          </div>
        </div>
      </div>

      {/* TOP PAGES */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages (Last 24h)</h3>
        <div className="space-y-3">
          {data.topPagesLast24h.map((page, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <div className="flex-1 min-w-0 w-full">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100 break-all">{page.url}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {page.sessions} sessions • {page.avgScrollDepth}% scroll • {formatTime(page.engagementTime)} engagement
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPANDABLE ADVANCED METRICS */}
      <div className="space-y-3">
        {/* User Experience Issues */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('ux-issues')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">User Experience Issues</h3>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-xs">
                {data.deadClicks + data.rageClicks + data.errorClicks} total
              </span>
            </div>
            {expandedSections['ux-issues'] ? <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          </button>
          
          {expandedSections['ux-issues'] && (
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div className="text-sm text-red-600 dark:text-red-400">Dead Clicks</div>
                  </div>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{data.deadClicks}</div>
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">Non-interactive elements clicked</div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div className="text-sm text-orange-600 dark:text-orange-400">Rage Clicks</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{data.rageClicks}</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Frustrated rapid clicking</div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Error Clicks</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{data.errorClicks}</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Clicks on error elements</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Errors */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Technical Errors</h3>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-xs">
                {data.scriptErrors} errors
              </span>
            </div>
            {expandedSections['technical'] ? <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          </button>
          
          {expandedSections['technical'] && (
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <div className="text-sm text-red-600 dark:text-red-400">JavaScript Errors</div>
                </div>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">{data.scriptErrors}</div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">Script execution failures detected</div>
                
                {data.scriptErrors > 0 && (
                  <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/50 rounded text-xs text-red-800 dark:text-red-200">
                    ⚠️ Critical: JavaScript errors detected. Check browser console for details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Full Report in Clarity */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Want deeper insights?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View heatmaps, session recordings, and advanced analytics in Microsoft Clarity
              </p>
            </div>
            <a
              href="https://clarity.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Open Clarity
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
