/** @jest-environment node */
import { createClient, createServiceClient } from '@/lib/supabase/server'
import * as media from './media/route'
import * as posts from './posts/route'
import * as upload from './upload/route'
import * as insights from './clarity/insights/route'
import * as sync from './clarity/sync/route'
jest.mock('server-only', () => ({}), { virtual: true })
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  createServiceClient: jest.fn(),
}))
jest.mock('@/lib/clarity/database', () => ({
  getLatestAnalytics: jest.fn(),
  getApiUsage: jest.fn(),
  saveAnalytics: jest.fn(),
  incrementApiUsage: jest.fn(),
}))
const routes = [
  ['GET', media.GET],
  ['DELETE', media.DELETE],
  ['PATCH', media.PATCH],
  ['GET', posts.GET],
  ['POST', posts.POST],
  ['PUT', posts.PUT],
  ['POST', upload.POST],
  ['GET', insights.GET],
  ['POST', sync.POST],
] as const

test.each(routes)(
  '%s admin handler rejects anonymous access before service-role operations',
  async (method, handler) => {
    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    })
    const response = await handler(
      new Request('https://portfolio.test/api/private', {
        method,
        headers: {
          origin: 'https://portfolio.test',
          'user-agent': 'Googlebot',
          cookie: 'dummyAuth=true',
        },
      })
    )
    expect(response.status).toBe(401)
    expect(createServiceClient).not.toHaveBeenCalled()
  }
)
