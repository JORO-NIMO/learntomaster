import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/auth';

interface RoleVerificationResult {
  verified: boolean;
  userRoles: UserRole[];
  userId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useServerRoleVerification(requiredRoles: UserRole[]): RoleVerificationResult {
  const [result, setResult] = useState<RoleVerificationResult>({
    verified: false,
    userRoles: [],
    userId: null,
    isLoading: true,
    error: null,
  });

  const verifyRole = useCallback(async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setResult({
          verified: false,
          userRoles: [],
          userId: null,
          isLoading: false,
          error: 'Not authenticated',
        });
        return;
      }

      // Call the edge function to verify role server-side
      const { data, error } = await supabase.functions.invoke('verify-role', {
        body: { requiredRoles },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Role verification error:', error);
        setResult({
          verified: false,
          userRoles: [],
          userId: null,
          isLoading: false,
          error: error.message,
        });
        return;
      }

      setResult({
        verified: data.verified,
        userRoles: data.userRoles || [],
        userId: data.userId,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Role verification failed:', err);
      setResult({
        verified: false,
        userRoles: [],
        userId: null,
        isLoading: false,
        error: 'Failed to verify role',
      });
    }
  }, [requiredRoles]);

  useEffect(() => {
    verifyRole();
  }, [verifyRole]);

  return result;
}
