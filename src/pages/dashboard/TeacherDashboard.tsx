import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, AlertTriangle, TrendingUp, BookOpen, Loader2, Sparkles } from 'lucide-react';

export default function TeacherDashboard() {
    const atRiskStudents = [
        { name: "John Doe", lin: "1001", risk: "High", gap: "Mathematics", attendance: "85%" },
        { name: "Sarah Smith", lin: "1005", risk: "Medium", gap: "Physics", attendance: "92%" },
        { name: "Mike Johnson", lin: "1012", risk: "Medium", gap: "Chemistry", attendance: "90%" },
    ];

    const [generating, setGenerating] = React.useState(false);

    const generateLessonPlan = async () => {
        setGenerating(true);
        // Call API /api/v1/ai/plan/lesson
        // For demo, just alert
        setTimeout(() => {
            setGenerating(false);
            alert("Lesson Plan Generated! (Check API response)");
        }, 2000);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                    <p className="text-muted-foreground">Class Analytics & CBC Implementation</p>
                </div>
                <div className="space-x-2">
                    <Button onClick={generateLessonPlan} disabled={generating}>
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        AI Lesson Plan
                    </Button>
                    <Button>Create Content</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-muted-foreground">Across 3 streams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">12</div>
                        <p className="text-xs text-muted-foreground">Needs intervention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Mastery</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">72%</div>
                        <p className="text-xs text-muted-foreground">Physics (Senior 3)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Topic Completion</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8/12</div>
                        <p className="text-xs text-muted-foreground">Topics covered this term</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI-Identified At-Risk Students</CardTitle>
                    <CardDescription>Students showing consistent gaps in specific competencies</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>LIN</TableHead>
                                <TableHead>Primary Gap</TableHead>
                                <TableHead>Risk Level</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {atRiskStudents.map((student) => (
                                <TableRow key={student.lin}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.lin}</TableCell>
                                    <TableCell>{student.gap}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${student.risk === 'High' ? 'bg-destructive/20 text-destructive' : 'bg-yellow-500/20 text-yellow-600'
                                            }`}>
                                            {student.risk}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">View Profile</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
