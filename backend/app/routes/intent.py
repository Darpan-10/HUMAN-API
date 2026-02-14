# app/routes/intent.py
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.intent import IntentCreate, IntentUpdate, IntentInDB, IntentResponse
from app.database import intents_collection, users_collection
from app.services.parser import parse_intent
from app.config import settings
from bson import ObjectId
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/submit", response_model=IntentResponse)
def submit_intent(user_id: str, intent: IntentCreate):
    """Submit new intent"""
    
    # FAILURE POINT 1: Invalid user_id or user doesn't exist
    try:
        user_oid = ObjectId(user_id)
        user = users_collection.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        logger.warning(f"Invalid user_id: {user_id}")
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    # FAILURE POINT 2: Intent parsing or expiration calculation fails
    try:
        parsed = parse_intent(intent.text)
        keywords = parsed.get("keywords", [])
        
        expires_at = datetime.utcnow() + timedelta(hours=settings.intent_expiration_hours)
        
        intent_dict = {
            "user_id": user_oid,
            "text": intent.text,
            "intent_type": intent.intent_type,
            "keywords": keywords,
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": expires_at
        }
        
        result = intents_collection.insert_one(intent_dict)
        intent_dict["_id"] = result.inserted_id
        
        return IntentResponse(
            success=True,
            message="Intent submitted successfully",
            data=IntentInDB(**intent_dict)
        )
    except Exception as e:
        logger.error(f"Intent submission error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit intent")


@router.get("/{user_id}", response_model=List[IntentInDB])
def get_user_intents(user_id: str):
    """Get user's intents"""
    
    try:
        user_oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    try:
        intents = list(intents_collection.find(
            {"user_id": user_oid, "status": "ACTIVE"}
        ).sort("created_at", -1))
        
        return [IntentInDB(**intent) for intent in intents]
    except Exception as e:
        logger.error(f"Get intents error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch intents")