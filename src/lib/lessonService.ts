import { getAuthHeaders } from './http';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://learn2master.onrender.com';

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    content: any;
    duration?: number;
    competencyIndicators?: string[];
    videoUrl?: string;
    order?: number;
}

export const lessonService = {
    async getLesson(lessonId: string): Promise<Lesson> {
        const res = await fetch(`${SERVER_URL}/api/v1/lessons/${lessonId}`, {
            headers: await getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch lesson');
        return await res.json();
    },

    async getSubjectLessons(subjectId: string): Promise<Lesson[]> {
        const res = await fetch(`${SERVER_URL}/api/v1/subjects/${subjectId}/lessons`, {
            headers: await getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch lessons');
        return await res.json();
    },

    async getProgress() {
        const res = await fetch(`${SERVER_URL}/api/v1/progress`, {
            headers: await getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch progress');
        return await res.json();
    },

    async saveProgress(lessonId: string, progress: number) {
        const res = await fetch(`${SERVER_URL}/api/v1/progress`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ lesson_id: lessonId, progress })
        });
        if (!res.ok) throw new Error('Failed to save progress');
        return await res.json();
    },

    async toggleBookmark(lessonId: string): Promise<{ bookmarked: boolean }> {
        const res = await fetch(`${SERVER_URL}/api/v1/bookmarks`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ lesson_id: lessonId })
        });
        if (!res.ok) throw new Error('Failed to toggle bookmark');
        return await res.json();
    },

    async getNotes(lessonId: string): Promise<{ content: string }[]> {
        const res = await fetch(`${SERVER_URL}/api/v1/notes?lesson_id=${lessonId}`, {
            headers: await getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch notes');
        return await res.json();
    },

    async saveNote(lessonId: string, content: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/notes`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ lesson_id: lessonId, content })
        });
        if (!res.ok) throw new Error('Failed to save note');
        return await res.json();
    }
};
