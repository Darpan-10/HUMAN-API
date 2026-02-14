# app/models/user.py
from pydantic import BaseModel, EmailStr, Field, field_validator, GetJsonSchemaHandler, GetCoreSchemaHandler, ConfigDict
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from enum import Enum


class PyObjectId(ObjectId):
    """Custom ObjectId for Pydantic v2"""
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler) -> JsonSchemaValue:
        return handler(_core_schema)


class AvailabilityEnum(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ON_BREAK = "ON_BREAK"


class UserCreate(BaseModel):
    """User registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2, max_length=100)
    skills: List[str] = Field(default=[])
    interests: List[str] = Field(default=[])
    bio: Optional[str] = None

    @field_validator("skills", "interests", mode="before")
    @classmethod
    def clean_arrays(cls, v):
        if not isinstance(v, list):
            return v
        return list(set(item.strip() for item in v if isinstance(item, str) and item.strip()))


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User profile update"""
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    bio: Optional[str] = None
    availability: Optional[AvailabilityEnum] = None


class UserInDB(BaseModel):
    """User from database"""
    id: PyObjectId = Field(alias="_id")
    email: str
    name: str
    skills: List[str]
    interests: List[str]
    bio: Optional[str]
    availability: AvailabilityEnum = AvailabilityEnum.ACTIVE
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class UserPublic(BaseModel):
    """User for suggestions (no email)"""
    id: PyObjectId = Field(alias="_id")
    name: str
    skills: List[str]
    interests: List[str]
    bio: Optional[str]

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class UserResponse(BaseModel):
    """API response"""
    success: bool
    message: str
    data: Optional[UserInDB] = None