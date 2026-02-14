# app/models/intent.py
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from enum import Enum
from .user import PyObjectId


class IntentTypeEnum(str, Enum):
    LOOKING_FOR_TEAM = "LOOKING_FOR_TEAM"
    BUILDING_PROJECT = "BUILDING_PROJECT"
    SKILL_SHARE = "SKILL_SHARE"


class IntentStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    MATCHED = "MATCHED"
    ARCHIVED = "ARCHIVED"


class IntentCreate(BaseModel):
    """Create new intent"""
    text: str = Field(..., min_length=10, max_length=500)
    intent_type: Optional[IntentTypeEnum] = IntentTypeEnum.LOOKING_FOR_TEAM

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError("Intent text cannot be empty")
        return v.strip()


class IntentUpdate(BaseModel):
    """Update intent"""
    text: Optional[str] = None
    intent_type: Optional[IntentTypeEnum] = None
    status: Optional[IntentStatusEnum] = None


class IntentInDB(BaseModel):
    """Intent from database"""
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    text: str
    intent_type: IntentTypeEnum
    keywords: List[str]
    status: IntentStatusEnum = IntentStatusEnum.ACTIVE
    keywords_auto_generated: bool = True
    created_at: datetime
    updated_at: datetime
    expires_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class IntentPublic(BaseModel):
    """Intent for suggestions (no user_id)"""
    id: PyObjectId = Field(alias="_id")
    text: str
    intent_type: IntentTypeEnum
    keywords: List[str]
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class IntentResponse(BaseModel):
    """API response wrapper for intent operations"""
    success: bool
    message: str
    data: Optional[IntentInDB] = None