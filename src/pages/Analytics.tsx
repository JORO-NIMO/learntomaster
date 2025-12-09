import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { BarChart3, TrendingUp, Users, Award, Target, Clock } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Analytics - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Analytics</h1>
          <p className="text-muted-foreground">Track your learning progress and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Learning Hours</p>
                  <p className="text-3xl font-bold mt-2">142.5</p>
                  <p className="text-sm text-green-600 mt-1">↑ 12.5% this week</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Mastery</p>
                  <p className="text-3xl font-bold mt-2">68%</p>
                  <p className="text-sm text-green-600 mt-1">↑ 5% this month</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                  <p className="text-3xl font-bold mt-2">32</p>
                  <p className="text-sm text-blue-600 mt-1">8 pending</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', mastery: 78, color: 'bg-blue-500' },
                { subject: 'Physics', mastery: 65, color: 'bg-purple-500' },
                { subject: 'Chemistry', mastery: 72, color: 'bg-green-500' },
                { subject: 'Biology', mastery: 58, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.mastery}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.mastery}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">{day}</p>
                  <div className="h-16 bg-muted rounded flex items-end justify-center p-1">
                    <div className="w-full bg-blue-500 rounded" style={{ height: `${20 + i * 8}%` }} />
                  </div>
                  <p className="text-xs mt-2">{30 + i * 5}m</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { badge: '🎯', title: 'Master Mathematician', desc: 'Reached 80% in Mathematics' },
                { badge: '🔥', title: '7-Day Streak', desc: 'Learned for 7 consecutive days' },
                { badge: '⭐', title: 'Quick Learner', desc: 'Completed a lesson in under 10 minutes' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="text-2xl">{item.badge}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Button variant="outline" className="w-full">
          Export Analytics Report
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
