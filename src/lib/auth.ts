// Authentication bridge for Learn2Master
// Uses Supabase for primary auth, localStorage as offline fallback

import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | 'admin' | 'school_admin';

export type AuthUser = {
  id: string;
  lin?: string;
  tmis?: string;
  nin?: string;
  userId: string;
  name: string;
  email?: string;
  role: UserRole;
  schoolId?: string;
  createdAt: string;
  isVerified: boolean;
  lastLogin?: string;
};

const LOCAL_SESSION_KEY = 'l2m_session_v3';

function isNetworkFetchError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !("message" in error)) return false;
  const message = String((error as { message?: string }).message || '').toLowerCase();
  return message.includes('failed to fetch') || message.includes('networkerror') || message.includes('load failed');
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

// Convert Supabase user to AuthUser format
function supabaseUserToAuthUser(user: User, profile: any, role: UserRole): AuthUser {
  return {
    id: user.id,
    userId: user.id,
    lin: profile?.lin || user.user_metadata?.lin,
    tmis: profile?.tmis || user.user_metadata?.tmis,
    nin: profile?.nin || user.user_metadata?.nin,
    name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email,
    role,
    schoolId: profile?.school_id || user.user_metadata?.school_id,
    createdAt: user.created_at,
    isVerified: true,
    lastLogin: new Date().toISOString()
  };
}

// Get current user (sync version for components that need it)
export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Store user in local session
export function setLocalUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

// Get user role from database
export async function getUserRole(userId: string): Promise<UserRole> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured');

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) throw new Error('No role assigned for user');
  return data.role as UserRole;
}

// Get user profile from database
export async function getProfile(userId: string) {
  if (!isSupabaseConfigured) return null;

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

// Initialize auth state from Supabase
export async function initializeAuth(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    setLocalUser(null);
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLocalUser(null);
      return null;
    }

    const [profile, role] = await Promise.all([
      getProfile(session.user.id),
      getUserRole(session.user.id)
    ]);

    const authUser = supabaseUserToAuthUser(session.user, profile, role);
    setLocalUser(authUser);
    return authUser;
  } catch (error) {
    console.error('Auth initialization error:', error);
    return getCurrentUser(); // Fall back to local storage
  }
}

// Sign up a new user
export async function registerUser(
  email: string,
  name: string,
  password: string,
  role: UserRole = 'student',
  extraData?: { lin?: string; tmis?: string; nin?: string; school_id?: string }
): Promise<AuthUser> {
  try {
    assertSupabaseConfigured();
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role,
          ...extraData
        }
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    if (!data.user) throw new Error('Registration failed - no user returned');

    // Wait for the profile to be created by the trigger
    await new Promise(resolve => setTimeout(resolve, 1000));

    const [profile, userRole] = await Promise.all([
      getProfile(data.user.id),
      getUserRole(data.user.id)
    ]);

    const authUser = supabaseUserToAuthUser(data.user, profile, userRole);
    setLocalUser(authUser);
    return authUser;
  } catch (error) {
    console.error('Register error:', error);
    if (isNetworkFetchError(error)) {
      throw new Error('Unable to reach Supabase. Check VITE_SUPABASE_URL and your DNS/network connection.');
    }
    throw error;
  }
}

// Sign in an existing user
export async function login(email: string, password: string): Promise<AuthUser> {
  try {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase login error:', error);
      throw error;
    }
    if (!data.user) throw new Error('Login failed - no user returned');

    const [profile, role] = await Promise.all([
      getProfile(data.user.id),
      getUserRole(data.user.id)
    ]);

    const authUser = supabaseUserToAuthUser(data.user, profile, role);
    setLocalUser(authUser);
    return authUser;
  } catch (error) {
    console.error('Login error:', error);
    if (isNetworkFetchError(error)) {
      throw new Error('Unable to reach Supabase. Check VITE_SUPABASE_URL and your DNS/network connection.');
    }
    throw error;
  }
}

// Sign out
export async function logout() {
  setLocalUser(null);
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

// Clear session
export function clearSession() {
  setLocalUser(null);
}

// Get schools for registration dropdown
export async function getSchools() {
  if (!isSupabaseConfigured) return [];

  try {
    const { data } = await supabase
      .from('schools')
      .select('id, name, code')
      .order('name');
    return data || [];
  } catch {
    return [];
  }
}
