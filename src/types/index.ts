// Learn2Master Type Definitions
// Aligned with Uganda NCDC CBC A-Level Curriculum

export type MasteryLevel = 'novice' | 'developing' | 'proficient' | 'master';

export type UserRole = 'learner' | 'teacher' | 'admin' | 'curriculum_specialist';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  createdAt: Date;
}

export interface LearnerProfile extends User {
  role: 'learner';
  grade: string; // S5, S6
  stream: string; // Sciences, Arts, etc.
  enrolledSubjects: string[];
  overallMastery: number; // 0-100
  totalXp: number;
  streak: number; // Days of consecutive learning
  preferences: LearnerPreferences;
}

export interface LearnerPreferences {
  learningPace: 'slow' | 'moderate' | 'fast';
  preferredContentType: ('video' | 'text' | 'interactive' | 'audio')[];
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
}

// CBC Curriculum Structure
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  competencies: Competency[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  lessons: Lesson[];
  estimatedHours: number;
}

export interface Competency {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  indicators: CompetencyIndicator[];
}

export interface CompetencyIndicator {
  id: string;
  competencyId: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
}

// Content Items
export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  order: number;
  type: 'video' | 'text' | 'interactive' | 'mixed';
  duration: number; // minutes
  content: LessonContent;
  assessments: Assessment[];
  competencyIndicators: string[];
  prerequisites: string[];
}

export interface LessonContent {
  sections: ContentSection[];
  resources: Resource[];
}

export interface ContentSection {
  id: string;
  type: 'text' | 'video' | 'image' | 'interactive' | 'example' | 'practice';
  title?: string;
  content: string;
  mediaUrl?: string;
}

export interface Resource {
  id: string;
  type: 'pdf' | 'video' | 'link' | 'download';
  title: string;
  url: string;
}

// Assessment System
export interface Assessment {
  id: string;
  lessonId: string;
  title: string;
  type: 'quiz' | 'practice' | 'project' | 'exam';
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // minutes
  competencyIndicators: string[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  competencyIndicatorId?: string;
}

// Learner Progress & Mastery
export interface LearnerProgress {
  learnerId: string;
  subjectId: string;
  topicProgresses: TopicProgress[];
  overallMastery: number;
  lastAccessedAt: Date;
}

export interface TopicProgress {
  topicId: string;
  completedLessons: string[];
  masteryLevel: MasteryLevel;
  masteryScore: number; // 0-100
  timeSpent: number; // minutes
  assessmentScores: AssessmentScore[];
}

export interface AssessmentScore {
  assessmentId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  timeSpent: number;
  attempts: number;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

// AI Adaptive Engine Types
export interface LearnerAnalytics {
  learnerId: string;
  strengths: string[]; // Competency IDs
  weaknesses: string[]; // Competency IDs
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  averageSessionDuration: number;
  optimalLearningTime: string; // e.g., "morning", "evening"
  errorPatterns: ErrorPattern[];
}

export interface ErrorPattern {
  competencyId: string;
  errorType: string;
  frequency: number;
  suggestedRemediation: string;
}

export interface AdaptiveRecommendation {
  type: 'lesson' | 'practice' | 'review' | 'challenge';
  itemId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

// Offline Sync
export interface SyncQueue {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: Record<string, unknown>;
  timestamp: Date;
  synced: boolean;
}

export interface OfflineBundle {
  id: string;
  subjectId: string;
  topicIds: string[];
  downloadedAt: Date;
  size: number; // bytes
  version: string;
}
