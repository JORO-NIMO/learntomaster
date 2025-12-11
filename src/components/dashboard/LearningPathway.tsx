import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, BookOpen, Brain, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface PathwayModule {
    step: number;
    title: string;
    type: 'content' | 'exercise' | 'quiz' | 'project';
    description: string;
    difficulty?: string;
}

interface Pathway {
    title: string;
    focus_competency: string;
    modules: PathwayModule[];
    status?: string;
    message?: string;
}

export const LearningPathway = () => {
    const [pathway, setPathway] = useState<Pathway | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchPathway();
    }, []);

    const fetchPathway = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/pathway`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: session.user.id })
            });

            if (res.ok) {
                const data = await res.json();
                setPathway(data);
            }
        } catch (error) {
            console.error('Error fetching pathway:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center text-muted-foreground">Loading your personalized plan...</div>;

    if (!pathway) return null;

    if (pathway.status === 'mastery') {
        return (
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200">
                <CardContent className="p-6 flex items-center gap-4">
                    <Trophy className="h-12 w-12 text-amber-500" />
                    <div>
                        <h3 className="text-lg font-bold text-amber-900">Mastery Achieved!</h3>
                        <p className="text-amber-800">{pathway.message}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl text-indigo-900">{pathway.title}</CardTitle>
                        <CardDescription>Adaptive Remedial Plan</CardDescription>
                    </div>
                    <Badge variant="secondary">{pathway.focus_competency}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-0">
                    {pathway.modules.map((module, index) => (
                        <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                            {/* Connector Line */}
                            {index !== pathway.modules.length - 1 && (
                                <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-slate-200" />
                            )}
                            
                            {/* Icon */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                                ${index === 0 ? 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-100 text-slate-400'}`}>
                                {module.type === 'content' && <BookOpen className="w-4 h-4" />}
                                {module.type === 'exercise' && <Brain className="w-4 h-4" />}
                                {module.type === 'quiz' && <CheckCircle className="w-4 h-4" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={`font-semibold ${index === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {module.title}
                                    </h4>
                                    {index === 0 && <Badge className="bg-indigo-600">Current</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                                
                                {index === 0 && (
                                    <Button size="sm" className="w-full sm:w-auto">
                                        Start Activity <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
