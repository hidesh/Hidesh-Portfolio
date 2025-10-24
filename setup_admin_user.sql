-- Create admin user for portfolio CMS
-- Run this in Supabase SQL Editor

-- Method 1: Direct auth.users insert with proper password hashing
DO $$
DECLARE
  user_id uuid := gen_random_uuid();
BEGIN
  -- Insert user with hashed password
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_token_new,
    email_change,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    'hidesh@live.dk',
    crypt('Test123!', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    '',
    '',
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Hidesh Kumar", "admin": true}',
    false,
    NOW()
  );

  -- Insert identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    format('{"sub": "%s", "email": "%s"}', user_id::text, 'hidesh@live.dk')::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Admin user created with ID: %', user_id;
END $$;