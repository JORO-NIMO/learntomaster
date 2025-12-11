import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, FileText, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockAssignments = [
  { id: 1, title: 'Algebra Quiz 1', class: 'Class A', dueDate: '2025-12-15', status: 'Active', submissions: 12, total: 25 },
  { id: 2, title: 'Science Project Proposal', class: 'Class B', dueDate: '2025-12-20', status: 'Draft', submissions: 0, total: 22 },
  { id: 3, title: 'Reading Comprehension', class: 'Class C', dueDate: '2025-12-10', status: 'Closed', submissions: 28, total: 28 },
];

const AssignmentManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">Manage quizzes, homework, and projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Assignment
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {mockAssignments.filter(a => a.status === 'Active').map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          {mockAssignments.filter(a => a.status === 'Draft').map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {mockAssignments.filter(a => a.status === 'Closed').map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
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
              <Badge variant="outline">{assignment.class}</Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due: {assignment.dueDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium">Submissions</div>
            <div className="text-2xl font-bold">
              {assignment.submissions} <span className="text-sm text-muted-foreground font-normal">/ {assignment.total}</span>
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
