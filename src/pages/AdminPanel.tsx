import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Users, Building2, TrendingUp, Download, Settings } from 'lucide-react';

const AdminPanelPage: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState('all');

  return (
    <DashboardLayout>
      <Helmet>
        <title>Admin Panel - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">System overview and configuration</p>
          </div>
          <Button size="lg">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Schools</p>
                  <p className="text-3xl font-bold mt-2">145</p>
                  <p className="text-sm text-green-600 mt-1">↑ 8 this month</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold mt-2">12,450</p>
                  <p className="text-sm text-green-600 mt-1">↑ 3% today</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platform Uptime</p>
                  <p className="text-3xl font-bold mt-2">99.97%</p>
                  <p className="text-sm text-green-600 mt-1">Last 30 days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Load</p>
                  <p className="text-3xl font-bold mt-2">34%</p>
                  <p className="text-sm text-green-600 mt-1">Healthy</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schools Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Schools Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Kampala High School', district: 'Kampala', students: 450, teachers: 28, status: 'Active' },
                { name: 'St. Marys Secondary', district: 'Wakiso', students: 380, teachers: 22, status: 'Active' },
                { name: 'Mengo School', district: 'Kampala', students: 520, teachers: 31, status: 'Active' },
                { name: 'Kololo Secondary', district: 'Kampala', students: 410, teachers: 25, status: 'Pending' },
              ].map((school) => (
                <div key={school.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">{school.district} • {school.students} students • {school.teachers} teachers</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${school.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {school.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">2,340</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">1,250</p>
                <p className="text-sm text-muted-foreground">Assessments</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">A-Level Subjects</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">450</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
            <Button className="w-full">Manage Content Repository</Button>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { service: 'API Server', status: 'Operational', latency: '45ms' },
              { service: 'Database', status: 'Operational', latency: '2.3ms' },
              { service: 'Cache (Redis)', status: 'Operational', latency: '1.2ms' },
              { service: 'Background Workers', status: 'Operational', latency: '142ms' },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{item.service}</p>
                  <p className="text-sm text-muted-foreground">{item.latency}</p>
                </div>
                <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Create New User</p>
                <p className="text-sm text-muted-foreground">Add a new learner, teacher, or admin</p>
              </div>
              <Button size="sm">+ Add User</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Bulk Import</p>
                <p className="text-sm text-muted-foreground">Import users from CSV file</p>
              </div>
              <Button size="sm" variant="outline">Import</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download anonymized user data</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">Monthly Usage Report</Button>
            <Button variant="outline" className="w-full">Student Performance Report</Button>
            <Button variant="outline" className="w-full">Financial Summary</Button>
            <Button variant="outline" className="w-full">System Audit Log</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanelPage;
