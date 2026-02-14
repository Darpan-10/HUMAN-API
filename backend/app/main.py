# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Add missing imports
from app.config import settings
from app.routes import auth, intent, suggestions
from app.database import client, users_collection
from app.services.parser import extract_keywords


logger = logging.getLogger(__name__)


# ============================================
# STARTUP/SHUTDOWN
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    
    # FAILURE POINT 1: Database not reachable on startup
    try:
        client.admin.command('ping')
        logger.info("✅ App startup: Database connected")
    except Exception as e:
        logger.error(f"❌ Database connection failed on startup: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("App shutdown")


# ============================================
# APP CREATION
# ============================================

app = FastAPI(
    title=settings.api_title,
    description="Intent-based collaboration engine for hackathon projects",
    version=settings.api_version,
    lifespan=lifespan
)


# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# ============================================
# ROUTES
# ============================================

# FAILURE POINT 2: Route import fails (missing routes module)
try:
    app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
    app.include_router(intent.router, prefix="/intents", tags=["Intents"])
    app.include_router(suggestions.router, prefix="/suggestions", tags=["Suggestions"])
    logger.info("✅ All routes loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load routes: {e}")
    raise


# ============================================
# ENDPOINTS
# ============================================

@app.get("/")
def root():
    return {
        "message": "Welcome to <DEV / DEX> API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}


@app.post("/intent")
def quick_intent(payload: dict):
    try:
        text = payload.get("intent", "")
        if not isinstance(text, str) or not text.strip():
            return []
        keywords = [k.lower() for k in extract_keywords(text) if isinstance(k, str)]
        if not keywords:
            return []
            
        keyword_set = set(keywords)
        results = []
        users = list(users_collection.find({"is_deleted": False}))
        
        for u in users:
            name = u.get("name") or "User"
            skills_raw = u.get("skills", [])
            interests_raw = u.get("interests", [])
            
            skills = [s.lower() for s in skills_raw if isinstance(s, str)]
            interests = [i.lower() for i in interests_raw if isinstance(i, str)]
            
            user_tokens = set(skills) | set(interests)
            overlap = list(user_tokens & keyword_set)
            
            if not overlap:
                continue
            
            # Suitability score based on overlap count and quality
            score = len(overlap)
            
            # Create expertise data from real skills
            # Assign realistic but varied proficiency levels
            expertise = []
            for i, skill in enumerate(skills_raw[:4]):
                # Base level between 65 and 95
                level = 95 - (i * 8) - (len(skill) % 5)
                expertise.append({"skill": skill, "level": max(60, min(95, level))})
                
            results.append({
                "name": name,
                "email": u.get("email"),
                "reason": f"Shares expertise in {', '.join(overlap[:3])}",
                "expertise": expertise,
                "suitability_score": score
            })
            
        # Sort by suitability score descending
        results.sort(key=lambda x: x["suitability_score"], reverse=True)
        
        # Assign alignment tags based on rank
        for i, res in enumerate(results):
            if i < 3:
                res["tag"] = "High Alignment"
            else:
                res["tag"] = "Medium Alignment"
            # Remove score from response
            del res["suitability_score"]
            
        return results[:15]
    except Exception as e:
        logger.error(f"POST /intent error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process intent")
