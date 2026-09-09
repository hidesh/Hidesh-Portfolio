import type { SupabaseClient } from '@supabase/supabase-js'

export async function restoreAdminSession(client: SupabaseClient) {
  const response = await fetch('/api/auth/admin-session', { method: 'POST' })
  const result = await response.json()
  if (!response.ok)
    throw new Error(result.error || 'Could not restore administrator access.')
  // Refresh the JWT as well as the user record so database RLS sees the role.
  const { data, error } = await client.auth.refreshSession()
  if (error || data.user?.app_metadata?.role !== 'admin') {
    throw new Error(
      'Your session could not be refreshed. Please sign in again.'
    )
  }
}
