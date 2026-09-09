import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    const formData = await request.formData()
    const file = formData.get('file')
    const rawAlt = formData.get('altText')
    const altText = typeof rawAlt === 'string' ? rawAlt : ''
    
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate SEO-friendly filename from alt text or original filename
    const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' }
    const fileExt = extensions[file.type]
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
    const hex = Buffer.from(bytes).toString('hex')
    const valid = fileExt === 'jpg' ? hex.startsWith('ffd8ff') : fileExt === 'png' ? hex.startsWith('89504e470d0a1a0a') : fileExt === 'gif' ? ['GIF87a', 'GIF89a'].includes(Buffer.from(bytes.slice(0, 6)).toString()) : hex.startsWith('52494646') && Buffer.from(bytes.slice(8, 12)).toString() === 'WEBP'
    if (!valid) return NextResponse.json({ error: 'File content does not match its image type' }, { status: 400 })
    const baseName = (altText || file.name.replace(/\.[^/.]+$/, ''))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
      .substring(0, 50) // Limit length
    const timestamp = Date.now()
    const fileName = `${baseName}-${timestamp}.${fileExt}`

    // Upload to Supabase Storage
    const supabase = createServiceClient()
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload image: ' + error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
