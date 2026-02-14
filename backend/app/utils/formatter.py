# app/utils/formatter.py
import logging

logger = logging.getLogger(__name__)


def get_labels(score: float) -> tuple:
    """Convert hidden score (0-100) to ethical labels"""
    
    # FAILURE POINT 1: Invalid input (None, string, negative)
    try:
        score = float(score)
        if score < 0 or score > 100:
            logger.warning(f"Score out of range: {score}")
            score = max(0, min(100, score))  # Clamp to 0-100
    except (TypeError, ValueError) as e:
        logger.error(f"Invalid score input: {e}")
        return "Recommended Connection", "Low"
    
    # Map score to label (no numbers shown to user)
    if score >= 70:
        return "Suggested Match", "Highly Compatible"
    elif score >= 40:
        return "Compatible", "Potentially Compatible"
    else:
        return "Recommended Connection", "Worth Exploring"


def format_suggestion(user_match: dict) -> dict:
    """Format match for API response (hide internal score)"""
    
    # FAILURE POINT 2: Missing score or user data
    try:
        score = user_match.get("score", 0)
        label, compatibility = get_labels(score)
        
        return {
            "user_id": user_match.get("user_id"),
            "name": user_match.get("name"),
            "skills": user_match.get("skills", []),
            "interests": user_match.get("interests", []),
            "bio": user_match.get("bio"),
            "match_label": label,
            "compatibility": compatibility
            # Score is NOT included in response
        }
    except Exception as e:
        logger.error(f"Format suggestion error: {e}")
        return {}