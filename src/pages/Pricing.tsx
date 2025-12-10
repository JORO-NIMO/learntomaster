import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Building2, CheckCircle, GraduationCap, School } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <>
            <Helmet>
                <title>Pricing - Learn2Master</title>
                <meta name="description" content="Pricing information for Learn2Master. Schools should contact the Ministry of Education and Sports for access." />
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            Simple, Transparent Access
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Quality education should be accessible to everyone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Student Plan */}
                        <Card className="flex flex-col border-2">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-2xl">Individual Students</CardTitle>
                                <CardDescription>For self-driven learners</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">Free</span>
                                    <span className="text-muted-foreground"> / forever</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span>Unlimited practice questions</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span>AI Tutor assistance</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span>Progress tracking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span>Offline access</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link to="/login" className="w-full">
                                    <Button className="w-full" size="lg">Get Started Free</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* School Plan */}
                        <Card className="flex flex-col border-2 border-primary shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                                OFFICIAL PARTNER
                            </div>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mb-4">
                                    <School className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-2xl">For Schools</CardTitle>
                                <CardDescription>Comprehensive institutional access</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-2xl font-bold">Contact MOES</span>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    Learn2Master is available to schools through our partnership with the Ministry of Education and Sports (MOES).
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span>School-wide implementation</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span>Teacher training included</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span>Administrative dashboard</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span>Integration support</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" size="lg" variant="secondary">
                                    <a href="https://www.education.go.ug/" target="_blank" rel="noopener noreferrer">
                                        Visit MOES Website
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="mt-16 text-center max-w-2xl mx-auto p-6 bg-muted rounded-xl">
                        <Building2 className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Government & Partners</h3>
                        <p className="text-muted-foreground">
                            Are you a government official or education partner looking to deploy Learn2Master at scale?
                            Please <Link to="/contact" className="text-primary underline">contact us directly</Link> for tailored solutions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
