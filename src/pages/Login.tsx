import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registerUser, AuthUser, UserRole } from '@/lib/auth';
import { serverLogin, serverRegister } from '@/lib/auth_migration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock schools for offline status - in real app, fetch from API
const MOCK_SCHOOLS = [
  { id: '1', name: 'Kampala High School' },
  { id: '2', name: 'St. Marys Secondary' },
  { id: '3', name: 'Mengo School' }
];

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [identifier, setIdentifier] = useState(''); // LIN, TMIS, or Email
  const [name, setName] = useState('');
  const [secret, setSecret] = useState('');
  const [nin, setNin] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [method, setMethod] = useState<'pin' | 'password'>('password'); // Default to password

  const navigate = useNavigate();
  const { toast } = useToast();

  const getIdentifierLabel = () => {
    switch (role) {
      case 'teacher': return 'TMIS Number';
      case 'student': return 'LIN (Learner ID)';
      default: return 'Email Address';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (role) {
      case 'teacher': return 'Enter your TMIS number';
      case 'student': return 'Enter your LIN';
      default: return 'admin@school.ac.ug';
    }
  };

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let user: AuthUser | null = null as any;
      const id = identifier.trim();
      const extraData = {
        email: role === 'admin' ? id : undefined,
        schoolId: (role === 'teacher' || role === 'school_admin') ? schoolId : undefined,
        nin: (role === 'teacher' && isRegister) ? nin.trim() : undefined
      };

      if (isRegister) {
        // Validation
        if (role === 'teacher' && !nin) throw new Error('NIN is required for teachers');
        if (role === 'teacher' && !schoolId) throw new Error('Please select your school');

        // Try server register first, fallback to local
        try {
          await serverRegister(id, name.trim(), secret, method, role, extraData);
          // also register locally for offline
          user = await registerUser(id, name.trim(), secret, method, role, extraData);
        } catch (err) {
          console.warn('Server register failed, falling back to local', err);
          user = await registerUser(id, name.trim(), secret, method, role, extraData);
        }
      } else {
        // Login
        try {
          await serverLogin(id, secret, role);
          user = await login(id, secret, role);
        } catch (err) {
          console.warn('Server login failed, falling back to local', err);
          user = await login(id, secret, role);
        }
      }

      console.log('Authenticated', user);
      toast({
        title: isRegister ? "Account created" : "Welcome back",
        description: `Successfully logged in as ${user.name}`
      });

      if (role === 'teacher') navigate('/teacher');
      else if (role === 'admin' || role === 'school_admin') navigate('/admin');
      else navigate('/dashboard');

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: err?.message ?? 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegister ? 'Enter your details to register' : 'Enter your credentials to login'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <form onSubmit={doSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">{getIdentifierLabel()}</Label>
                  <Input
                    id="identifier"
                    placeholder={getIdentifierPlaceholder()}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                )}

                {isRegister && role === 'teacher' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nin">National ID (NIN)</Label>
                      <Input
                        id="nin"
                        placeholder="Enter your NIN"
                        value={nin}
                        onChange={e => setNin(e.target.value)}
                        required
                      />
                      <p className="text-[0.8rem] text-muted-foreground">Required for TMIS verification</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Select School</Label>
                      <Select onValueChange={setSchoolId} value={schoolId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_SCHOOLS.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="secret">Password</Label>
                    {!isRegister && <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>}
                  </div>
                  <Input id="secret" type="password" value={secret} onChange={e => setSecret(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isRegister ? 'Create Account' : 'Login'}
                </Button>
              </form>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-sm">
            <span className="text-muted-foreground">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <span
              className="text-primary font-semibold cursor-pointer hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setIdentifier('');
                setSecret('');
                setNin('');
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
