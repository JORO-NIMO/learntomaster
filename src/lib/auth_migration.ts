import { login as localLogin, registerUser as localRegister, getCurrentUser as getLocalUser } from './auth';

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export async function serverRegister(lin: string, name: string, secret: string, method: string) {
  try {
    const res = await fetch(`${SERVER_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lin, name, secret, method })
    });
    if (!res.ok) throw new Error('server register failed');
    return await res.json();
  } catch (e) {
    // fallback to local
    return await localRegister(lin, name, secret, method as any);
  }
}

export async function serverLogin(lin: string, name: string, secret: string) {
  try {
    const res = await fetch(`${SERVER_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lin, name, secret })
    });
    if (!res.ok) throw new Error('server login failed');
    return await res.json();
  } catch (e) {
    // fallback to local
    return await localLogin(lin, name, secret);
  }
}

export function getLocalUserProfile() {
  return getLocalUser();
}
