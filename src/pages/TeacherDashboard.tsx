
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, BookOpen, TrendingUp, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolService } from '@/lib/schoolService';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';

// Simplified types for dashboard
interface Class {
  id: string;
  name: string;
  subject: string;
}

const TeacherDashboard = () => {
  // State
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await schoolService.getClasses();
        setClasses(data.classes || []);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load classes' });
        // NOTE: In production you might want to show mock data or empty state
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const handleCreateClass = async () => {
    try {
      await schoolService.createClass({ name: newClassName, subject: newClassSubject });
      toast({ title: 'Class Created' });
      setCreateOpen(false);
      // Reload classes
      const data = await schoolService.getClasses();
      setClasses(data.classes || []);
      setNewClassName('');
      setNewClassSubject('');
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create class' });
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Teacher Dashboard - Learn2Master</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Monitor student progress and manage your classes</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Add a new class to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="col-span-3"
                    placeholder="Class Name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={newClassSubject}
                    onChange={(e) => setNewClassSubject(e.target.value)}
                    className="col-span-3"
                    placeholder="Subject"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateClass}>Create Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                <CardDescription>{cls.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    0 Students
                  </div>
                </div>
                <Button className="w-full" variant="secondary" asChild>
                  <Link to={`/teacher/classes/${cls.id}`}>View Class</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button className="w-full">Create Assignment</Button>
          <Button variant="outline" className="w-full">Send Announcement</Button>
          <Button variant="outline" className="w-full">Generate Report</Button>
          <Button variant="outline" className="w-full">AI Recommendations</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
