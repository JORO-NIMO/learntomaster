import { mockRecommendations } from '@/data/mockData';
import { AdaptiveRecommendation } from '@/types';

// Lightweight AI stub that returns mock recommendations.
// In a full implementation this would call the AI microservice.

export async function getRecommendationsForUser(lin: string): Promise<AdaptiveRecommendation[]> {
  // simulate async work / local heuristics
  await new Promise(r => setTimeout(r, 120));
  // For now return the static mock recommendations; later filter per user
  return mockRecommendations;
}
