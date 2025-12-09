import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registerUser, AuthUser } from '@/lib/auth';
import { serverLogin, serverRegister } from '@/lib/auth_migration';

const LoginPage: React.FC = () => {
  const [lin, setLin] = useState('');
  const [name, setName] = useState('');
  const [secret, setSecret] = useState('');
  const [method, setMethod] = useState<'pin' | 'password'>('pin');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let user: AuthUser | null = null as any;
      if (isRegister) {
        // Try server register first, fallback to local
        try {
          await serverRegister(lin.trim(), name.trim(), secret, method);
          // also register locally for offline
          user = await registerUser(lin.trim(), name.trim(), secret, method);
        } catch (err) {
          user = await registerUser(lin.trim(), name.trim(), secret, method);
        }
      } else {
        try {
          await serverLogin(lin.trim(), name.trim(), secret);
          user = await login(lin.trim(), name.trim(), secret);
        } catch (err) {
          user = await login(lin.trim(), name.trim(), secret);
        }
      }
      console.log('Authenticated', user);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err?.message ?? 'Authentication error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={doSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        <label className="block mb-2">
          <div className="text-sm text-muted-foreground">LIN</div>
          <input value={lin} onChange={e => setLin(e.target.value)} className="input mt-1 w-full" required />
        </label>
        <label className="block mb-2">
          <div className="text-sm text-muted-foreground">Name</div>
          <input value={name} onChange={e => setName(e.target.value)} className="input mt-1 w-full" required />
        </label>
        <label className="block mb-4">
          <div className="text-sm text-muted-foreground">{method === 'pin' ? 'PIN' : 'Password'}</div>
          <input type={method === 'pin' ? 'password' : 'password'} value={secret} onChange={e => setSecret(e.target.value)} className="input mt-1 w-full" required />
        </label>

        <div className="flex items-center gap-4 mb-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={method === 'pin'} onChange={() => setMethod('pin')} />
            <span className="text-sm">Use PIN</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={method === 'password'} onChange={() => setMethod('password')} />
            <span className="text-sm">Use Password</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="btn btn-primary">
            {isRegister ? 'Create account' : 'Login'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setIsRegister(s => !s)}>
            {isRegister ? 'Have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
