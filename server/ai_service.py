# Learn2Master - Flexible AI Service
# Supports multiple AI providers: OpenAI, Google Gemini, Anthropic
# Configure via environment variables

import os
from typing import List, Dict, Optional
import json

# Configuration - set these in .env or environment
AI_PROVIDER = os.getenv('AI_PROVIDER', 'mock')  # 'openai', 'gemini', 'anthropic', 'mock'
AI_API_KEY = os.getenv('AI_API_KEY', '')
AI_MODEL = os.getenv('AI_MODEL', 'gpt-4')  # Default models per provider

class AIService:
    """Multi-provider AI service for Learn2Master"""
    
    def __init__(self, provider: str = None, api_key: str = None):
        self.provider = provider or AI_PROVIDER
        self.api_key = api_key or AI_API_KEY
        
        # Initialize provider client
        if self.provider == 'openai' and self.api_key:
            import openai
            self.client = openai.OpenAI(api_key=self.api_key)
        elif self.provider == 'gemini' and self.api_key:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.client = genai.GenerativeModel(AI_MODEL or 'gemini-pro')
        elif self.provider == 'anthropic' and self.api_key:
            import anthropic
            self.client = anthropic.Anthropic(api_key=self.api_key)
        else:
            self.client = None  # Mock mode
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        context: Optional[Dict] = None,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Send chat messages and get AI response
        
        Args:
            messages: List of {role: 'user'|'assistant', content: str}
            context: Optional context (current lesson, subject, etc.)
            system_prompt: Optional system instructions
        
        Returns:
            AI response text
        """
        # Build system prompt
        if not system_prompt:
            system_prompt = self._build_system_prompt(context)
        
        # Call appropriate provider
        if self.provider == 'openai':
            return await self._call_openai(messages, system_prompt)
        elif self.provider == 'gemini':
            return await self._call_gemini(messages, system_prompt)
        elif self.provider == 'anthropic':
            return await self._call_anthropic(messages, system_prompt)
        elif self.provider == 'anthropic':
            return await self._call_anthropic(messages, system_prompt)
        # FORCE MOCK IF NO KEY, BUT TRY TO WARN
        if not self.api_key or self.api_key == "change-me":
            print("WARNING: No valid API Key found. Returning mock data.")
            return self._mock_response(messages, context)
        # Fallback to OpenAI if key exists but provider obscure? Default to OpenAI.
        return await self._call_openai(messages, system_prompt)
    
    def _build_system_prompt(self, context: Optional[Dict] = None) -> str:
        """Build system prompt based on context"""
        base_prompt = """You are a helpful AI tutor for Learn2Master, an adaptive e-learning platform for A-Level students in Uganda following the NCDC CBC curriculum.

