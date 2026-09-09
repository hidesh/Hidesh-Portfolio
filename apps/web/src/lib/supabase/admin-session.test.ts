/** @jest-environment node */
import { restoreAdminSession } from './admin-session'
import type { SupabaseClient } from '@supabase/supabase-js'
test('refreshes JWT after role restoration so RLS gets the new claim', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  })
  const refreshSession = jest
    .fn()
    .mockResolvedValue({
      data: { user: { app_metadata: { role: 'admin' } } },
      error: null,
    })
  await restoreAdminSession({
    auth: { refreshSession },
  } as unknown as SupabaseClient)
  expect(refreshSession).toHaveBeenCalledTimes(1)
})
test('does not refresh or sign out on server failure', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Server setup needed' }),
  })
  const refreshSession = jest.fn()
  await expect(
    restoreAdminSession({
      auth: { refreshSession },
    } as unknown as SupabaseClient)
  ).rejects.toThrow('Server setup needed')
  expect(refreshSession).not.toHaveBeenCalled()
})
