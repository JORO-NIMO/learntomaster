import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const TeacherDashboardPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('all');

  return (
    <DashboardLayout>
      <Helmet>
        <title>Teacher Dashboard - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and manage your classes</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold mt-2">145</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold mt-2">87</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Grading</p>
                  <p className="text-3xl font-bold mt-2">23</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Mastery</p>
                  <p className="text-3xl font-bold mt-2">68%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {['All Classes', 'S5A', 'S5B', 'S6A', 'S6B'].map((cls) => (
                <Button
                  key={cls}
                  variant={selectedClass === cls.toLowerCase() ? 'default' : 'outline'}
                  onClick={() => setSelectedClass(cls.toLowerCase())}
                >
                  {cls}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', completed: 156, total: 200, mastery: 78 },
                { subject: 'Physics', completed: 142, total: 200, mastery: 71 },
                { subject: 'Chemistry', completed: 165, total: 200, mastery: 82 },
                { subject: 'Biology', completed: 130, total: 200, mastery: 65 },
              ].map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.completed}/{item.total} lessons · {item.mastery}% mastery</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(item.completed / item.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Peter Mukasa', issue: 'Low mastery in Mathematics (35%)', action: 'Assign remedial lessons' },
                { name: 'Diana Mwale', issue: 'Inactive for 5 days', action: 'Send motivation message' },
                { name: 'Timothy Okoro', issue: 'Struggling with Physics', action: 'Schedule office hours' },
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.issue}</p>
                  <Button size="sm" variant="ghost" className="mt-2">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignments Due */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Quadratic Equations Project', subject: 'Mathematics', due: 'Dec 12', submitted: 32, total: 45 },
                { title: 'Photosynthesis Lab Report', subject: 'Biology', due: 'Dec 10', submitted: 38, total: 45 },
                { title: 'Chemical Reactions Quiz', subject: 'Chemistry', due: 'Dec 9', submitted: 42, total: 45 },
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-lg border">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subject} • Due {item.due}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Grade
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.submitted}/{item.total} submitted
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

export default TeacherDashboardPage;
