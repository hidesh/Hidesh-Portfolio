/** @jest-environment node */
import {
  contactSchema,
  contactFingerprints,
  contactIpHash,
} from './contact-security'
const request = (ip = '192.0.2.1', alternate = '203.0.113.1') =>
  new Request('https://portfolio.test/api/contact', {
    headers: { 'x-vercel-forwarded-for': ip, 'x-forwarded-for': alternate },
  })
beforeEach(() => {
  process.env.ALTCHA_HMAC_KEY = 'test-secret-longer-than-32-characters'
  process.env.VERCEL = '1'
})
afterEach(() => {
  delete process.env.VERCEL
})

test('honeypot, empty values, invalid email and oversized messages are rejected', () => {
  const form = {
    name: 'Name',
    email: 'person@example.com',
    subject: 'A project',
    message: 'Hello',
    altchaPayload: 'encoded',
  }
  expect(contactSchema.safeParse(form).success).toBe(true)
  for (const fields of [
    { website: 'spam.example' },
    { name: '  ' },
    { email: 'invalid' },
    { message: 'x'.repeat(2001) },
  ]) {
    expect(contactSchema.safeParse({ ...form, ...fields }).success).toBe(false)
  }
})

test('fingerprints do not disclose IPs/emails and normalize repeated messages', () => {
  const a = contactFingerprints(
    request(),
    'Person@Example.com',
    'Hello    WORLD'
  )
  const b = contactFingerprints(
    request(),
    'person@example.com',
    ' hello world '
  )
  expect(a).toEqual(b)
  for (const hash of Object.values(a)) expect(hash).toMatch(/^[a-f0-9]{64}$/)
})

test('untrusted forwarded headers do not bypass IP limit', () => {
  expect(contactIpHash(request('192.0.2.1', '203.0.113.1'))).toBe(
    contactIpHash(request('192.0.2.1', '203.0.113.2'))
  )
  expect(() => contactIpHash(request('invalid'))).toThrow()
  delete process.env.VERCEL
  expect(contactIpHash(request('192.0.2.1'))).toBe(
    contactIpHash(request('192.0.2.2'))
  )
})

test('IPv6 rotation within /64 and IPv4-mapped addresses cannot bypass limits', () => {
  expect(contactIpHash(request('2001:db8:1234:5678::1'))).toBe(
    contactIpHash(request('2001:0db8:1234:5678:abcd:ef12::2'))
  )
  expect(contactIpHash(request('::ffff:192.0.2.1'))).toBe(
    contactIpHash(request('192.0.2.1'))
  )
  expect(contactIpHash(request('2001:db8:1234:5678::1'))).not.toBe(
    contactIpHash(request('2001:db8:1234:5679::1'))
  )
})
