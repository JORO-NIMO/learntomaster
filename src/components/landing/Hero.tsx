import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles, BookOpen, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

export const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, hsla(168, 70%, 12%, 0.9), hsla(215, 35%, 12%, 0.95)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-slide-down">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary-foreground/20 text-primary-foreground/90 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Aligned to Uganda NCDC CBC Curriculum
            </Badge>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 animate-slide-up leading-tight">
            Master A-Level with
            <span className="block mt-2 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up stagger-1 leading-relaxed">
            Personalized adaptive learning that understands how you learn best. 
            Study offline, track your progress, and achieve mastery with 
            Uganda's smartest e-learning platform.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up stagger-2">
            <Button asChild variant="accent" size="xl">
              <Link to="/dashboard">
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-slide-up stagger-3">
            <StatItem icon={<BookOpen className="w-5 h-5" />} value="8+" label="A-Level Subjects" />
            <StatItem icon={<Users className="w-5 h-5" />} value="10,000+" label="Students" />
            <StatItem icon={<Zap className="w-5 h-5" />} value="95%" label="Pass Rate" />
            <StatItem icon={<Sparkles className="w-5 h-5" />} value="AI" label="Adaptive Learning" />
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="text-center p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
    <div className="flex justify-center mb-2 text-accent">{icon}</div>
    <div className="text-2xl md:text-3xl font-bold text-primary-foreground font-display">{value}</div>
    <div className="text-sm text-primary-foreground/70">{label}</div>
  </div>
);
