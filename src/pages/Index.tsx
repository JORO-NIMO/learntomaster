import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { SubjectShowcase } from '@/components/landing/SubjectShowcase';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Learn2Master - AI-Powered A-Level E-Learning for Uganda</title>
        <meta name="description" content="Master A-Level with personalized adaptive learning. AI-powered lessons aligned to Uganda's NCDC CBC curriculum. Study offline, track progress, achieve mastery." />
      </Helmet>
      
      <div className="min-h-screen">
        <Navbar variant="transparent" />
        <Hero />
        <Features />
        <SubjectShowcase />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
