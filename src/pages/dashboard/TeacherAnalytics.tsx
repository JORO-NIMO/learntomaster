import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { schoolService } from '@/lib/schoolService';
import { Loader2 } from 'lucide-react';

interface TopicInsight {
  topic: string;
  questionCount: number;
  alignmentPercent: number;
  markOutOf100: number;
}

interface TeacherStats {
  totalStudents: number;
  avgAttendance: number;
  assignmentsSubmitted: number;
  classAverage: number;
  classPerformance: Array<{ name: string; math: number; science: number; english: number }>;
}

interface SchoolClass {
  name: string;
  student_count?: number;
}

interface AssignmentSummary {
  submissions?: number;
}

const AI_TOPIC_COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444', '#A855F7'];

const MOCK_AI_INTERACTIONS = [
  { topic: 'Algebraic Functions', alignmentPercent: 86 },
  { topic: 'Algebraic Functions', alignmentPercent: 84 },
  { topic: 'Algebraic Functions', alignmentPercent: 89 },
  { topic: 'Mechanics', alignmentPercent: 72 },
  { topic: 'Mechanics', alignmentPercent: 76 },
  { topic: 'Organic Chemistry', alignmentPercent: 91 },
  { topic: 'Organic Chemistry', alignmentPercent: 94 },
  { topic: 'Cell Biology', alignmentPercent: 78 },
  { topic: 'Cell Biology', alignmentPercent: 81 },
  { topic: 'Cell Biology', alignmentPercent: 75 },
  { topic: 'Statistics', alignmentPercent: 68 },
];

const TeacherAnalytics = () => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // In a real app we would have a specific analytics endpoint
        // For now we simulate aggregating data from available endpoints
        const [classesData, assignmentsData] = await Promise.all([
          schoolService.getClasses().catch(() => ({ classes: [] })),
          schoolService.getAssignments().catch(() => []),
        ]);

        // Transform data for charts
        // Mocking transformation for now as backend might not return aggregate stats directly
        const classes = ((classesData as { classes?: SchoolClass[] }).classes || []) as SchoolClass[];
        const assignments = (assignmentsData as AssignmentSummary[]) || [];

        const classPerformance =
          classes.map((c) => ({
            name: c.name,
            math: Math.floor(Math.random() * 20) + 70, // Placeholder until real grades API
            science: Math.floor(Math.random() * 20) + 70,
            english: Math.floor(Math.random() * 20) + 70,
          })) || [];

        setStats({
          totalStudents: classes.reduce((acc, curr) => acc + (curr.student_count || 0), 0),
          avgAttendance: 95.6, // Placeholder
          assignmentsSubmitted: assignments.reduce((acc, curr) => acc + (curr.submissions || 0), 0),
          classAverage: 82, // Placeholder
          classPerformance,
        });
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const aiTopicInsights: TopicInsight[] = useMemo(() => {
    const groupedByTopic = MOCK_AI_INTERACTIONS.reduce<Record<string, { count: number; alignmentTotal: number }>>(
      (acc, interaction) => {
        const existing = acc[interaction.topic] || { count: 0, alignmentTotal: 0 };
        acc[interaction.topic] = {
          count: existing.count + 1,
          alignmentTotal: existing.alignmentTotal + interaction.alignmentPercent,
        };
        return acc;
      },
      {},
    );

    return Object.entries(groupedByTopic)
      .map(([topic, values]) => {
        const alignmentPercent = Number((values.alignmentTotal / values.count).toFixed(1));
        const repetitionPenalty = Math.max(0, (values.count - 1) * 4);
        const markOutOf100 = Math.max(0, Math.round(alignmentPercent - repetitionPenalty));

        return {
          topic,
          questionCount: values.count,
          alignmentPercent,
          markOutOf100,
        };
      })
      .sort((a, b) => b.questionCount - a.questionCount);
  }, []);

  const totalAIQuestions = aiTopicInsights.reduce((sum, topic) => sum + topic.questionCount, 0);
  const averageAIAlignment = aiTopicInsights.length
    ? Number(
        (
          aiTopicInsights.reduce((sum, topic) => sum + topic.alignmentPercent, 0) /
          aiTopicInsights.length
        ).toFixed(1),
      )
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Fallback if no data
  if (!stats) return <div>No analytics available</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students (Enrolled)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all your classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Based on recent sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentsSubmitted}</div>
            <p className="text-xs text-muted-foreground">Total active assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.classAverage}%</div>
            <p className="text-xs text-muted-foreground">Average overall score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Questions Analysed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAIQuestions}</div>
            <p className="text-xs text-muted-foreground">Questions grouped by repeated topic</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Response Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAIAlignment}%</div>
            <p className="text-xs text-muted-foreground">Average alignment to learning trajectory</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Marks Conversion Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Topic mark = average alignment − repetition penalty. Repetition penalty = 4 marks per repeated
              question on the same topic. This helps flag where learners are repeatedly asking for the same concept.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Class Performance (Estimated)</CardTitle>
            <CardDescription>Performance comparison across classes</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="math" fill="#8884d8" name="Math" />
                  <Bar dataKey="science" fill="#82ca9d" name="Science" />
                  <Bar dataKey="english" fill="#ffc658" name="English" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          {/* Placeholder for real attendance data */}
          <CardHeader>
            <CardTitle>Attendance Trend (Sample)</CardTitle>
            <CardDescription>Weekly attendance overview</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { week: 'Week 1', attendance: 98 },
                    { week: 'Week 2', attendance: 95 },
                    { week: 'Week 3', attendance: 97 },
                    { week: 'Week 4', attendance: 92 },
                    { week: 'Week 5', attendance: 96 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Repeated AI Questions by Topic (Bar)</CardTitle>
            <CardDescription>
              High bars indicate topics where many students ask the same type of question repeatedly.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiTopicInsights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value, key) => [value, key === 'questionCount' ? 'Questions' : 'Mark /100']} />
                  <Legend />
                  <Bar dataKey="questionCount" name="Repeated Questions" fill="#6366F1" />
                  <Bar dataKey="markOutOf100" name="Converted Mark (/100)" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Distribution (Pie)</CardTitle>
            <CardDescription>
              Share of AI questions per topic to quickly spot where conceptual traction is weak.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiTopicInsights}
                    dataKey="questionCount"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(entry) => `${entry.topic}: ${entry.questionCount}`}
                  >
                    {aiTopicInsights.map((entry, index) => (
                      <Cell key={`${entry.topic}-${index}`} fill={AI_TOPIC_COLORS[index % AI_TOPIC_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questions`, 'Volume']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
