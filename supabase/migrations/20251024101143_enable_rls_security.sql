-- Enable RLS on all public tables to fix security vulnerabilities
-- This migration addresses the security advisor warnings about disabled RLS

-- Enable RLS on profiles table
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on posts table  
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contacts table
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on pageviews table
ALTER TABLE IF EXISTS public.pageviews ENABLE ROW LEVEL SECURITY;

-- Enable RLS on events table
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;

-- Enable RLS on projects table
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;

-- Create security policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create security policies for posts table (blog posts)
CREATE POLICY "Anyone can view published posts" ON public.posts
    FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can view all posts" ON public.posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can create posts" ON public.posts
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Only admins can update posts" ON public.posts
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete posts" ON public.posts
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Create security policies for contacts table
CREATE POLICY "Only authenticated users can insert contacts" ON public.contacts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can view contacts" ON public.contacts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Create security policies for pageviews table (analytics)
CREATE POLICY "Anyone can insert pageviews" ON public.pageviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view pageviews" ON public.pageviews
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Create security policies for events table
CREATE POLICY "Anyone can insert events" ON public.events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view events" ON public.events
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Create security policies for projects table
CREATE POLICY "Anyone can view published projects" ON public.projects
    FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can view all projects" ON public.projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Only admins can update projects" ON public.projects
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete projects" ON public.projects
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Add a comment to document this security fix
COMMENT ON SCHEMA public IS 'RLS enabled on all tables to prevent unauthorized access. Security policies implemented for proper access control.';
