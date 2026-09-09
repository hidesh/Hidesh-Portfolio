import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Dashboard from './dashboard'
import { createClient } from '@/lib/supabase/client'
jest.mock('@/lib/supabase/client', () => ({ createClient: jest.fn() }))
jest.mock('@/components/ui/theme-toggle', () => ({ ThemeToggle: () => null }))
jest.mock('@/components/ui/markdown-viewer', () => ({
  MarkdownViewer: ({ content }: { content: string }) => <div>{content}</div>,
}))
jest.mock('@/components/clarity-analytics-dashboard', () => ({
  ClarityAnalyticsDashboard: () => <div>Analytics panel</div>,
}))
jest.mock('./messages-client', () => ({
  MessagesClient: () => <div>Messages panel</div>,
}))
jest.mock('./media-client', () => ({
  MediaClient: () => <div>Media panel</div>,
}))
const post = {
  id: 'post-id',
  title: 'Existing story',
  excerpt: 'An excerpt',
  body_mdx: 'Original content',
  tags: ['web'],
  published_at: '2025-01-01T12:00:00.000Z',
  created_at: '2025-01-01',
  slug: 'existing-story',
}
beforeEach(() => {
  history.replaceState(null, '', '/cms')
  ;(createClient as jest.Mock).mockReturnValue({
    auth: {
      getUser: async () => ({
        data: {
          user: { email: 'owner@example.com', app_metadata: { role: 'admin' } },
        },
      }),
      signOut: async () => ({ error: null }),
    },
  })
  ;(fetch as jest.Mock).mockImplementation(async (_url, options) => ({
    ok: true,
    json: async () => (options ? post : [post]),
  }))
  jest.spyOn(window, 'alert').mockImplementation(() => {})
})
test('loads posts once and retains the original publication date on edit', async () => {
  render(<Dashboard />)
  fireEvent.click(
    await screen.findByRole('button', { name: 'Edit Existing story' })
  )
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Revised story' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Update Post' }))
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  )
  const call = (fetch as jest.Mock).mock.calls.find(
    ([, options]) => options?.method === 'PUT'
  )
  expect(JSON.parse(call[1].body)).toMatchObject({
    id: 'post-id',
    title: 'Revised story',
    published_at: post.published_at,
  })
  expect(
    (fetch as jest.Mock).mock.calls.filter(([, options]) => !options)
  ).toHaveLength(2)
})
test('keeps unsaved input when save fails', async () => {
  render(<Dashboard />)
  fireEvent.click(await screen.findByRole('button', { name: 'New post' }))
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Keep me' },
  })
  fireEvent.change(screen.getByLabelText('Excerpt'), {
    target: { value: 'An excerpt' },
  })
  fireEvent.change(screen.getByLabelText('Post content'), {
    target: { value: 'Unsaved body' },
  })
  ;(fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: 'Save unavailable' }),
  })
  fireEvent.click(screen.getByRole('button', { name: 'Create Post' }))
  await waitFor(() =>
    expect(window.alert).toHaveBeenCalledWith('Save unavailable')
  )
  expect(screen.getByLabelText('Post content')).toHaveValue('Unsaved body')
})
test('opens the media deep link', async () => {
  history.replaceState(null, '', '/cms?tab=media')
  render(<Dashboard />)
  expect(await screen.findByText('Media panel')).toBeInTheDocument()
})
