import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockSubjects, mockMathTopics, mockLessons, mockProgress } from '@/data/mockData';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Lock, 
  Play,
  Trophy,
  Target
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const subject = mockSubjects.find(s => s.id === subjectId);
  const topics = mockMathTopics; // Using math topics as example
  
  if (!subject) {
    return <div>Subject not found</div>;
  }
  
  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'master': return 'text-success';
      case 'proficient': return 'text-primary';
      case 'developing': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{subject.name} - Learn2Master</title>
        <meta name="description" content={subject.description} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container px-4">
            {/* Back button */}
            <Link 
              to="/subjects" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Subjects
            </Link>
            
            {/* Subject header */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">{subject.code}</Badge>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                      {subject.name}
                    </h1>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  {subject.description}
                </p>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span><strong>5</strong> Topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span><strong>120+</strong> Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span><strong>45</strong> Competencies</span>
                  </div>
                </div>
              </div>
              
              {/* Progress card */}
              <Card variant="feature">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${mockProgress.overallMastery * 2.51} 251`}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-display font-bold">
                          {mockProgress.overallMastery}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Mastery</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold text-foreground">2/5</p>
                      <p className="text-xs text-muted-foreground">Topics Completed</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold text-foreground">8</p>
                      <p className="text-xs text-muted-foreground">Lessons Done</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Topics list */}
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Topics
            </h2>
            
            <div className="space-y-4">
              {topics.map((topic, index) => {
                const topicProgress = mockProgress.topicProgresses.find(tp => tp.topicId === topic.id);
                const isLocked = index > 2; // Lock topics after the first 3 for demo
                const isCompleted = topicProgress?.masteryScore && topicProgress.masteryScore >= 80;
                
                return (
                  <Card 
                    key={topic.id}
                    variant={isLocked ? "outline" : "interactive"}
                    className={cn(
                      "transition-all",
                      isLocked && "opacity-60"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Status icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                          isCompleted ? "bg-success/10 text-success" :
                          isLocked ? "bg-muted text-muted-foreground" :
                          "bg-primary/10 text-primary"
                        )}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : isLocked ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold font-display text-foreground">
                              {topic.name}
                            </h3>
                            {topicProgress && (
                              <Badge variant={
                                topicProgress.masteryLevel === 'master' ? 'master' :
                                topicProgress.masteryLevel === 'proficient' ? 'proficient' :
                                topicProgress.masteryLevel === 'developing' ? 'developing' :
                                'novice'
                              }>
                                {topicProgress.masteryLevel}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {topic.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {mockLessons.filter(l => l.topicId === topic.id).length || 5} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {topic.estimatedHours}h
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress & Action */}
                        <div className="flex items-center gap-4">
                          {topicProgress && !isLocked && (
                            <div className="w-24 hidden sm:block">
                              <div className="text-xs text-muted-foreground mb-1 text-right">
                                {topicProgress.masteryScore}%
                              </div>
                              <Progress value={topicProgress.masteryScore} size="sm" />
                            </div>
                          )}
                          
                          <Button
                            variant={isLocked ? "outline" : "default"}
                            size="sm"
                            disabled={isLocked}
                            asChild={!isLocked}
                          >
                            {isLocked ? (
                              <span>Locked</span>
                            ) : (
                              <Link to={`/subjects/${subjectId}/topic/${topic.id}`}>
                                {topicProgress ? 'Continue' : 'Start'}
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default SubjectDetail;
