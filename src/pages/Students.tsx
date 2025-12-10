import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import {
    Brain,
    Trophy,
    Target,
    Zap,
    Smartphone,
    Clock,
    CheckCircle,
    ArrowRight,
    Sparkles,
    GraduationCap,
    BookOpen,
    WifiOff
} from 'lucide-react';

const Students = () => {
    const features = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "24/7 AI Tutor",
            description: "Get instant answers to your questions, anytime, anywhere. No more getting stuck on difficult concepts."
        },
        {
            icon: <WifiOff className="w-6 h-6" />,
            title: "Offline Learning",
            description: "Download lessons and study without internet. Perfect for when data is tight or connection is poor."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Personalized Path",
            description: "Our AI adapts to your learning style, focusing on areas where you need the most improvement."
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: "Gamified Progress",
            description: "Earn badges, track your streaks, and complete challenges to make learning fun and addictive."
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "NCDC Aligned",
            description: "Study with confidence knowing all content matches the official Uganda National Curriculum."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Feedback",
            description: "Practice with quizzes and exams that give you immediate explanations and corrections."
        }
    ];

    const benefits = [
        "Improve your grades significantly",
        "Study at your own pace",
        "Access thousands of practice questions",
        "Visual & interactive lessons",
        "Join a community of learners",
        "Mobile-first design for your phone"
    ];

    return (
        <>
            <Helmet>
                <title>For Students - Learn2Master</title>
                <meta name="description" content="Master your A-Levels with Learn2Master. AI-powered tutoring, offline access, and personalized learning paths designed for Ugandan students." />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="container mx-auto px-4 py-20 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Join 10,000+ students acing their exams</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                                Your Personal AI Tutor<br />in Your Pocket
                            </h1>

                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                Master difficult concepts, practice smarter, and get the grades you deserve with Learn2Master.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                        Start Learning Free
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                                    See How It Works
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-muted/50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {[
                                { value: "10k+", label: "Active Students" },
                                { value: "50k+", label: "Quizzes Taken" },
                                { value: "92%", label: "Pass Rate" },
                                { value: "24/7", label: "AI Availability" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Supercharge Your Studies
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to excel in your A-Level examinations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, i) => (
                            <Card key={i} className="hover:shadow-lg transition-shadow border-indigo-100 dark:border-indigo-900/20">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-muted/30 py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                                    Why Top Students Choose Learn2Master
                                </h2>
                                <div className="space-y-4">
                                    {benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                                            <span className="text-lg">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Link to="/login">
                                        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                            Join for Free
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-xl"></div>
                                <Card className="relative p-8 border-2 border-indigo-100 dark:border-indigo-900/50">
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <GraduationCap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                            <div className="text-2xl font-bold mb-2">Student Success Plan</div>
                                            <div className="text-muted-foreground">Everything you need to succeed</div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Daily Lessons</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Practice Exams</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">AI Chat Support</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Performance Analytics</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <div className="text-center mb-2">
                                                <span className="text-3xl font-bold text-indigo-600">Free</span>
                                                <span className="text-muted-foreground"> / forever</span>
                                            </div>
                                            <p className="text-center text-sm text-muted-foreground mb-4">
                                                Optional premium features available
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="container mx-auto px-4 py-20">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                        Student Success Stories
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                name: "John Kato",
                                role: "S.6 Science Student",
                                quote: "Physics used to be a nightmare. The AI explanations finally made sense of mechanics for me!"
                            },
                            {
                                name: "Mary Akello",
                                role: "S.5 Arts Student",
                                quote: "I love that I can download lessons. I study on the bus home without using my data."
                            },
                            {
                                name: "Peter Ssekyondwa",
                                role: "S.6 Student",
                                quote: "The practice quizzes helped me spot my weak areas just in time for UACE mocks."
                            }
                        ].map((testimonial, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <div className="flex text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                            Start Your Journey to Success
                        </h2>
                        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                            Join thousands of Ugandan students transforming their grades with Learn2Master
                        </p>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-white/90">
                                Get Started Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <p className="mt-4 text-sm text-white/70">
                            Free account • No credit card needed • Instant access
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Students;
