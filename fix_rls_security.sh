#!/bin/bash

# Supabase RLS Security Fix Script
echo "🔒 Applying RLS security fixes to Supabase..."

# Read environment variables
source apps/web/.env.local

# Apply RLS directly via psql
PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" psql \
  -h $(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|supabase.co|.pooler.supabase.com|') \
  -p 5432 \
  -d postgres \
  -U postgres \
  -c "
-- Enable RLS on all public tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;

-- Create basic security policies
DROP POLICY IF EXISTS \"Enable read access for all users\" ON public.profiles;
CREATE POLICY \"Enable read access for all users\" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS \"Enable insert for authenticated users only\" ON public.profiles;
CREATE POLICY \"Enable insert for authenticated users only\" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS \"Enable update for users based on id\" ON public.profiles;
CREATE POLICY \"Enable update for users based on id\" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts policies
DROP POLICY IF EXISTS \"Enable read access for all users\" ON public.posts;
CREATE POLICY \"Enable read access for all users\" ON public.posts FOR SELECT USING (published = true);

-- Admin access for posts
DROP POLICY IF EXISTS \"Enable all access for admin users\" ON public.posts;
CREATE POLICY \"Enable all access for admin users\" ON public.posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies  
DROP POLICY IF EXISTS \"Enable read access for published projects\" ON public.projects;
CREATE POLICY \"Enable read access for published projects\" ON public.projects FOR SELECT USING (published = true);

DROP POLICY IF EXISTS \"Enable all access for admin users\" ON public.projects;
CREATE POLICY \"Enable all access for admin users\" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contacts policies
DROP POLICY IF EXISTS \"Enable insert for authenticated users\" ON public.contacts;
CREATE POLICY \"Enable insert for authenticated users\" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS \"Enable read for admin users\" ON public.contacts;
CREATE POLICY \"Enable read for admin users\" ON public.contacts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Analytics tables - allow inserts, admin read
DROP POLICY IF EXISTS \"Enable insert for all\" ON public.pageviews;
CREATE POLICY \"Enable insert for all\" ON public.pageviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS \"Enable read for admin\" ON public.pageviews;
CREATE POLICY \"Enable read for admin\" ON public.pageviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS \"Enable insert for all\" ON public.events;  
CREATE POLICY \"Enable insert for all\" ON public.events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS \"Enable read for admin\" ON public.events;
CREATE POLICY \"Enable read for admin\" ON public.events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

SELECT 'RLS has been enabled on all tables and security policies have been created.' as status;
"

echo "✅ RLS security fix completed!"