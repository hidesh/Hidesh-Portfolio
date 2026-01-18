import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read about my journey in software development, e-commerce solutions, AI automation, project insights, and tech thoughts. Learn from real-world experiences and tutorials.',
  keywords: [
    ...siteConfig.keywords,
    'software development blog',
    'web development tutorials',
    'programming blog',
    'tech blog',
    'coding tutorials',
    'developer insights',
  ],
  openGraph: getOpenGraphMetadata({
    title: 'Blog - Hidesh Kumar',
    description: 'Read about my journey in software development, e-commerce solutions, AI automation, project insights, and tech thoughts.',
    url: `${siteConfig.url}/blog`,
  }),
  twitter: getTwitterMetadata({
    title: 'Blog - Hidesh Kumar',
    description: 'Read about my journey in software development, e-commerce solutions, AI automation, project insights, and tech thoughts.',
  }),
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

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

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .not('published_at', 'is', null)
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl py-2 font-bold text-center mb-6 text-gradient">
            Blog
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights from my journey in software development, project deep-dives, and thoughts on the ever-evolving tech landscape.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted/50 backdrop-blur rounded-lg p-12 border border-border">
              <div className="w-16 h-16 bg-branding-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-branding-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">No posts yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                I'm working on some exciting content about software development, projects, and tech insights. Check back soon!
              </p>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-branding-600 text-white rounded-md hover:bg-branding-700 transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <article className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:border-branding-500/50 transition-all duration-300 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-branding-600 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <time className="text-sm text-muted-foreground flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-branding-500/10 text-branding-600 border border-branding-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags?.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <span className="inline-flex items-center text-branding-600 group-hover:text-branding-700 font-medium text-sm transition-colors group-hover:translate-x-1 duration-200">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}