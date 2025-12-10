import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import {
    BookOpen,
    BarChart3,
    Users,
    Clock,
    Award,
    Bot,
    CheckCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const Teachers = () => {
    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Class Management",
            description: "Effortlessly manage multiple classes, track attendance, and organize students"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Real-Time Analytics",
            description: "Monitor student progress with detailed analytics and performance insights"
        },
        {
            icon: <Bot className="w-6 h-6" />,
            title: "AI Grading Assistant",
            description: "Save time with AI-powered grading suggestions and instant feedback generation"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Automated Reports",
            description: "Generate comprehensive progress reports with a single click"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "NCDC CBC Aligned",
            description: "All content aligned with Uganda's National Curriculum Development Centre standards"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Mastery Tracking",
            description: "Adaptive learning paths ensure every student achieves mastery"
        }
    ];

    const benefits = [
        "Reduce grading time by up to 70%",
        "Identify struggling students instantly",
        "Personalized intervention recommendations",
        "Offline-first design works anywhere",
        "Mobile-friendly dashboard",
        "Free professional development resources"
    ];

    return (
        <>
            <Helmet>
                <title>For Teachers - Learn2Master</title>
                <meta name="description" content="Empower your teaching with AI-powered analytics, automated grading, and real-time student insights. Join 500+ teachers transforming A-Level education in Uganda." />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="container mx-auto px-4 py-20 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Trusted by 500+ teachers across Uganda</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                                Teach Smarter,<br />Not Harder
                            </h1>

                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                AI-powered tools that help you focus on what matters most: inspiring your students
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                        Start Free Trial
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                                    Watch Demo
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
                                { value: "500+", label: "Active Teachers" },
                                { value: "12,000+", label: "Students Taught" },
                                { value: "70%", label: "Time Saved" },
                                { value: "4.9/5", label: "Teacher Rating" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
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
                            Everything You Need to Excel
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed specifically for A-Level teachers in Uganda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, i) => (
                            <Card key={i} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                                    Join Uganda's Leading Teachers
                                </h2>
                                <div className="space-y-4">
                                    {benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
                                            <span className="text-lg">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Link to="/login">
                                        <Button size="lg">
                                            Get Started Free
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <Card className="p-8">
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">Free Forever</div>
                                        <div className="text-muted-foreground">For individual teachers</div>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>Unlimited students</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>AI grading assistant</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>Real-time analytics</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>Offline access</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success" />
                                            <span>Free training & support</span>
                                        </li>
                                    </ul>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="container mx-auto px-4 py-20">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                        What Teachers Say
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Sarah Namukasa",
                                role: "Physics Teacher, Kampala High",
                                quote: "Learn2Master has cut my grading time in half. The AI assistant helps me identify exactly where students are struggling."
                            },
                            {
                                name: "David Okello",
                                role: "Mathematics Teacher, St. Mary's",
                                quote: "The analytics dashboard is incredible. I can see which topics need more focus before students even tell me."
                            },
                            {
                                name: "Grace Mutesi",
                                role: "Chemistry Teacher, Mengo School",
                                quote: "Finally, a platform that works offline! Perfect for our rural students who don't always have internet."
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
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                            Ready to Transform Your Teaching?
                        </h2>
                        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                            Join hundreds of teachers using Learn2Master to inspire the next generation
                        </p>
                        <Link to="/login">
                            <Button size="lg" variant="secondary">
                                Start Free Today
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <p className="mt-4 text-sm text-white/70">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Teachers;
