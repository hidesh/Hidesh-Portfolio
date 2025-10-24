-- Alternative method: Use Supabase admin functions
-- Run this if the main SQL script doesn't work

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Simple direct insert method
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'hidesh@live.dk',
  crypt('Test123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Hidesh Kumar","admin":true}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = now(),
  updated_at = now();

-- Verify the user was created
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'hidesh@live.dk';