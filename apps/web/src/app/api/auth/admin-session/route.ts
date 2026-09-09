import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 })
  }
  try {
    const client = await createClient()
    const {
      data: { user },
      error,
    } = await client.auth.getUser()
    if (error || !user)
      return NextResponse.json(
        { error: 'Please sign in with your Supabase account.' },
        { status: 401 }
      )
    // Login checks authority; it must never grant or restore it.
    if (user.app_metadata?.role !== 'admin') {
      return NextResponse.json(
        {
          error:
            'Your login is valid, but this account has not been granted administrator access.',
        },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json(
      {
        error:
          'Authentication is temporarily unavailable. Please try again later.',
      },
      { status: 503 }
    )
  }
}
