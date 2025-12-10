import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <>
            <Helmet>
                <title>Contact Us - Learn2Master</title>
                <meta name="description" content="Get in touch with the Learn2Master team." />
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                {/* Header */}
                <div className="container mx-auto px-4 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground">
                                            Plot 12, Innovation Avenue<br />
                                            Kampala, Uganda
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">
                                            General: hello@learn2master.ug<br />
                                            Support: support@learn2master.ug
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">
                                            +256 700 000 000<br />
                                            Mon-Fri, 8am - 5pm EAT
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="you@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="How can we help?" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" className="min-h-[150px]" placeholder="Tell us more..." />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
