import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MasteryItem {
    code: string;
    score: number; // 0 to 1
}

interface MasteryTrackerProps {
    masteryMap: Record<string, number>;
}

export const MasteryTracker = ({ masteryMap }: MasteryTrackerProps) => {
    const items: MasteryItem[] = Object.entries(masteryMap).map(([code, score]) => ({
        code,
        score
    })).sort((a, b) => b.score - a.score);

    const getStatusColor = (score: number) => {
        if (score >= 0.8) return "bg-green-500";
        if (score >= 0.5) return "bg-amber-500";
        return "bg-red-500";
    };

    const getStatusLabel = (score: number) => {
        if (score >= 0.8) return "Mastered";
        if (score >= 0.5) return "Developing";
        return "Needs Support";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Competency Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {items.length === 0 && <p className="text-sm text-muted-foreground">No mastery data yet.</p>}
                
                {items.map((item) => (
                    <div key={item.code} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.code}</span>
                            <span className="text-muted-foreground">{getStatusLabel(item.score)} ({Math.round(item.score * 100)}%)</span>
                        </div>
                        <Progress value={item.score * 100} className="h-2" indicatorClassName={getStatusColor(item.score)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
