import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MediaClient } from './media-client'
test('shows a retryable error instead of silently swallowing a failed fetch', async () => {
  ;(fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: false })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ files: [] }) })
  render(<MediaClient />)
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Could not load media'
  )
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  await waitFor(() =>
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  )
  expect(fetch).toHaveBeenCalledTimes(2)
})
