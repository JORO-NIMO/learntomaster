import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Upload, BookOpen, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

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

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Study Hub</h1>
                <p className="text-muted-foreground">Upload notes or past papers for NCDC-aligned summaries.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Input Material</CardTitle>
                        <CardDescription>Paste text or upload a PDF (max 5MB)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste complex text here..."
                            className="min-h-[150px]"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                        </div>
                        <Button className="w-full" onClick={handleSimplify} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {loading ? "Analyzing..." : "Simplify with AI"}
                        </Button>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center">
                                <BookOpen className="mr-2 h-5 w-5" /> Smart Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="prose prose-sm max-w-none">
                                <p>{result.summary}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center">
                                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" /> Key Concepts
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.key_concepts.map((c, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border rounded-full text-xs font-medium text-slate-700">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm mb-2">Competencies Targeted</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.competency_tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
