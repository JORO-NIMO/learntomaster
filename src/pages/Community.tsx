import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Users } from 'lucide-react';

const Community = () => {
    return (
        <>
            <Helmet>
                <title>Community - Learn2Master</title>
                <meta name="description" content="Join the Learn2Master community." />
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-display font-bold mb-4">Community Coming Soon</h1>
                    <p className="text-muted-foreground mb-8">
                        We're building a space for students and teachers to connect, share resources, and support each other.
                        Stay tuned!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Join Discord
                        </Button>
                        <Button className="gap-2">
                            Join Waitlist
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Community;
