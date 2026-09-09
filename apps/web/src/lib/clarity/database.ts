import 'server-only'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Analytics unavailable')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

/**
 * Get latest Clarity analytics from database
 */
export async function getLatestAnalytics() {
  const { data, error } = await getAdminClient()
    .from('clarity_analytics')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching analytics from DB:', error)
    return null
  }

  return data
}

/**
 * Save Clarity analytics to database
 */
export async function saveAnalytics(analyticsData: any) {
  const { data, error } = await getAdminClient()
    .from('clarity_analytics')
    .insert({
      data: analyticsData,
      fetched_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving analytics to DB:', error)
    throw error
  }

  return data
}

/**
 * Get today's API usage stats
 */
export async function getApiUsage() {
  const { data, error } = await getAdminClient()
    .rpc('get_todays_api_usage')

  if (error) {
    console.error('Error fetching API usage:', error)
    return { requests_today: 0, requests_remaining: 10, last_request: null }
  }

  return data[0] || { requests_today: 0, requests_remaining: 10, last_request: null }
}

/**
 * Increment API usage counter
 */
export async function incrementApiUsage() {
  const { data, error } = await getAdminClient()
    .rpc('increment_api_usage')

  if (error) {
    console.error('Error incrementing API usage:', error)
    throw error
  }

  return data
}
