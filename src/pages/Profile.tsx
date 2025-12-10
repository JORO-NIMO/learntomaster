import React, { useState } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { LogOut, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-sm text-muted-foreground">{user.lin ? `LIN: ${user.lin}` : user.email}</p>
                  <Badge className="mt-2 capitalize">{user.role}</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="w-4 h-4 mr-2" />
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
