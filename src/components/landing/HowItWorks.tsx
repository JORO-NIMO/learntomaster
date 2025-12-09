import { Badge } from '@/components/ui/badge';

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and tell us your subjects, grade, and learning preferences. Our AI starts understanding you from day one.',
  },
  {
    number: '02',
    title: 'Take a Diagnostic',
    description: 'A quick assessment identifies your current mastery levels across competencies, helping us personalize your learning path.',
  },
  {
    number: '03',
    title: 'Learn Adaptively',
    description: 'Study interactive lessons that adjust to your pace. Get hints when stuck, extra practice where needed, and challenges when ready.',
  },
  {
    number: '04',
    title: 'Track & Master',
    description: 'Monitor your progress on the dashboard. Our AI continuously recommends what to study next for optimal mastery.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Your Journey to{' '}
            <span className="text-primary">A-Level Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple, effective process designed to maximize your learning outcomes.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-success hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 md:gap-12 animate-slide-up ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Number bubble */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-lg shadow-primary/30">
                    {step.number}
                  </div>
                </div>
                
                {/* Content */}
                <div className={`flex-1 pb-8 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-xl font-semibold font-display text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
