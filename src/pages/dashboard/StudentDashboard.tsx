import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, BookOpen, Target, Sparkles, AlertCircle } from 'lucide-react';
import { CompetencyRadar } from '@/components/dashboard/CompetencyRadar';
import { useToast } from "@/hooks/use-toast";


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
                // Show result in a nice modal (using state for now via simple alert/toast expansion or state var)
                // For now, let's just log it and show a summary toast, but ideally we setAssessmentData(data)
                console.log("AOI Generated:", data);
                toast({
                    title: "Activity Ready: " + (data.scenario ? "Scenario Based" : "Quiz"),
                    description: "Check the console for the full NCDC Activity (Scenario + Rubric)."
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
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                    <p className="text-muted-foreground">Your AI-powered adaptive learning path</p>
                </div>
                <Button onClick={fetchProfile} variant="outline">Refresh Data</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Learning Style</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile?.learning_style || 'Visual'}</div>
                        <p className="text-xs text-muted-foreground">AI-detected preference</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mastery Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">68%</div>
                        <p className="text-xs text-muted-foreground">+5% from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Algebra II</div>
                        <p className="text-xs text-muted-foreground">Recommended by AI</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Competency Map (CBC)</CardTitle>
                        <CardDescription>Your mastery across different subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CompetencyRadar data={radarData} />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>AI Recommendations</CardTitle>
                        <CardDescription>Personalized content based on your gaps</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg bg-accent/10 flex gap-4 items-start">
                            <div className="bg-primary/20 p-2 rounded-full"><Brain className="h-5 w-5 text-primary" /></div>
                            <div>
                                <h4 className="font-semibold">Review: Quadratic Equations</h4>
                                <p className="text-sm text-muted-foreground">Based on your recent quiz performance (45%)</p>
                                <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="secondary">Watch Video</Button>
                                    <Button size="sm">Start Practice</Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-accent/10 flex gap-4 items-start">
                            <div className="bg-primary/20 p-2 rounded-full"><BookOpen className="h-5 w-5 text-primary" /></div>
                            <div>
                                <h4 className="font-semibold">Advance: Physics Mechanics</h4>
                                <p className="text-sm text-muted-foreground">You've mastered the basics! Try a project.</p>
                                <Button size="sm" className="mt-2">View Project</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Adaptive Assessment Zone</CardTitle>
                    <CardDescription>Generate quizzes tailored to your level</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-secondary/20 rounded-lg">
                        <div>
                            <h3 className="text-lg font-semibold">Ready to test your knowledge?</h3>
                            <p className="text-muted-foreground">AI will generate questions specifically for your weak areas.</p>
                        </div>
                        <Button size="lg" onClick={generateAssessment} disabled={generating}>
                            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {generating ? 'AI Generating...' : 'Start Smart Quiz'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
