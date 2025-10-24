-- RLS Security Fix Script
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Create security policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Create security policies for posts
CREATE POLICY "posts_select_all" ON public.posts 
    FOR SELECT USING (true);

CREATE POLICY "posts_admin_manage" ON public.posts 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "posts_update_admin" ON public.posts 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "posts_delete_admin" ON public.posts 
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. Create security policies for projects
CREATE POLICY "projects_select_all" ON public.projects 
    FOR SELECT USING (true);

CREATE POLICY "projects_admin_manage" ON public.projects 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "projects_update_admin" ON public.projects 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "projects_delete_admin" ON public.projects 
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Create security policies for contacts
CREATE POLICY "contacts_insert_auth" ON public.contacts 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "contacts_admin_select" ON public.contacts 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 6. Create security policies for pageviews (analytics)
CREATE POLICY "pageviews_insert_all" ON public.pageviews 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "pageviews_admin_select" ON public.pageviews 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. Create security policies for events
CREATE POLICY "events_insert_all" ON public.events 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "events_admin_select" ON public.events 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 8. Create admin user (replace with your actual user ID after signup)
-- First sign up at your app with hidesh@live.dk, then run this:
-- INSERT INTO public.profiles (id, email, role, name, headline, created_at, updated_at)
-- SELECT id, 'hidesh@live.dk', 'admin', 'Hidesh Kumar', 'Portfolio Admin', now(), now()
-- FROM auth.users WHERE email = 'hidesh@live.dk'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();

SELECT 'RLS has been successfully enabled on all tables!' as status;