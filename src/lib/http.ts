import { supabase } from '@/integrations/supabase/client';

export async function getAuthHeaders(includeJson = true): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {};

  if (includeJson) headers['Content-Type'] = 'application/json';
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

  return headers;
}
