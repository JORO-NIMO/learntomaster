import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { mockSubjects } from '@/data/mockData';
import { Link } from 'react-router-dom';

export const SubjectShowcase = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">A-Level Subjects</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Complete A-Level Coverage
          </h2>
          <p className="text-lg text-muted-foreground">
            All your A-Level subjects in one place, aligned with Uganda's National Curriculum 
            Development Centre standards.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockSubjects.map((subject, index) => (
            <Card
              key={subject.id}
              variant="subject"
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-0">
                {/* Colored header */}
                <div 
                  className="h-24 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: `${subject.color}15` }}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold font-display text-foreground">
                      {subject.name}
                    </h3>
                    <Badge variant="subject" className="text-xs">
                      {subject.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {subject.description}
                  </p>
                  <Link 
                    to={`/subjects/${subject.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors inline-flex items-center"
                  >
                    Start Learning
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/subjects">
              View All Subjects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
