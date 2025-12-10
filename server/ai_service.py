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
        else:
            return self._mock_response(messages, context)
    
    def _build_system_prompt(self, context: Optional[Dict] = None) -> str:
        """Build system prompt based on context"""
        base_prompt = """You are a helpful AI tutor for Learn2Master, an adaptive e-learning platform for A-Level students in Uganda following the NCDC CBC curriculum.

Your role is to:
- Answer student questions clearly and concisely
- Explain concepts in simple terms
- Provide step-by-step solutions
- Encourage critical thinking
- Adapt explanations to student's level
- Reference curriculum standards when relevant"""
        
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
