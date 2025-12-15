import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuizComponent } from '@/components/learning/QuizComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIAssistant from '@/components/learning/AIAssistant';
import { Progress } from '@/components/ui/progress';
import { mockLessons, mockQuizQuestions } from '@/data/mockData';
import { getCurrentUser } from '@/lib/auth';
import { lessonService, Lesson } from '@/lib/lessonService';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Lightbulb,
  Play,
  FileText,
  Loader2,
  Bookmark,
  StickyNote,
  Save
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ViewMode = 'lesson' | 'quiz';

const LearnPage = () => {
  const { lessonId } = useParams();
  const [viewMode, setViewMode] = useState<ViewMode>('lesson');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  // Smart quiz state
  const [quizTopic, setQuizTopic] = useState<string | undefined>(undefined);
  const [quizCompetency, setQuizCompetency] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return;
      setLoading(true);
      try {
        // try fetching real, fallback to mock for now if server not ready with data
        try {
          const data = await lessonService.getLesson(lessonId);
          setLesson(data);
        } catch (e) {
          console.warn('Using mock lesson data as fallback');
          // Find mock lesson or default to first
          const mock = mockLessons.find(l => l.id === lessonId) || mockLessons[0];
          setLesson(mock);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson');
        toast({ variant: "destructive", title: "Error", description: "Failed to load lesson content" });
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, [lessonId, toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lesson) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <h2 className="text-xl font-bold">Lesson not found</h2>
          <Link to="/dashboard/subjects">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Subjects</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const sections = lesson.content.sections || [];
  const currentSection = sections[currentSectionIndex] || {};

  const handleBookmark = async () => {
    try {
      const res = await lessonService.toggleBookmark(lessonId!);
      setIsBookmarked(res.bookmarked);
      toast({ title: res.bookmarked ? "Bookmarked" : "Bookmark Removed" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update bookmark" });
    }
  };

  const handleSaveNote = async () => {
    try {
      await lessonService.saveNote(lessonId!, notes);
      toast({ title: "Note Saved" });
      setIsNoteOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save note" });
    }
  };

  const handleStartSmartQuiz = (topic: string, competencyCode: string) => {
    setQuizTopic(topic);
    setQuizCompetency(competencyCode);
    setViewMode('quiz');
  };

  const handleQuizComplete = async (score: number, total: number) => {
    // Send mastery update if the lesson has competency indicators
    const competencyCode: string | undefined = (lesson.competencyIndicators && lesson.competencyIndicators[0]) || undefined;
    if (competencyCode && total > 0) {
      const percent = Math.round((score / total) * 100);
      // Fire and forget mastery update; best-effort
      import('@/lib/ai').then(mod => {
        mod.updateMastery(competencyCode, percent, 3).catch(() => {});
      });
    }
  };

  if (viewMode === 'quiz') {
    return (
      <>
        <Helmet>
          <title>Quiz: {lesson.title} - Learn2Master</title>
        </Helmet>

        <DashboardLayout>
          <div className="max-w-4xl mx-auto">
            {/* Back to lesson */}
            <button
              onClick={() => setViewMode('lesson')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lesson
            </button>

            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">Quiz</Badge>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {lesson.title}
              </h1>
            </div>

            <QuizComponent
              questions={quizTopic ? [] : mockQuizQuestions}
              topic={quizTopic}
              competencyCode={quizCompetency || (lesson.competencyIndicators && lesson.competencyIndicators[0])}
              onComplete={handleQuizComplete}
            />
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{lesson.title} - Learn2Master</title>
      </Helmet>

      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Link
            to="/dashboard/subjects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Link>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Algebra & Functions</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {lesson.duration} min
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBookmark} className={isBookmarked ? "text-yellow-500" : "text-muted-foreground"}>
                  <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
                </Button>

                <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <StickyNote className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Lesson Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Write your notes here..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <Button onClick={handleSaveNote} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              {lesson.title}
            </h1>

            <p className="text-muted-foreground">
              {lesson.description}
            </p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Lesson progress</span>
                <span className="font-medium text-foreground">
                  {currentSectionIndex + 1} of {sections.length}
                </span>
              </div>
              <Progress
                value={((currentSectionIndex + 1) / sections.length) * 100}
                size="sm"
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Lesson content */}
            <div className="lg:col-span-3">
              <Card variant="feature">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {currentSection.type === 'text' && <FileText className="w-5 h-5 text-primary" />}
                    {currentSection.type === 'example' && <Lightbulb className="w-5 h-5 text-accent" />}
                    {currentSection.type === 'interactive' && <Play className="w-5 h-5 text-success" />}
                    <CardTitle>{currentSection.title || 'Lesson Content'}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Content display */}
                  <div className="prose prose-slate max-w-none">
                    {currentSection.type === 'text' && (
                      <p className="text-foreground leading-relaxed">
                        {currentSection.content}
                      </p>
                    )}

                    {currentSection.type === 'example' && (
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <pre className="whitespace-pre-wrap text-foreground font-mono text-sm">
                          {currentSection.content}
                        </pre>
                      </div>
                    )}

                    {currentSection.type === 'interactive' && (
                      <div className="p-8 rounded-lg bg-muted text-center">
                        <Play className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Interactive element: {currentSection.content}
                        </p>
                        <Button className="mt-4">
                          Start Interactive
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                      disabled={currentSectionIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentSectionIndex < sections.length - 1 ? (
                      <Button
                        onClick={() => setCurrentSectionIndex(currentSectionIndex + 1)}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => setViewMode('quiz')}>
                        Take Quiz
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Section list */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSectionIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                        index === currentSectionIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        index < currentSectionIndex
                          ? "bg-success text-success-foreground"
                          : index === currentSectionIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                      )}>
                        {index < currentSectionIndex ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-sm truncate">
                        {section.title || `Section ${index + 1}`}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Resources */}
              {lesson.content.resources.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lesson.content.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Download className="w-4 h-4" />
                        {resource.title}
                      </a>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      <AIAssistant context={lesson.title} lessonId={lesson.id} onStartSmartQuiz={handleStartSmartQuiz} />
    </>
  );
};

export default LearnPage;
