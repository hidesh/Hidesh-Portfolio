import { NextResponse } from 'next/server'
import { generateAltchaChallenge } from '@/lib/altcha'

export async function GET() {
  try {
    const challenge = await generateAltchaChallenge()
    
    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error generating ALTCHA challenge:', error)
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 }
    )
  }
}
