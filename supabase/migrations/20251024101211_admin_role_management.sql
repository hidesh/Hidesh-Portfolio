-- Admin role management and security functions
-- This ensures proper admin role assignment and security

-- Create a function to check if user is admin (more secure than direct table access)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely assign admin role (only existing admins can do this)
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can assign admin roles';
    END IF;
    
    -- Assign admin role
    UPDATE public.profiles 
    SET role = 'admin', updated_at = now()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to revoke admin role
CREATE OR REPLACE FUNCTION public.revoke_admin_role(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can revoke admin roles';
    END IF;
    
    -- Prevent revoking own admin role (to avoid lockout)
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot revoke your own admin role';
    END IF;
    
    -- Revoke admin role
    UPDATE public.profiles 
    SET role = 'user', updated_at = now()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert your user as the first admin (replace with your actual email)
-- This ensures you have admin access after enabling RLS
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get user ID for hidesh@live.dk if it exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'hidesh@live.dk'
    LIMIT 1;
    
    -- If user exists, make them admin
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, role, created_at, updated_at)
        VALUES (admin_user_id, 'hidesh@live.dk', 'admin', now(), now())
        ON CONFLICT (id) DO UPDATE SET 
            role = 'admin',
            updated_at = now();
    END IF;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin_role(UUID) TO authenticated;
