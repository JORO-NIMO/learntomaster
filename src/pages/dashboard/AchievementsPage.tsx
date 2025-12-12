import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Achievements } from '@/components/dashboard/Achievements';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Trophy, Medal, Crown, Star, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AchievementsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: session.user.id })
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>Achievements - Learn2Master</title>
            </Helmet>
            
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Achievements & Badges</h1>
                    <p className="text-muted-foreground">Track your milestones and compete with peers.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Main Achievements List */}
                    <div className="space-y-6">
                        <Achievements profile={profile} />
                    </div>

                    {/* Leaderboard & Stats */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-yellow-500" />
                                    Weekly Leaderboard
                                </CardTitle>
                                <CardDescription>Top learners this week</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: 'Sarah K.', points: 2450, rank: 1, avatar: '' },
                                    { name: 'John M.', points: 2100, rank: 2, avatar: '' },
                                    { name: 'David O.', points: 1950, rank: 3, avatar: '' },
                                    { name: 'You', points: 1200, rank: 12, avatar: '' },
                                    { name: 'Grace L.', points: 1150, rank: 13, avatar: '' },
                                ].map((user, i) => (
                                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${user.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {user.rank}
                                            </div>
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className={`text-sm font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>{user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-bold">{user.points}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Medal className="w-5 h-5 text-blue-500" />
                                    Your Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-700">12</div>
                                    <div className="text-xs text-blue-600">Badges Earned</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-700">Top 15%</div>
                                    <div className="text-xs text-purple-600">Global Rank</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-700">450</div>
                                    <div className="text-xs text-green-600">Total Quizzes</div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-orange-700">85h</div>
                                    <div className="text-xs text-orange-600">Learning Time</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
