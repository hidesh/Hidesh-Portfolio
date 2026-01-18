import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { getBlogPostMetadata, siteConfig } from '@/lib/seo';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body_mdx: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  cover_image?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return getBlogPostMetadata({
    title: post.title,
    description: post.excerpt,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    tags: post.tags,
    image: post.cover_image || undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Redirect to blog list if post is not published (draft)
  if (!post.published_at) {
    redirect('/blog');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/blog"
          className="inline-flex items-center text-branding-600 hover:text-branding-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-6">
              <time className="text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-branding-100 text-branding-800 dark:bg-branding-900 dark:text-branding-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-branding-500 pl-6 mb-8">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="mb-8">
            <MarkdownViewer content={post.body_mdx} />
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last updated: {new Date(post.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}