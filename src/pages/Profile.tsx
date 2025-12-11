import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { LogOut, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: session.user.id,
                name: formData.name,
                email: formData.email
            })
        });

        if (res.ok) {
            toast({ title: "Profile Updated", description: "Your changes have been saved." });
            setIsEditing(false);
            // Ideally update local user state or re-fetch
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Profile - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback>{formData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="font-bold text-xl h-8 w-64 mb-1"
                      />
                  ) : (
                    <h1 className="text-2xl font-bold">{formData.name}</h1>
                  )}
                  <p className="text-sm text-muted-foreground">{user.lin ? `LIN: ${user.lin}` : formData.email}</p>
                  <Badge className="mt-2 capitalize">{user.role}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-2"/> Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={loading}>
                            <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                )}
              </div>

                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">School</p>
                <p className="text-sm text-muted-foreground">Your School Name</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Class</p>
                <p className="text-sm text-muted-foreground">S5 / S6</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">{user.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">68%</p>
              <p className="text-sm text-muted-foreground">Overall Mastery</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
