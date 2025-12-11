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
    { subject: 'Chem', mastery: 68, avg: 60, fullMark: 100 },
    { subject: 'Bio', mastery: 90, avg: 70, fullMark: 100 },
    { subject: 'Hist', mastery: 75, avg: 62, fullMark: 100 },
    { subject: 'Geo', mastery: 82, avg: 58, fullMark: 100 },
];

const AnalyticsPage: React.FC = () => {
    return (
        <DashboardLayout>
            <Helmet>
                <title>Analytics - Learn2Master</title>
            </Helmet>
            
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                        <p className="text-muted-foreground">Deep dive into your learning patterns and mastery.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Last 7 Days
                        </Button>
                        <Button>
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Total Learning Hours</p>
                                    <p className="text-3xl font-bold mt-2 text-blue-700">142.5</p>
                                    <div className="flex items-center mt-1 text-sm text-blue-600">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        <span>+12.5% this week</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-900">Overall Mastery</p>
                                    <p className="text-3xl font-bold mt-2 text-green-700">78%</p>
                                    <div className="flex items-center mt-1 text-sm text-green-600">
                                        <Target className="w-4 h-4 mr-1" />
                                        <span>Top 15% of class</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-900">Total XP Earned</p>
                                    <p className="text-3xl font-bold mt-2 text-purple-700">12,450</p>
                                    <div className="flex items-center mt-1 text-sm text-purple-600">
                                        <Zap className="w-4 h-4 mr-1" />
                                        <span>+850 today</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Focus Score</p>
                                    <p className="text-3xl font-bold mt-2 text-amber-700">8.5/10</p>
                                    <div className="flex items-center mt-1 text-sm text-amber-600">
                                        <Brain className="w-4 h-4 mr-1" />
                                        <span>High consistency</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-full">
                                    <Brain className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Activity Chart */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Learning Activity</CardTitle>
                            <CardDescription>Hours spent and XP earned over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Area yAxisId="left" type="monotone" dataKey="hours" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHours)" name="Hours" />
                                        <Area yAxisId="right" type="monotone" dataKey="xp" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorXp)" name="XP" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subject Mastery Radar */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Subject Mastery</CardTitle>
                            <CardDescription>Your performance vs class average</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar name="You" dataKey="mastery" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                                        <Radar name="Average" dataKey="avg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                                        <Legend />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Strongest Competencies</CardTitle>
                            <CardDescription>Areas where you are excelling</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Calculus: Integration', score: 95, subject: 'Math' },
                                { name: 'Cell Biology', score: 92, subject: 'Biology' },
                                { name: 'Mechanics: Forces', score: 88, subject: 'Physics' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div>
                                        <p className="font-semibold text-green-900">{item.name}</p>
                                        <p className="text-xs text-green-700">{item.subject}</p>
                                    </div>
                                    <Badge className="bg-green-500 hover:bg-green-600">{item.score}%</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Areas for Improvement</CardTitle>
                            <CardDescription>Focus here to boost your grades</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Organic Chemistry', score: 45, subject: 'Chemistry' },
                                { name: 'Statistics: Probability', score: 52, subject: 'Math' },
                                { name: 'World History: WWII', score: 58, subject: 'History' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div>
                                        <p className="font-semibold text-red-900">{item.name}</p>
                                        <p className="text-xs text-red-700">{item.subject}</p>
                                    </div>
                                    <Button size="sm" variant="destructive" className="h-7 text-xs">Practice</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;
