import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Star, Shield, Map, Zap, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

// Define/Duplicate interface here to ensure self-containment without refactoring entire project types yet
interface LearnerProfile {
    mastery_level: Record<string, number>;
    learning_style: string;
    strengths: string[];
    weaknesses: string[];
}

// Mapping NCDC subjects to quests
const QUEST_TEMPLATES = [
    {
        subject: 'MTH',
        baseTitle: 'Mathematician',
        steps: ['Algebra Basics', 'Quadratic Equations', 'Calculus', 'Statistics'],
        rarity: 'rare',
        xpPerStep: 150
    },
    {
        subject: 'PHY',
        baseTitle: 'Physics Pioneer',
        steps: ['Mechanics', 'Heat', 'Waves', 'Electricity'],
        rarity: 'epic',
        xpPerStep: 200
    },
    {
        subject: 'BIO',
        baseTitle: 'Life Expert',
        steps: ['Cells', 'Genetics', 'Ecology', 'Evolution'],
        rarity: 'common',
        xpPerStep: 100
    },
    {
        subject: 'CHE',
        baseTitle: 'Alchemist',
        steps: ['Matter', 'Bonds', 'Organic', 'Acids'],
        rarity: 'rare',
        xpPerStep: 150
    }
];

interface QuestLogProps {
    profile: LearnerProfile | null;
}

export const QuestLog: React.FC<QuestLogProps> = ({ profile }) => {

    // Calculate quests based on mastery
    const quests = useMemo(() => {
        if (!profile || !profile.mastery_level) return [];

        return QUEST_TEMPLATES.map((template, idx) => {
            // Find mastery for this subject (e.g., MTH)
            // Mastery keys might be 'MTH-ALG-01'. We look for keys starting with Subject Code.
            const subjectEntries = Object.entries(profile.mastery_level)
                .filter(([k, v]) => k.startsWith(template.subject));

            const totalMasteryScore = subjectEntries.reduce((acc, [_, v]) => acc + (v as number), 0);
            const count = subjectEntries.length || 1;
            const subjectAvg = totalMasteryScore / count;
            // Note: Real world would map specific competencies to specific steps. 
            // For now, we map average mastery to "Quest Progress"

            // Calculate progress (0-100)
            const progress = Math.min(100, Math.round(subjectAvg * 100));
            const completedSteps = Math.floor((progress / 100) * template.steps.length);
            const isComplete = progress >= 100;

            // Logic: You unlock the next quest if you have some progress in the previous one, or if it's the first one.
            // Simplified: All active if they have data? Or unlock sequentially?
            // Let's make them all visible but "locked" if < 0 progress? No, let's say all active.
            const isLocked = false;

            return {
                id: template.subject,
                title: template.baseTitle,
                description: `Master all ${template.steps.length} modules in ${template.subject}.`,
                xp: template.xpPerStep * template.steps.length,
                progress: progress,
                totalSteps: template.steps.length,
                completedSteps: completedSteps,
                rarity: template.rarity as 'common' | 'rare' | 'epic',
                status: isLocked ? 'locked' : (isComplete ? 'completed' : 'active'),
                nextStep: template.steps[completedSteps] || 'Mastery Achieved'
            };
        });
    }, [profile]);

    // Calculate total level
    const totalXP = quests.reduce((acc, q) => acc + (q.completedSteps * 150), 0);
    const level = Math.floor(totalXP / 500) + 1;

    const rarityColors = {
        common: 'bg-slate-100 text-slate-600 border-slate-200',
        rare: 'bg-blue-50 text-blue-700 border-blue-200',
        epic: 'bg-purple-50 text-purple-700 border-purple-200',
        legendary: 'bg-amber-50 text-amber-700 border-amber-200'
    };

    const rarityIcons = {
        common: <Shield className="w-3 h-3" />,
        rare: <Star className="w-3 h-3" />,
        epic: <Map className="w-3 h-3" />,
        legendary: <Trophy className="w-3 h-3" />
    };

    return (
        <Card className="h-full border-2 border-indigo-100 dark:border-indigo-900 shadow-xl bg-gradient-to-br from-white to-indigo-50/20">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 shadow-sm">
                            <Map className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Quest Log</CardTitle>
                            <CardDescription className="text-xs">Campaign Operations</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 border-indigo-200 bg-indigo-50 text-indigo-700 font-bold shadow-sm">
                        <Zap className="w-3 h-3 mr-1 fill-current text-yellow-500" /> Lvl {level}
                    </Badge>
                </div>
                <Progress value={(totalXP % 500) / 5} className="h-1 bg-indigo-100" />
                <div className="text-[10px] text-right text-muted-foreground">{totalXP % 500} / 500 XP to next level</div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-3">
                        {quests.map((quest) => (
                            <div
                                key={quest.id}
                                className={`
                                    relative p-3 rounded-xl border-2 transition-all duration-200 group
                                    ${quest.status === 'locked' ? 'opacity-60 bg-slate-50 border-slate-100 grayscale' : 'bg-white hover:shadow-md border-transparent hover:border-indigo-100'}
                                    ${quest.status === 'completed' ? 'border-green-100 bg-green-50/30' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`flex items-center gap-1 text-[10px] px-2 py-0 h-5 ${rarityColors[quest.rarity]} border`}>
                                            {rarityIcons[quest.rarity]}
                                            {quest.rarity.toUpperCase()}
                                        </Badge>
                                        {quest.status === 'completed' && (
                                            <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 px-1 py-0 h-5">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {quest.status === 'completed' ? 'MAX XP' : `+${quest.xp - quest.completedSteps * 150} XP`}
                                    </div>
                                </div>

                                <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                                    {quest.title}
                                    {quest.status === 'locked' && <Lock className="w-3 h-3 text-slate-400" />}
                                </h4>

                                {quest.status !== 'locked' && quest.status !== 'completed' && (
                                    <div className="mb-2 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50/50 p-1.5 rounded-md">
                                        <ChevronRight className="w-3 h-3" />
                                        <span>Current Objective: <span className="font-semibold">{quest.nextStep}</span></span>
                                    </div>
                                )}

                                {quest.status !== 'locked' && (
                                    <div className="space-y-1 mt-2">
                                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                            <span>Progress</span>
                                            <span>{Math.round(quest.progress)}%</span>
                                        </div>
                                        <Progress
                                            value={quest.progress}
                                            className={`h-1.5 ${quest.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'}`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        {quests.length === 0 && (
                            <div className="text-center p-4 text-sm text-muted-foreground">
                                No quests available based on your profile yet. Start learning!
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
