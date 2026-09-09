import { z } from 'zod'
import { InvalidBody, readJsonBody } from '@/lib/request-body'
import { requireAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'



const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(2000),
  body_mdx: z.string().trim().min(1).max(200000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  published_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
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
    if (error instanceof InvalidBody) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    // Use service role to bypass RLS for CMS admin operations
    const supabase = createServiceClient()
    
    const user = auth.user

    const result = postSchema.safeParse(await readJsonBody(request, 250000))
    if (!result.success) return NextResponse.json({ error: 'Invalid post fields' }, { status: 400 })
    const body = result.data
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


    const { data: post, error } = await supabase
      .from('posts')

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
    if (error instanceof InvalidBody) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if (auth.response) return auth.response
    // Use service role to bypass RLS for admin operations
    const supabase = createServiceClient()

    const user = auth.user

    const result = postSchema.safeParse(await readJsonBody(request, 250000))
    if (!result.success) return NextResponse.json({ error: 'Invalid post fields' }, { status: 400 })
    const body = result.data
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


    const { data: post, error } = await supabase
      .from('posts')

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
    if (error instanceof InvalidBody) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}