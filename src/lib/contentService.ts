import { getCurrentUser } from './auth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

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

export const contentService = {
    // Get all content for the current user
    async getContent(type?: 'lesson' | 'assessment' | 'project') {
        let url = `${SERVER_URL}/api/v1/content`;
        if (type) {
            url += `?type=${type}`;
        }
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch content');
        return await res.json();
    },

    // Get a specific content item
    async getContentById(id: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch content details');
        return await res.json();
    },

    // Create new content
    async createContent(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/content`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create content');
        return await res.json();
    },

    // Update existing content
    async updateContent(id: string, data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update content');
        return await res.json();
    },

    // Delete content
    async deleteContent(id: string) {
        const res = await fetch(`${SERVER_URL}/api/v1/content/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete content');
        return true;
    }
};
