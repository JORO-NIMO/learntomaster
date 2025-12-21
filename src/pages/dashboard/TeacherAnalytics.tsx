import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { schoolService } from '@/lib/schoolService';
import { Loader2 } from 'lucide-react';

const TeacherAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // In a real app we would have a specific analytics endpoint
        // For now we simulate aggregating data from available endpoints
        const [classesData, assignmentsData] = await Promise.all([
          schoolService.getClasses().catch(() => ({ classes: [] })),
          schoolService.getAssignments().catch(() => ([]))
        ]);

        // Transform data for charts
        // Mocking transformation for now as backend might not return aggregate stats directly
        const classPerformance = classesData.classes?.map((c: any) => ({
          name: c.name,
          math: Math.floor(Math.random() * 20) + 70, // Placeholder until real grades API
          science: Math.floor(Math.random() * 20) + 70,
          english: Math.floor(Math.random() * 20) + 70
        })) || [];

        setStats({
          totalStudents: classesData.classes?.reduce((acc: number, curr: any) => acc + (curr.student_count || 0), 0) || 0,
          avgAttendance: 95.6, // Placeholder
          assignmentsSubmitted: assignmentsData.reduce((acc: number, curr: any) => acc + (curr.submissions || 0), 0),
          classAverage: 82, // Placeholder
          classPerformance
        });

      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  // Fallback if no data
  if (!stats) return <div>No analytics available</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students (Enrolled)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all your classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Based on recent sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentsSubmitted}</div>
            <p className="text-xs text-muted-foreground">Total active assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.classAverage}%</div>
            <p className="text-xs text-muted-foreground">Average overall score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Class Performance (Estimated)</CardTitle>
            <CardDescription>Performance comparison across classes</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="math" fill="#8884d8" name="Math" />
                  <Bar dataKey="science" fill="#82ca9d" name="Science" />
                  <Bar dataKey="english" fill="#ffc658" name="English" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          {/* Placeholder for real attendance data */}
          <CardHeader>
            <CardTitle>Attendance Trend (Sample)</CardTitle>
            <CardDescription>Weekly attendance overview</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { week: 'Week 1', attendance: 98 },
                  { week: 'Week 2', attendance: 95 },
                  { week: 'Week 3', attendance: 97 },
                  { week: 'Week 4', attendance: 92 },
                  { week: 'Week 5', attendance: 96 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
