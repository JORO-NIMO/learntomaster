-- Fix: Always assign 'student' role regardless of user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, lin, tmis, nin, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'lin',
    NEW.raw_user_meta_data->>'tmis',
    NEW.raw_user_meta_data->>'nin',
    (NEW.raw_user_meta_data->>'school_id')::UUID
  );
  
  -- SECURITY FIX: Always assign 'student' role, ignore user-supplied metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Drop existing INSERT policy and create a restrictive one
DROP POLICY IF EXISTS "Users can insert their own role on signup" ON public.user_roles;

-- New policy: Users can only insert 'student' role for themselves
CREATE POLICY "Users can only insert student role on signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'student');

-- Add explicit policies to prevent unauthorized role modifications
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));