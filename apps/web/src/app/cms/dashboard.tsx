'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import '../admin.css'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ClarityAnalyticsDashboard } from '@/components/clarity-analytics-dashboard'
import { MessagesClient } from './messages-client'
import { MediaClient } from './media-client'
import { MarkdownEditor } from '@/components/ui/markdown-editor'
import {
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  FileText,
  LogOut,
  Home,
  Menu,
  ChevronLeft,
  Mail,
  Image as ImageIcon,
} from 'lucide-react'

interface Post {
  id: string
  title: string
  excerpt: string
  body_mdx: string
  tags: string[]
  published_at: string | null
  created_at: string
  updated_at: string
  slug: string
  cover_image?: string
  author_id?: string
}

// Sidebar Navigation Component
function CMSSidebar({
  activeTab,
  setActiveTab,
  onSignOut,
  sidebarOpen,
  setSidebarOpen,
  user,
}: {
  activeTab: 'posts' | 'analytics' | 'messages' | 'media'
  setActiveTab: (tab: 'posts' | 'analytics' | 'messages' | 'media') => void
  onSignOut: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: User | null
}) {
  useEffect(() => {
    if (!sidebarOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [sidebarOpen, setSidebarOpen])

  const sidebarItems = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'messages', label: 'Messages', icon: Mail },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-dvh w-64 shrink-0 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0 visible' : '-translate-x-full invisible lg:visible'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:z-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">
                Hidesh Studio
                <span className="studio-caption">PORTFOLIO WORKSPACE</span>
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
                className="lg:hidden p-1 rounded-md hover:bg-muted"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        window.history.replaceState(
                          null,
                          '',
                          `/cms?tab=${item.id}`
                        )
                        setActiveTab(
                          item.id as
                            'posts' | 'analytics' | 'messages' | 'media'
                        )
                        setSidebarOpen(false)
                      }}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                        ${
                          isActive
                            ? 'bg-branding-100 text-branding-700 dark:bg-branding-900 dark:text-branding-300'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              {/* User Info & Theme Toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {user?.email || 'Admin'}
                </span>
                <ThemeToggle />
              </div>

              <button
                onClick={() =>
                  window.open('/', '_blank', 'noopener,noreferrer')
                }
                className="w-full flex items-center px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Home className="w-5 h-5 mr-3" />
                View Site
              </button>
              <button
                onClick={onSignOut}
                className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Main CMS Dashboard Component
export default function CMSPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [loadError, setLoadError] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState<
    'posts' | 'analytics' | 'messages' | 'media'
  >('posts')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Check URL parameters for tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const tab = searchParams.get('tab')
      if (
        tab === 'messages' ||
        tab === 'analytics' ||
        tab === 'posts' ||
        tab === 'media'
      ) {
        setActiveTab(tab)
      }
    }
  }, [pathname])

  // Form state
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user?.app_metadata?.role !== 'admin') {
      router.push('/login')
      return false
    } else {
      setUser(user)
      return true
    }
  }

  const fetchPosts = async () => {
    try {
      setLoadError('')
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data as Post[])
      } else {
        setLoadError('Could not load posts. Please retry.')
      }
    } catch (error) {
      setLoadError('Could not load posts. Please retry.')
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        if (await checkUser()) await fetchPosts()
      } catch {
        setLoadError('Could not load your workspace. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setNotice('Sign out failed. Please try again.')
      return
    }
    router.replace('/login')
    router.refresh()
  }

  const handleSavePost = async () => {
    if (saving) return
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setNotice('Title, excerpt and content are required.')
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/api/posts', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingPost ? { id: editingPost.id } : {}),
          title: title.trim(),
          excerpt: summary.trim(),
          body_mdx: content.trim(),
          tags: tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
          published_at: isPublished
            ? editingPost?.published_at || new Date().toISOString()
            : null,
        }),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Could not save your post.')
      }
      resetEditor()
      setNotice('Post saved.')
      await fetchPosts()
    } catch (error) {
      // Keep the editor and all unsaved content open on failure.
      alert(
        error instanceof Error ? error.message : 'Could not save your post.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .select('id')
        .single()

      if (error) {
        console.error('Error deleting post:', error)
        alert('Error deleting post: ' + error.message)
      } else {
        fetchPosts()
        alert('Post deleted successfully!')
      }
    }
  }

  const handleEditPost = (post: Post) => {
    // Use any for now since structure differs
    setEditingPost(post)
    setTitle(post.title)
    setSummary(post.excerpt || '')
    setContent(post.body_mdx || '') // posts table uses 'body_mdx'
    setTags(post.tags?.join(', ') || '')
    setIsPublished(!!post.published_at) // posts table uses 'published_at'
    setShowEditor(true)
  }

  const resetEditor = () => {
    setShowEditor(false)
    setEditingPost(null)
    setTitle('')
    setSummary('')
    setContent('')
    setTags('')
    setIsPublished(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-branding-600 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell flex min-h-dvh bg-background">
      <CMSSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Workspace navigation */}
        <header className="studio-topbar bg-card border-b border-border">
          <div className="flex items-center h-full">
            <button
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-0.5 rounded-md hover:bg-muted mr-1"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-medium text-foreground capitalize">
              {activeTab}
            </h1>
          </div>
        </header>

        {/* Workspace content */}
        <section className="studio-content flex-1 min-w-0">
          {notice && (
            <p role="status" className="studio-notice">
              {notice}
            </p>
          )}
          {loadError && (
            <div role="alert" className="studio-notice">
              {loadError} <button onClick={fetchPosts}>Retry</button>
            </div>
          )}
          <div className="h-full">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Posts Header */}
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                  <div>
                    <h2 className="studio-heading">Your stories</h2>
                    <p className="text-muted-foreground mt-2">
                      Write, refine and share what you are building.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditor(true)}
                    className="studio-primary"
                  >
                    <Plus className="w-4 h-4 mr-0.5" />
                    New post
                  </button>
                </div>

                {/* Posts Grid */}
                <div className="grid gap-4">
                  {posts.map(post => (
                    <div
                      key={post.id}
                      className="studio-post bg-card border border-border rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap gap-4 items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-lg mb-2 break-words">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 break-words">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span className="px-1 py-0.5 rounded-full text-xs bg-muted text-foreground">
                              {post.published_at
                                ? new Date(post.published_at) > new Date()
                                  ? 'Scheduled'
                                  : 'Published'
                                : 'Draft'}
                            </span>
                            <span className="text-xs">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            aria-label={`Edit ${post.title}`}
                            onClick={() => handleEditPost(post)}
                            className="p-0.5 text-muted-foreground hover:text-foreground rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            aria-label={`Delete ${post.title}`}
                            onClick={() => handleDeletePost(post.id)}
                            className="p-0.5 text-muted-foreground hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {posts.length === 0 && (
                    <div className="studio-empty text-center py-16">
                      <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <h3 className="text-lg font-medium text-foreground">
                        No posts yet
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Create your first post
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="min-w-0">
                <ClarityAnalyticsDashboard />
              </div>
            )}

            {activeTab === 'media' && (
              <div className="min-w-0">
                <MediaClient />
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="min-w-0">
                <MessagesClient />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Post Editor Modal */}
      {showEditor && (
        <MarkdownEditor
          saving={saving}
          value={content}
          onChange={setContent}
          onSave={handleSavePost}
          onCancel={resetEditor}
          title={title}
          onTitleChange={setTitle}
          excerpt={summary}
          onExcerptChange={setSummary}
          tags={tags}
          onTagsChange={setTags}
          isPublished={isPublished}
          onPublishedChange={setIsPublished}
          editMode={!!editingPost}
        />
      )}
    </div>
  )
}
