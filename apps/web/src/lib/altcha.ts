import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto'

function getKey() {
  const key = process.env.ALTCHA_HMAC_KEY
  if (!key || key.length < 32)
    throw new Error('ALTCHA_HMAC_KEY must contain at least 32 characters')
  return key
}
export interface AltchaChallenge {
  algorithm: string
  challenge: string
  maxnumber: number
  salt: string
  signature: string
}
export async function generateAltchaChallenge(): Promise<AltchaChallenge> {
  const key = getKey()
  const salt = `${randomBytes(16).toString('hex')}?expires=${Date.now() + 300000}`
  const maxnumber = 50000
  const challenge = createHash('sha256')
    .update(salt + randomInt(maxnumber + 1))
    .digest('hex')
  return {
    algorithm: 'SHA-256',
    challenge,
    maxnumber,
    salt,
    signature: createHmac('sha256', key).update(challenge).digest('hex'),
  }
}
export async function verifyAltchaSolution(payload: string): Promise<boolean> {
  try {
    if (typeof payload !== 'string' || payload.length > 4096) return false
    const { algorithm, challenge, number, salt, signature } = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf8')
    )
    if (
      algorithm !== 'SHA-256' ||
      !Number.isInteger(number) ||
      number < 0 ||
      number > 50000 ||
      typeof salt !== 'string' ||
      !/^[a-f0-9]{32}\?expires=\d{13}$/.test(salt)
    )
      return false
    if (
      typeof challenge !== 'string' ||
      typeof signature !== 'string' ||
      !/^[a-f0-9]{64}$/.test(challenge) ||
      !/^[a-f0-9]{64}$/.test(signature)
    )
      return false
    const expires = Number(salt.split('=')[1])
    if (expires < Date.now() || expires > Date.now() + 300000) return false
    const expected = createHmac('sha256', getKey()).update(challenge).digest()
    return (
      timingSafeEqual(Buffer.from(signature, 'hex'), expected) &&
      createHash('sha256')
        .update(salt + number)
        .digest('hex') === challenge
    )
  } catch {
    return false
  }
}
