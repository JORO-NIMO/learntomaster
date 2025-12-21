import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, FileText, CheckCircle, Clock, MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { schoolService } from '@/lib/schoolService';
import { useToast } from '@/hooks/use-toast';

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignData, classData] = await Promise.all([
        schoolService.getAssignments().catch(() => []),
        schoolService.getClasses().catch(() => ({ classes: [] }))
      ]);
      setAssignments(Array.isArray(assignData) ? assignData : []);
      setClasses(classData.classes || []);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load assignments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle || !newClassId || !newDueDate) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    try {
      // Find class name for UI consistency if needed, but ID is what matters for backend
      const selectedClass = classes.find(c => c.id === newClassId);

      await schoolService.createAssignment({
        title: newTitle,
        description: 'New Assignment', // simplified for now
        class_id: newClassId,
        due_date: newDueDate,
        status: 'active'
      });
      toast({ title: 'Assignment Created' });
      setCreateOpen(false);
      setNewTitle('');
      setNewClassId('');
      setNewDueDate('');
      loadData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to create assignment', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">Manage quizzes, homework, and projects.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Set up a new task for your students.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">Class</Label>
                <select
                  id="class"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                  value={newClassId}
                  onChange={e => setNewClassId(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due" className="text-right">Due Date</Label>
                <Input id="due" type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {assignments.filter(a => !a.status || a.status === 'active' || a.status === 'published').length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No active assignments</div>
          ) : (
            assignments.filter(a => !a.status || a.status === 'active' || a.status === 'published').map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="text-center py-10 text-muted-foreground">Drafts feature coming soon.</div>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <div className="text-center py-10 text-muted-foreground">No closed assignments</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AssignmentCard = ({ assignment }: { assignment: any }) => {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{assignment.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Badge variant="outline">{assignment.class_name || 'General'}</Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No date'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{assignment.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium">Submissions</div>
            <div className="text-2xl font-bold">
              {assignment.submissions_count || 0} <span className="text-sm text-muted-foreground font-normal">/ {assignment.total_students || '--'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">View Results</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentManager;
