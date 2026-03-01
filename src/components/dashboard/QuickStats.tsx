import { Card } from '@/components/ui/card';
import { Trophy, Flame, BookOpen, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { dashboardService, DashboardStats } from '@/lib/dashboardService';

export const QuickStats = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({
    streak: 0,
    totalXp: 0,
    lessonsDone: 0,
    quizzesPassed: 0,
    overallMastery: 0,
    dailyGoalMinutes: 45,
  });

  useEffect(() => {
    dashboardService.getStats().then(setStatsData).catch(() => undefined);
  }, []);

  const stats = useMemo(() => [
    {
      label: 'Day Streak',
      value: statsData.streak,
      icon: <Flame className="w-5 h-5" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Total XP',
      value: statsData.totalXp.toLocaleString(),
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Lessons Done',
      value: statsData.lessonsDone,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Quizzes Passed',
      value: statsData.quizzesPassed,
      icon: <Target className="w-5 h-5" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ], [statsData]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} variant="feature" className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
