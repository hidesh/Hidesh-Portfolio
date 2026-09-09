/** @jest-environment node */
import { createHash } from 'node:crypto'
import { generateAltchaChallenge, verifyAltchaSolution } from './altcha'
import { readJsonBody, InvalidBody } from './request-body'

const key = 'test-key-for-tests-only-32-characters-long'
const encode = (data: unknown) =>
  Buffer.from(JSON.stringify(data)).toString('base64')

beforeEach(() => {
  process.env.ALTCHA_HMAC_KEY = key
})

test('CAPTCHA fails closed without a configured secret', async () => {
  delete process.env.ALTCHA_HMAC_KEY
  await expect(generateAltchaChallenge()).rejects.toThrow('ALTCHA_HMAC_KEY')
})

test('CAPTCHA accepts real work and rejects tampering, expiry, and invalid counters', async () => {
  const challenge = await generateAltchaChallenge()
  const expires = Number(
    new URLSearchParams(challenge.salt.split('?')[1]).get('expires')
  )
  const browserDelay = expires * 1000 - Date.now()
  expect(browserDelay).toBeGreaterThan(298000)
  expect(browserDelay).toBeLessThanOrEqual(300000)
  expect(browserDelay).toBeLessThan(2147483647)
  let number = 0
  while (
    createHash('sha256')
      .update(challenge.salt + number)
      .digest('hex') !== challenge.challenge &&
    number <= challenge.maxnumber
  )
    number++
  expect(number).toBeLessThanOrEqual(challenge.maxnumber)
  const solution = { ...challenge, number }
  expect(await verifyAltchaSolution(encode(solution))).toBe(true)
  expect(await verifyAltchaSolution(encode({ ...solution, number: -1 }))).toBe(
    false
  )
  expect(
    await verifyAltchaSolution(
      encode({ ...solution, signature: '0'.repeat(64) })
    )
  ).toBe(false)
  expect(
    await verifyAltchaSolution(
      encode({
        ...solution,
        salt: solution.salt.replace(/expires=\d+/, 'expires=1000000000'),
      })
    )
  ).toBe(false)
  expect(
    await verifyAltchaSolution(encode({ ...solution, algorithm: 'MD5' }))
  ).toBe(false)
  const now = Date.now()
  const clock = jest.spyOn(Date, 'now').mockReturnValue(now + 360000)
  expect(await verifyAltchaSolution(encode(solution))).toBe(false)
  clock.mockRestore()
})

test.each(['invalid', 'x'.repeat(4097), encode(null), encode({})])(
  'rejects malformed CAPTCHA payload',
  async payload => {
    expect(await verifyAltchaSolution(payload)).toBe(false)
  }
)

test('bounded JSON reader checks actual streamed bytes without trusting content-length', async () => {
  const request = (body: string) =>
    new Request('https://example.test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
  expect(await readJsonBody(request('{"name":"Hidesh"}'))).toEqual({
    name: 'Hidesh',
  })
  await expect(
    readJsonBody(request('"' + 'x'.repeat(100) + '"'), 20)
  ).rejects.toBeInstanceOf(InvalidBody)
  await expect(readJsonBody(request('{'))).rejects.toBeInstanceOf(InvalidBody)
})
