import { schoolService } from './schoolService';
import { lessonService } from './lessonService';
import { getRecommendationsForUser } from './ai';
import { getCurrentUser } from './auth';

export type SubjectProgressItem = {
  id: string;
  subject: string;
  progress: number;
  completed: number;
  lessons: number;
};

export type WeeklyActivityItem = { day: string; minutes: number };

export type DashboardStats = {
  streak: number;
  totalXp: number;
  lessonsDone: number;
  quizzesPassed: number;
  overallMastery: number;
  dailyGoalMinutes: number;
};

export type DashboardRecommendation = {
  reason: string;
  estimatedTime: number;
};

type ProgressEntry = {
  score?: number;
  completed?: number;
  time_spent?: number;
  lesson_id?: string;
  last_accessed?: string;
  created_at?: string;
};

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getEntryDate(entry: ProgressEntry): Date {
  return new Date(entry.last_accessed || entry.created_at || Date.now());
}

function getDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function calculateStreak(progressList: ProgressEntry[]): number {
  const activeDays = new Set(
    progressList
      .map(getEntryDate)
      .map(getDayKey)
  );

  let streak = 0;
  const cursor = new Date();

  while (activeDays.has(getDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildStats(progressList: ProgressEntry[]): DashboardStats {
  const lessonsDone = progressList.filter((entry) => toNumber(entry.completed) >= 100).length;
  const quizzesPassed = progressList.filter((entry) => toNumber(entry.score) >= 50).length;
  const scoreValues = progressList.map((entry) => toNumber(entry.score)).filter((score) => score > 0);
  const overallMastery = scoreValues.length ? Math.round(scoreValues.reduce((acc, score) => acc + score, 0) / scoreValues.length) : 0;

  return {
    streak: calculateStreak(progressList),
    totalXp: (lessonsDone * 50) + (quizzesPassed * 20),
    lessonsDone,
    quizzesPassed,
    overallMastery,
    dailyGoalMinutes: 45,
  };
}

export const dashboardService = {
  async getSubjectProgress(): Promise<SubjectProgressItem[]> {
    const classesResponse = await schoolService.getClasses();
    const classes = classesResponse?.classes || (Array.isArray(classesResponse) ? classesResponse : []);

    return classes.map((c: any) => ({
      id: String(c.id),
      subject: c.name || c.code || 'Subject',
      progress: Math.max(0, Math.min(100, Number(c.progress || 0))),
      completed: Number(c.lessons_completed || 0),
      lessons: Number(c.total_lessons || 0),
    }));
  },

  async getWeeklyActivity(): Promise<WeeklyActivityItem[]> {
    const progressResponse = await lessonService.getProgress();
    const progressList = progressResponse?.progress || [];

    const minutesByDay = new Map<string, number>(WEEK_DAYS.map((d) => [d, 0]));

    for (const entry of progressList) {
      const d = getEntryDate(entry);
      const idx = (d.getDay() + 6) % 7;
      const day = WEEK_DAYS[idx];
      minutesByDay.set(day, (minutesByDay.get(day) || 0) + toNumber(entry.time_spent));
    }

    return WEEK_DAYS.map((day) => ({ day, minutes: minutesByDay.get(day) || 0 }));
  },

  async getStats(): Promise<DashboardStats> {
    const progressResponse = await lessonService.getProgress();
    const progressList = progressResponse?.progress || [];
    return buildStats(progressList);
  },

  async getTopRecommendation(): Promise<DashboardRecommendation | null> {
    const user = getCurrentUser();
    if (!user?.lin) return null;

    const recommendations = await getRecommendationsForUser(user.lin);
    const top = recommendations[0];

    if (!top) return null;

    return {
      reason: top.reason,
      estimatedTime: Number(top.estimatedTime || 30),
    };
  },
};
