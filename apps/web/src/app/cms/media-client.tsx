'use client'

import { useDialogFocus } from '@/lib/use-dialog-focus'
import { useState, useEffect } from 'react'
import {
  Download,
  Trash2,
  Edit3,
  X,
  Calendar,
  FileImage,
  ExternalLink,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  size: number
  type: string
  created_at: string
  updated_at: string
  url: string
  usedIn: Array<{
    id: string
    title: string
    slug: string
  }>
}

export function MediaClient() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')

  const dialogRef = useDialogFocus(!!selectedFile, () => {
    if (!busy) {
      setSelectedFile(null)
      setRenaming(false)
      setNewName('')
    }
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoadError('')
      const response = await fetch('/api/media')
      if (!response.ok) throw new Error('Could not load media. Please retry.')
      const data = await response.json()
      setFiles(data.files || [])
    } catch (error) {
      setLoadError('Could not load media. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm('Er du sikker på at du vil slette dette billede?')) return

    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      })

      if (response.ok) {
        setFiles(files.filter(f => f.name !== fileName))
        setSelectedFile(null)
        alert('Billede slettet!')
      } else {
        alert('Fejl ved sletning')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Fejl ved sletning')
    }
  }

  const handleRename = async () => {
    if (!selectedFile || !newName.trim() || busy) return

    const ext = selectedFile.name.split('.').pop()
    const sanitizedName = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    if (!sanitizedName) {
      alert('Please enter a valid file name.')
      return
    }
    const fullNewName = `${sanitizedName}.${ext}`

    setBusy(true)
    try {
      const response = await fetch('/api/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          newName: fullNewName,
        }),
      })

      if (response.ok) {
        await fetchMedia()
        setSelectedFile(null)
        setRenaming(false)
        setNewName('')
        alert('Filnavn ændret!')
      } else {
        alert('Fejl ved omdøbning')
      }
    } catch (error) {
      console.error('Rename error:', error)
      alert('Fejl ved omdøbning')
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async (file: MediaFile) => {
    try {
      const response = await fetch(file.url)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Fejl ved download')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-branding-600"></div>
      </div>
    )
  }

  return (
    <div className="p-0">
      {loadError && (
        <div role="alert" className="studio-notice">
          {loadError} <button onClick={fetchMedia}>Retry</button>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Media Library
        </h2>
        <p className="text-muted-foreground">Administrer uploadede billeder</p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <FileImage className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Ingen billeder uploadet endnu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map(file => (
            <div
              key={file.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-branding-500 transition-all cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Open ${file.name}`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedFile(file)
                }
              }}
              onClick={() => setSelectedFile(file)}
            >
              <div className="aspect-video relative bg-muted">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate mb-1">
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{file.usedIn.length} post(s)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Media details"
            className="bg-card rounded-lg w-full max-w-4xl max-h-[90dvh] overflow-auto my-8"
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-foreground">
                Billede Detaljer
              </h3>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setRenaming(false)
                  setNewName('')
                }}
                aria-label="Close media details"
                className="p-2 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Preview */}
              <div className="mb-6 relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2 break-all">
                      <FileImage className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Filnavn:</span>
                      <span className="text-foreground font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 break-all">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Uploadet:</span>
                      <span className="text-foreground font-medium">
                        {formatDate(selectedFile.created_at)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 break-all">
                      <span className="text-muted-foreground">Størrelse:</span>
                      <span className="text-foreground font-medium">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 break-all">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground font-medium">
                        {selectedFile.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Bruges i
                  </h4>
                  {selectedFile.usedIn.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Bruges ikke i nogen posts
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedFile.usedIn.map(post => (
                        <a
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-branding-600 hover:text-branding-700 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {post.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rename Section */}
              {renaming ? (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nyt filnavn (uden extension)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      aria-label="New file name"
                      className="flex-1 min-w-0 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      placeholder="nyt-filnavn"
                    />
                    <button
                      disabled={busy}
                      onClick={handleRename}
                      className="px-4 py-2 bg-branding-600 text-white rounded-md hover:bg-branding-700"
                    >
                      Gem
                    </button>
                    <button
                      onClick={() => {
                        setRenaming(false)
                        setNewName('')
                      }}
                      className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                    >
                      Annuller
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="flex items-center gap-2 px-4 py-2 bg-branding-600 text-white rounded-md hover:bg-branding-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setRenaming(true)
                    setNewName(selectedFile.name.replace(/\.[^/.]+$/, ''))
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted"
                >
                  <Edit3 className="w-4 h-4" />
                  Omdøb
                </button>
                <button
                  onClick={() => handleDelete(selectedFile.name)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Slet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
