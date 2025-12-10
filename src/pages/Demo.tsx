import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { CheckCircle, School } from 'lucide-react';

const Demo = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to an API
        setSubmitted(true);
    };

    return (
        <>
            <Helmet>
                <title>Request Demo - Learn2Master</title>
                <meta name="description" content="Request a school demo of the Learn2Master platform." />
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                                <School className="w-4 h-4" />
                                <span className="text-sm font-medium">For Schools & Institutions</span>
                            </div>
                            <h1 className="text-4xl font-display font-bold mb-6">
                                See Learn2Master in Action
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Schedule a personalized demo to see how our platform can transform teaching and learning in your school.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Walkthrough of the Teacher Dashboard",
                                    "Student performance tracking tools",
                                    "Curriculum alignment preview",
                                    "Q&A with our education specialists"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle>Request a Demo</CardTitle>
                                <CardDescription>Fill out the form below and we'll be in touch within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Request Received!</h3>
                                        <p className="text-muted-foreground">
                                            Thank you for your interest. One of our specialists will contact you shortly to schedule your demo.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" required placeholder="John" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" required placeholder="Doe" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">School Email</Label>
                                            <Input id="email" type="email" required placeholder="john@school.edu.ug" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="school">School Name</Label>
                                            <Input id="school" required placeholder="Kampala High School" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="role">Job Title</Label>
                                            <Input id="role" required placeholder="Head of Department" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Anything specific you'd like to see?</Label>
                                            <Textarea id="message" placeholder="I'm interested in..." />
                                        </div>

                                        <Button type="submit" className="w-full" size="lg">
                                            Schedule Demo
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Demo;
