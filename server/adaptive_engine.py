from typing import List, Dict, Optional
import json
from datetime import datetime

class AdaptiveLearningEngine:
    """
    Core Engine for Personalizing Learning Pathways.
    Uses Learner Profile (Mastery Levels) to generate targeted interventions.
    """
    
    def __init__(self, ai_service):
        self.ai = ai_service

    async def generate_pathway(self, profile: Dict, subject: str = None) -> Dict:
        """
        Generate a structured learning pathway based on mastery gaps.
        """
        mastery_map = profile.get('mastery_level', {})
        weaknesses = profile.get('weaknesses', [])
        
        # 1. Identify Focus Areas (Competencies with low mastery)
        focus_areas = []
        for code, score in mastery_map.items():
            if score < 0.6: # Threshold for "Developing"
                focus_areas.append({'code': code, 'score': score})
        
        # Sort by lowest score first
        focus_areas.sort(key=lambda x: x['score'])
        
        # If no specific gaps, focus on enrichment or next topic
        if not focus_areas:
            return {
                "status": "mastery",
                "message": "You are doing great! Here is an enrichment pathway.",
                "modules": [
                    {
                        "title": "Advanced Project",
                        "type": "project",
                        "description": "Apply your skills in a real-world scenario.",
                        "difficulty": "High"
                    }
                ]
            }

        # 2. Generate Modules for the top priority gap
        target = focus_areas[0]
        competency_code = target['code']
        current_score = target['score']
        
        # Prompt AI to generate a specific remedial plan
        prompt = f"""
        Create a 3-step remedial learning pathway for a student with:
        - Competency: {competency_code}
        - Current Mastery: {current_score} (Scale 0-1)
        - Learning Style: {profile.get('learning_style', 'Visual')}
        
        Steps should be:
        1. Review (Concept clarification)
        2. Practice (Guided exercises)
        3. Assess (Quiz/Check)
        
        Return JSON:
        {{
            "title": "Pathway: Mastering {competency_code}",
            "focus_competency": "{competency_code}",
            "modules": [
                {{ "step": 1, "title": "...", "type": "content", "description": "..." }},
                {{ "step": 2, "title": "...", "type": "exercise", "description": "..." }},
                {{ "step": 3, "title": "...", "type": "quiz", "description": "..." }}
            ]
        }}
        """
        
        messages = [{"role": "user", "content": prompt}]
        response = await self.ai.chat(messages, system_prompt="You are an Adaptive Learning Specialist.")
        pathway = self.ai._parse_json_response(response)
        
        return pathway

    def calculate_mastery_update(self, current_score: float, assessment_score: float, difficulty: int) -> float:
        """
        Bayesian-like update of mastery score.
        
        current_score: 0.0 to 1.0
        assessment_score: 0.0 to 1.0 (e.g., 80% = 0.8)
        difficulty: 1 to 5
        """
        # Weight of the new evidence depends on difficulty
        weight = 0.1 * difficulty 
        
        # If they aced a hard question, big boost
        # If they failed an easy question, big drop
        
        diff = assessment_score - current_score
        new_score = current_score + (diff * weight)
        
        return max(0.0, min(1.0, new_score))