Your role is to:
- Act as a Socratic Tutor: Ask guiding questions to help the student discover the answer.
- NEVER give the direct answer unless the student has tried 3 times.
- Contextualize everything to Uganda (e.g., "Think about how we calculate profit in a local market").
- Reference specific NCDC Competencies when providing feedback.
- Promote Critical Thinking and Application over Recall."""
        
        if context:
            if context.get('subject'):
                base_prompt += f"\n\nCurrent subject: {context['subject']}"
            if context.get('lesson'):
                base_prompt += f"\nCurrent lesson: {context['lesson']}"
            if context.get('topic'):
                base_prompt += f"\nCurrent topic: {context['topic']}"
        
        return base_prompt
    
    async def _call_openai(self, messages: List[Dict], system_prompt: str) -> str:
        """Call OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=AI_MODEL or "gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *messages
                ],
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI error: {e}")
            return self._mock_response(messages, {})
    
    async def _call_gemini(self, messages: List[Dict], system_prompt: str) -> str:
        """Call Google Gemini API"""
        try:
            # Combine system prompt with first user message
            full_messages = f"{system_prompt}\n\n" + "\n".join([
                f"{m['role']}: {m['content']}" for m in messages
            ])
            
            response = self.client.generate_content(full_messages)
            return response.text
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._mock_response(messages, {})
    
    async def _call_anthropic(self, messages: List[Dict], system_prompt: str) -> str:
        """Call Anthropic Claude API"""
        try:
            response = self.client.messages.create(
                model=AI_MODEL or "claude-3-sonnet-20240229",
                max_tokens=1000,
                system=system_prompt,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            print(f"Anthropic error: {e}")
            return self._mock_response(messages, {})
    
    def _mock_response(self, messages: List[Dict], context: Optional[Dict]) -> str:
        """Generate mock AI response for testing"""
        last_message = messages[-1]['content'].lower() if messages else ""
        
        # Pattern matching for common questions
        if 'quadratic' in last_message or 'equation' in last_message:
            return """A quadratic equation is in the form ax² + bx + c = 0.

To solve it, you can use:
1. **Factoring** - if the equation can be factored easily
2. **Quadratic formula**: x = (-b ± √(b²-4ac)) / 2a
3. **Completing the square**

Would you like me to show you a step-by-step example?"""
        
        elif 'help' in last_message or 'explain' in last_message:
            subject = context.get('subject', 'Mathematics') if context else 'Mathematics'
            return f"""I'm here to help you with {subject}! 

I can:
- Explain concepts step-by-step
- Help solve problems
- Answer questions about the lesson
- Provide practice problems

What specific topic would you like me to explain?"""
        
        elif 'practice' in last_message or 'quiz' in last_message:
            return """Great! Practice is key to mastery. Let me create a practice problem for you:

**Problem**: If f(x) = 2x² + 3x - 5, find f(3).

Take your time to solve it, then I'll guide you through the solution!"""
        
        else:
            return f"""That's a great question! Based on what we're studying, let me explain...

{last_message[:50]}... - I understand you're asking about this topic. 

To give you the best answer, could you provide more context about which specific part you'd like me to clarify?"""

# Singleton instance
_ai_service = None

def get_ai_service() -> AIService:
    """Get or create AI service instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service

    async def generate_learner_profile(self, student_data: Dict) -> Dict:
        """
        Analyze assessment results to generate learner profile (DKT Logic)
        
        Args:
            student_data: { 'assessments': [...], 'recent_activity': [...] }
        """
        prompt = """Analyze this student's performance data and generate a learner profile for Uganda's CBC context.
        
        Logic for Mastery:
        - Consistent high scores (>80%) in complex tasks = High Mastery
        - Mixed scores = Partial Mastery
        - Consistently low scores (<50%) = Low Mastery
        
        Identify:
        1. Current Mastery Level (0.0 - 1.0) for each competency detected
        2. Preferred Learning Style (Visual/Auditory/Kinesthetic) based on content engagement
        3. Strengths and Weaknesses
        
        Return JSON format:
        {
            "mastery_level": { "CODE": 0.0-1.0 },
            "learning_style": "Visual|Auditory|Kinesthetic",
            "strengths": ["..."],
            "weaknesses": ["..."]
        }
        """
        
        messages = [
            {"role": "user", "content": f"{prompt}\n\nStudent Data: {json.dumps(student_data)}"}
        ]
        
        response = await self.chat(messages, system_prompt="You are an expert Educational Data Analyst for CBC.")
        return self._parse_json_response(response)

    async def adapt_content(self, content: str, profile: Dict, competency: str) -> Dict:
        """
        Adapt content based on learner profile
        """
        mastery = profile.get('mastery_level', {}).get(competency, 0.5)
        style = profile.get('learning_style', 'Visual')
        
        prompt = f"""Adapt the following educational content for a student with:
        - Mastery Level: {mastery} (0.0=Beginner, 1.0=Expert)
        - Learning Style: {style}
        - Context: Uganda CBC Secondary School
        
        Adaptation Rules:
        - If Mastery < 0.4: Simplify language, use local analogies (e.g., farming, market), focus on basics.
        - If Mastery > 0.7: Add critical thinking questions, project-based tasks, real-world application.
        - If Visual: Emphasize diagrams, charts, mental imagery.
        
        Return JSON:
        {{
            "title": "Adapted Title",
            "content": "The adapted text...",
            "complexity_level": "Low|Medium|High",
            "suggested_activities": ["activity 1", "activity 2"]
        }}
        """
        
        messages = [{"role": "user", "content": f"{prompt}\n\nOriginal Content: {content}"}]
        response = await self.chat(messages, system_prompt="You are an expert CBC Curriculum Specialist.")
        return self._parse_json_response(response)

    async def generate_assessment(self, topic: str, competency: str, difficulty: int) -> Dict:
        """
        Generate an NCDC-aligned 'Activity of Integration' (AOI)
        Context: Uganda Lower Secondary Curriculum (New CBC)
        """
        prompt = f"""Generate a valid NCDC CBC 'Activity of Integration' (AOI) for:
        - Subject/Topic: {topic}
        - Competency: {competency}
        - Level: Senior {difficulty} (S1-S4)
        
        CRITICAL NCDC REQUIREMENTS:
        1. SCENARIO: Must be a relatable Ugandan context (e.g., local market, farming, transport, health center, community meetings).
        2. PROBLEM: A clear challenge needing a solution.
        3. PRODUCT/OUTPUT: What the student must create (e.g., A budget, A poster, A written speech, A model).
        4. GENERIC SKILLS: Target 1-2 skills (Critical Thinking, Communication).
        
        Return STRICT JSON:
        {{
            "scenario": "Detailed story text...",
            "instructions": "Step-by-step instructions for the student...",
            "expected_output": "Description of the final product...",
            "rubric": {{
                 "score_1": "Basis descriptor (Recall)",
                 "score_2": "Moderate descriptor (Application)",
                 "score_3": "High descriptor (Coherent/Justified)"
            }},
            "support_files": []
        }}
        """
        
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are an expert NCDC Curriculum Developer.")
        return self._parse_json_response(response)

    async def generate_learner_profile(self, student_data: Dict) -> Dict:
        """
        Analyze mastery using NCDC 1, 2, 3 scale
        """
        prompt = """Analyze student performance based on NCDC Competency Scoring (1, 2, 3).
        
        Data: {student_data}
        
        Derive:
        1. Average Score per Competency (aiming for 3.0).
        2. Generic Skills acquisition (e.g., if they do well in projects -> 'Creativity').
        3. Values exhibited (e.g., 'Responsibility' if consistent).
        
        Return JSON:
        {{
            "mastery_level": {{ "CODE": 2.5, ... }}, 
            "competency_descriptors": {{ "CODE": "Achieved level 2: Can explain but lacks justification" }},
            "learning_style": "Visual/Auditory/Kinesthetic",
            "strengths": ["Critical Thinking", "Communication"],
            "gaps": ["Problem Solving in novel contexts"]
        }}
        """
        
        messages = [
            {"role": "user", "content": f"{prompt}"}
        ]
        
        response = await self.chat(messages, system_prompt="You are a Senior Teacher at a Ugandan Secondary School.")
        return self._parse_json_response(response)

    async def evaluate_submission(self, original_activity: Dict, student_response: str) -> Dict:
        """
        Mark student work against NCDC Rubrics
        """
        rubric = original_activity.get('rubric', {})
        prompt = f"""Evaluate this student response based on the NCDC Competency Rubric.
        
        Assignment Scenario: {original_activity.get('scenario')}
        Expected Output: {original_activity.get('expected_output')}
        Rubric: {json.dumps(rubric)}
        
        Student Response: {student_response}
        
        Task:
        1. Assign a Score (1=Basic, 2=Moderate, 3=High).
        2. Identify specific strengths and gaps.
        3. Detect if the student COPIED or used generic AI text (Anti-Cheating check).
        4. Provide Socratic feedback guiding them to the next level.
        
        Return JSON:
        {{
            "score": 2,
            "mastery_level": "Developing",
            "feedback": "You identified the key problem, but... (Socratic hint)",
            "integrity_flag": "clean|suspicious",
            "remedial_task": "Try to explain WHY..."
        }}
        """
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are a strict but supportive NCDC Assessor.")
        return self._parse_json_response(response)

    async def simplify_content(self, text: str, level: str = "Senior 1") -> Dict:
        """
        Simplify complex text (notes/PDFs) for learners
        """
        prompt = f"""Simplify the following academic text for a {level} student in Uganda.
        
        Goals:
        1. Break down complex jargon into simple terms.
        2. Use local analogies.
        3. Highlight key NCDC Competencies found in the text.
        4. Create a 'Key Takeaways' bullet list.
        
        Text: {text[:4000]}... (truncated)
        
        Return JSON:
        {{
            "summary": "...",
            "key_concepts": ["..."],
            "analogies_used": ["..."],
            "competency_tags": ["..."]
        }}
        """
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are an expert Educational Content Creator.")
        return self._parse_json_response(response)

    async def generate_lesson_plan(self, topic: str, duration: str, class_level: str) -> Dict:
        """
        Generate NCDC Scheme of Work / Lesson Plan
        """
        prompt = f"""Generate a 1-hour NCDC CBC Lesson Plan for:
        - Class: {class_level}
        - Topic: {topic}
        - Duration: {duration} minutes
        
        Requirements:
        1. Activity of Integration (AOI) as the core.
        2. Generic Skills to be assessed.
        3. Materials needed (Focus on low-cost/local materials).
        4. Step-by-step Facilitator Guide (not 'Teaching', but 'Facilitating').
        
        Return JSON:
        {{
            "competency": "...",
            "learning_outcome": "...",
            "materials": ["..."],
            "procedure": [
                {{ "time": "10 min", "activity": "Introduction", "teacher_action": "...", "learner_action": "..." }}
            ],
            "assessment": "..."
        }}
        """
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are a Master Trainer for NCDC.")
        return self._parse_json_response(response)

    async def get_career_guidance(self, profile: Dict) -> Dict:
        """
        Map learner strengths to Career Pathways
        """
        prompt = f"""Analyze this learner profile and suggest Career Pathways relevant to Uganda's economy (Vision 2040).
        
        Profile: {json.dumps(profile)}
        
        Focus areas: Agriculture, ICT, Tourism, Oil & Gas, Medicine, Education, Entrepreneurship.
        
        Return JSON:
        {{
            "top_careers": [
                {{ "title": "Agri-Tech Specialist", "match_score": 0.95, "reason": "Strong Bio & ICT skills..." }}
            ],
            "recommended_subjects": ["...", "..."],
            "skill_gaps_to_fill": ["..."]
        }}
        """
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are a Career Guidance Counselor.")
        return self._parse_json_response(response)

    async def get_recommendations(self, profile: Dict, recent_gap: str) -> List[Dict]:
        """
        Recommend remedial content for a specific gap
        """
        prompt = f"""Suggest 3 remedial activities for a student struggling with specific competency gap: {recent_gap}.
        Student Profile: {json.dumps(profile)}
        
        Focus on low-resource, offline-friendly activities (textbooks, practical experiments, peer discussion).
        
        Return JSON List:
        [
            {{
                "title": "Activity Title",
                "type": "exercise|reading|project",
                "description": "..."
            }}
        ]
        """
        
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat(messages, system_prompt="You are a Personal Learning Advisor.")
        parsed = self._parse_json_response(response)
        return parsed if isinstance(parsed, list) else [parsed]


    def _parse_json_response(self, response: str):
        """Helper to extract JSON from AI response"""
        try:
            # strip markdown code blocks if present
            clean = response.replace('```json', '').replace('```', '').strip()
            return json.loads(clean)
        except Exception:
            return {"error": "Failed to parse AI response", "raw": response}

    def _mock_response(self, messages: List[Dict], context: Optional[Dict]) -> str:
        """Mock response for testing without API usage"""
        return "This is a mock AI response. Configure AI_PROVIDER to 'openai' or 'gemini' for real responses."
