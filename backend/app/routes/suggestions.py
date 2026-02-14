# app/routes/suggestions.py
from fastapi import APIRouter, HTTPException
from app.services.matcher import get_top_matches
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/{user_id}")
def get_suggestions(user_id: str, limit: int = 5):
    """Get collaboration suggestions for user"""
    
    # FAILURE POINT 1: Invalid user_id format
    try:
        user_oid = ObjectId(user_id)
    except Exception:
        logger.warning(f"Invalid user_id: {user_id}")
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    # FAILURE POINT 2: Matching computation fails
    try:
        if limit > 10:
            limit = 10
        if limit < 1:
            limit = 5
        
        matches = get_top_matches(str(user_oid), limit=limit)
        
        if not matches:
            return {
                "success": True,
                "message": "No matches found yet",
                "suggestions": []
            }
        
        # Return as simple cards - NO NUMBERS, NO SCORES
        suggestions = [
            {
                "user_id": match["user_id"],
                "name": match["name"],
                "skills": match["skills"],
                "interests": match["interests"],
                "bio": match["bio"]
                # Score is NOT included - hidden internally
            }
            for match in matches
        ]
        
        return {
            "success": True,
            "message": f"Found {len(suggestions)} collaborators",
            "suggestions": suggestions
        }
    except Exception as e:
        logger.error(f"Suggestion computation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")