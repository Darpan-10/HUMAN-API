# app/services/matcher.py
from typing import List, Dict
from bson import ObjectId
from app.database import users_collection, intents_collection
import logging

logger = logging.getLogger(__name__)


def compute_compatibility(user_a: Dict, user_b: Dict, keywords_a: List[str], keywords_b: List[str]) -> float:
    """Calculate hidden compatibility score (0-100) - NOT shown to user"""
    
    score = 0.0
    weights = 0.0
    
    # ========== SKILL OVERLAP (Weight: 3) ==========
    skills_a = set(user_a.get("skills", []))
    skills_b = set(user_b.get("skills", []))
    
    if skills_a and skills_b:
        overlap = len(skills_a & skills_b)
        max_skills = max(len(skills_a), len(skills_b))
        skill_score = (overlap / max_skills) * 100  # 0-100
        score += skill_score * 3
        weights += 3
    
    # ========== INTEREST OVERLAP (Weight: 2.5) ==========
    interests_a = set(user_a.get("interests", []))
    interests_b = set(user_b.get("interests", []))
    
    if interests_a and interests_b:
        overlap = len(interests_a & interests_b)
        max_interests = max(len(interests_a), len(interests_b))
        interest_score = (overlap / max_interests) * 100  # 0-100
        score += interest_score * 2.5
        weights += 2.5
    
    # ========== INTENT KEYWORDS OVERLAP (Weight: 2) ==========
    keywords_set_a = set(keywords_a)
    keywords_set_b = set(keywords_b)
    
    if keywords_set_a and keywords_set_b:
        overlap = len(keywords_set_a & keywords_set_b)
        max_keywords = max(len(keywords_set_a), len(keywords_set_b))
        keyword_score = (overlap / max_keywords) * 100  # 0-100
        score += keyword_score * 2
        weights += 2
    
    # ========== COMPLEMENTARY SKILLS (Weight: 1.5) ==========
    # If user_a has skill that user_b wants to learn, bonus points
    if skills_a and interests_b:
        if len(skills_a & interests_b) > 0:
            score += 15 * 1.5  # Fixed bonus
            weights += 1.5
    
    if weights == 0:
        return 0.0
    
    # Normalize to 0-100
    final_score = (score / weights)
    return min(final_score, 100)


def get_top_matches(user_id: str, limit: int = 5) -> List[Dict]:
    """Get top matching users - INTERNALLY SORTED, no numbers shown"""
    
    # FAILURE POINT 1: Invalid user_id or user not found
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id), "is_deleted": False}
        )
        if not user:
            logger.warning(f"User not found: {user_id}")
            return []
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return []
    
    # Check user availability
    if user.get("availability") == "INACTIVE":
        logger.info(f"User {user_id} is inactive, no suggestions")
        return []
    
    # Get user's intent keywords
    try:
        user_intents = list(intents_collection.find(
            {"user_id": ObjectId(user_id), "status": "ACTIVE"}
        ).sort("created_at", -1).limit(3))
        
        user_keywords = []
        for intent in user_intents:
            user_keywords.extend(intent.get("keywords", []))
        
        if not user_keywords:
            user_keywords = user.get("interests", [])
    
    # FAILURE POINT 2: Database query fails
    except Exception as e:
        logger.error(f"Error fetching intents: {e}")
        user_keywords = user.get("interests", [])
    
    matches = []
    seen_users = set()  # Track duplicates
    
    try:
        # Get other users (exclude current user, exclude inactive)
        other_users = list(users_collection.find(
            {
                "_id": {"$ne": ObjectId(user_id)},
                "is_deleted": False,
                "availability": "ACTIVE"  # Only active users
            }
        ))
        
        for other in other_users:
            other_id = str(other["_id"])
            
            # Skip duplicates
            if other_id in seen_users:
                continue
            seen_users.add(other_id)
            
            # Get other user's intents
            other_intents = list(intents_collection.find(
                {"user_id": other["_id"], "status": "ACTIVE"}
            ).limit(3))
            
            other_keywords = []
            for intent in other_intents:
                other_keywords.extend(intent.get("keywords", []))
            
            if not other_keywords:
                other_keywords = other.get("interests", [])
            
            # Compute score (HIDDEN)
            score = compute_compatibility(user, other, user_keywords, other_keywords)
            
            # Only include if there's some compatibility
            if score > 20:
                matches.append({
                    "user_id": other_id,
                    "name": other.get("name"),
                    "skills": other.get("skills", []),
                    "interests": other.get("interests", []),
                    "bio": other.get("bio"),
                    "score": score  # HIDDEN from frontend
                })
        
        # INTERNALLY SORT by score (best first)
        matches.sort(key=lambda x: x["score"], reverse=True)
        
        # Return top matches
        return matches[:limit]
    
    except Exception as e:
        logger.error(f"Matching computation error: {e}")
        return []