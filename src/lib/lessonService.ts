import { getCurrentUser } from './auth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://learn2master.onrender.com';

export interface Lesson {
    id: string;
    title: string;
    content: string; // Markdown or HTML
    videoUrl?: string;
    order: number;
}

export interface Subject {
    id: string;
    name: string;
    description: string;
}

const getHeaders = () => {
    const user = getCurrentUser();
    const token = localStorage.getItem('l2m_server_session_v1')
        ? JSON.parse(localStorage.getItem('l2m_server_session_v1') || '{}').token
        : null;
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const lessonService = {
    async getLesson(lessonId: string): Promise<Lesson> {
        // Try to fetch from server
        try {
            const res = await fetch(`${SERVER_URL}/api/v1/lessons/${lessonId}`, {
                headers: getHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch lesson');
            return await res.json();
        } catch (error) {
            console.warn('Fetching lesson failed, checking offline cache', error);
            // Fallback to offline content if implemented
            throw error;
        }
    },

    async getSubjectLessons(subjectId: string): Promise<Lesson[]> {
        try {
            const res = await fetch(`${SERVER_URL}/api/v1/subjects/${subjectId}/lessons`, {
                headers: getHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch lessons');
            return await res.json();
        } catch (error) {
            console.warn('Fetching subject lessons failed', error);
            throw error;
        }
    },

    async saveProgress(lessonId: string, progress: number) {
        try {
            const res = await fetch(`${SERVER_URL}/api/v1/progress`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ lesson_id: lessonId, progress })
            });
            if (!res.ok) throw new Error('Failed to save progress');
            return await res.json();
        } catch (error) {
            console.warn('Saving progress failed, queueing offline', error);
            // Offline queue logic is handled in the component via offline.ts
            throw error;
        }
    },

    async toggleBookmark(lessonId: string): Promise<{ bookmarked: boolean }> {
        const res = await fetch(`${SERVER_URL}/api/v1/bookmarks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ lesson_id: lessonId })
        });
        if (!res.ok) throw new Error('Failed to toggle bookmark');
        return await res.json();
    },

    async getNotes(lessonId: string): Promise<{ content: string }[]> {
        const res = await fetch(`${SERVER_URL}/api/v1/notes?lesson_id=${lessonId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch notes');
        return await res.json();
    },

    async saveNote(lessonId: string, content: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/notes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ lesson_id: lessonId, content })
        });
        if (!res.ok) throw new Error('Failed to save note');
        return await res.json();
    }
};
