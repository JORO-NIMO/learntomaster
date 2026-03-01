import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { schoolService } from '@/lib/schoolService';

export const SubjectShowcase = () => {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    schoolService.getClasses()
      .then((data) => setSubjects((data.classes || data || []).slice(0, 6)))
      .catch(() => setSubjects([]));
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">Curriculum Coverage</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Subjects Built from Live Curriculum Data</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{subject.description || 'No description available.'}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/subjects">Explore <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
