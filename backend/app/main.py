# app/main.py
from fastapi import FastAPI
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
from app.database import client


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
        "message": "Welcome to Campus Connect API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}