import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dashboardService, SubjectProgressItem } from '@/lib/dashboardService';

const getMasteryVariant = (progress: number) => {
  if (progress >= 80) return 'master';
  if (progress >= 60) return 'proficient';
  if (progress >= 40) return 'developing';
  return 'novice';
};

const getMasteryLabel = (progress: number) => {
  if (progress >= 80) return 'Master';
  if (progress >= 60) return 'Proficient';
  if (progress >= 40) return 'Developing';
  return 'Novice';
};

export const SubjectProgressCard = () => {
  const [subjects, setSubjects] = useState<SubjectProgressItem[]>([]);

  useEffect(() => {
    dashboardService.getSubjectProgress().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Subject Progress</CardTitle>
        <Link
          to="/dashboard/subjects"
          className="text-sm text-primary hover:text-primary-light transition-colors flex items-center"
        >
          View All
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-5">
        {subjects.length === 0 && (
          <p className="text-sm text-muted-foreground">No subject progress available yet.</p>
        )}
        {subjects.map((subject) => (
          <div key={subject.id} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm text-foreground">
                  {subject.subject}
                </span>
                <Badge variant={getMasteryVariant(subject.progress)} className="text-xs">
                  {getMasteryLabel(subject.progress)}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {subject.completed}/{subject.lessons} lessons
              </span>
            </div>
            <Progress
              value={subject.progress}
              size="sm"
              className="group-hover:h-3 transition-all"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
