"""
AI services for academic and governance assistance
"""
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.db.supabase import supabase_client
from loguru import logger
import json

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI package not installed. AI features will be limited.")


class AIService:
    """Service for AI operations"""
    
    def __init__(self):
        self.client = None
        if OPENAI_AVAILABLE and settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
    
    def _get_module_context(self, module_id: str) -> str:
        """Get module context for AI queries"""
        try:
            module = supabase_client.select_one("curriculum_modules", filters={"id": module_id})
            if module:
                topics = ", ".join(module.get("topics", []))
                objectives = ", ".join(module.get("learning_objectives", []))
                return f"Module: {module.get('title', '')}\nTopics: {topics}\nLearning Objectives: {objectives}\nDescription: {module.get('description', '')}"
        except Exception as e:
            logger.error(f"Error fetching module context: {e}")
        return ""
    
    def academic_query(self, query: str, context: Optional[str] = None, module_id: Optional[str] = None) -> dict:
        """Process academic query using AI with NMC-aligned medical education context"""
        if not self.client:
            return {
                "answer": "AI service not configured. Please set OPENAI_API_KEY in environment variables.",
                "explanation": None,
                "related_topics": [],
                "mnemonics": [],
                "study_tips": []
            }
        
        try:
            # Build context for medical education
            system_prompt = """You are an AI academic instructor for medical students, aligned with NMC (National Medical Commission) curriculum standards. 
            Your role is to:
            1. Explain medical concepts clearly and accurately
            2. Create helpful mnemonics for memorization
            3. Compare and contrast related concepts
            4. Provide study tips and revision strategies
            5. Identify weak areas and suggest improvement plans
            
            Always ensure your responses are:
            - Medically accurate and evidence-based
            - Aligned with NMC competency-based medical education
            - Clear and easy to understand for medical students
            - Supportive and encouraging"""
            
            user_context = context or ""
            if module_id:
                module_context = self._get_module_context(str(module_id))
                user_context = f"{user_context}\n\n{module_context}" if user_context else module_context
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context: {user_context}\n\nQuestion: {query}\n\nPlease provide a comprehensive answer with explanation, mnemonics if helpful, and study tips."}
            ]
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Using cost-effective model
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            answer = response.choices[0].message.content
            
            # Extract structured information
            explanation = answer
            related_topics = []
            mnemonics = []
            study_tips = []
            
            # Try to extract structured data from response
            if "mnemonic" in answer.lower() or "remember" in answer.lower():
                # Simple extraction - in production, use structured output
                mnemonics = [line for line in answer.split('\n') if 'mnemonic' in line.lower() or 'remember' in line.lower()][:3]
            
            return {
                "answer": answer,
                "explanation": explanation,
                "related_topics": related_topics,
                "mnemonics": mnemonics,
                "study_tips": study_tips
            }
            
        except Exception as e:
            logger.error(f"Error in academic_query: {e}")
            return {
                "answer": f"Error processing query: {str(e)}",
                "explanation": None,
                "related_topics": [],
                "mnemonics": [],
                "study_tips": []
            }
    
    def generate_study_plan(self, student_id: str, module_ids: List[str], weak_areas: Optional[List[str]] = None) -> dict:
        """Generate personalized study plan using AI"""
        if not self.client:
            return {
                "plan": [],
                "recommendations": [],
                "timeline": {}
            }
        
        try:
            # Get module information
            modules_info = []
            for module_id in module_ids:
                module = supabase_client.select_one("curriculum_modules", filters={"id": module_id})
                if module:
                    modules_info.append(f"- {module.get('title', '')}: {', '.join(module.get('topics', [])[:3])}")
            
            modules_text = "\n".join(modules_info)
            weak_areas_text = ", ".join(weak_areas) if weak_areas else "None identified yet"
            
            prompt = f"""Create a personalized study plan for a medical student covering these modules:
{modules_text}

Weak areas identified: {weak_areas_text}

Provide a weekly study plan with:
1. Daily study schedule
2. Topic prioritization
3. Revision schedule
4. Practice recommendations

Format as a structured plan."""
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a study planning assistant for medical students. Create practical, achievable study plans."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            plan_text = response.choices[0].message.content
            
            return {
                "plan": plan_text.split('\n'),
                "recommendations": [],
                "timeline": {},
                "weak_areas": weak_areas or []
            }
            
        except Exception as e:
            logger.error(f"Error generating study plan: {e}")
            return {
                "plan": [],
                "recommendations": [],
                "timeline": {},
                "weak_areas": weak_areas or []
            }
    
    def detect_weak_areas(self, student_id: str) -> List[str]:
        """Detect weak areas from student progress data"""
        try:
            # Get student progress
            progress_records = supabase_client.select(
                "student_module_progress",
                filters={"student_id": student_id}
            )
            
            weak_areas = []
            for record in progress_records:
                completion = record.get("completion_percentage", 0)
                if completion < 50:  # Threshold for weak area
                    module_id = record.get("module_id")
                    module = supabase_client.select_one("curriculum_modules", filters={"id": module_id})
                    if module:
                        weak_areas.append(module.get("title", "Unknown Module"))
            
            return weak_areas
            
        except Exception as e:
            logger.error(f"Error detecting weak areas: {e}")
            return []
    
    def compare_concepts(self, concept1: str, concept2: str, subject: Optional[str] = None) -> dict:
        """Compare two medical concepts using AI"""
        if not self.client:
            return {
                "similarities": [],
                "differences": [],
                "summary": "AI service not configured"
            }
        
        try:
            prompt = f"""Compare and contrast these two medical concepts:
1. {concept1}
2. {concept2}

Subject context: {subject or 'General Medicine'}

Provide:
- Key similarities
- Key differences
- When to use each concept
- Clinical applications"""
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a medical education assistant. Provide clear, accurate comparisons."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            comparison_text = response.choices[0].message.content
            
            # Simple parsing - in production, use structured output
            similarities = []
            differences = []
            
            lines = comparison_text.split('\n')
            current_section = None
            for line in lines:
                if 'similar' in line.lower():
                    current_section = 'similarities'
                elif 'differ' in line.lower():
                    current_section = 'differences'
                elif line.strip() and current_section:
                    if current_section == 'similarities':
                        similarities.append(line.strip())
                    else:
                        differences.append(line.strip())
            
            return {
                "similarities": similarities[:5],
                "differences": differences[:5],
                "summary": comparison_text
            }
            
        except Exception as e:
            logger.error(f"Error comparing concepts: {e}")
            return {
                "similarities": [],
                "differences": [],
                "summary": f"Error: {str(e)}"
            }
    
    def governance_query(self, query: str, metrics_type: Optional[str] = None, college_id: Optional[str] = None) -> dict:
        """Process governance query using AI with institutional data context"""
        if not self.client:
            return {
                "answer": "AI service not configured.",
                "insights": [],
                "recommendations": []
            }
        
        try:
            # Get relevant metrics based on query type
            context_data = ""
            if metrics_type == "attendance":
                # Get attendance analytics
                context_data = "Focus on attendance patterns, trends, and compliance."
            elif metrics_type == "clinical":
                context_data = "Focus on clinical exposure, logbook completion, and posting status."
            elif metrics_type == "academic":
                context_data = "Focus on academic progress, module completion, and performance."
            
            system_prompt = """You are an AI governance assistant for medical college administration. 
            Analyze institutional data and provide:
            1. Key insights from the data
            2. Actionable recommendations
            3. Compliance indicators
            4. Performance trends
            
            Be specific, data-driven, and focused on improving medical education outcomes."""
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"{context_data}\n\nQuery: {query}\n\nProvide insights and recommendations."}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            answer = response.choices[0].message.content
            
            # Extract insights and recommendations
            insights = []
            recommendations = []
            
            lines = answer.split('\n')
            current_section = None
            for line in lines:
                if 'insight' in line.lower() or 'finding' in line.lower():
                    current_section = 'insights'
                elif 'recommend' in line.lower() or 'action' in line.lower():
                    current_section = 'recommendations'
                elif line.strip() and current_section and (line.strip().startswith('-') or line.strip().startswith('•')):
                    if current_section == 'insights':
                        insights.append(line.strip().lstrip('- •'))
                    else:
                        recommendations.append(line.strip().lstrip('- •'))
            
            return {
                "answer": answer,
                "insights": insights[:5] if insights else ["Review the detailed analysis above"],
                "recommendations": recommendations[:5] if recommendations else ["Review the detailed recommendations above"]
            }
            
        except Exception as e:
            logger.error(f"Error in governance_query: {e}")
            return {
                "answer": f"Error processing query: {str(e)}",
                "insights": [],
                "recommendations": []
            }


# Global instance
ai_service = AIService()

