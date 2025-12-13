-- Create a function to migrate existing sensitive data (call once with encryption key)
CREATE OR REPLACE FUNCTION public.migrate_sensitive_identifiers(encryption_key text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  migrated_count integer := 0;
  profile_record RECORD;
BEGIN
  -- Only allow admins to run this
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can run this migration';
  END IF;

  -- Loop through profiles with any sensitive data
  FOR profile_record IN 
    SELECT id, nin, lin, tmis 
    FROM public.profiles 
    WHERE nin IS NOT NULL OR lin IS NOT NULL OR tmis IS NOT NULL
  LOOP
    -- Insert or update sensitive_identifiers
    INSERT INTO public.sensitive_identifiers (user_id, nin_encrypted, lin_encrypted, tmis_encrypted)
    VALUES (
      profile_record.id,
      encrypt_identifier(profile_record.nin, encryption_key),
      encrypt_identifier(profile_record.lin, encryption_key),
      encrypt_identifier(profile_record.tmis, encryption_key)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      nin_encrypted = COALESCE(encrypt_identifier(profile_record.nin, encryption_key), sensitive_identifiers.nin_encrypted),
      lin_encrypted = COALESCE(encrypt_identifier(profile_record.lin, encryption_key), sensitive_identifiers.lin_encrypted),
      tmis_encrypted = COALESCE(encrypt_identifier(profile_record.tmis, encryption_key), sensitive_identifiers.tmis_encrypted),
      updated_at = now();
    
    migrated_count := migrated_count + 1;
  END LOOP;

  RETURN migrated_count;
END;
$$;

-- Drop the deprecated columns from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS nin;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS lin;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS tmis;

-- Update the handle_new_user trigger to not reference dropped columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    (NEW.raw_user_meta_data->>'school_id')::UUID
  );
  
  -- Always assign 'student' role, ignore user-supplied metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;