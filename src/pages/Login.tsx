import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registerUser, AuthUser } from '@/lib/auth';
import { serverLogin, serverRegister } from '@/lib/auth_migration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <form onSubmit={doSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold">{isRegister ? 'Register' : 'Login'}</h2>

            <div className="space-y-2">
              <Label htmlFor="lin">LIN</Label>
              <Input id="lin" value={lin} onChange={e => setLin(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">{method === 'pin' ? 'PIN' : 'Password'}</Label>
              <Input id="secret" type="password" value={secret} onChange={e => setSecret(e.target.value)} required />
            </div>

            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={method === 'pin'} onChange={() => setMethod('pin')} />
                <span className="text-sm">Use PIN</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={method === 'password'} onChange={() => setMethod('password')} />
                <span className="text-sm">Use Password</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit">
                {isRegister ? 'Create account' : 'Login'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsRegister(s => !s)}>
                {isRegister ? 'Have an account? Login' : "Don't have an account? Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
