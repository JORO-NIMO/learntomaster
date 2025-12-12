import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target, Medal, Crown, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AchievementsProps {
    profile?: any;
}

export const Achievements = ({ profile }: AchievementsProps) => {
    // Calculate achievements based on profile data
    const masteryCount = profile?.mastery_level ? Object.values(profile.mastery_level).filter((v: any) => v >= 0.8).length : 0;
    
    const achievements = [
        { title: 'Early Bird', description: 'Completed a lesson before 8 AM', icon: <Star className="w-5 h-5 text-yellow-500" />, progress: 100, unlocked: true },
        { title: 'Master Mind', description: 'Master 3 Competencies', icon: <Brain className="w-5 h-5 text-blue-500" />, progress: (masteryCount / 3) * 100, unlocked: masteryCount >= 3 },
        { title: 'Streak Master', description: '7 Day Learning Streak', icon: <Flame className="w-5 h-5 text-orange-500" />, progress: 42, unlocked: false },
        { title: 'Quiz Champion', description: 'Complete 50 Quizzes', icon: <Trophy className="w-5 h-5 text-purple-500" />, progress: 20, unlocked: false },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {achievements.map((achievement, i) => (
                        <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${achievement.unlocked ? 'bg-yellow-50 border-yellow-100' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-white shadow-sm' : 'bg-slate-200 grayscale'}`}>
                                {achievement.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className={`font-medium text-sm ${achievement.unlocked ? 'text-yellow-900' : 'text-slate-700'}`}>
                                        {achievement.title}
                                    </h4>
                                    {achievement.unlocked && <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 text-[10px] h-5">Unlocked</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                                {!achievement.unlocked && (
                                    <Progress value={Math.min(100, achievement.progress)} className="h-1.5" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

function Brain({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    )
}
