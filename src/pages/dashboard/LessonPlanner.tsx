import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, BookOpen, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/lib/ai';

const LessonPlanner = () => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic || !gradeLevel || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a lesson plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const plan = await aiService.generateLessonPlan(topic, gradeLevel, duration);
      setGeneratedPlan(plan);
      toast({
        title: "Lesson Plan Generated",
        description: "Your AI-assisted lesson plan is ready!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Using offline mode.",
        variant: "destructive"
      });
      // Fallback to mock if server fails (e.g. during dev without backend running)
      setGeneratedPlan({
        title: `Lesson Plan: ${topic}`,
        objectives: ["Understand core concepts", "Apply knowledge"],
        activities: [
          { time: "10 min", activity: "Introduction" },
          { time: "40 min", activity: "Main Lesson" },
          { time: "10 min", activity: "Review" }
        ],
        resources: ["Textbook"],
        assessment: "Quiz"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Lesson Planner
            </CardTitle>
            <CardDescription>
              Generate comprehensive lesson plans in seconds using AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Subject</Label>
              <Input 
                id="topic" 
                placeholder="e.g. Photosynthesis, World War II, Linear Equations" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="k-5">Elementary (K-5)</SelectItem>
                    <SelectItem value="6-8">Middle School (6-8)</SelectItem>
                    <SelectItem value="9-12">High School (9-12)</SelectItem>
                    <SelectItem value="higher-ed">Higher Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                    <SelectItem value="90">90 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Specific Learning Objectives (Optional)</Label>
              <Textarea placeholder="Any specific goals you want to achieve?" />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Lesson Plan
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        {generatedPlan ? (
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
            <CardHeader>
              <CardTitle>{generatedPlan.title}</CardTitle>
              <CardDescription>Duration: {duration} minutes • Grade: {gradeLevel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" /> Learning Objectives
                </h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {generatedPlan.objectives.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" /> Activity Timeline
                </h3>
                <div className="space-y-3">
                  {generatedPlan.activities.map((act: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="font-mono font-medium text-purple-600 whitespace-nowrap">{act.time}</span>
                      <span className="text-muted-foreground">{act.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4" /> Resources Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedPlan.resources.map((res: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-background rounded-md border text-xs">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="w-full">Save Plan</Button>
              <Button variant="outline" className="w-full">Export PDF</Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
            <Sparkles className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">Ready to Plan</h3>
            <p className="text-sm max-w-xs mx-auto mt-2">
              Enter your topic and details on the left to generate a structured lesson plan instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanner;
