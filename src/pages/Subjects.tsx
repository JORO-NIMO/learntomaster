import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockSubjects, mockSubjectProgress } from '@/data/mockData';
import { ArrowRight, BookOpen, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Subjects = () => {
  return (
    <>
      <Helmet>
        <title>A-Level Subjects - Learn2Master</title>
        <meta name="description" content="Explore all A-Level subjects aligned with Uganda's NCDC CBC curriculum. Mathematics, Physics, Chemistry, Biology, and more." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container px-4">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4">A-Level Curriculum</Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                All Subjects
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete coverage of Uganda's A-Level curriculum. Each subject is mapped to 
                NCDC competency indicators for comprehensive learning.
              </p>
            </div>
            
            {/* Subject grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {mockSubjects.map((subject, index) => {
                const progress = mockSubjectProgress.find(p => 
                  p.subject.toLowerCase() === subject.name.toLowerCase()
                );
                
                return (
                  <Card
                    key={subject.id}
                    variant="subject"
                    className="group animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-0">
                      {/* Colored header */}
                      <div 
                        className="h-32 flex items-center justify-center text-6xl relative overflow-hidden"
                        style={{ backgroundColor: `${subject.color}15` }}
                      >
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ 
                            background: `linear-gradient(135deg, ${subject.color}20, transparent)` 
                          }}
                        />
                        <span className="group-hover:scale-110 transition-transform duration-300 relative z-10">
                          {subject.icon}
                        </span>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold font-display text-foreground">
                            {subject.name}
                          </h3>
                          <Badge variant="subject">{subject.code}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {subject.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {progress?.lessons || 15} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            20+ hours
                          </span>
                        </div>
                        
                        {/* Progress */}
                        {progress && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Your progress</span>
                              <span className="font-medium text-foreground">{progress.progress}%</span>
                            </div>
                            <Progress value={progress.progress} size="sm" />
                          </div>
                        )}
                        
                        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Link to={`/subjects/${subject.id}`}>
                            {progress ? 'Continue Learning' : 'Start Learning'}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
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

export default Subjects;
