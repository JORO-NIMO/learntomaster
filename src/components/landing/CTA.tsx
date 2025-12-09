import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  'Free to start - no credit card required',
  'Works offline for learning anywhere',
  'AI-powered personalized recommendations',
  'Aligned with NCDC CBC curriculum',
];

export const CTA = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Transform Your
            <span className="block text-accent">A-Level Journey?</span>
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of Ugandan students already achieving better results 
            with personalized, adaptive learning.
          </p>
          
          <ul className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <li 
                key={index}
                className="flex items-center gap-2 text-primary-foreground/90 text-sm"
              >
                <CheckCircle className="w-5 h-5 text-accent" />
                {benefit}
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="accent" size="xl">
              <Link to="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/demo">
                Request School Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
