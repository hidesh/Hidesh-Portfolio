-- Apply after 20260909210000_harden_portfolio_access.sql.
BEGIN;
ALTER TABLE public.contact_admissions ADD COLUMN IF NOT EXISTS ip_hash text;
ALTER TABLE public.contact_admissions ADD COLUMN IF NOT EXISTS message_hash text;
CREATE INDEX IF NOT EXISTS contact_admissions_ip_idx ON public.contact_admissions(ip_hash, created_at);
CREATE INDEX IF NOT EXISTS contact_admissions_message_idx ON public.contact_admissions(message_hash, created_at);
CREATE INDEX IF NOT EXISTS contact_admissions_created_idx ON public.contact_admissions(created_at);

-- Submission and admission happen in one transaction: failed inserts never consume proof of work.
CREATE OR REPLACE FUNCTION public.submit_contact(
  p_challenge text, p_sender_hash text, p_ip_hash text, p_message_hash text,
  p_name text, p_email text, p_subject text, p_message text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE lock_key bigint; contact_id uuid; retry_seconds integer := 0; wait_seconds integer;
BEGIN
  IF p_challenge IS NULL OR p_challenge !~ '^[a-f0-9]{64}$'
    OR p_sender_hash IS NULL OR p_sender_hash !~ '^[a-f0-9]{64}$'
    OR p_ip_hash IS NULL OR p_ip_hash !~ '^[a-f0-9]{64}$'
    OR p_message_hash IS NULL OR p_message_hash !~ '^[a-f0-9]{64}$'
    OR p_name IS NULL OR length(btrim(p_name)) NOT BETWEEN 1 AND 100
    OR p_email IS NULL OR length(p_email) NOT BETWEEN 3 AND 254
    OR p_subject IS NULL OR length(btrim(p_subject)) NOT BETWEEN 1 AND 200
    OR p_message IS NULL OR length(btrim(p_message)) NOT BETWEEN 1 AND 2000
  THEN RETURN jsonb_build_object('status', 'invalid'); END IF;

  -- Stable lock order prevents deadlocks; shared keys serialize rotating-email attacks.
  FOR lock_key IN SELECT DISTINCT hashtextextended(k, 0) FROM unnest(ARRAY[
    'sender:' || p_sender_hash, 'ip:' || p_ip_hash,
    'message:' || p_message_hash, 'challenge:' || p_challenge
  ]) AS k ORDER BY 1 LOOP
    PERFORM pg_advisory_xact_lock(lock_key);
  END LOOP;

  DELETE FROM public.contact_admissions WHERE created_at < now() - interval '24 hours';
  IF EXISTS (SELECT 1 FROM public.contact_admissions WHERE challenge = p_challenge) THEN
    RETURN jsonb_build_object('status', 'replayed');
  END IF;
  IF EXISTS (SELECT 1 FROM public.contact_admissions WHERE message_hash = p_message_hash) THEN
    RETURN jsonb_build_object('status', 'duplicate');
  END IF;
  IF (SELECT count(*) FROM public.contact_admissions WHERE sender_hash = p_sender_hash AND created_at > now() - interval '15 minutes') >= 3 THEN
    SELECT ceil(extract(epoch FROM min(created_at) + interval '15 minutes' - now()))::integer INTO wait_seconds
    FROM public.contact_admissions WHERE sender_hash = p_sender_hash AND created_at > now() - interval '15 minutes';
    retry_seconds := greatest(retry_seconds, wait_seconds);
  END IF;
  IF (SELECT count(*) FROM public.contact_admissions WHERE ip_hash = p_ip_hash AND created_at > now() - interval '15 minutes') >= 5 THEN
    SELECT ceil(extract(epoch FROM min(created_at) + interval '15 minutes' - now()))::integer INTO wait_seconds
    FROM public.contact_admissions WHERE ip_hash = p_ip_hash AND created_at > now() - interval '15 minutes';
    retry_seconds := greatest(retry_seconds, wait_seconds);
  END IF;
  IF (SELECT count(*) FROM public.contact_admissions WHERE ip_hash = p_ip_hash) >= 20 THEN
    SELECT ceil(extract(epoch FROM min(created_at) + interval '24 hours' - now()))::integer INTO wait_seconds
    FROM public.contact_admissions WHERE ip_hash = p_ip_hash;
    retry_seconds := greatest(retry_seconds, wait_seconds);
  END IF;
  IF retry_seconds > 0 THEN RETURN jsonb_build_object('status', 'rate_limited', 'retry_after', retry_seconds); END IF;

  INSERT INTO public.contacts(name, email, message, handled)
  VALUES(p_name, p_email, 'Subject: ' || p_subject || E'\n\n' || p_message, false)
  RETURNING id INTO contact_id;
  INSERT INTO public.contact_admissions(challenge, sender_hash, ip_hash, message_hash)
  VALUES(p_challenge, p_sender_hash, p_ip_hash, p_message_hash);
  RETURN jsonb_build_object('status', 'accepted', 'id', contact_id);
END $$;
REVOKE ALL ON FUNCTION public.submit_contact(text,text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_contact(text,text,text,text,text,text,text,text) TO service_role;
DROP FUNCTION IF EXISTS public.admit_contact(text,text);
COMMIT;
