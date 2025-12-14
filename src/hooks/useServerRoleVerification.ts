import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, getUserRole } from '@/lib/auth';

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

      // Get role directly from user_roles table
      const role = await getUserRole(session.user.id);
      const userRoles = role ? [role] : [];
      const verified = requiredRoles.length === 0 ? true : requiredRoles.includes(role);

      setResult({
        verified,
        userRoles,
        userId: session.user.id,
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
