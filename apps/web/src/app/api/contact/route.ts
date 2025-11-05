import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { verifyAltchaSolution } from '@/lib/altcha'
import { checkRateLimit, getResetTime } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, altchaPayload } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Verify ALTCHA challenge
    if (!altchaPayload) {
      return NextResponse.json(
        { error: 'Please complete the CAPTCHA verification' },
        { status: 400 }
      )
    }

    const isValidCaptcha = await verifyAltchaSolution(altchaPayload)
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Email validation (strict RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email)
    if (!rateLimit.allowed) {
      const resetTime = getResetTime(rateLimit.resetAt)
      return NextResponse.json(
        { 
          error: `Too many submissions. Please try again in ${resetTime}.`,
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      )
    }

    // Save to Supabase - combine subject and message
    const fullMessage = subject ? `Subject: ${subject}\n\n${message}` : message
    
    console.log('Attempting to save to Supabase:', { name, email, messageLength: fullMessage.length, handled: false })
    
    const { data: savedMessage, error: dbError } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          message: fullMessage,
          handled: false,
        },
      ])
      .select()
      .single()

    console.log('Supabase response:', { savedMessage, dbError })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'hidesh@live.dk',
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #1f2937;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280;">
              <p><strong>Submission Details:</strong></p>
              <p>Time: ${new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })}</p>
              <p>Message ID: ${savedMessage.id}</p>
            </div>

            <div style="margin-top: 20px; text-align: center;">
              <a href="https://www.hidesh.com/cms?tab=messages" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View in Dashboard
              </a>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails - message is already saved
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        id: savedMessage.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
