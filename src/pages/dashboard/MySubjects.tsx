import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    Clock,
    Search,
    MoreHorizontal,
    PlayCircle,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { schoolService } from '@/lib/schoolService';
import { useToast } from '@/hooks/use-toast';

export default function MySubjects() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadSubjects = async () => {
            setLoading(true);
            try {
                const data = await schoolService.getClasses();
                // backend returns { classes: [...] } or just array
                const classList = data.classes || (Array.isArray(data) ? data : []);

                // Map to UI model
                const mapped = classList.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    code: c.code || 'SUB',
                    description: c.description || 'No description available',
                    progress: c.progress || 0, // Assuming backend provides this or we default to 0
                    completedLessons: c.lessons_completed || 0,
                    totalLessons: c.total_lessons || 12,
                    lastAccessed: 'Recently',
                    status: (c.progress || 0) > 0 ? 'in-progress' : 'not-started',
                    color: '#3b82f6', // default color
                    icon: '📚'
                }));
                setSubjects(mapped);
            } catch (e) {
                toast({ title: 'Error', description: 'Failed to load subjects', variant: 'destructive' });
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    const filteredSubjects = subjects
        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(s => filter === 'all' || s.status === filter);

    if (loading) return <div className="flex justify-center p-20 animate-in fade-in"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
                    <p className="text-muted-foreground">Manage your courses and track your mastery.</p>
                </div>
                <Button onClick={() => navigate('/subjects')} variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Catalog
                </Button>
            </div>

            {/* Continue Learning Hero */}
            {subjects.some(s => s.progress > 0) && (
                <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <PlayCircle className="h-12 w-12 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <Badge variant="secondary" className="mb-2">Resume Learning</Badge>
                            <h2 className="text-2xl font-bold">Continue where you left off</h2>
                            <p className="text-muted-foreground">Pick up your last active lesson.</p>
                        </div>
                        <Button size="lg" className="shadow-lg">
                            Continue Lesson <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
                    <TabsList>
                        <TabsTrigger value="all">All Subjects</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="not-started">Not Started</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subjects..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubjects.map((subject) => (
                    <Card key={subject.id} className="group hover:shadow-md transition-all duration-300 border-l-4" style={{ borderLeftColor: subject.color }}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="mb-2">{subject.code}</Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <span className="text-2xl">{subject.icon}</span>
                                {subject.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 h-10">
                                {subject.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{subject.progress}%</span>
                                    </div>
                                    <Progress value={subject.progress} className="h-2" />
                                </div>

                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        <span>{subject.completedLessons}/{subject.totalLessons} Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{subject.lastAccessed}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3 border-t bg-slate-50/50">
                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="secondary" onClick={() => navigate(`/dashboard/subject/${subject.id}`)}>
                                {subject.progress > 0 ? 'Continue' : 'Start Learning'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredSubjects.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="bg-muted/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No subjects found</h3>
                    <p className="text-muted-foreground">You haven't enrolled in any subjects yet.</p>
                </div>
            )}
        </div>
    );
}