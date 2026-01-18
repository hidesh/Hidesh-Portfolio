-- Create admin profile for CMS operations
-- This profile ID matches what we use in the API

-- Insert admin profile into profiles table
INSERT INTO public.profiles (
    id,
    name,
    role,
    headline,
    socials,
    created_at,
    updated_at
)
VALUES (
    '0ead8d37-8ddd-4b1d-b4c1-061d5927191c'::uuid,
    'Hidesh Kumar',
    'Admin',
    'Software Engineer & Portfolio Admin',
    '{"github": "https://github.com/hidesh", "linkedin": "https://linkedin.com/in/hidesh-kumar"}'::jsonb,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    headline = EXCLUDED.headline,
    updated_at = now();

