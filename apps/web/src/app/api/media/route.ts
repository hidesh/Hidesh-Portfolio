import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    const supabase = createServiceClient()
    
    // List all files in blog-images bucket
    const { data: files, error } = await supabase.storage
      .from('blog-images')
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('Error listing files:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URLs and metadata for each file
    const filesWithUrls = files.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(file.name)

      return {
        id: file.id,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || '',
        created_at: file.created_at,
        updated_at: file.updated_at,
        url: publicUrl
      }
    })

    // Get all posts to check image usage
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, body_mdx')

    if (postsError) return NextResponse.json({ error: 'Failed to load image usage' }, { status: 500 })

    // Find which posts use each image
    const filesWithUsage = filesWithUrls.map(file => {
      const usedIn = posts?.filter(post => 
        post.body_mdx?.includes(file.url)
      ).map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug
      })) || []

      return {
        ...file,
        usedIn
      }
    })

    return NextResponse.json({ files: filesWithUsage })
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    const { fileName } = await request.json()

    if (!isFileName(fileName)) {
      return NextResponse.json({ error: 'File name required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName])

    if (error) {
      console.error('Error deleting file:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    const { fileName, newName } = await request.json()

    if (!isFileName(fileName) || !isFileName(newName)) {
      return NextResponse.json({ error: 'File name and new name required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    
    // Get old URL before renaming
    const { data: { publicUrl: oldUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)
    
    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('blog-images')
      .download(fileName)

    if (downloadError) {
      return NextResponse.json({ error: downloadError.message }, { status: 500 })
    }

    // Upload with new name
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(newName, fileData, {
        cacheControl: '31536000',
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get new URL
    const { data: { publicUrl: newUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(newName)

    // Update all posts that use this image
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, body_mdx')
      .like('body_mdx', `%${oldUrl}%`)

    if (postsError) return NextResponse.json({ error: 'Could not verify image usage; original image retained' }, { status: 500 })

    if (posts && posts.length > 0) {
      // Update each post's markdown content
      for (const post of posts) {
        const updatedContent = post.body_mdx.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl)
        
        const { error: updateError } = await supabase
          .from('posts')
          .update({ body_mdx: updatedContent, updated_at: new Date().toISOString() })
          .eq('id', post.id)
        if (updateError) return NextResponse.json({ error: 'Rename incomplete; original image retained' }, { status: 500 })
      }
    }

    // Delete old file
    await supabase.storage
      .from('blog-images')
      .remove([fileName])

    return NextResponse.json({ 
      success: true, 
      newUrl,
      updatedPosts: posts?.length || 0
    })
  } catch (error) {
    console.error('Rename error:', error)
    return NextResponse.json({ error: 'Failed to rename file' }, { status: 500 })
  }
}

function isFileName(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 200 && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value) && !value.includes('..')
}
