import { render, screen, fireEvent } from '@testing-library/react'
import { MessagesClient } from './messages-client'
import { createClient } from '@/lib/supabase/client'
jest.mock('@/lib/supabase/client', () => ({ createClient: jest.fn() }))
test('filters locally while keeping accurate total and status counts', async () => {
  const order = jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        name: 'First',
        email: 'one@example.com',
        message: 'First message',
        handled: false,
        created_at: '2026-01-01',
      },
      {
        id: '2',
        name: 'Second',
        email: 'two@example.com',
        message: 'Second message',
        handled: true,
        created_at: '2026-01-01',
      },
    ],
    error: null,
  })
  ;(createClient as jest.Mock).mockReturnValue({
    from: () => ({ select: () => ({ order }) }),
  })
  render(<MessagesClient />)
  await screen.findByText('First')
  fireEvent.click(screen.getByRole('button', { name: 'Handled (1)' }))
  expect(screen.queryByText('First')).not.toBeInTheDocument()
  expect(screen.getByText('Second')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'All (2)' })).toBeInTheDocument()
  expect(order).toHaveBeenCalledTimes(1)
})
