import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
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
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
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

  return {
    title: `${post.title} - Hidesh Kumar`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
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

          <div className="text-foreground leading-relaxed">
            {/* For now, render content as text. In a real app, you'd use a markdown parser */}
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-branding-600 hover:text-branding-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>
            
            <div className="text-sm text-muted-foreground">
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