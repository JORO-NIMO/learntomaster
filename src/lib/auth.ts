// Lightweight client-side authentication for Learn2Master
// Uses LIN (learner/school ID), name, and PIN or password
// Stores users in localStorage for the PWA/offline demo.

export type AuthUser = {
  lin: string;
  name: string;
  createdAt: string;
  method: 'pin' | 'password';
  salt: string; // base64
  verifier: string; // base64 derived key
};

const STORAGE_KEY = 'l2m_users_v1';
const SESSION_KEY = 'l2m_session_v1';

function getUsers(): Record<string, AuthUser> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, AuthUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function saveSession(lin: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ lin, at: new Date().toISOString() }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): { lin: string } | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
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
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const arr = new Uint8Array(bits);
  return btoa(String.fromCharCode(...arr));
}

export async function registerUser(lin: string, name: string, secret: string, method: 'pin' | 'password' = 'pin') {
  const users = getUsers();
  if (users[lin]) throw new Error('LIN already registered');
  const salt = randomSalt(16);
  const verifier = await deriveVerifier(secret, salt);
  const u: AuthUser = { lin, name, createdAt: new Date().toISOString(), method, salt, verifier };
  users[lin] = u;
  saveUsers(users);
  saveSession(lin);
  return u;
}

export async function login(lin: string, name: string, secret: string) {
  const users = getUsers();
  const u = users[lin];
  if (!u) throw new Error('User not found');
  if (u.name !== name) throw new Error('Name does not match');
  const verifier = await deriveVerifier(secret, u.salt);
  if (verifier !== u.verifier) throw new Error('Invalid credentials');
  saveSession(lin);
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
