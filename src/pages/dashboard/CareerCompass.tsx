import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Map, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";

interface CareerPath {
    title: string;
    match_score: number;
    reason: string;
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
                method: 'POST', // or GET if modified, but POST is safe for ID payload
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: session.user.id }) // Send explicit ID or just rely on token
            });

            if (res.ok) {
                const data = await res.json();
                setGuidance(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Career Compass 🧭</h1>
                <p className="text-muted-foreground">Your Personalized Vision 2040 Career Pathway</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Matches */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center"><Briefcase className="mr-2" /> Top Career Matches</h2>
                    {guidance?.top_careers.map((career, i) => (
                        <Card key={i} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg flex justify-between">
                                    {career.title}
                                    <span className="text-sm font-normal text-muted-foreground">{Math.round(career.match_score * 100)}% Match</span>
                                </CardTitle>
                                <CardDescription>{career.reason}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={career.match_score * 100} className="h-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Strategy Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-blue-500" /> Recommended Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {guidance?.recommended_subjects.map((subj, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {subj}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-orange-500" /> Skills to Improve</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {guidance?.skill_gaps_to_fill.map((gap, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="mr-2 text-orange-500">•</span>
                                        <span className="text-sm">{gap}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
