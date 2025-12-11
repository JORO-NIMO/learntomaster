import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Award, 
    Target, 
    Clock, 
    Zap, 
    Brain, 
    ArrowUpRight,
    Calendar
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const activityData = [
    { name: 'Mon', hours: 2.5, xp: 150 },
    { name: 'Tue', hours: 3.8, xp: 220 },
    { name: 'Wed', hours: 1.5, xp: 80 },
    { name: 'Thu', hours: 4.2, xp: 300 },
    { name: 'Fri', hours: 3.0, xp: 180 },
    { name: 'Sat', hours: 5.5, xp: 450 },
    { name: 'Sun', hours: 2.0, xp: 120 },
];

const AnalyticsPage: React.FC = () => {
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: session.user.id })
            });

            if (res.ok) {
                const profile = await res.json();
                if (profile.mastery_level) {
                    const mapped = Object.entries(profile.mastery_level).map(([key, value]) => ({
                        subject: key.split('-')[1] || key,
                        mastery: (value as number) * 100,
                        avg: 60, // Mock average
                        fullMark: 100
                    }));
                    setSubjectData(mapped);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>Analytics - Learn2Master</title>
            </Helmet>
            
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                        <p className="text-muted-foreground">Deep dive into your learning metrics and growth.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last 30 Days
                        </Button>
                        <Button>
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24.5h</div>
                            <p className="text-xs text-muted-foreground">+12% from last week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Competencies Mastered</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subjectData.filter(s => s.mastery >= 80).length}</div>
                            <p className="text-xs text-muted-foreground">Out of {subjectData.length} tracked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12 Days</div>
                            <p className="text-xs text-muted-foreground">Best: 15 Days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Top 10%</div>
                            <p className="text-xs text-muted-foreground">92nd Percentile</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="subjects">Subject Breakdown</TabsTrigger>
                        <TabsTrigger value="trends">Learning Trends</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Study Activity</CardTitle>
                                    <CardDescription>Hours spent learning per day</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={activityData}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                                            <Tooltip />
                                            <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Subject Mastery</CardTitle>
                                    <CardDescription>Current proficiency levels</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectData.length ? subjectData : [{subject: 'None', mastery: 0, fullMark: 100}]}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                            <Radar name="Student" dataKey="mastery" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;
