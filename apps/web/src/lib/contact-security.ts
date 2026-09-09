import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  altchaPayload: z.string().min(1).max(4096),
  website: z.string().max(0).optional(),
})

function digest(namespace: string, value: string) {
  const secret = process.env.ALTCHA_HMAC_KEY
  if (!secret || secret.length < 32)
    throw new Error('Contact security is not configured')
  return createHmac('sha256', secret)
    .update(`${namespace}:${value}`)
    .digest('hex')
}

// Only trust the platform's IP header when actually hosted on Vercel.
// A self-hosted installation must configure its proxy before using client IPs.
export function contactIpHash(request: Request) {
  if (process.env.VERCEL !== '1') return digest('ip', 'self-hosted-shared')
  const ip = request.headers.get('x-vercel-forwarded-for')?.trim()
  if (!ip || !isIP(ip)) throw new Error('Trusted client address unavailable')
  // Canonicalize IPv6 and bucket by /64 to prevent trivial address rotation.
  let normalized = ip
  if (isIP(ip) === 6) {
    const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1)
    const [left, right] = canonical.split('::')
    const start = left ? left.split(':') : []
    const end = right ? right.split(':') : []
    const parts =
      right === undefined
        ? start
        : [...start, ...Array(8 - start.length - end.length).fill('0'), ...end]
    const words = parts.map(part => Number.parseInt(part, 16))
    normalized =
      words.slice(0, 5).every(word => word === 0) && words[5] === 65535
        ? [words[6] >> 8, words[6] & 255, words[7] >> 8, words[7] & 255].join(
            '.'
          )
        : words
            .slice(0, 4)
            .map(word => word.toString(16))
            .join(':') + '::/64'
  }
  return digest('ip', normalized)
}

export function contactFingerprints(
  request: Request,
  email: string,
  message: string
) {
  return {
    ip: contactIpHash(request),
    sender: digest('sender', email.toLowerCase()),
    message: digest(
      'message',
      message.normalize('NFKC').replace(/\s+/gu, ' ').trim().toLowerCase()
    ),
  }
}
