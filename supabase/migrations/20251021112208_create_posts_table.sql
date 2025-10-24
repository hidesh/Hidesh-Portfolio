-- Create posts table that matches TypeScript interface
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,  -- Must be NOT NULL to match interface
    body_mdx text NOT NULL, -- Must be NOT NULL to match interface  
    cover_image text,
    tags text[] DEFAULT '{}',
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(), 
    published_at timestamptz,
    read_time integer
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view published posts
CREATE POLICY "Published posts are viewable by everyone" 
ON posts FOR SELECT 
USING (published_at IS NOT NULL);

-- Authors can manage their own posts
CREATE POLICY "Authors can manage their own posts" 
ON posts FOR ALL 
USING (auth.uid() = author_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
