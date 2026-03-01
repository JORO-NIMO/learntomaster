import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import { dashboardService, WeeklyActivityItem } from '@/lib/dashboardService';

export const WeeklyActivityCard = () => {
  const [activity, setActivity] = useState<WeeklyActivityItem[]>([]);

  useEffect(() => {
    dashboardService.getWeeklyActivity().then(setActivity).catch(() => setActivity([]));
  }, []);

  const maxMinutes = useMemo(() => Math.max(1, ...activity.map((d) => d.minutes)), [activity]);
  const totalMinutes = useMemo(() => activity.reduce((acc, d) => acc + d.minutes, 0), [activity]);
  const avgMinutes = Math.round(totalMinutes / 7);

  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Activity</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-foreground">{totalMinutes}</p>
            <p className="text-xs text-muted-foreground">minutes this week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-32">
          {activity.map((day, index) => {
            const height = (day.minutes / maxMinutes) * 100;
            const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6);

            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday ? 'gradient-primary' : 'bg-secondary'
                    }`}
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily average</span>
          <span className="font-medium text-foreground">{avgMinutes} min</span>
        </div>
      </CardContent>
    </Card>
  );
};
