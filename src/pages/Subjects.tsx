import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { schoolService } from '@/lib/schoolService';

const Subjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    schoolService.getClasses()
      .then((data) => setSubjects(data.classes || (Array.isArray(data) ? data : [])))
      .catch(() => setSubjects([]));
  }, []);

  return (
    <>
      <Helmet>
        <title>A-Level Subjects - Learn2Master</title>
        <meta name="description" content="Explore all A-Level subjects aligned with Uganda's NCDC CBC curriculum." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4">A-Level Curriculum</Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">All Subjects</h1>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {subjects.map((subject, index) => (
                <Card key={subject.id} variant="subject" className="group animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold font-display text-foreground">{subject.name}</h3>
                      <Badge variant="subject">{subject.code || 'SUB'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description || 'No description available'}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{subject.total_lessons || 0} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{subject.hours_estimate || 0} hours</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Your progress</span>
                        <span className="font-medium text-foreground">{subject.progress || 0}%</span>
                      </div>
                      <Progress value={subject.progress || 0} size="sm" />
                    </div>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={`/subjects/${subject.id}`}>Open Subject<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {subjects.length === 0 && <p className="text-muted-foreground col-span-full text-center">No subjects available.</p>}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Subjects;
