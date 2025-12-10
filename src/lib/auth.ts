// Lightweight client-side authentication for Learn2Master
// Uses LIN (learner/school ID), name, and PIN or password
// Stores users in localStorage for the PWA/offline demo.

export type UserRole = 'student' | 'teacher' | 'admin' | 'school_admin';

export type AuthUser = {
  lin?: string; // For students
  tmis?: string; // For teachers
  nin?: string; // For teachers
  userId: string; // Generic unique ID
  name: string;
  email?: string;
  role: UserRole;
  schoolId?: string; // For teachers and students
  createdAt: string;
  method: 'pin' | 'password';
  salt: string; // base64
  verifier: string; // base64 derived key
  isVerified: boolean;
  lastLogin?: string;
};

const STORAGE_KEY = 'l2m_users_v2'; // Updated version for new schema
const SESSION_KEY = 'l2m_session_v2';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getUsers(): Record<string, AuthUser> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, AuthUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function saveSession(lin: string) {
  const now = Date.now();
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    lin,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + SESSION_EXPIRY_MS
  }));
}

export function updateSessionActivity() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return;
  try {
    const session = JSON.parse(raw);
    session.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): { lin: string; expiresAt: number } | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    // Check if session is expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function randomSalt(len = 16) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return btoa(String.fromCharCode(...arr));
}

async function deriveVerifier(secret: string, saltB64: string) {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256', length: 256 } as any,
    keyMaterial,
    256
  );
  const arr = new Uint8Array(bits);
  return btoa(String.fromCharCode(...arr));
}

export async function registerUser(
  id: string, // LIN, TMIS, or Email
  name: string,
  secret: string,
  method: 'pin' | 'password' = 'pin',
  role: UserRole = 'student',
  extraData?: { email?: string; schoolId?: string; nin?: string }
) {
  const users = getUsers();

  // Basic validation
  if (users[id]) throw new Error(`${role === 'student' ? 'LIN' : 'ID'} already registered`);

  if (role === 'teacher') {
    if (!extraData?.nin) throw new Error('NIN required for teachers');
    if (!extraData?.schoolId) throw new Error('School required for teachers');
  } else if (role === 'student') {
    // LIN validation could go here
  }

  const salt = randomSalt(16);
  const verifier = await deriveVerifier(secret, salt);
  const u: AuthUser = {
    userId: id,
    lin: role === 'student' ? id : undefined,
    tmis: role === 'teacher' ? id : undefined,
    nin: extraData?.nin,
    name,
    email: extraData?.email,
    role,
    schoolId: extraData?.schoolId,
    createdAt: new Date().toISOString(),
    method,
    salt,
    verifier,
    isVerified: role === 'student', // Students auto verified
    lastLogin: new Date().toISOString()
  };
  users[id] = u;
  saveUsers(users);
  saveSession(id);
  return u;
}

export async function login(id: string, secret: string, role?: UserRole) {
  const users = getUsers();
  const u = users[id];

  // Note: Simple local look up by ID.
  // In a real scenario, we might need to lookup by TMIS/LIN separately if the keys vary.
  // For this local storage impl, we assume the 'id' passed is the Primary Key used at registration.

  if (!u) throw new Error('User not found');

  // Optional: check role match if provided
  if (role && u.role !== role) throw new Error(`Incorrect role selected for this user`);

  // Check if user is verified
  if (!u.isVerified) {
    throw new Error('Account pending verification. Please contact your administrator.');
  }

  const verifier = await deriveVerifier(secret, u.salt);
  if (verifier !== u.verifier) throw new Error('Invalid credentials');

  // Update last login
  u.lastLogin = new Date().toISOString();
  users[id] = u;
  saveUsers(users);

  saveSession(id);
  return u;
}

export function logout() {
  clearSession();
}

export function getCurrentUser(): AuthUser | null {
  const s = getSession();
  if (!s) return null;
  const users = getUsers();
  return users[s.lin] ?? null;
}
