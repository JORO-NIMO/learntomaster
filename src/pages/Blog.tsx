import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

const Blog = () => {
    return (
        <>
            <Helmet>
                <title>Blog - Learn2Master</title>
                <meta name="description" content="Latest news, study tips, and updates from Learn2Master." />
            </Helmet>

            <div className="min-h-screen bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-display font-bold mb-4">Latest Insights</h1>
                        <p className="text-xl text-muted-foreground">Tips for success, platform updates, and education news.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Top 10 Study Tips for UACE",
                                category: "Study Tips",
                                date: "October 15, 2025",
                                excerpt: "Master your exams with these proven strategies from top performing students."
                            },
                            {
                                title: "Understanding the New Competency Curriculum",
                                category: "Education",
                                date: "September 28, 2025",
                                excerpt: "A guide for students and parents on what to expect from the NCDC changes."
                            },
                            {
                                title: "New Features: AI Tutor Upgrade",
                                category: "Product Update",
                                date: "September 10, 2025",
                                excerpt: "We've made our AI assistant even smarter. Here's what's new."
                            }
                        ].map((post, i) => (
                            <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-muted rounded-t-xl flex items-center justify-center font-display text-4xl font-bold text-muted-foreground/20">
                                    IMAGE
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-center mb-2">
                                        <Badge variant="secondary">{post.category}</Badge>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {post.date}
                                        </div>
                                    </div>
                                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-3">
                                        {post.excerpt}
                                    </CardDescription>
                                    <div className="mt-4 text-primary font-medium text-sm hover:underline">
                                        Read more →
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;
