import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Wifi, 
  Target, 
  BarChart3, 
  BookMarked, 
  Clock,
  Smartphone,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI-Powered Adaptation',
    description: 'Our intelligent engine learns your strengths and weaknesses, adapting content difficulty and pacing just for you.',
    color: 'text-primary',
  },
  {
    icon: <Wifi className="w-8 h-8" />,
    title: 'Works Offline',
    description: 'Download lessons and continue learning without internet. Perfect for areas with limited connectivity.',
    color: 'text-success',
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'CBC Competency Tracking',
    description: 'Every lesson and assessment is mapped to NCDC competency indicators for complete curriculum coverage.',
    color: 'text-accent',
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Real-time Analytics',
    description: 'Visual dashboards show your progress, mastery levels, and areas needing attention.',
    color: 'text-primary',
  },
  {
    icon: <BookMarked className="w-8 h-8" />,
    title: 'Interactive Lessons',
    description: 'Engaging video, text, and interactive content designed for how Ugandan students learn best.',
    color: 'text-success',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Smart Scheduling',
    description: 'AI recommends optimal study times and creates personalized revision schedules.',
    color: 'text-accent',
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Mobile-First Design',
    description: 'Optimized for smartphones and tablets - learn anywhere, anytime.',
    color: 'text-primary',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Teacher Dashboard',
    description: 'Teachers can monitor class progress, identify struggling students, and provide targeted support.',
    color: 'text-success',
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Learning Designed for{' '}
            <span className="text-primary">Your Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built specifically for Uganda's A-Level curriculum with features that address 
            real challenges students and teachers face every day.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="feature"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold font-display text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
