-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create a restricted table for sensitive identifiers with encryption
CREATE TABLE public.sensitive_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nin_encrypted BYTEA,
  lin_encrypted BYTEA,
  tmis_encrypted BYTEA,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sensitive_identifiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sensitive identifiers"
  ON public.sensitive_identifiers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sensitive identifiers"
  ON public.sensitive_identifiers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sensitive identifiers"
  ON public.sensitive_identifiers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view sensitive identifiers"
  ON public.sensitive_identifiers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_sensitive_identifiers_updated_at
  BEFORE UPDATE ON public.sensitive_identifiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create secure functions to encrypt/decrypt sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_identifier(plain_text TEXT, encryption_key TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF plain_text IS NULL OR plain_text = '' THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_encrypt(plain_text, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_identifier(encrypted_data BYTEA, encryption_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF encrypted_data IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Mark plaintext fields as deprecated
COMMENT ON COLUMN public.profiles.nin IS 'DEPRECATED: Sensitive data moved to sensitive_identifiers table with encryption';
COMMENT ON COLUMN public.profiles.lin IS 'DEPRECATED: Sensitive data moved to sensitive_identifiers table with encryption';
COMMENT ON COLUMN public.profiles.tmis IS 'DEPRECATED: Sensitive data moved to sensitive_identifiers table with encryption';