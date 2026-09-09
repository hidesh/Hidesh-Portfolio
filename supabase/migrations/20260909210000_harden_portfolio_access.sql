-- Run on the existing Supabase project after granting the owner app_metadata.role = admin.
-- Restrictive policies also constrain old permissive policies left by earlier migrations.
BEGIN;
DO $$
DECLARE t text; op text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','posts','contacts','projects','pageviews','events','clarity_analytics','clarity_api_usage'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    FOREACH op IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'secure_admin_' || lower(op), t);
      IF op = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')', 'secure_admin_insert', t);
      ELSIF op = 'UPDATE' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING ((auth.jwt()->''app_metadata''->>''role'') = ''admin'') WITH CHECK ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')', 'secure_admin_update', t);
      ELSE
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')', 'secure_admin_delete', t);
      END IF;
    END LOOP;
    EXECUTE format('DROP POLICY IF EXISTS secure_admin_access ON public.%I', t);
    EXECUTE format('CREATE POLICY secure_admin_access ON public.%I FOR ALL TO authenticated USING ((auth.jwt()->''app_metadata''->>''role'') = ''admin'') WITH CHECK ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')', t);
    IF t NOT IN ('profiles','posts','projects') THEN
      EXECUTE format('DROP POLICY IF EXISTS secure_private_read ON public.%I', t);
      EXECUTE format('CREATE POLICY secure_private_read ON public.%I AS RESTRICTIVE FOR SELECT TO anon, authenticated USING ((auth.jwt()->''app_metadata''->>''role'') = ''admin'')', t);
    ELSIF t IN ('posts','projects') THEN
      EXECUTE format('DROP POLICY IF EXISTS secure_published_read ON public.%I', t);
      EXECUTE format('CREATE POLICY secure_published_read ON public.%I AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (published_at <= now() OR (auth.jwt()->''app_metadata''->>''role'') = ''admin'')', t);
    END IF;
  END LOOP;
END $$;

DROP POLICY IF EXISTS secure_blog_insert ON storage.objects;
CREATE POLICY secure_blog_insert ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'blog-images' OR (auth.jwt()->'app_metadata'->>'role') = 'admin');
DROP POLICY IF EXISTS secure_blog_update ON storage.objects;
CREATE POLICY secure_blog_update ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'blog-images' OR (auth.jwt()->'app_metadata'->>'role') = 'admin')
WITH CHECK (bucket_id <> 'blog-images' OR (auth.jwt()->'app_metadata'->>'role') = 'admin');
DROP POLICY IF EXISTS secure_blog_delete ON storage.objects;
CREATE POLICY secure_blog_delete ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (bucket_id <> 'blog-images' OR (auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Shared, transactional replay protection and contact limits across serverless instances.
CREATE TABLE IF NOT EXISTS public.contact_admissions (
  challenge text PRIMARY KEY,
  sender_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_admissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_admissions FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS contact_admissions_sender_idx ON public.contact_admissions(sender_hash, created_at);
CREATE OR REPLACE FUNCTION public.admit_contact(p_challenge text, p_sender_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF length(p_challenge) > 128 OR length(p_sender_hash) <> 64 THEN RETURN false; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_sender_hash, 0));
  DELETE FROM public.contact_admissions WHERE created_at < now() - interval '10 minutes';
  IF (SELECT count(*) FROM public.contact_admissions WHERE sender_hash = p_sender_hash AND created_at > now() - interval '5 minutes') >= 5 THEN RETURN false; END IF;
  INSERT INTO public.contact_admissions(challenge, sender_hash) VALUES (p_challenge, p_sender_hash) ON CONFLICT DO NOTHING;
  RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.admit_contact(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admit_contact(text, text) TO service_role;
COMMIT;
