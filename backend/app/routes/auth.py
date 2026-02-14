# app/routes/auth.py
from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserUpdate, UserInDB, UserResponse, UserLogin
from app.database import users_collection
from app.config import settings
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    """Register new user"""
    
    # FAILURE POINT 1: Email already exists
    try:
        existing = users_collection.find_one({"email": user.email})
        if existing:
            logger.warning(f"Registration attempt with existing email: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        logger.error(f"Email check failed: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    
    # FAILURE POINT 2: Password hashing fails
    try:
        hashed_password = pwd_context.hash(user.password)
        
        user_dict = {
            "email": user.email,
            "password_hash": hashed_password,
            "name": user.name,
            "skills": user.skills,
            "interests": user.interests,
            "bio": user.bio,
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return UserResponse(
            success=True,
            message="User registered successfully",
            data=UserInDB(**user_dict)
        )
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login", response_model=UserResponse)
def login(credentials: UserLogin):
    """User login"""
    
    try:
        user = users_collection.find_one({"email": credentials.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not pwd_context.verify(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return UserResponse(
            success=True,
            message="Login successful",
            data=UserInDB(**user)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")


@router.put("/profile/{user_id}", response_model=UserResponse)
def update_profile(user_id: str, update: UserUpdate):
    """Update user profile"""
    
    try:
        # FAILURE POINT 1: Invalid user_id
        user_oid = ObjectId(user_id)
    except Exception:
        logger.warning(f"Invalid user_id format: {user_id}")
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    # FAILURE POINT 2: User not found
    try:
        user = users_collection.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        update_dict = update.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        users_collection.update_one(
            {"_id": user_oid},
            {"$set": update_dict}
        )
        
        updated_user = users_collection.find_one({"_id": user_oid})
        
        return UserResponse(
            success=True,
            message="Profile updated successfully",
            data=UserInDB(**updated_user)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Update failed")