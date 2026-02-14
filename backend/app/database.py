# app/database.py
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from .config import settings
import logging

logger = logging.getLogger(__name__)

# ============================================
# CONNECTION
# ============================================

try:
    client = MongoClient(
        settings.mongo_uri,
        serverSelectionTimeoutMS=5000
    )
    # Don't ping on import - let the lifespan handle it
    # This prevents the app from crashing before it even starts
    logger.info("📡 MongoDB client initialized")
except Exception as e:
    logger.error(f"❌ MongoDB client initialization failed: {e}")
    # We still raise because without a client, the app can't function
    # but at least we've logged it properly.
    raise

db = client[settings.database_name]

# ============================================
# COLLECTIONS
# ============================================

users_collection = db["users"]
intents_collection = db["intents"]
collaborations_collection = db["collaborations"]

# ============================================
# INDEXES (Performance optimization)
# ============================================

try:
    users_collection.create_index("email", unique=True)
    users_collection.create_index("created_at")
    
    intents_collection.create_index("user_id")
    intents_collection.create_index("keywords")
    intents_collection.create_index("expires_at")
    
    collaborations_collection.create_index("target_user_id")
    collaborations_collection.create_index("status")
    
    logger.info("✅ Database indexes created")
except Exception as e:
    logger.warning(f"⚠️  Index creation issue: {e}")