'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  BarChart3, 
  Users, 
  FileText,
  TrendingUp,
  Calendar,
  Globe,
  LogOut,
  Settings,
  Home,
  Menu,
  ChevronLeft
} from 'lucide-react'

interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
  slug?: string
}

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  topPages: Array<{ page: string; views: number }>
  topCountries: Array<{ country: string; visitors: number }>
  deviceTypes: Array<{ type: string; count: number }>
  recentEvents: any[]
  dailyViews: Array<{ date: string; views: number }>
}

// Sidebar Navigation Component
function CMSSidebar({ activeTab, setActiveTab, onSignOut, sidebarOpen, setSidebarOpen, user }: {
  activeTab: 'posts' | 'analytics'
  setActiveTab: (tab: 'posts' | 'analytics') => void
  onSignOut: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: any
}) {
  const sidebarItems = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">CMS Dashboard</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-muted"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id as 'posts' | 'analytics')
                        setSidebarOpen(false)
                      }}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                        ${activeTab === item.id 
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
                onClick={() => window.open('/', '_blank')}
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
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics'>('posts')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    checkUser()
    if (activeTab === 'posts') {
      fetchPosts()
    } else {
      fetchAnalytics()
    }
  }, [activeTab])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Also check for dummy auth
    const isDummyAuth = document.cookie.includes('dummyAuth=true')
    
    if (!user && !isDummyAuth) {
      router.push('/login')
    } else {
      setUser(user || { email: 'hidesh@live.dk' })
    }
    setLoading(false)
  }

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setPosts(data as Post[])
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsData({
        totalViews: 1247,
        uniqueVisitors: 892,
        topPages: [
          { page: '/', views: 456 },
          { page: '/projects', views: 289 },
          { page: '/about', views: 178 },
          { page: '/contact', views: 124 }
        ],
        topCountries: [
          { country: 'Denmark', visitors: 234 },
          { country: 'United States', visitors: 187 },
          { country: 'Germany', visitors: 145 },
          { country: 'United Kingdom', visitors: 98 }
        ],
        deviceTypes: [
          { type: 'Desktop', count: 562 },
          { type: 'Mobile', count: 485 },
          { type: 'Tablet', count: 200 }
        ],
        recentEvents: [],
        dailyViews: [],
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }

  const handleSignOut = async () => {
    document.cookie = 'dummyAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSavePost = async () => {
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const postData = {
      title,
      excerpt: summary,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      published: isPublished,
      slug: slug,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id)
        
        if (error) {
          console.error('Error updating post:', error)
          alert('Error updating post: ' + error.message)
        } else {
          fetchPosts()
          resetEditor()
          alert('Post updated successfully!')
        }
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }])
        
        if (error) {
          console.error('Error creating post:', error)
          alert('Error creating post: ' + error.message)
        } else {
          fetchPosts()
          resetEditor()
          alert('Post created successfully!')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred')
    }
  }

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      
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
    setEditingPost(post)
    setTitle(post.title)
    setSummary(post.excerpt || '')
    setContent(post.content || '')
    setTags(post.tags?.join(', ') || '')
    setIsPublished(post.published)
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
    <div className="flex h-screen bg-background">
      <CMSSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - ULTRA COMPACT */}
        <header className="bg-card border-b border-border py-0.5 px-1 flex-shrink-0 h-6">
          <div className="flex items-center h-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-0.5 rounded-md hover:bg-muted mr-1"
            >
              <Menu className="w-3 h-3" />
            </button>
            <h1 className="text-xs font-bold text-foreground capitalize">
              {activeTab}
            </h1>
          </div>
        </header>

        {/* Content Area - FULL HEIGHT, NO PADDING */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === 'posts' && (
              <div className="p-1 h-full">
                {/* Posts Header */}
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-xs font-semibold text-foreground">Blog Posts</h2>
                    <p className="text-muted-foreground text-xs">Manage content</p>
                  </div>
                  <button
                    onClick={() => setShowEditor(true)}
                    className="flex items-center px-1.5 py-0.5 bg-branding-600 text-white rounded text-xs"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    New
                  </button>
                </div>

                {/* Posts Grid */}
                <div className="grid gap-1">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-card border border-border rounded p-1.5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-xs mb-0.5">{post.title}</h3>
                          <p className="text-muted-foreground text-xs mb-0.5 line-clamp-1">{post.excerpt}</p>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span className="px-1 py-0.5 rounded-full text-xs bg-muted text-foreground">
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-xs">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-0.5 text-muted-foreground hover:text-foreground rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-0.5 text-muted-foreground hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {posts.length === 0 && (
                    <div className="text-center py-4">
                      <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <h3 className="text-xs font-medium text-foreground">No posts yet</h3>
                      <p className="text-muted-foreground text-xs">Create your first post</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && analyticsData && (
              <div className="p-1 h-full">
                {/* Analytics Header */}
                <div className="mb-1">
                  <h2 className="text-xs font-semibold text-foreground">Analytics</h2>
                  <p className="text-muted-foreground text-xs">Site performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                  <div className="bg-card border border-border rounded p-1.5">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 text-branding-600 mr-1" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Views</p>
                        <p className="text-xs font-bold text-foreground">{analyticsData?.totalViews.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded p-1.5">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 text-green-600 mr-1" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Visitors</p>
                        <p className="text-xs font-bold text-foreground">{analyticsData?.uniqueVisitors.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded p-1.5">
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 text-blue-600 mr-1" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Countries</p>
                        <p className="text-xs font-bold text-foreground">{analyticsData?.topCountries.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Post Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={resetEditor}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Excerpt</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="Brief description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-border rounded bg-background text-foreground font-mono text-sm"
                  placeholder="Write your post content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                  placeholder="react, typescript, nextjs (comma separated)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 text-branding-600"
                />
                <label htmlFor="published" className="ml-2 text-sm text-foreground">
                  Publish immediately
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-border">
              <button
                onClick={resetEditor}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                className="flex items-center px-4 py-2 bg-branding-600 text-white rounded hover:bg-branding-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingPost ? 'Update' : 'Create'} Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}