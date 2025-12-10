import { Helmet } from 'react-helmet-async';
import { SubjectShowcase } from '@/components/landing/SubjectShowcase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PublicSubjects = () => {
    return (
        <>
            <Helmet>
                <title>Subjects - Learn2Master</title>
                <meta name="description" content="Explore our comprehensive collection of A-Level subjects aligned with the NCDC curriculum." />
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <main className="flex-1 pt-20">
                    <div className="bg-primary/5 py-16">
                        <div className="container mx-auto px-4 text-center">
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                                Course Catalog
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                                Dive into our expert-curated content designed to help you master every topic in the syllabus.
                            </p>
                            <Button asChild size="lg">
                                <Link to="/login">Start Learning for Free</Link>
                            </Button>
                        </div>
                    </div>

                    <SubjectShowcase />
                </main>

                <Footer />
            </div>
        </>
    );
};

export default PublicSubjects;
