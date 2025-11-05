// Generate HMAC key for ALTCHA
// In production, use a secure random string stored in environment variables
const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || 'your-secret-hmac-key-change-in-production'

export interface AltchaChallenge {
  algorithm: string
  challenge: string
  maxnumber: number
  salt: string
  signature: string
}

/**
 * Create a new ALTCHA challenge
 */
export async function generateAltchaChallenge(): Promise<AltchaChallenge> {
  const crypto = require('crypto')
  
  // Generate random salt
  const salt = crypto.randomBytes(16).toString('hex')
  
  // Generate random challenge number
  const maxNumber = 50000 // Difficulty level
  const challengeNumber = Math.floor(Math.random() * maxNumber)
  
  // Create the challenge string
  const algorithm = 'SHA-256'
  const challenge = crypto
    .createHash('sha256')
    .update(salt + challengeNumber.toString())
    .digest('hex')
  
  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', ALTCHA_HMAC_KEY)
    .update(challenge)
    .digest('hex')

  return {
    algorithm,
    challenge,
    maxnumber: maxNumber,
    salt,
    signature,
  }
}

/**
 * Verify ALTCHA solution from client
 */
export async function verifyAltchaSolution(payload: string): Promise<boolean> {
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
    const { algorithm, challenge, number, salt, signature } = data
    
    if (!algorithm || !challenge || number === undefined || !salt || !signature) {
      return false
    }

    const crypto = require('crypto')
    
    // Verify signature matches
    const expectedSignature = crypto
      .createHmac('sha256', ALTCHA_HMAC_KEY)
      .update(challenge)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return false
    }
    
    // Verify the solution
    const hash = crypto
      .createHash('sha256')
      .update(salt + number.toString())
      .digest('hex')
    
    return hash === challenge
  } catch (error) {
    console.error('ALTCHA verification error:', error)
    return false
  }
}
