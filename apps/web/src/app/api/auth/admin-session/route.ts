import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isVerifiedPortfolioOwner } from '@/lib/portfolio-owner'

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
    if (user.app_metadata?.role === 'admin')
      return NextResponse.json({ success: true })
    if (!isVerifiedPortfolioOwner(user)) {
      return NextResponse.json(
        { error: 'This account does not have administrator access.' },
        { status: 403 }
      )
    }
    // Repair the owner's existing account without changing its password or ID.
    // user_metadata and profile roles cannot trigger this operation.
    const service = createServiceClient()
    const { error: updateError } = await service.auth.admin.updateUserById(
      user.id,
      {
        app_metadata: { ...user.app_metadata, role: 'admin' },
      }
    )
    if (updateError) throw updateError
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      {
        error:
          'Your login is valid, but administrator access could not be restored. The server must have its Supabase service key configured.',
      },
      { status: 503 }
    )
  }
}
