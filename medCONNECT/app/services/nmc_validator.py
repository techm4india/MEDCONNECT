"""
NMC (National Medical Commission) curriculum validation service
"""
from typing import List, Dict, Any
from loguru import logger


class NMCValidator:
    """Service for validating NMC curriculum alignment"""
    
    # NMC Competency Domains (simplified representation)
    NMC_COMPETENCIES = {
        "MK": "Medical Knowledge",
        "PC": "Patient Care",
        "ICS": "Interpersonal and Communication Skills",
        "PBLI": "Practice-Based Learning and Improvement",
        "PROF": "Professionalism",
        "SBP": "Systems-Based Practice"
    }
    
    # Common NMC competency codes (example structure)
    COMPETENCY_CODES = {
        "MK.1": "Basic sciences knowledge",
        "MK.2": "Clinical sciences knowledge",
        "MK.3": "Evidence-based medicine",
        "PC.1": "History taking",
        "PC.2": "Physical examination",
        "PC.3": "Clinical reasoning",
        "PC.4": "Diagnostic procedures",
        "PC.5": "Therapeutic procedures",
        "ICS.1": "Patient communication",
        "ICS.2": "Team communication",
        "PBLI.1": "Self-directed learning",
        "PBLI.2": "Quality improvement",
        "PROF.1": "Ethical practice",
        "PROF.2": "Cultural competence",
        "SBP.1": "Healthcare systems",
        "SBP.2": "Resource management"
    }
    
    @staticmethod
    def validate_competency_codes(codes: List[str]) -> Dict[str, Any]:
        """Validate NMC competency codes"""
        valid_codes = []
        invalid_codes = []
        
        for code in codes:
            if code in NMCValidator.COMPETENCY_CODES:
                valid_codes.append(code)
            else:
                invalid_codes.append(code)
        
        return {
            "valid": valid_codes,
            "invalid": invalid_codes,
            "is_valid": len(invalid_codes) == 0
        }
    
    @staticmethod
    def suggest_competency_codes(topics: List[str], learning_objectives: List[str]) -> List[str]:
        """Suggest NMC competency codes based on module content"""
        suggested = []
        
        # Simple keyword-based suggestion (in production, use NLP/AI)
        content = " ".join(topics + learning_objectives).lower()
        
        if any(keyword in content for keyword in ["anatomy", "structure", "organ", "system"]):
            suggested.append("MK.1")
        
        if any(keyword in content for keyword in ["diagnosis", "disease", "pathology", "treatment"]):
            suggested.append("MK.2")
            suggested.append("PC.3")
        
        if any(keyword in content for keyword in ["examination", "physical", "clinical"]):
            suggested.append("PC.2")
        
        if any(keyword in content for keyword in ["history", "patient", "interview"]):
            suggested.append("PC.1")
            suggested.append("ICS.1")
        
        if any(keyword in content for keyword in ["procedure", "skill", "technique"]):
            suggested.append("PC.4")
            suggested.append("PC.5")
        
        if any(keyword in content for keyword in ["evidence", "research", "study"]):
            suggested.append("MK.3")
            suggested.append("PBLI.2")
        
        if any(keyword in content for keyword in ["ethics", "professional", "conduct"]):
            suggested.append("PROF.1")
        
        return list(set(suggested))  # Remove duplicates
    
    @staticmethod
    def validate_module_alignment(
        topics: List[str],
        learning_objectives: List[str],
        competency_codes: List[str]
    ) -> Dict[str, Any]:
        """Validate if module is properly aligned with NMC standards"""
        validation_result = {
            "is_aligned": True,
            "issues": [],
            "suggestions": [],
            "competency_validation": None
        }
        
        # Validate competency codes
        if competency_codes:
            comp_validation = NMCValidator.validate_competency_codes(competency_codes)
            validation_result["competency_validation"] = comp_validation
            
            if not comp_validation["is_valid"]:
                validation_result["is_aligned"] = False
                validation_result["issues"].append(
                    f"Invalid competency codes: {', '.join(comp_validation['invalid'])}"
                )
        else:
            # Suggest codes if none provided
            suggested = NMCValidator.suggest_competency_codes(topics, learning_objectives)
            if suggested:
                validation_result["suggestions"].append(
                    f"Consider adding competency codes: {', '.join(suggested)}"
                )
        
        # Check if learning objectives are present
        if not learning_objectives:
            validation_result["issues"].append("No learning objectives defined")
            validation_result["is_aligned"] = False
        
        # Check if topics are present
        if not topics:
            validation_result["issues"].append("No topics defined")
            validation_result["is_aligned"] = False
        
        return validation_result
    
    @staticmethod
    def get_competency_description(code: str) -> str:
        """Get description for a competency code"""
        return NMCValidator.COMPETENCY_CODES.get(code, "Unknown competency code")
    
    @staticmethod
    def get_all_competencies() -> Dict[str, str]:
        """Get all available NMC competencies"""
        return NMCValidator.COMPETENCY_CODES.copy()


