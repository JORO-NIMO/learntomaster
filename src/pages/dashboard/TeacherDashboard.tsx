import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, BarChart3, BookOpen, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolService } from '@/lib/schoolService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';

// Import new components (relative to this file in dashboard/)
import TeacherAnalytics from './TeacherAnalytics';
import LessonPlanner from './LessonPlanner';
import AssignmentManager from './AssignmentManager';

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Lesson Planner
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Classes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
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
              
              {/* Add Class Card (Empty State) */}
              {classes.length === 0 && !loading && (
                <Card className="border-dashed flex flex-col items-center justify-center p-6 h-[200px]">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">No classes yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first class to get started</p>
                    <Button variant="outline" onClick={() => setCreateOpen(true)}>
                      Create Class
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <TeacherAnalytics />
          </TabsContent>

          <TabsContent value="planning">
            <LessonPlanner />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
