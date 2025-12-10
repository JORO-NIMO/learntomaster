import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { registerUser, login, getSchools, getUserRole, getCurrentUser, type UserRole } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface School {
  id: string;
  name: string;
  code: string;
}

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lin, setLin] = useState('');
  const [tmis, setTmis] = useState('');
  const [nin, setNin] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getSchools().then(setSchools);
  }, []);

  useEffect(() => {
    // Check if already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      redirectBasedOnRole(currentUser.role);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userRole = await getUserRole(session.user.id);
        redirectBasedOnRole(userRole);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectBasedOnRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'teacher':
        navigate('/teacher');
        break;
      case 'admin':
      case 'school_admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Name is required');
        if (!email.trim()) throw new Error('Email is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        if (role === 'student' && !lin.trim()) throw new Error('Learner ID (LIN) is required for students');
        if (role === 'teacher') {
          if (!tmis.trim()) throw new Error('TMIS Number is required for teachers');
          if (!nin.trim()) throw new Error('NIN is required for teachers');
          if (!schoolId) throw new Error('Please select your school');
        }

        const user = await registerUser(email, name.trim(), password, role, {
          lin: role === 'student' ? lin.trim() : undefined,
          tmis: role === 'teacher' ? tmis.trim() : undefined,
          nin: role === 'teacher' ? nin.trim() : undefined,
          school_id: schoolId || undefined
        });

        toast({
          title: "Account created",
          description: `Welcome to Learn2Master, ${user.name}!`
        });

        redirectBasedOnRole(role);
      } else {
        const user = await login(email, password);

        toast({
          title: "Welcome back",
          description: `Successfully logged in as ${user.name}`
        });

        redirectBasedOnRole(user.role);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err?.message ?? 'An unknown error occurred';
      
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (message.includes('User already registered')) {
        message = 'This email is already registered. Please login instead.';
      }

      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {isRegister && role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="lin">Learner ID (LIN)</Label>
                    <Input
                      id="lin"
                      placeholder="Enter your Learner ID"
                      value={lin}
                      onChange={e => setLin(e.target.value)}
                      required
                    />
                    <p className="text-[0.8rem] text-muted-foreground">Your unique learner identification number</p>
                  </div>
                )}

                {isRegister && role === 'teacher' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tmis">TMIS Number</Label>
                      <Input
                        id="tmis"
                        placeholder="Enter your TMIS number"
                        value={tmis}
                        onChange={e => setTmis(e.target.value)}
                        required
                      />
                    </div>
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
                          {schools.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {!isRegister && (
                      <span className="text-xs text-primary cursor-pointer hover:underline">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isRegister ? "Create a password (min 6 characters)" : "Enter your password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
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
                setEmail('');
                setPassword('');
                setName('');
                setLin('');
                setTmis('');
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
