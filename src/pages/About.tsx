import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Heart, Award } from 'lucide-react';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us - Learn2Master</title>
                <meta name="description" content="Learn about our mission to transform education in Uganda through technology." />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Hero */}
                <div className="bg-primary/5 py-20">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            Transforming Education in Africa
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            We're on a mission to make high-quality, personalized education accessible to every student in Uganda and beyond.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="py-20 container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-primary" />,
                                title: "Impact First",
                                description: "We measure our success by the improved learning outcomes of the students we serve."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-danger" />,
                                title: "Student Centric",
                                description: "Every feature we build starts with the question: 'How does this help a student learn better?'"
                            },
                            {
                                icon: <Users className="w-8 h-8 text-success" />,
                                title: "Inclusive",
                                description: "We design for accessibility, ensuring our platform works even in low-connectivity areas."
                            },
                            {
                                icon: <Award className="w-8 h-8 text-accent" />,
                                title: "Excellence",
                                description: "We set high standards for our content and technology, reflecting the potential of our users."
                            }
                        ].map((value, i) => (
                            <Card key={i} className="text-center p-6 bg-card border-none shadow-md">
                                <CardContent className="pt-6">
                                    <div className="flex justify-center mb-4">{value.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Team (Placeholder) */}
                <div className="bg-muted/30 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-display font-bold mb-12">Our Team</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="group">
                                    <div className="w-48 h-48 bg-primary/10 rounded-full mx-auto mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                        {/* Placeholder Image */}
                                        <div className="w-full h-full flex items-center justify-center text-primary/40">
                                            <Users className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">Team Member {i + 1}</h3>
                                    <p className="text-sm text-muted-foreground">Co-Founder & Lead</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
