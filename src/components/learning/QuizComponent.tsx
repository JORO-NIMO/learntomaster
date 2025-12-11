import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockQuizQuestions } from '@/data/mockData';
import { Question } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  ArrowRight, 
  Clock,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizComponentProps {
  questions?: Question[];
  topic?: string; // If provided, fetches questions from AI
  onComplete?: (score: number, total: number) => void;
}

export const QuizComponent = ({ 
  questions: initialQuestions,
  topic,
  onComplete 
}: QuizComponentProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [loading, setLoading] = useState(!!topic && !initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
      if (topic && (!initialQuestions || initialQuestions.length === 0)) {
          fetchQuestions();
      }
  }, [topic]);

  const fetchQuestions = async () => {
      setLoading(true);
      try {
          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/ai/quiz`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${session?.access_token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ content: topic, num_questions: 5 })
          });
          if (res.ok) {
              const data = await res.json();
              // Transform AI response to Question type if needed
              // Assuming AI returns list of { question, options, correct_answer, explanation }
              // We need to map it to our Question interface
              const mapped: Question[] = data.map((q: any, i: number) => ({
                  id: i,
                  text: q.question,
                  options: q.options,
                  correctAnswer: q.options[q.correct_answer] || q.correct_answer, // Handle index or string
                  explanation: q.explanation,
                  points: 10
              }));
              setQuestions(mapped);
          }
      } catch (e) {
          console.error(e);
          setQuestions(mockQuizQuestions); // Fallback
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (questions.length === 0) return <div>No questions available.</div>;
  
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };
  
  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(score + currentQuestion.points);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setIsComplete(true);
      onComplete?.(score, questions.reduce((acc, q) => acc + q.points, 0));
    }
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setAnswers([]);
    setIsComplete(false);
  };
  
  if (isComplete) {
    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= 70;
    
    return (
      <Card variant="feature" className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-success/10' : 'bg-destructive/10'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-success" />
            ) : (
              <RotateCcw className="w-10 h-10 text-destructive" />
            )}
          </div>
          
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            {passed ? 'Excellent Work!' : 'Keep Practicing!'}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            You scored {score} out of {totalPoints} points ({percentage}%)
          </p>
          
          <div className="flex justify-center gap-2 mb-8">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${correct ? 'bg-success' : 'bg-destructive'}`}
              />
            ))}
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="feature" className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-accent" />
              {currentQuestion.points} pts
            </span>
            <Badge variant={
              currentQuestion.difficulty === 'easy' ? 'success' :
              currentQuestion.difficulty === 'medium' ? 'warning' : 'destructive'
            }>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </div>
        <Progress value={progress} size="sm" className="mb-4" />
        <CardTitle className="text-lg font-display">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Answer options */}
        {currentQuestion.options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          
          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={showResult}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all",
                !showResult && isSelected && "border-primary bg-primary/5",
                !showResult && !isSelected && "border-border hover:border-primary/30 hover:bg-muted/50",
                showResult && isCorrect && "border-success bg-success/10",
                showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                showResult && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{option}</span>
                {showResult && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </button>
          );
        })}
        
        {/* Hint */}
        {!showResult && currentQuestion.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        )}
        
        {showHint && !showResult && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-foreground">{currentQuestion.hint}</p>
          </div>
        )}
        
        {/* Explanation */}
        {showResult && (
          <div className={cn(
            "p-4 rounded-lg border",
            selectedAnswer === currentQuestion.correctAnswer
              ? "bg-success/10 border-success/20"
              : "bg-destructive/10 border-destructive/20"
          )}>
            <p className="text-sm font-medium text-foreground mb-1">
              {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite right'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {!showResult ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'See Results'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
