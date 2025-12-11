import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Map, Target, TrendingUp, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CareerPath {
    title: string;
    match_score: number;
    reason: string;
    salary_range?: string;
    growth_outlook?: string;
}

interface CareerGuidance {
    top_careers: CareerPath[];
    recommended_subjects: string[];
    skill_gaps_to_fill: string[];
}

export default function CareerCompass() {
    const [loading, setLoading] = useState(true);
    const [guidance, setGuidance] = useState<CareerGuidance | null>(null);

    useEffect(() => {
        fetchGuidance();
    }, []);

    const fetchGuidance = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/plan/career`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: session.user.id })
            });

            if (res.ok) {
                const data = await res.json();
                // Mock additional data if missing
                const enhancedData = {
                    ...data,
                    top_careers: data.top_careers.map((c: any) => ({
                        ...c,
                        salary_range: c.salary_range || '$40k - $80k',
                        growth_outlook: c.growth_outlook || 'High (+15%)'
                    }))
                };
                setGuidance(enhancedData);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Career Compass 🧭</h1>
                    <p className="text-muted-foreground">Your AI-driven roadmap to success aligned with Vision 2040.</p>
                </div>
                <Button>
                    <Map className="mr-2 h-4 w-4" />
                    View Full Roadmap
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content - Top Matches */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" /> 
                            Top Career Matches
                        </h2>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            AI Analysis Complete
                        </Badge>
                    </div>
                    
                    <div className="space-y-4">
                        {guidance?.top_careers.map((career, i) => (
                            <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {career.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">{career.reason}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-2xl font-bold text-primary">{Math.round(career.match_score * 100)}%</div>
                                            <div className="text-xs text-muted-foreground">Match Score</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span>Skill Alignment</span>
                                            <span className="font-medium">{Math.round(career.match_score * 100)}%</span>
                                        </div>
                                        <Progress value={career.match_score * 100} className="h-2" />
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t text-sm">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span>Growth: <span className="font-medium text-slate-900">{career.growth_outlook}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Target className="h-4 w-4 text-blue-500" />
                                            <span>Salary: <span className="font-medium text-slate-900">{career.salary_range}</span></span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Roadmap Visualization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-primary" />
                                Your Career Roadmap
                            </CardTitle>
                            <CardDescription>Key milestones to reach your goal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {[
                                    { title: 'Complete A-Level Math', status: 'current', date: 'Dec 2025' },
                                    { title: 'University Application', status: 'upcoming', date: 'Jan 2026' },
                                    { title: 'Internship at Tech Firm', status: 'upcoming', date: 'Jun 2027' },
                                    { title: 'Junior Data Scientist', status: 'goal', date: '2029' },
                                ].map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                                            step.status === 'current' ? 'border-primary text-primary' : 
                                            step.status === 'goal' ? 'border-green-500 text-green-500' : 'border-slate-300 text-slate-300'
                                        }`}>
                                            {step.status === 'current' && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                            {step.status === 'goal' && <Target className="w-3 h-3" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold ${step.status === 'current' ? 'text-primary' : 'text-slate-900'}`}>
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Skills & Subjects */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-400" />
                                Recommended Subjects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {guidance?.recommended_subjects.map((subj, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-500/50">
                                        {subj}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-4">
                                *Based on university requirements for your top matches.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-red-500" />
                                Skill Gaps
                            </CardTitle>
                            <CardDescription>Focus areas to improve employability</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {guidance?.skill_gaps_to_fill.map((skill, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-red-900 text-sm">{skill}</p>
                                        <Button variant="link" className="h-auto p-0 text-xs text-red-600">
                                            Find Course <ArrowRight className="ml-1 w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
