import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Define message type
interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIAssistantProps {
    context?: string; // Current lesson context or subject
    lessonId?: string;
    onStartSmartQuiz?: (topic: string, competencyCode: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context, lessonId, onStartSmartQuiz }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your AI study assistant. Ask me anything about this lesson!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const user = getCurrentUser();

    // Smart Quiz quick action state
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [quizTopic, setQuizTopic] = useState('');
    const [quizCompetency, setQuizCompetency] = useState('');

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
        setLoading(true);

        try {
            const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
            const token = localStorage.getItem('l2m_server_session_v1')
                ? JSON.parse(localStorage.getItem('l2m_server_session_v1') || '{}').token
                : null;

            // Build full message history for better context
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await fetch(`${SERVER_URL}/api/v1/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    messages: [...history, { role: 'user', content: userMessage }],
                    context: {
                        subject: context || 'General',
                        lesson_id: lessonId,
                        user_level: user?.role || 'student'
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error('AI Chat Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not connect to AI service. Please try again later.",
            });
            // Add error message to chat
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please check your connection or try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 animate-bounce-slow"
                onClick={() => setIsOpen(true)}
            >
                <Bot className="w-8 h-8" />
            </Button>
        );
    }

    return (
        <Card className={`fixed right-4 z-50 shadow-2xl transition-all duration-300 ${isMinimized ? 'bottom-4 w-72 h-14' : 'bottom-20 w-80 md:w-96 h-[500px]'}`}>
            <CardHeader className="p-3 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <CardTitle className="text-sm font-medium">Study Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                    {onStartSmartQuiz && !isMinimized && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-primary-foreground hover:bg-white/20"
                            onClick={() => setShowQuizForm(v => !v)}
                            title="Start Smart Quiz"
                        >
                            Smart Quiz
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20" onClick={() => setIsMinimized(!isMinimized)}>
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="p-0 flex-1 overflow-hidden flex flex-col h-[calc(100%-110px)]">
                        {showQuizForm && onStartSmartQuiz && (
                            <div className="p-3 border-b bg-background/80">
                                <div className="text-xs font-medium mb-2 text-foreground">Start Smart Quiz</div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        value={quizTopic}
                                        onChange={(e) => setQuizTopic(e.target.value)}
                                        placeholder="Topic (e.g., Quadratic Equations)"
                                    />
                                    <Input
                                        value={quizCompetency}
                                        onChange={(e) => setQuizCompetency(e.target.value)}
                                        placeholder="Competency code (e.g., MTH-ALG-01)"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            disabled={!quizTopic.trim() || !quizCompetency.trim()}
                                            onClick={() => {
                                                onStartSmartQuiz(quizTopic.trim(), quizCompetency.trim());
                                                setShowQuizForm(false);
                                                setIsOpen(false);
                                            }}
                                        >
                                            Launch Quiz
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setShowQuizForm(false)}>Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-1 mb-1 opacity-70">
                                                <Sparkles className="w-3 h-3" />
                                                <span className="text-xs">AI Assistant</span>
                                            </div>
                                        )}
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 bg-background border-t">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask explanation..."
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

export default AIAssistant;
