import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { Search, HelpCircle, BookOpen, Video, FileText, MessageSquare, AlertCircle } from 'lucide-react';

const HelpDocsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const articles = [
    { id: 1, title: 'Getting Started with Learn2Master', category: 'Getting Started', icon: <BookOpen className="w-5 h-5" />, views: 1250 },
    { id: 2, title: 'How to Access Lessons Offline', category: 'Offline Learning', icon: <AlertCircle className="w-5 h-5" />, views: 980 },
    { id: 3, title: 'Understanding Your Mastery Levels', category: 'Learning', icon: <BookOpen className="w-5 h-5" />, views: 750 },
    { id: 4, title: 'Taking Quizzes and Assessments', category: 'Assessments', icon: <FileText className="w-5 h-5" />, views: 650 },
    { id: 5, title: 'Submitting Project Work', category: 'Projects', icon: <FileText className="w-5 h-5" />, views: 520 },
    { id: 6, title: 'Troubleshooting Sync Issues', category: 'Technical', icon: <AlertCircle className="w-5 h-5" />, views: 890 },
    { id: 7, title: 'Working with Study Groups', category: 'Collaboration', icon: <MessageSquare className="w-5 h-5" />, views: 340 },
    { id: 8, title: 'Using Video Lessons Effectively', category: 'Learning', icon: <Video className="w-5 h-5" />, views: 1100 },
  ];

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Helmet>
        <title>Help & Documentation - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help & Documentation</h1>
          <p className="text-muted-foreground">Find answers and learn how to use Learn2Master</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Help Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3">
                <HelpCircle className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <p className="font-medium">Getting Started</p>
                  <p className="text-xs text-muted-foreground">First time? Start here</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <AlertCircle className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-xs text-muted-foreground">Learn without internet</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <MessageSquare className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <p className="font-medium">Contact Support</p>
                  <p className="text-xs text-muted-foreground">Get help from our team</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredArticles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition">
                  <div className="text-muted-foreground mt-1">{article.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">{article.category}</span>
                      <span className="text-xs text-muted-foreground">{article.views} views</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">→</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Articles */}
        <Card>
          <CardHeader>
            <CardTitle>All Articles ({filteredArticles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground mt-1">{article.icon}</div>
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.category}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Read</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { q: 'How do I download content for offline learning?', a: 'Go to any lesson and click the download button. Content will be available offline automatically.' },
              { q: 'How are my competency levels calculated?', a: 'We use an adaptive algorithm that considers your attempts, time spent, and assessment scores.' },
              { q: 'Can I share my account?', a: 'No, each learner must have their own account with a unique LIN for data integrity.' },
              { q: 'How often is new content added?', a: 'New lessons and assessments are added weekly by our curriculum team.' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <p className="font-medium mb-2">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Contact our support team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="w-full">
                Email Support
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpDocsPage;
