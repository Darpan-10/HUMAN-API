# seeds/sample_data.py
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import users_collection, intents_collection
from datetime import datetime, timedelta
import bcrypt

def seed_sample_data():
    """Seed 10 sample users with intents"""
    
    try:
        users_collection.delete_many({})
        intents_collection.delete_many({})
    except Exception as e:
        print(f"Error clearing collections: {e}")
        return
    
    hashed_pwd = bcrypt.hashpw("pass123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    users = [
        {
            "email": "alice@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Alice Chen",
            "skills": ["python", "fastapi", "mongodb"],
            "interests": ["web dev", "ai", "sustainability"],
            "bio": "3rd year CS student building green tech",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "bob@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Bob Johnson",
            "skills": ["react", "javascript", "nodejs"],
            "interests": ["mobile dev", "ui/ux", "design"],
            "bio": "Frontend dev enthusiast",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "charlie@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Charlie Patel",
            "skills": ["python", "tensorflow", "pytorch"],
            "interests": ["machine learning", "ai", "data science"],
            "bio": "AI researcher passionate about NLP",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "diana@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Diana Lee",
            "skills": ["flutter", "dart", "firebase"],
            "interests": ["mobile app", "startups"],
            "bio": "Mobile app developer with startup experience",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "evan@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Evan Martinez",
            "skills": ["java", "spring", "docker"],
            "interests": ["backend", "devops", "cloud"],
            "bio": "Backend engineer interested in scalable systems",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "fiona@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Fiona Singh",
            "skills": ["python", "blockchain", "solidity"],
            "interests": ["web3", "cryptocurrency", "defi"],
            "bio": "Blockchain developer exploring Web3",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "george@campus.edu",
            "password_hash": hashed_pwd,
            "name": "George Wang",
            "skills": ["vue", "typescript", "css"],
            "interests": ["frontend", "design", "animation"],
            "bio": "Creative frontend developer",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "hannah@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Hannah Brown",
            "skills": ["python", "django", "postgresql"],
            "interests": ["backend", "databases", "apis"],
            "bio": "Full stack developer with backend focus",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "isaac@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Isaac Kumar",
            "skills": ["react", "python", "aws"],
            "interests": ["full stack", "cloud", "devops"],
            "bio": "Full stack developer interested in cloud solutions",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "email": "julia@campus.edu",
            "password_hash": hashed_pwd,
            "name": "Julia Garcia",
            "skills": ["golang", "rust", "c++"],
            "interests": ["systems", "competitive programming"],
            "bio": "Systems programmer interested in performance",
            "availability": "ACTIVE",
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = users_collection.insert_many(users)
    user_ids = result.inserted_ids
    
    intents = [
        {
            "user_id": user_ids[0],
            "text": "Looking for React developer to build web dashboard for campus sustainability project",
            "intent_type": "LOOKING_FOR_TEAM",
            "keywords": ["react", "web", "sustainability", "dashboard"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[1],
            "text": "Building mobile app for campus events, need backend and AI person",
            "intent_type": "BUILDING_PROJECT",
            "keywords": ["mobile", "app", "campus", "events", "backend"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[2],
            "text": "Want to share machine learning expertise and collaborate on AI projects",
            "intent_type": "SKILL_SHARE",
            "keywords": ["machine learning", "ai", "tensorflow"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[3],
            "text": "Looking for backend and frontend devs to build startup MVP",
            "intent_type": "LOOKING_FOR_TEAM",
            "keywords": ["startup", "mvp", "backend", "frontend"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[4],
            "text": "Building cloud-native application, need full stack developers",
            "intent_type": "BUILDING_PROJECT",
            "keywords": ["cloud", "native", "fullstack", "aws"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[5],
            "text": "Interested in Web3 and blockchain hackathon, seeking collaborators",
            "intent_type": "LOOKING_FOR_TEAM",
            "keywords": ["web3", "blockchain", "ethereum"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[6],
            "text": "Creating interactive UI library, need backend support",
            "intent_type": "BUILDING_PROJECT",
            "keywords": ["ui", "library", "animation", "frontend"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[7],
            "text": "Need frontend and DevOps engineer for database optimization project",
            "intent_type": "LOOKING_FOR_TEAM",
            "keywords": ["frontend", "devops", "database", "optimization"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[8],
            "text": "Looking for Golang developers to build microservices architecture",
            "intent_type": "LOOKING_FOR_TEAM",
            "keywords": ["golang", "microservices", "systems"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        },
        {
            "user_id": user_ids[9],
            "text": "Building competitive programming judge platform, need full stack team",
            "intent_type": "BUILDING_PROJECT",
            "keywords": ["competitive", "programming", "judge", "platform"],
            "status": "ACTIVE",
            "keywords_auto_generated": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=48)
        }
    ]
    
    intents_collection.insert_many(intents)
    print("✅ Seeded 10 users with 10 intents")

if __name__ == "__main__":
    seed_sample_data()