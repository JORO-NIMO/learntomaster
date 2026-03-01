import { getAuthHeaders } from './http';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const contentService = {
    async getContent(type?: 'lesson' | 'assessment' | 'project') {
        let url = `${SERVER_URL}/api/v1/content`;
        if (type) url += `?type=${type}`;
        const res = await fetch(url, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch content');
        return await res.json();
    },

    async getContentById(id: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch content details');
        return await res.json();
    },

    async createContent(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/content`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create content');
        return await res.json();
    },

    async updateContent(id: string, data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update content');
        return await res.json();
    },

    async deleteContent(id: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete content');
        return true;
    }
};
