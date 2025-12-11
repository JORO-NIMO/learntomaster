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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Study Hub</h1>
                    <p className="text-muted-foreground">Transform complex notes into NCDC-aligned summaries and quizzes.</p>
                </div>
                <Button variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Notebook
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="border-primary/20 shadow-md">
                        <CardHeader>
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

                    {/* Recent Notes (Mock) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Summaries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {['Photosynthesis Process', 'Newton\'s Laws', 'East African History'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{item}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">2 days ago</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {result ? (
                        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200 shadow-lg animate-in slide-in-from-right duration-500">
                            <CardHeader className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex justify-between items-start">
                                    <div>
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
                                    <h3 className="font-semibold mb-2 text-lg">Overview</h3>
                                    <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 text-lg">Key Concepts</h3>
                                    <div className="grid gap-2">
                                        {result.key_concepts.map((concept, i) => (
                                            <div key={i} className="flex items-start gap-2 p-2 rounded bg-white border shadow-sm">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                                <span className="text-sm">{concept}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {result.analogies_used.length > 0 && (
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                        <h3 className="font-semibold mb-2 text-amber-900 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Real-world Analogy
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.analogies_used.map((analogy, i) => (
                                                <li key={i} className="text-sm text-amber-800">{analogy}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {result.competency_tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t p-4 flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">Generated by Learn2Master AI</p>
                                <Button onClick={handleQuiz} className="bg-green-600 hover:bg-green-700">
                                    Generate Quiz from this
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Brain className="h-12 w-12 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Ready to Simplify</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                Your AI summary will appear here. It extracts key points, creates analogies, and maps content to the curriculum.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
