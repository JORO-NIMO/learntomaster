import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, TrendingUp, Target, Calendar, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { LearningPathway } from '@/components/dashboard/LearningPathway';
import { SubjectProgressCard } from '@/components/dashboard/SubjectProgressCard';
import { CompetencyRadar } from '@/components/dashboard/CompetencyRadar';
import { MasteryTracker } from '@/components/dashboard/MasteryTracker';
import { Achievements } from '@/components/dashboard/Achievements';
import { QuestLog } from '@/components/dashboard/QuestLog';
import { QuizComponent } from '@/components/learning/QuizComponent';

interface LearnerProfile {
  mastery_level: Record<string, number>;
  learning_style: string;
  strengths: string[];
  weaknesses: string[];
}

interface AssessmentData {
  competency?: string;
  scenario?: string;
  instructions?: string;
  expected_output?: string;
  rubric?: Record<string, string>;
}

const FALLBACK_RADAR = [
  { subject: 'Math', mastery: 0.6, fullMark: 1 },
  { subject: 'Physics', mastery: 0.4, fullMark: 1 },
  { subject: 'Biology', mastery: 0.8, fullMark: 1 },
  { subject: 'Chemistry', mastery: 0.5, fullMark: 1 },
  { subject: 'History', mastery: 0.7, fullMark: 1 },
];

export default function StudentDashboard() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: session.user.id }),
      });

      if (res.ok) {
        const data = (await res.json()) as LearnerProfile;
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({ variant: 'destructive', title: 'Failed to load your profile' });
    } finally {
      setLoading(false);
    }
  };

  const generateAssessment = async () => {
    setGenerating(true);
    toast({ title: 'AI is preparing your assessment', description: 'Generating a competency-based activity…' });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/assess`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'Statistics',
          competency: 'MTH-STAT-01',
          difficulty: 2,
        }),
      });

      if (!res.ok) throw new Error('Assessment generation failed');

      const data = (await res.json()) as AssessmentData;
      setAssessmentData(data);
      setShowAssessment(true);
      toast({ title: 'Assessment ready', description: 'Your personalized activity has been generated.' });
    } catch (error) {
      console.error('Assessment generation error:', error);
      toast({ variant: 'destructive', title: 'Unable to generate assessment right now' });
    } finally {
      setGenerating(false);
    }
  };

  const radarData = useMemo(() => {
    if (!profile?.mastery_level) return FALLBACK_RADAR;

    return Object.entries(profile.mastery_level).map(([competencyCode, mastery]) => ({
      subject: competencyCode.split('-')[1] || competencyCode,
      mastery,
      fullMark: 1,
    }));
  }, [profile]);

  const strongAreas = profile?.strengths?.length ?? 0;
  const weakAreas = profile?.weaknesses?.length ?? 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">A clearer view of your progress, priorities, and next actions.</p>
        </div>
        <Button onClick={fetchProfile} variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh data
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Learning style</CardDescription>
            <CardTitle className="text-2xl">{profile?.learning_style || 'Adaptive'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Strong areas</CardDescription>
            <CardTitle className="text-2xl">{strongAreas}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Priority gaps</CardDescription>
            <CardTitle className="text-2xl">{weakAreas}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next review</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-5 w-5 text-primary" />
              Today
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <LearningPathway />

          <div className="grid gap-6 lg:grid-cols-2">
            <SubjectProgressCard />
            <MasteryTracker masteryMap={profile?.mastery_level || {}} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Competency overview
              </CardTitle>
              <CardDescription>Mastery across CBC competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <CompetencyRadar data={radarData} />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick actions
              </CardTitle>
              <CardDescription>Start what matters most right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                Focus recommendation: <span className="font-medium text-foreground">Statistics remediation</span>
              </div>
              <Button className="w-full" size="lg" onClick={generateAssessment} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                {generating ? 'Generating…' : 'Start smart assessment'}
              </Button>
              <Button className="w-full" size="lg" variant="outline" onClick={() => setShowQuiz(true)}>
                Quick practice (MCQ)
              </Button>
              <Badge variant="secondary">AI-powered</Badge>
            </CardContent>
          </Card>

          <Achievements profile={profile} />
          <QuestLog profile={profile} />
        </aside>
      </section>

      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quick Practice</DialogTitle>
            <DialogDescription>Short MCQ practice to keep your momentum.</DialogDescription>
          </DialogHeader>
          <QuizComponent topic="General Science and Mathematics" onComplete={() => setShowQuiz(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
        <DialogContent className="max-h-[80vh] max-w-3xl">
          <DialogHeader>
            <DialogTitle>Activity of Integration</DialogTitle>
            <DialogDescription>
              Based on competency: {assessmentData?.competency || 'MTH-STAT-01'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-5">
              <div className="rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-1 font-semibold">Scenario</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{assessmentData?.scenario || 'No scenario returned.'}</p>
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Instructions</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{assessmentData?.instructions || 'No instructions returned.'}</p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-1 font-semibold">Expected Output</h3>
                <p className="text-sm text-muted-foreground">{assessmentData?.expected_output || 'No expected output returned.'}</p>
              </div>

              {assessmentData?.rubric && (
                <div>
                  <h3 className="mb-2 font-semibold">Rubric</h3>
                  <div className="space-y-2">
                    {Object.entries(assessmentData.rubric).map(([key, value]) => (
                      <div key={key} className="rounded-md border p-2 text-sm">
                        <span className="font-medium">{key.replace('_', ' ')}: </span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssessment(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowAssessment(false);
                toast({ title: 'Saved', description: 'Assessment saved to your portfolio.' });
              }}
            >
              Save to portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
