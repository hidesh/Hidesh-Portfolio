-- Simple RLS Security Fix Migration
-- Only applies security fixes without touching existing schema

-- Enable RLS on existing tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies  
CREATE POLICY "posts_select_published" ON public.posts FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "posts_admin_all" ON public.posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contacts policies
CREATE POLICY "contacts_insert_auth" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "contacts_admin_select" ON public.contacts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pageviews policies
CREATE POLICY "pageviews_insert_all" ON public.pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "pageviews_admin_select" ON public.pageviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Events policies  
CREATE POLICY "events_insert_all" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_admin_select" ON public.events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies
CREATE POLICY "projects_select_published" ON public.projects FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "projects_admin_all" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);