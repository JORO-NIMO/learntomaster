import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { dashboardService, DashboardRecommendation, DashboardStats } from '@/lib/dashboardService';
import { getCurrentUser } from '@/lib/auth';

export const WelcomeCard = () => {
  const greeting = getGreeting();
  const user = getCurrentUser();
  const firstName = user?.name?.split(' ')[0] || 'Learner';

  const [stats, setStats] = useState<DashboardStats>({
    streak: 0,
    totalXp: 0,
    lessonsDone: 0,
    quizzesPassed: 0,
    overallMastery: 0,
    dailyGoalMinutes: 45,
  });
  const [topRecommendation, setTopRecommendation] = useState<DashboardRecommendation | null>(null);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(() => undefined);
    dashboardService.getTopRecommendation().then(setTopRecommendation).catch(() => setTopRecommendation(null));
  }, []);

  const strokeDasharray = useMemo(() => `${Math.max(0, Math.min(100, stats.overallMastery)) * 3.52} 352`, [stats.overallMastery]);

  return (
    <Card variant="feature" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">AI Recommendation</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              {greeting}, {firstName}!
            </h1>

            <p className="text-muted-foreground mb-4">
              {topRecommendation?.reason || 'Ready to continue your learning journey?'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-primary" />
                <span>Daily goal: {stats.dailyGoalMinutes} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>Est. time: {topRecommendation?.estimatedTime || 30} min</span>
              </div>
            </div>

            <Button asChild size="lg">
              <Link to="/dashboard/learn">
                Continue Learning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--success))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-bold text-foreground">{stats.overallMastery}%</span>
                <span className="text-xs text-muted-foreground">Mastery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
