import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Eye, FileText, Loader2 } from 'lucide-react';
import { contentService } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';

const AuthoringToolPage: React.FC = () => {
  const [contentType, setContentType] = useState('all');
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [body, setBody] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await contentService.getContent();
      setContents(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    if (!title || !subject) {
      toast({ title: 'Missing fields', description: 'Title and Subject are required', variant: 'destructive' });
      return;
    }

    try {
      await contentService.createContent({
        title,
        subject,
        topic,
        description,
        objectives: objectives.split('\n'),
        content_body: body,
        type: 'Lesson', // Defaulting to Lesson for this builder
        status,
        version: '1.0'
      });
      toast({ title: `Content ${status}` });
      // Reset form
      setTitle('');
      setSubject('');
      setTopic('');
      setDescription('');
      setBody('');

      loadContent();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' });
    }
  };

  const filteredContent = contentType === 'all'
    ? contents
    : contents.filter(c => c.type?.toLowerCase() === contentType.toLowerCase());

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
          <Button size="lg" onClick={() => {
            // Scroll to builder or open modal
            window.scrollTo({ top: 500, behavior: 'smooth' });
          }}>
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
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No content found. Start creating!</div>
            ) : (
              <div className="space-y-3">
                {filteredContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{content.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">{content.type || 'Unknown'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${content.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {content.status || 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{content.subject} • v{content.version || '1.0'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        if (confirm('Are you sure?')) {
                          contentService.deleteContent(content.id).then(loadContent);
                        }
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter title" className="mt-1" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Select subject" className="mt-1" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Topic</label>
                <Input placeholder="Select topic" className="mt-1" value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Description" className="mt-1" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Learning Objectives</label>
                <Textarea placeholder="Line separated" className="mt-1" rows={3} value={objectives} onChange={e => setObjectives(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Content Body</label>
                <Textarea placeholder="Main content" className="mt-1" rows={3} value={body} onChange={e => setBody(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => handleSave('Draft')}>Save as Draft</Button>
              <Button className="flex-1" onClick={() => handleSave('Published')}>Publish</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default AuthoringToolPage;
