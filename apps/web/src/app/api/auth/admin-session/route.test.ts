/** @jest-environment node */
import { POST } from './route'
import { createClient, createServiceClient } from '@/lib/supabase/server'
jest.mock('server-only', () => ({}), { virtual: true })
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  createServiceClient: jest.fn(),
}))
const updateUserById = jest.fn()
const request = (origin = 'https://portfolio.test') =>
  new Request('https://portfolio.test/api/auth/admin-session', {
    method: 'POST',
    headers: { origin },
  })
function setUser(user: unknown) {
  ;(createClient as jest.Mock).mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }),
    },
  })
}
beforeEach(() => {
  setUser(null)
  ;(createServiceClient as jest.Mock).mockReturnValue({
    auth: { admin: { updateUserById } },
  })
  updateUserById.mockResolvedValue({ error: null })
})
test('restores verified owner role without changing password, ID, or other metadata', async () => {
  setUser({
    id: 'existing-owner-id',
    email: 'hidesh@live.dk',
    email_confirmed_at: '2024-01-01',
    app_metadata: { provider: 'email' },
  })
  expect((await POST(request())).status).toBe(200)
  expect(updateUserById).toHaveBeenCalledWith('existing-owner-id', {
    app_metadata: { provider: 'email', role: 'admin' },
  })
})
test.each([
  null,
  { id: 'unverified', email: 'hidesh@live.dk', app_metadata: {} },
  {
    id: 'other',
    email: 'attacker@example.com',
    email_confirmed_at: '2024-01-01',
    user_metadata: { role: 'admin', email: 'hidesh@live.dk' },
    app_metadata: {},
  },
])(
  'never grants access to unsigned-in/unverified/unrelated identities',
  async user => {
    setUser(user)
    expect([401, 403]).toContain((await POST(request())).status)
    expect(updateUserById).not.toHaveBeenCalled()
  }
)
test('already authorized users require no role mutation', async () => {
  setUser({ id: 'admin', app_metadata: { role: 'admin' } })
  expect((await POST(request())).status).toBe(200)
  expect(updateUserById).not.toHaveBeenCalled()
})
test('rejects cross-origin access', async () => {
  expect((await POST(request('https://attacker.test'))).status).toBe(403)
  expect(createClient).not.toHaveBeenCalled()
})
test('reports server setup failure instead of blaming the password', async () => {
  setUser({
    id: 'owner',
    email: 'hidesh@live.dk',
    email_confirmed_at: '2024-01-01',
  })
  updateUserById.mockResolvedValue({ error: new Error('server failure') })
  expect((await POST(request())).status).toBe(503)
})
