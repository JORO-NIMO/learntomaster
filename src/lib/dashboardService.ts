import { schoolService } from './schoolService';
import { lessonService } from './lessonService';

export type SubjectProgressItem = {
  id: string;
  subject: string;
  progress: number;
  completed: number;
  lessons: number;
};

export type WeeklyActivityItem = { day: string; minutes: number };

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
      const d = new Date(entry.last_accessed || entry.created_at || Date.now());
      const idx = (d.getDay() + 6) % 7;
      const day = WEEK_DAYS[idx];
      minutesByDay.set(day, (minutesByDay.get(day) || 0) + Number(entry.time_spent || 0));
    }

    return WEEK_DAYS.map((day) => ({ day, minutes: minutesByDay.get(day) || 0 }));
  },
};
