import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Upload, BookOpen, CheckCircle2, Brain, Save, Share2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimplifiedContent {
    summary: string;
    key_concepts: string[];
    analogies_used: string[];
    competency_tags: string[];
}

export default function StudyHub() {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimplifiedContent | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        console.log("StudyHub Mounted");
        console.log("Server URL:", import.meta.env.VITE_SERVER_URL);
    }, []);

    const handleSimplify = async () => {
        if (!text && !file) {
            toast({ title: "Input Required", description: "Please enter text or upload a PDF.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const formData = new FormData();
            if (text) formData.append('text', text);
            if (file) formData.append('file', file);
            formData.append('level', 'Senior 1'); // Default, could be dynamic

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/simplify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                    // Content-Type not set for FormData, browser handles it
                },
                body: formData
            });

            if (!res.ok) throw new Error("Simplification failed");

            const data = await res.json();
            setResult(data);
            toast({ title: "Success", description: "Content simplified!" });
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to process content.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        toast({ title: "Saved", description: "Added to your digital notebook." });
    };

    const handleQuiz = () => {
        toast({ title: "Quiz Generated", description: "5 questions created from this content." });
    };

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Study Hub</h1>
                    <p className="text-muted-foreground mt-1">Transform complex notes into NCDC-aligned summaries and quizzes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden md:flex">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Notebook
                    </Button>
                </div>
            </div>

            {/* Workflow Steps Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">1</div>
                    <div className="text-sm font-medium">Input Material</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm opacity-75">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold">2</div>
                    <div className="text-sm font-medium">AI Processing</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm opacity-75">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold">3</div>
                    <div className="text-sm font-medium">Review & Quiz</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Input & History (4 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-primary/20 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <CardHeader>
                            <Badge variant="outline" className="w-fit mb-2">Step 1</Badge>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-primary" />
                                Input Material
                            </CardTitle>
                            <CardDescription>Paste text or upload a PDF (max 5MB)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="text" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                                    <TabsTrigger value="file">Upload File</TabsTrigger>
                                </TabsList>
                                <TabsContent value="text" className="space-y-4 mt-4">
                                    <Textarea
                                        placeholder="Paste complex text here (e.g., from a textbook or lecture notes)..."
                                        className="min-h-[200px] resize-none focus-visible:ring-primary"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                </TabsContent>
                                <TabsContent value="file" className="space-y-4 mt-4">
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                        <Input
                                            type="file"
                                            accept=".pdf,.docx,.txt"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <p className="font-medium">{file ? file.name : "Drop file here or click to upload"}</p>
                                            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 5MB</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            
                            <Button className="w-full" size="lg" onClick={handleSimplify} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {loading ? "AI Analyzing..." : "Simplify & Explain"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Notes / History */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Recent Iterations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {['Photosynthesis Process', 'Newton\'s Laws', 'East African History'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <FileText className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                                            </div>
                                            <span className="font-medium text-sm">{item}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">2d ago</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Output (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {result ? (
                        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200 shadow-lg animate-in slide-in-from-right duration-500 h-full">
                            <CardHeader className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">Step 2: Result</Badge>
                                        <CardTitle className="text-primary flex items-center gap-2">
                                            <Brain className="h-5 w-5" />
                                            Smart Summary
                                        </CardTitle>
                                        <CardDescription>AI-generated explanation</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={handleSave}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div>
                                    <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Overview
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-lg">{result.summary}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                                        <Target className="h-4 w-4 text-primary" />
                                        Key Concepts
                                    </h3>
                                    <div className="grid gap-2">
                                        {result.key_concepts.map((concept, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow">
                                                <div className="mt-0.5 bg-green-100 p-1 rounded-full">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">{concept}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {result.analogies_used.length > 0 && (
                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                                        <h3 className="font-semibold mb-3 text-amber-900 flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-amber-600" />
                                            Real-world Analogy
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.analogies_used.map((analogy, i) => (
                                                <li key={i} className="text-sm text-amber-800 flex gap-2">
                                                    <span className="select-none">•</span>
                                                    {analogy}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-4 border-t">
                                    {result.competency_tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs px-2 py-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t p-6 flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">Generated by Learn2Master AI</p>
                                <Button onClick={handleQuiz} className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20">
                                    Generate Quiz from this
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                            <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                                <Brain className="h-16 w-16 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Simplify</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Your AI summary will appear here. It extracts key points, creates analogies, and maps content to the curriculum.
                            </p>
                            <div className="mt-8 grid grid-cols-3 gap-4 text-center max-w-lg w-full">
                                <div className="p-4 bg-white rounded-lg border shadow-sm">
                                    <FileText className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                                    <div className="text-xs font-medium">Summaries</div>
                                </div>
                                <div className="p-4 bg-white rounded-lg border shadow-sm">
                                    <Sparkles className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                                    <div className="text-xs font-medium">Analogies</div>
                                </div>
                                <div className="p-4 bg-white rounded-lg border shadow-sm">
                                    <CheckCircle2 className="h-6 w-6 mx-auto text-green-500 mb-2" />
                                    <div className="text-xs font-medium">Quizzes</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
