import { getAuthHeaders } from './http';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const schoolService = {
    async getSchools() {
        const res = await fetch(`${SERVER_URL}/api/v1/schools`, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch schools');
        return await res.json();
    },

    async createSchool(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/schools`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create school');
        return await res.json();
    },

    async getClasses() {
        const res = await fetch(`${SERVER_URL}/api/v1/classes`, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch classes');
        return await res.json();
    },

    async createClass(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/classes`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create class');
        return await res.json();
    },

    async getAssignments(classId?: string) {
        const url = classId ? `${SERVER_URL}/api/v1/assignments?class_id=${classId}` : `${SERVER_URL}/api/v1/assignments`;
        const res = await fetch(url, { headers: await getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return await res.json();
    },

    async createAssignment(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/assignments`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create assignment');
        return await res.json();
    }
};
