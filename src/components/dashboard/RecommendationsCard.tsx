import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRecommendations } from '@/data/mockData';
import { getCurrentUser } from '@/lib/auth';
import { getRecommendationsForUser } from '@/lib/ai';
import { useEffect, useState } from 'react';
import { BookOpen, Target, RefreshCw, Sparkles, Clock, ArrowRight } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'lesson':
      return <BookOpen className="w-4 h-4" />;
    case 'practice':
      return <Target className="w-4 h-4" />;
    case 'review':
      return <RefreshCw className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'accent';
    case 'medium':
      return 'default';
    default:
      return 'secondary';
  }
};

export const RecommendationsCard = () => {
  const [recs, setRecs] = useState(() => mockRecommendations);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    getRecommendationsForUser(u.lin).then(r => setRecs(r)).catch(() => setRecs(mockRecommendations));
  }, []);

  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recs.map((rec, index) => (
          <div
            key={index}
            className="group p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shrink-0">
                {getIcon(rec.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {rec.type}
                  </span>
                  <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {rec.reason}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {rec.estimatedTime} min
                </div>
              </div>
              
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-2">
          View More Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};
