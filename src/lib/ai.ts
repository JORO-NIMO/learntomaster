import { mockRecommendations } from '@/data/mockData';
import { AdaptiveRecommendation } from '@/types';

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export async function getRecommendationsForUser(lin: string): Promise<AdaptiveRecommendation[]> {
  try {
    const res = await fetch(`${SERVER_BASE}/api/v1/recommendations/${encodeURIComponent(lin)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.recommendations)) return data.recommendations as AdaptiveRecommendation[];
    }
  } catch {}
  await new Promise(r => setTimeout(r, 120));
  return mockRecommendations;
}
