import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, BookOpen, Target, Sparkles, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { CompetencyRadar } from '@/components/dashboard/CompetencyRadar';
import { useToast } from "@/hooks/use-toast";
import { SubjectProgressCard } from '@/components/dashboard/SubjectProgressCard';
import { Achievements } from '@/components/dashboard/Achievements';
import { Badge } from '@/components/ui/badge';

interface LearnerProfile {
    mastery_level: Record<string, number>;
    learning_style: string;
    strengths: string[];
    weaknesses: string[];
}

export default function StudentDashboard() {
    const [profile, setProfile] = useState<LearnerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [assessmentData, setAssessmentData] = useState<any>(null);
    const [showAssessment, setShowAssessment] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
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
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateAssessment = async () => {
        setGenerating(true);
        toast({ title: "AI is creating your Activity of Integration", description: "Generating NCDC Scenario..." });

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/assess`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: 'Statistics',
                    competency: 'MTH-STAT-01',
                    difficulty: 2
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("AOI Generated:", data);
                setAssessmentData(data);
                setShowAssessment(true);
                toast({
                    title: "Activity Ready",
                    description: "Your personalized assessment has been generated."
                });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Error", variant: "destructive" });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    // Transform mastery for chart
    const radarData = profile ? Object.entries(profile.mastery_level).map(([k, v]) => ({
        subject: k.split('-')[1] || k, // Extract subject from code MTH-ALG
        mastery: v,
        fullMark: 1
    })) : [
        { subject: 'Math', mastery: 0.6, fullMark: 1 },
        { subject: 'Physics', mastery: 0.4, fullMark: 1 },
        { subject: 'Bio', mastery: 0.8, fullMark: 1 },
        { subject: 'Chem', mastery: 0.5, fullMark: 1 },
        { subject: 'Hist', mastery: 0.7, fullMark: 1 },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's your AI-powered learning overview.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchProfile} variant="outline" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Refresh Stats
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Learning Style</CardTitle>
                        <Brain className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{profile?.learning_style || 'Visual'}</div>
                        <p className="text-xs text-blue-600/80">AI-detected preference</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Mastery Score</CardTitle>
                        <Target className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">68%</div>
                        <p className="text-xs text-green-600/80">+5% from last week</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Study Streak</CardTitle>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">12 Days</div>
                        <p className="text-xs text-amber-600/80">Keep it up!</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Next Goal</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700">Algebra II</div>
                        <p className="text-xs text-purple-600/80">Recommended by AI</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress & Competency */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="col-span-1 h-full">
                            <CardHeader>
                                <CardTitle>Competency Map (CBC)</CardTitle>
                                <CardDescription>Your mastery across different subjects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CompetencyRadar data={radarData} />
                            </CardContent>
                        </Card>

                        <div className="col-span-1 h-full">
                            <SubjectProgressCard />
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                AI Recommendations
                            </CardTitle>
                            <CardDescription>Personalized content based on your gaps</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors flex gap-4 items-start cursor-pointer">
                                <div className="bg-white p-2 rounded-full shadow-sm border"><Brain className="h-5 w-5 text-primary" /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-semibold text-slate-900">Review: Quadratic Equations</h4>
                                        <Badge variant="secondary" className="text-xs">High Priority</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Based on your recent quiz performance (45%)</p>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm" variant="default" className="h-8">Start Practice</Button>
                                        <Button size="sm" variant="outline" className="h-8">Watch Video</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors flex gap-4 items-start cursor-pointer">
                                <div className="bg-white p-2 rounded-full shadow-sm border"><BookOpen className="h-5 w-5 text-green-600" /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-semibold text-slate-900">Advance: Physics Mechanics</h4>
                                        <Badge variant="outline" className="text-xs">Project</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">You've mastered the basics! Try a real-world project.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-8">
                    <Achievements />
                    
                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Adaptive Assessment</CardTitle>
                            <CardDescription className="text-slate-400">Generate quizzes tailored to your level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-300">
                                    AI will generate questions specifically for your weak areas in <span className="font-semibold text-white">Statistics</span>.
                                </p>
                                <Button size="lg" onClick={generateAssessment} disabled={generating} className="w-full bg-white text-slate-900 hover:bg-slate-100">
                                    {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {generating ? 'AI Generating...' : 'Start Smart Quiz'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Activity of Integration</DialogTitle>
                        <DialogDescription>
                            Based on NCDC Competency: {assessmentData?.competency || 'Statistics'}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <h3 className="font-semibold text-lg mb-2 text-slate-900">Scenario</h3>
                                <p className="text-slate-700 whitespace-pre-wrap">{assessmentData?.scenario}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                                <p className="text-slate-700 whitespace-pre-wrap">{assessmentData?.instructions}</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-1">Expected Output</h4>
                                    <p className="text-sm text-blue-800">{assessmentData?.expected_output}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="font-medium text-green-900 mb-1">Generic Skills</h4>
                                    <p className="text-sm text-green-800">Critical Thinking, Communication</p>
                                </div>
                            </div>

                            {assessmentData?.rubric && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Scoring Rubric</h3>
                                    <div className="grid gap-2">
                                        {Object.entries(assessmentData.rubric).map(([key, value]) => (
                                            <div key={key} className="flex gap-4 items-start p-2 border rounded">
                                                <Badge variant="outline" className="w-20 justify-center shrink-0">
                                                    {key.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                                <p className="text-sm text-slate-600">{String(value)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAssessment(false)}>Close</Button>
                        <Button onClick={() => {
                            setShowAssessment(false);
                            toast({ title: "Saved", description: "Activity saved to your portfolio." });
                        }}>Save to Portfolio</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
