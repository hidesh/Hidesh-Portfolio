/** @jest-environment node */
import { requireAdmin } from './admin'
import { createClient } from './supabase/server'
jest.mock('server-only', () => ({}), { virtual: true })
jest.mock('./supabase/server', () => ({
  createClient: jest.fn(),
  createServiceClient: jest.fn(),
}))

const mockClient = createClient as jest.Mock
const request = (method = 'GET', origin?: string) =>
  new Request('https://portfolio.test/api/posts', {
    method,
    headers: origin ? { origin } : {},
  })
function user(value: unknown) {
  mockClient.mockResolvedValue({
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: value }, error: null }),
    },
  })
}
beforeEach(() => {
  user(null)
})

test('anonymous requests are denied', async () => {
  expect((await requireAdmin(request())).response?.status).toBe(401)
})
test('self-editable metadata cannot grant admin', async () => {
  user({ id: 'user', user_metadata: { role: 'admin' }, app_metadata: {} })
  expect((await requireAdmin(request())).response?.status).toBe(403)
})
test('trusted admin is allowed', async () => {
  user({ id: 'admin', app_metadata: { role: 'admin' } })
  expect(
    (await requireAdmin(request('POST', 'https://portfolio.test'))).user?.id
  ).toBe('admin')
})
test.each([undefined, 'https://attacker.test'])(
  'mutations reject missing or foreign origin',
  async origin => {
    user({ id: 'admin', app_metadata: { role: 'admin' } })
    expect((await requireAdmin(request('POST', origin))).response?.status).toBe(
      403
    )
    expect(mockClient).not.toHaveBeenCalled()
  }
)

test('missing configuration fails closed', async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  expect((await requireAdmin(request())).response?.status).toBe(503)
  process.env.NEXT_PUBLIC_SUPABASE_URL = url
})
