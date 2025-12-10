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

export const schoolService = {
    // School Management
    async getSchools() {
        const res = await fetch(`${SERVER_URL}/api/v1/schools`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch schools');
        return await res.json();
    },

    async createSchool(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/schools`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create school');
        return await res.json();
    },

    // Teacher Dashboard Functions
    async getClasses() {
        const res = await fetch(`${SERVER_URL}/api/v1/classes`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch classes');
        return await res.json();
    },

    async createClass(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/classes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create class');
        return await res.json();
    },

    async getAssignments(classId?: string) {
        const url = classId ? `${SERVER_URL}/api/v1/assignments?class_id=${classId}` : `${SERVER_URL}/api/v1/assignments`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return await res.json();
    },

    async createAssignment(data: any) {
        const res = await fetch(`${SERVER_URL}/api/v1/assignments`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create assignment');
        return await res.json();
    }
};
