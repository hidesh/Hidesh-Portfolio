import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// app_metadata can only be changed by a trusted Supabase administrator.
// Never authorize using user_metadata or a self-editable profile row.
export async function requireAdmin(request?: Request) {
  if (request && !['GET', 'HEAD'].includes(request.method)) {
    const origin = request.headers.get('origin')
    if (!origin || origin !== new URL(request.url).origin) {
      return {
        response: NextResponse.json(
          { error: 'Forbidden origin' },
          { status: 403 }
        ),
        user: null,
      }
    }
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      response: NextResponse.json(
        { error: 'Authentication unavailable' },
        { status: 503 }
      ),
      user: null,
    }
  }
  const client = await createClient()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()
  if (error || !user) {
    return {
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
      user: null,
    }
  }
  if (user.app_metadata?.role !== 'admin') {
    return {
      response: NextResponse.json(
        { error: 'Administrator access required' },
        { status: 403 }
      ),
      user: null,
    }
  }
  return { response: null, user }
}
