import { InvalidBody, readJsonBody } from '@/lib/request-body'
import { contactSchema, contactFingerprints } from '@/lib/contact-security'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { verifyAltchaSolution } from '@/lib/altcha'

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!
  )
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin')
    if (!origin || origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { error: 'Invalid form origin' },
        { status: 403 }
      )
    }
    const parsed = contactSchema.safeParse(await readJsonBody(request))
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Please check your form fields and verification.' },
        { status: 400 }
      )
    const { name, email, subject, message, altchaPayload } = parsed.data

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

    const hashes = contactFingerprints(request, email, message)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const challenge = JSON.parse(
      Buffer.from(altchaPayload, 'base64').toString('utf8')
    ).challenge
    const { data: result, error: admissionError } = await supabase.rpc(
      'submit_contact',
      {
        p_challenge: challenge,
        p_sender_hash: hashes.sender,
        p_ip_hash: hashes.ip,
        p_message_hash: hashes.message,
        p_name: name,
        p_email: email,
        p_subject: subject,
        p_message: message,
      }
    )
    if (admissionError || !result)
      return NextResponse.json(
        {
          error:
            'Contact form temporarily unavailable. Please email me directly.',
        },
        { status: 503 }
      )
    if (result.status === 'duplicate')
      return NextResponse.json(
        {
          error:
            'This message has already been received. There is no need to send it again.',
        },
        { status: 409 }
      )
    if (result.status === 'replayed')
      return NextResponse.json(
        {
          error:
            'This verification has already been used. Please verify again.',
        },
        { status: 400 }
      )
    if (result.status === 'rate_limited')
      return NextResponse.json(
        {
          error:
            'Too many messages. Please try again later or email me directly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Number.isInteger(result.retry_after)
                ? Math.min(86400, Math.max(1, result.retry_after))
                : 900
            ),
          },
        }
      )
    if (result.status !== 'accepted' || typeof result.id !== 'string')
      return NextResponse.json(
        { error: 'Could not accept message' },
        { status: 503 }
      )
    const savedMessage = { id: result.id }

    // Send email via Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'hidesh@live.dk',
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>From:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #1f2937;">${escapeHtml(message)}</p>
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
    if (error instanceof InvalidBody)
      return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
