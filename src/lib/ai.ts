import { AdaptiveRecommendation } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'https://learn2master.onrender.com';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
}

export async function getRecommendationsForUser(lin: string): Promise<AdaptiveRecommendation[]> {
  try {
    const res = await fetch(`${SERVER_BASE}/api/v1/recommendations/${encodeURIComponent(lin)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.recommendations)) return data.recommendations as AdaptiveRecommendation[];
    }
  } catch (error) {
    console.error('Failed to load recommendations', error);
  }
  return [];
}

export const aiService = {
  async generateLessonPlan(topic: string, gradeLevel: string, duration: string, objectives: string = "") {
    const headers = await getAuthHeader();
    const res = await fetch(`${SERVER_BASE}/api/v1/ai/plan/lesson`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, class_level: gradeLevel, duration, objectives })
    });
    if (!res.ok) throw new Error('Failed to generate lesson plan');
    return res.json();
  },

  async generateQuiz(content: string, numQuestions: number = 5, difficulty: string = "medium") {
    const headers = await getAuthHeader();
    const res = await fetch(`${SERVER_BASE}/api/v1/ai/quiz`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, num_questions: numQuestions, difficulty })
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return res.json();
  },

  async summarizeContent(content: string, format: string = "bullet_points") {
    const headers = await getAuthHeader();
    const res = await fetch(`${SERVER_BASE}/api/v1/ai/summarize`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, format })
    });
    if (!res.ok) throw new Error('Failed to summarize content');
    return res.json();
  }
};

// Mastery/Competence updates
export async function updateMastery(competencyCode: string, scorePercent: number, difficulty: number = 3) {
  const headers = await getAuthHeader();
  const res = await fetch(`${SERVER_BASE}/api/v1/ai/mastery/update`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ competency_code: competencyCode, score: Math.round(scorePercent), difficulty })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update mastery (${res.status}): ${text}`);
  }
  return res.json();
}

