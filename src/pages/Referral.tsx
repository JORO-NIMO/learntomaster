import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { Share2, Users, TrendingUp, Gift, Copy, CheckCircle } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'LEARN2M-ABC123';
  const referralLink = `https://learn2master.ug/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Referral Program - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and earn rewards together</p>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-3xl font-bold mt-2">8</p>
                  <p className="text-sm text-green-600 mt-1">2 this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rewards Earned</p>
                  <p className="text-3xl font-bold mt-2">4,200 XP</p>
                  <p className="text-sm text-green-600 mt-1">850 XP pending</p>
                </div>
                <Gift className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold mt-2">87.5%</p>
                  <p className="text-sm text-green-600 mt-1">↑ 15% from target</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Your Referral Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
              <p className="text-sm font-medium mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-background rounded font-mono text-lg">{referralLink}</code>
                <Button size="sm" onClick={handleCopy} variant="outline">
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="w-full">Share on WhatsApp</Button>
              <Button className="w-full">Share on Facebook</Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium">Share Your Code</p>
                <p className="text-sm text-muted-foreground">Send your referral link to friends and classmates</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium">They Sign Up</p>
                <p className="text-sm text-muted-foreground">Your friend registers using your referral link</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium">Earn Rewards</p>
                <p className="text-sm text-muted-foreground">Both of you get 500 bonus XP when they complete first lesson</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'John Akello', date: 'Dec 5, 2025', status: 'Active', reward: '500 XP' },
                { name: 'Sarah Achieng', date: 'Dec 3, 2025', status: 'Active', reward: '500 XP' },
                { name: 'Moses Okello', date: 'Nov 28, 2025', status: 'Active', reward: '500 XP' },
                { name: 'Grace Lira', date: 'Nov 20, 2025', status: 'Pending', reward: '0 XP' },
              ].map((ref) => (
                <div key={ref.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{ref.name}</p>
                    <p className="text-sm text-muted-foreground">{ref.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${ref.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {ref.status}
                    </p>
                    <p className="text-sm text-muted-foreground">{ref.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'Emmanuel Kakooza', refs: 15, reward: '7,500 XP', badge: '🏆' },
                { rank: 2, name: 'Stella Namwase', refs: 12, reward: '6,000 XP', badge: '🥈' },
                { rank: 3, name: 'Robert Mbalire', refs: 10, reward: '5,000 XP', badge: '🥉' },
                { rank: 4, name: 'Your Name', refs: 8, reward: '4,000 XP', badge: '📍' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.badge}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.refs} referrals</p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">{item.reward}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReferralPage;
