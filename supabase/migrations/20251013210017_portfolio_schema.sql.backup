-- Complete Portfolio Schema Migration
-- This migration creates all necessary tables and seed data

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    role text NOT NULL,
    headline text NOT NULL,
    bio text,
    location text,
    email text,
    phone text,
    avatar_url text,
    socials jsonb DEFAULT '{}',
    skills text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    content text,
    github_url text,
    live_url text,
    image_url text,
    technologies text[],
    category text,
    featured boolean DEFAULT false,
    status text DEFAULT 'active',
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    excerpt text,
    content text,
    image_url text,
    published boolean DEFAULT false,
    featured boolean DEFAULT false,
    tags text[],
    reading_time integer,
    view_count integer DEFAULT 0,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    company text NOT NULL,
    position text NOT NULL,
    description text,
    location text,
    start_date date,
    end_date date,
    is_current boolean DEFAULT false,
    technologies text[],
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    issuer text NOT NULL,
    credential_id text,
    credential_url text,
    issue_date date,
    expiry_date date,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}',
    user_agent text,
    ip_address inet,
    referrer text,
    path text,
    created_at timestamptz DEFAULT now()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_profile_id ON blog_posts(profile_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_experiences_profile_id ON experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_certifications_profile_id ON certifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Profiles policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Projects policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Public projects are viewable by everyone'
    ) THEN
        CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can manage their own projects'
    ) THEN
        CREATE POLICY "Users can manage their own projects" ON projects FOR ALL USING (auth.uid() = profile_id);
    END IF;

    -- Blog posts policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Published blog posts are viewable by everyone'
    ) THEN
        CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Users can manage their own blog posts'
    ) THEN
        CREATE POLICY "Users can manage their own blog posts" ON blog_posts FOR ALL USING (auth.uid() = profile_id);
    END IF;

    -- Experiences policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'experiences' AND policyname = 'Public experiences are viewable by everyone'
    ) THEN
        CREATE POLICY "Public experiences are viewable by everyone" ON experiences FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'experiences' AND policyname = 'Users can manage their own experiences'
    ) THEN
        CREATE POLICY "Users can manage their own experiences" ON experiences FOR ALL USING (auth.uid() = profile_id);
    END IF;

    -- Certifications policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'certifications' AND policyname = 'Public certifications are viewable by everyone'
    ) THEN
        CREATE POLICY "Public certifications are viewable by everyone" ON certifications FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'certifications' AND policyname = 'Users can manage their own certifications'
    ) THEN
        CREATE POLICY "Users can manage their own certifications" ON certifications FOR ALL USING (auth.uid() = profile_id);
    END IF;

    -- Analytics policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'analytics' AND policyname = 'Anyone can insert analytics'
    ) THEN
        CREATE POLICY "Anyone can insert analytics" ON analytics FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'analytics' AND policyname = 'Only authenticated users can view analytics'
    ) THEN
        CREATE POLICY "Only authenticated users can view analytics" ON analytics FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Insert seed data
INSERT INTO profiles (id, name, role, headline, bio, location, email, socials, skills) 
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Hidesh Kumar',
    'Full-Stack Developer',
    'Building performance-first, scalable applications with modern web technologies.',
    'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I love creating efficient, user-friendly applications that solve real-world problems.',
    'India',
    'hello@hidesh.com',
    '{
        "github": "https://github.com/hidesh",
        "linkedin": "https://linkedin.com/in/hidesh",
        "twitter": "https://twitter.com/hidesh",
        "email": "hello@hidesh.com"
    }'::jsonb,
    ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes']
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    headline = EXCLUDED.headline,
    bio = EXCLUDED.bio,
    socials = EXCLUDED.socials,
    skills = EXCLUDED.skills,
    updated_at = now();

-- Sample projects
INSERT INTO projects (id, profile_id, title, description, github_url, technologies, category, featured, order_index)
VALUES 
    (
        gen_random_uuid(),
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Portfolio Website',
        'A modern, performance-optimized portfolio website built with Next.js 15 and Supabase.',
        'https://github.com/hidesh/portfolio',
        ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        'Web Development',
        true,
        1
    ),
    (
        gen_random_uuid(),
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Task Management App',
        'A collaborative task management application with real-time updates and team collaboration features.',
        'https://github.com/hidesh/task-manager',
        ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'],
        'Web Development',
        true,
        2
    )
ON CONFLICT DO NOTHING;

-- Sample blog posts
INSERT INTO blog_posts (id, profile_id, title, slug, excerpt, published, featured, tags, reading_time, order_index)
VALUES 
    (
        gen_random_uuid(),
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Building Scalable React Applications',
        'building-scalable-react-applications',
        'Learn the best practices for building large-scale React applications that can grow with your team.',
        true,
        true,
        ARRAY['React', 'JavaScript', 'Best Practices'],
        8,
        1
    ),
    (
        gen_random_uuid(),
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'Modern CSS Techniques for 2024',
        'modern-css-techniques-2024',
        'Explore the latest CSS features and techniques that will improve your web development workflow.',
        true,
        false,
        ARRAY['CSS', 'Web Development', 'Frontend'],
        6,
        2
    )
ON CONFLICT DO NOTHING;
