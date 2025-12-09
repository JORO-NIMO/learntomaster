import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react';

const AuthoringToolPage: React.FC = () => {
  const [contentType, setContentType] = useState('all');

  return (
    <DashboardLayout>
      <Helmet>
        <title>Content Authoring - Learn2Master</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Authoring Tool</h1>
            <p className="text-muted-foreground">Create and manage learning content</p>
          </div>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Button variant={contentType === 'all' ? 'default' : 'outline'} onClick={() => setContentType('all')}>
            All Content
          </Button>
          <Button variant={contentType === 'lesson' ? 'default' : 'outline'} onClick={() => setContentType('lesson')}>
            Lessons
          </Button>
          <Button variant={contentType === 'assessment' ? 'default' : 'outline'} onClick={() => setContentType('assessment')}>
            Assessments
          </Button>
          <Button variant={contentType === 'project' ? 'default' : 'outline'} onClick={() => setContentType('project')}>
            Projects
          </Button>
        </div>

        {/* Content Library */}
        <Card>
          <CardHeader>
            <CardTitle>Your Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 1, title: 'Introduction to Polynomials', type: 'Lesson', subject: 'Mathematics', status: 'Published', version: '2.1' },
                { id: 2, title: 'Algebra Quiz Week 1', type: 'Assessment', subject: 'Mathematics', status: 'Draft', version: '1.0' },
                { id: 3, title: 'Photosynthesis Lab Report', type: 'Project', subject: 'Biology', status: 'Published', version: '1.3' },
                { id: 4, title: 'Forces and Motion', type: 'Lesson', subject: 'Physics', status: 'Published', version: '1.8' },
                { id: 5, title: 'Chemical Reactions', type: 'Assessment', subject: 'Chemistry', status: 'Draft', version: '1.2' },
              ].map((content) => (
                <div key={content.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{content.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">{content.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${content.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {content.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{content.subject} • v{content.version}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lesson Title</label>
              <Input placeholder="Enter lesson title" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Select subject" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Topic</label>
                <Input placeholder="Select topic" className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Lesson description" className="mt-1" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Learning Objectives</label>
                <Textarea placeholder="List learning objectives" className="mt-1" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Content Body</label>
                <Textarea placeholder="Main lesson content" className="mt-1" rows={3} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Media Files</label>
              <Button variant="outline" className="w-full mt-1">Upload Files</Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Save as Draft</Button>
              <Button variant="outline" className="flex-1">Preview</Button>
              <Button className="flex-1">Publish</Button>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Create Assessment / Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assessment Title</label>
              <Input placeholder="Enter assessment title" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Questions</label>
              <div className="mt-2 space-y-3">
                {[1, 2].map((q) => (
                  <div key={q} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Question {q}</p>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input placeholder="Question text" className="mb-2" />
                    <Button size="sm" variant="outline" className="w-full">+ Add Answer Option</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-2">+ Add Question</Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Save as Draft</Button>
              <Button variant="outline" className="flex-1">Preview</Button>
              <Button className="flex-1">Publish</Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Versioning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Version Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { version: '2.1', date: 'Dec 5, 2025', author: 'You', changes: 'Fixed typos, updated examples' },
                { version: '2.0', date: 'Nov 28, 2025', author: 'You', changes: 'Major content update' },
                { version: '1.0', date: 'Nov 15, 2025', author: 'Sarah M.', changes: 'Initial publication' },
              ].map((v) => (
                <div key={v.version} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium">Version {v.version}</p>
                    <p className="text-sm text-muted-foreground">{v.date} by {v.author}</p>
                    <p className="text-sm text-muted-foreground">{v.changes}</p>
                  </div>
                  <Button size="sm" variant="outline">Restore</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuthoringToolPage;
