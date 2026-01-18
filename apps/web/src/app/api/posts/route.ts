import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'



export async function GET() {
  try {
    const supabase = await createClient()
    
    // Using existing posts table
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use service role to bypass RLS for CMS admin operations
    const supabase = createServiceClient()
    
    // For now, use the existing profile ID from database
    // TODO: Get current user properly
    const user = { id: '0ead8d37-8ddd-4b1d-b4c1-061d5927191c' } // Real profile ID from database

    const body = await request.json()
    const { title, excerpt, body_mdx, tags, published_at } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    
    if (!excerpt?.trim()) {
      return NextResponse.json({ error: 'Excerpt is required' }, { status: 400 })
    }
    
    if (!body_mdx?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Map to posts table structure  
    const postData: {
      title: string;
      slug: string;
      excerpt: string;
      body_mdx: string;
      tags: string[];
      author_id: string;
      published_at: string | null;
    } = {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      body_mdx: body_mdx.trim(),
      tags: tags || [],
      author_id: user.id,
      published_at: published_at || null
    }

    console.log('Creating post with data:', JSON.stringify(postData, null, 2))

    const { data: post, error } = await supabase
      .from('posts')
      // @ts-expect-error - Supabase type mismatch
      .insert([postData])
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: error.message, 
        details: error.details,
        hint: error.hint,
        code: error.code 
      }, { status: 400 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Use service role to bypass RLS for admin operations
    const supabase = createServiceClient()

    // For now, use the existing profile ID from database
    const user = { id: '0ead8d37-8ddd-4b1d-b4c1-061d5927191c' }

    const body = await request.json()
    const { id, title, excerpt, body_mdx, tags, published_at } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }
    
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    
    if (!excerpt?.trim()) {
      return NextResponse.json({ error: 'Excerpt is required' }, { status: 400 })
    }
    
    if (!body_mdx?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Map to posts table structure  
    const postData = {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      body_mdx: body_mdx.trim(),
      tags: tags || [],
      author_id: user.id,
      published_at: published_at || null,
      updated_at: new Date().toISOString()
    }

    console.log('Updating post with data:', JSON.stringify(postData, null, 2))

    const { data: post, error } = await supabase
      .from('posts')
      // @ts-expect-error - Supabase type mismatch
      .update(postData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: error.message, 
        details: error.details,
        hint: error.hint,
        code: error.code 
      }, { status: 400 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}