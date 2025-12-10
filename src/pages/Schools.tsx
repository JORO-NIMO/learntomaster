import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
    Building2,
    Users,
    BarChart3,
    Shield,
    Clock,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Award,
    Zap,
    Globe
} from 'lucide-react';

const Schools = () => {
    const [contactForm, setContactForm] = useState({
        schoolName: '',
        contactPerson: '',
        email: '',
        phone: '',
        students: ''
    });

    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Unlimited Students & Teachers",
            description: "Scale without limits. Support your entire institution with one platform"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "School-Wide Analytics",
            description: "Track performance across classes, subjects, and year groups in real-time"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Compliant",
            description: "Enterprise-grade security with GDPR compliance and data protection"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Offline-First Design",
            description: "Works seamlessly even without internet - perfect for Uganda's infrastructure"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "NCDC CBC Aligned",
            description: "100% aligned with Uganda's National Curriculum standards"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "AI-Powered Insights",
            description: "Predictive analytics to identify at-risk students early"
        }
    ];

    const pricingPlans = [
        {
            name: "Standard",
            price: "UGX 500K",
            period: "/term",
            students: "Up to 200 students",
            features: [
                "Unlimited teachers",
                "Basic analytics",
                "Email support",
                "Offline access",
                "Mobile apps"
            ]
        },
        {
            name: "Premium",
            price: "UGX 1.2M",
            period: "/term",
            students: "Up to 500 students",
            popular: true,
            features: [
                "Everything in Standard",
                "Advanced analytics",
                "AI recommendations",
                "Priority support",
                "Custom branding",
                "Parent portal"
            ]
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            students: "Unlimited",
            features: [
                "Everything in Premium",
                "Dedicated success manager",
                "Custom integrations",
                "On-site training",
                "24/7 phone support",
                "SLA guarantee"
            ]
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you! Our team will contact you within 24 hours.');
        setContactForm({ schoolName: '', contactPerson: '', email: '', phone: '', students: '' });
    };

    return (
        <>
            <Helmet>
                <title>For Schools - Learn2Master</title>
                <meta name="description" content="Transform your school with Uganda's leading A-Level e-learning platform. Trusted by 145+ schools. NCDC CBC aligned. Offline-first. Enterprise-grade security." />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="container mx-auto px-4 py-20 relative z-10">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">145+ schools trust Learn2Master</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                                Empower Every Student.<br />Elevate Your School.
                            </h1>

                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                The complete A-Level learning platform trusted by Uganda's top schools
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="#contact">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                        Request Demo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                                <a href="#pricing">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                                        View Pricing
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-muted/50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {[
                                { value: "145+", label: "Partner Schools", icon: <Building2 className="w-6 h-6 text-blue-600" /> },
                                { value: "12,450+", label: "Active Students", icon: <Users className="w-6 h-6 text-green-600" /> },
                                { value: "89%", label: "Pass Rate Increase", icon: <TrendingUp className="w-6 h-6 text-purple-600" /> },
                                { value: "99.97%", label: "Uptime SLA", icon: <Globe className="w-6 h-6 text-orange-600" /> }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex justify-center mb-2">{stat.icon}</div>
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
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
                            Built for Educational Excellence
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Enterprise features designed for schools that demand the best
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, i) => (
                            <Card key={i} className="hover:shadow-lg transition-shadow border-2">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ROI Calculator Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                                Average School Sees 3x ROI in First Year
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { value: "70%", label: "Reduction in administrative time" },
                                    { value: "45%", label: "Increase in student engagement" },
                                    { value: "89%", label: "Improvement in pass rates" }
                                ].map((stat, i) => (
                                    <Card key={i} className="text-center p-6">
                                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-muted-foreground">{stat.label}</div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Transparent Pricing
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Choose the plan that fits your school's needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, i) => (
                            <Card key={i} className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="text-muted-foreground text-sm mb-4">{plan.students}</div>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="#contact">
                                        <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                                            {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="bg-muted/30 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                            Trusted by Leading Schools
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {[
                                {
                                    school: "Kampala High School",
                                    role: "Headmaster",
                                    name: "Dr. Robert Musoke",
                                    quote: "Our pass rates increased by 43% in the first year. Learn2Master transformed how we teach A-Level."
                                },
                                {
                                    school: "St. Mary's Secondary",
                                    role: "Director of Studies",
                                    name: "Sr. Christine Nakato",
                                    quote: "The offline capability is game-changing. Students can learn anywhere, anytime, regardless of connectivity."
                                },
                                {
                                    school: "Mengo School",
                                    role: "Deputy Head",
                                    name: "Mr. James Ssemakula",
                                    quote: "The analytics help us identify struggling students early. We can intervene before it's too late."
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
                                            <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                                        </div>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                            <div className="text-sm text-primary font-medium">{testimonial.school}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div id="contact" className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                                Request a Demo
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                See how Learn2Master can transform your school
                            </p>
                        </div>

                        <Card>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="schoolName">School Name *</Label>
                                        <Input
                                            id="schoolName"
                                            required
                                            value={contactForm.schoolName}
                                            onChange={(e) => setContactForm({ ...contactForm, schoolName: e.target.value })}
                                            placeholder="e.g., Kampala High School"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="contactPerson">Contact Person *</Label>
                                            <Input
                                                id="contactPerson"
                                                required
                                                value={contactForm.contactPerson}
                                                onChange={(e) => setContactForm({ ...contactForm, contactPerson: e.target.value })}
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="students">Number of Students</Label>
                                            <Input
                                                id="students"
                                                type="number"
                                                value={contactForm.students}
                                                onChange={(e) => setContactForm({ ...contactForm, students: e.target.value })}
                                                placeholder="e.g., 500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                placeholder="admin@school.ac.ug"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                                placeholder="+256 700 000 000"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        Request Demo
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                    <p className="text-sm text-muted-foreground text-center">
                                        Our team will contact you within 24 hours to schedule your personalized demo
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                            Join Uganda's Leading Schools
                        </h2>
                        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                            Transform your school's A-Level education with Learn2Master
                        </p>
                        <a href="#contact">
                            <Button size="lg" variant="secondary">
                                Get Started Today
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schools;
