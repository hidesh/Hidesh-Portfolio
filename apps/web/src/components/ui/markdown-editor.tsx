'use client'

import { useState, useRef } from 'react'
import { Eye, Code, X, Save, HelpCircle, ImagePlus, Loader2 } from 'lucide-react'
import { MarkdownViewer } from './markdown-viewer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  onCancel?: () => void
  title?: string
  excerpt?: string
  onTitleChange?: (value: string) => void
  onExcerptChange?: (value: string) => void
  tags?: string
  onTagsChange?: (value: string) => void
  isPublished?: boolean
  onPublishedChange?: (value: boolean) => void
  editMode?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  onSave,
  onCancel,
  title = '',
  excerpt = '',
  onTitleChange,
  onExcerptChange,
  tags = '',
  onTagsChange,
  isPublished = false,
  onPublishedChange,
  editMode = false
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [showHelp, setShowHelp] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
        return
      }

      const data = await response.json()
      
      // Insert markdown image syntax at cursor position
      const imageMarkdown = `\n\n![${file.name}](${data.url})\n\n`
      onChange(value + imageMarkdown)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const markdownHelp = [
    { syntax: '# Heading 1', desc: 'Large heading' },
    { syntax: '## Heading 2', desc: 'Medium heading' },
    { syntax: '**bold text**', desc: 'Bold text' },
    { syntax: '*italic text*', desc: 'Italic text' },
    { syntax: '[Link](url)', desc: 'Create link' },
    { syntax: '![Alt](image.jpg)', desc: 'Insert image' },
    { syntax: '- Item', desc: 'Bullet list' },
    { syntax: '1. Item', desc: 'Numbered list' },
    { syntax: '`code`', desc: 'Inline code' },
    { syntax: '```language\ncode\n```', desc: 'Code block' },
    { syntax: '> Quote', desc: 'Blockquote' },
    { syntax: '---', desc: 'Horizontal line' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <h2 className="text-lg font-semibold text-foreground">
            {editMode ? 'Edit Post' : 'New Post'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Markdown Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Help Panel */}
        {showHelp && (
          <div className="bg-muted/30 p-4 border-b border-border">
            <h3 className="font-semibold mb-3 text-sm">Markdown Cheat Sheet</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {markdownHelp.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <code className="bg-muted px-2 py-1 rounded text-primary block font-mono">
                    {item.syntax}
                  </code>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Meta Fields */}
        <div className="p-4 space-y-3 border-b border-border bg-background">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter an engaging post title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt *</label>
            <textarea
              value={excerpt}
              onChange={(e) => onExcerptChange?.(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Brief description that appears in blog listings..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => onTagsChange?.(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="react, typescript, nextjs"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => onPublishedChange?.(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground font-medium">
                  Publish immediately
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 px-2 py-1">
            <button
              onClick={() => setMode('write')}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
                mode === 'write'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="w-4 h-4" />
              Write
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
                mode === 'preview'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            
            {/* Image Upload Button - Inline with tabs */}
            {mode === 'write' && (
              <>
                <div className="flex-1" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-branding-600 hover:bg-branding-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm text-sm"
                  title="Upload Image"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          {mode === 'write' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none"
              placeholder="# Start writing your post...

Use **markdown** to format your content.

## Add headings, links, images, and more!

```javascript
// You can even add code blocks
console.log('Hello, World!');
```"
            />
          ) : (
            <div className="w-full h-full p-8 bg-muted/10 overflow-y-scroll">
              <div className="max-w-4xl mx-auto">
                {value ? (
                  <MarkdownViewer content={value} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nothing to preview yet</p>
                    <p className="text-sm">Start writing in the Write tab</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            {value.length} characters • {value.split(/\s+/).filter(Boolean).length} words
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!title || !excerpt || !value}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {editMode ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
