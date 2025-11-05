'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Trash2, Search, Filter, CheckCircle, Clock } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  handled: boolean
  created_at: string
}

export function MessagesClient() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterHandled, setFilterHandled] = useState<'all' | 'handled' | 'unhandled'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const supabase = createClient()

  const fetchMessages = async () => {
    setLoading(true)
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterHandled === 'handled') {
      query = query.eq('handled', true)
    } else if (filterHandled === 'unhandled') {
      query = query.eq('handled', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      console.log('Fetched messages:', data)
      setMessages(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [filterHandled])

  const toggleHandled = async (id: string, currentHandled: boolean) => {
    const { error } = await supabase
      .from('contacts')
      .update({ handled: !currentHandled })
      .eq('id', id)

    if (error) {
      console.error('Error updating handled status:', error)
      alert('Failed to update status')
    } else {
      setMessages(messages.map(msg => msg.id === id ? { ...msg, handled: !currentHandled } : msg))
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, handled: !currentHandled })
      }
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    } else {
      setMessages(messages.filter(msg => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusCounts = {
    all: messages.length,
    handled: messages.filter(m => m.handled).length,
    unhandled: messages.filter(m => !m.handled).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">Manage and respond to contact form submissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg focus:ring-2 focus:ring-branding-500 focus:border-branding-500 transition-all outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterHandled('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterHandled === 'all'
                ? 'bg-branding-600 text-white'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilterHandled('unhandled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterHandled === 'unhandled'
                ? 'bg-branding-600 text-white'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            Unhandled ({statusCounts.unhandled})
          </button>
          <button
            onClick={() => setFilterHandled('handled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterHandled === 'handled'
                ? 'bg-branding-600 text-white'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            Handled ({statusCounts.handled})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg border border-branding-200 dark:border-branding-800">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No messages found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map(message => (
              <div
                key={message.id}
                className={`p-6 bg-card border rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                  selectedMessage?.id === message.id
                    ? 'border-branding-500 ring-2 ring-branding-500/20'
                    : 'border-branding-200 dark:border-branding-800'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{message.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        message.handled 
                          ? 'text-green-600 bg-green-50 dark:bg-green-950' 
                          : 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                      }`}>
                        {message.handled ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        {message.handled ? 'Handled' : 'Unhandled'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{message.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.created_at).toLocaleString('da-DK', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleHandled(message.id, message.handled)
                      }}
                      className="px-3 py-1.5 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      {message.handled ? 'Mark Unhandled' : 'Mark Handled'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMessage(message.id)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded View */}
                {selectedMessage?.id === message.id && (
                  <div className="mt-4 pt-4 border-t border-branding-200 dark:border-branding-800">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Full Message:</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                      {message.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
