import { login as localLogin, registerUser as localRegister, getCurrentUser as getLocalUser } from './auth';

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export async function serverRegister(
  id: string,
  name: string,
  secret: string,
  method: string,
  role: string,
  extra?: { email?: string; schoolId?: string; nin?: string }
) {
  try {
    const payload: any = {
      name, secret, method, role,
      email: extra?.email,
      schoolId: extra?.schoolId,
      nin: extra?.nin
    };

    // server expects specific keys
    if (role === 'student') payload.lin = id;
    if (role === 'teacher') payload.tmis = id;
    if (role === 'admin') payload.email = id; // or adminId

    const res = await fetch(`${SERVER_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'server register failed');
    }
    return await res.json();
  } catch (e) {
    // fallback to local
    return await localRegister(id, name, secret, method as any, role as any, extra);
  }
}

export async function serverLogin(id: string, secret: string, role: string) {
  try {
    const res = await fetch(`${SERVER_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, secret, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'server login failed');
    }
    const data = await res.json();
    if (data?.session_token) {
      localStorage.setItem('l2m_server_session_v1', JSON.stringify({
        token: data.session_token,
        id: data.userId,
        name: data.name,
        at: Date.now()
      }));
    }
    return data;
  } catch (e) {
    // fallback to local
    return await localLogin(id, secret, role as any);
  }
}

export function getLocalUserProfile() {
  return getLocalUser();
}
