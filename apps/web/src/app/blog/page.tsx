import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Hidesh Kumar',
  description: 'Read about my journey in software development, project insights, and tech thoughts.',
  openGraph: {
    title: 'Blog - Hidesh Kumar',
    description: 'Read about my journey in software development, project insights, and tech thoughts.',
  },
};

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects') // We're using the projects table for blog posts
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights from my journey in software development, project deep-dives, and thoughts on the ever-evolving tech landscape.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No posts yet</h2>
              <p className="text-muted-foreground">
                I'm working on some exciting content. Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-foreground hover:text-branding-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-muted-foreground mt-2 line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
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
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="text-branding-600 hover:text-branding-700 font-medium text-sm transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}