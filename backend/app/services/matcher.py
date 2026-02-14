# app/services/matcher.py
from typing import List, Dict
from bson import ObjectId
from app.database import users_collection, intents_collection
import logging

logger = logging.getLogger(__name__)


def compute_compatibility(user_a: Dict, user_b: Dict, keywords_a: List[str], keywords_b: List[str]) -> float:
    """Calculate hidden compatibility score (0-100)"""
    
    score = 0.0
    
    # Skills overlap (weight 2)
    skills_a = set(user_a.get("skills", []))
    skills_b = set(user_b.get("skills", []))
    if skills_a and skills_b:
        overlap = len(skills_a & skills_b) / max(len(skills_a), len(skills_b))
        score += overlap * 2
    
    # Interests overlap (weight 1.5)
    interests_a = set(user_a.get("interests", []))
    interests_b = set(user_b.get("interests", []))
    if interests_a and interests_b:
        overlap = len(interests_a & interests_b) / max(len(interests_a), len(interests_b))
        score += overlap * 1.5
    
    # Keywords overlap (weight 2.5)
    keywords_set_a = set(keywords_a)
    keywords_set_b = set(keywords_b)
    if keywords_set_a and keywords_set_b:
        overlap = len(keywords_set_a & keywords_set_b) / max(len(keywords_set_a), len(keywords_set_b))
        score += overlap * 2.5
    
    # Normalize to 0-100
    return min(score * 20, 100)


def get_top_matches(user_id: str, limit: int = 5) -> List[Dict]:
    """Get top matching users (score hidden)"""
    
    try:
        user_oid = ObjectId(user_id)
        user = users_collection.find_one(
            {"_id": user_oid, "is_deleted": False}
        )
        if not user:
            logger.warning(f"User not found: {user_id}")
            return []
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return []
    
    # Get user's intent keywords
    try:
        user_intents = list(intents_collection.find(
            {"user_id": user_oid, "status": "ACTIVE"}
        ).sort("created_at", -1).limit(3))
        
        user_keywords = []
        for intent in user_intents:
            user_keywords.extend(intent.get("keywords", []))
        
        if not user_keywords:
            user_keywords = user.get("interests", [])
    except Exception as e:
        logger.error(f"Error fetching intents: {e}")
        user_keywords = user.get("interests", [])
    
    matches = []
    
    try:
        # Optimization: Fetch all active intents for all users in one query
        # This avoids the N+1 query problem
        all_active_intents = list(intents_collection.find({"status": "ACTIVE"}))
        
        # Group intents by user_id for faster lookup
        intents_by_user = {}
        for intent in all_active_intents:
            u_id = str(intent["user_id"])
            if u_id not in intents_by_user:
                intents_by_user[u_id] = []
            if len(intents_by_user[u_id]) < 3:  # Keep only top 3 intents per user
                intents_by_user[u_id].append(intent)

        # Get other users
        other_users = list(users_collection.find(
            {"_id": {"$ne": user_oid}, "is_deleted": False}
        ))
        
        for other in other_users:
            other_id_str = str(other["_id"])
            other_intents = intents_by_user.get(other_id_str, [])
            
            other_keywords = []
            for intent in other_intents:
                other_keywords.extend(intent.get("keywords", []))
            
            if not other_keywords:
                other_keywords = other.get("interests", [])
            
            score = compute_compatibility(user, other, user_keywords, other_keywords)
            
            if score > 0:
                matches.append({
                    "user_id": other_id_str,
                    "name": other.get("name"),
                    "skills": other.get("skills", []),
                    "interests": other.get("interests", []),
                    "bio": other.get("bio"),
                    "score": score
                })
        
        # Sort by score and return top matches
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:limit]
    
    except Exception as e:
        logger.error(f"Matching computation error: {e}")
        return []