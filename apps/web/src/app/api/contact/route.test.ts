/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from './route'
import { createClient } from '@supabase/supabase-js'
import { verifyAltchaSolution } from '@/lib/altcha'
import { Resend } from 'resend'
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }))
jest.mock('@/lib/altcha', () => ({ verifyAltchaSolution: jest.fn() }))
jest.mock('resend', () => ({ Resend: jest.fn() }))
const rpc = jest.fn()
const send = jest.fn()
const body = {
  name: 'Real Person',
  email: 'person@example.com',
  subject: 'A project',
  message: 'Can we discuss a project?',
  website: '',
  altchaPayload: Buffer.from(
    JSON.stringify({ challenge: 'a'.repeat(64) })
  ).toString('base64'),
}
function request(fields = {}, origin = 'https://portfolio.test') {
  return new NextRequest('https://portfolio.test/api/contact', {
    method: 'POST',
    headers: {
      origin,
      'content-type': 'application/json',
      'x-vercel-forwarded-for': '192.0.2.1',
    },
    body: JSON.stringify({ ...body, ...fields }),
  })
}
beforeEach(() => {
  process.env.VERCEL = '1'
  process.env.ALTCHA_HMAC_KEY = 'test-secret-longer-than-32-characters'
  ;(createClient as jest.Mock).mockReturnValue({ rpc })
  ;(verifyAltchaSolution as jest.Mock).mockResolvedValue(true)
  ;(Resend as unknown as jest.Mock).mockImplementation(() => ({
    emails: { send },
  }))
  rpc.mockResolvedValue({
    data: { status: 'accepted', id: 'contact-id' },
    error: null,
  })
  send.mockResolvedValue({ data: { id: 'email-id' }, error: null })
})
afterEach(() => {
  delete process.env.VERCEL
})

test('rejects spamtrap before verification, database access or email', async () => {
  expect((await POST(request({ website: 'spam.example' }))).status).toBe(400)
  expect(verifyAltchaSolution).not.toHaveBeenCalled()
  expect(rpc).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
})
test('foreign origins cannot submit', async () => {
  expect((await POST(request({}, 'https://attacker.test'))).status).toBe(403)
  expect(rpc).not.toHaveBeenCalled()
})
test('invalid CAPTCHA cannot reach the database', async () => {
  ;(verifyAltchaSolution as jest.Mock).mockResolvedValue(false)
  expect((await POST(request())).status).toBe(400)
  expect(rpc).not.toHaveBeenCalled()
})
test.each([
  ['duplicate', 409],
  ['replayed', 400],
  ['rate_limited', 429],
  ['invalid', 503],
])('database %s blocks mail delivery', async (status, code) => {
  rpc.mockResolvedValue({ data: { status }, error: null })
  expect((await POST(request())).status).toBe(code)
  expect(send).not.toHaveBeenCalled()
})
test('database outage fails closed', async () => {
  rpc.mockResolvedValue({ data: null, error: { message: 'Unavailable' } })
  expect((await POST(request())).status).toBe(503)
  expect(send).not.toHaveBeenCalled()
})
test('accepted message stores atomically with hashed identifiers and escaped email HTML', async () => {
  expect(
    (
      await POST(
        request({ name: '<img src=x>', message: '<script>test</script>' })
      )
    ).status
  ).toBe(200)
  expect(rpc).toHaveBeenCalledWith(
    'submit_contact',
    expect.objectContaining({
      p_ip_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
      p_sender_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
  )
  expect(send).toHaveBeenCalledTimes(1)
  expect(send.mock.calls[0][0].html).toContain('&lt;img src=x&gt;')
  expect(send.mock.calls[0][0].html).not.toContain('<script>')
})
