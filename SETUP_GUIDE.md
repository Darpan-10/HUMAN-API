# Human API - Setup & Debugging Guide

## Problem: "TypeError: Failed to fetch"

This error occurs when the frontend cannot reach the backend API. The backend server must be running for authentication and data storage to work.

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 20+** (for frontend)
- **MongoDB** running locally or accessible at `mongodb://localhost:27017/`

## Quick Start

### 1. Start MongoDB

```bash
# If you have MongoDB installed locally
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Verify MongoDB is running:
```bash
mongo
# Should open MongoDB shell
exit
```

### 2. Setup Backend (Python/FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with configuration (copy from .env.example)
cp .env.example .env

# Start the backend server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     ✅ App startup: Database connected
INFO:     ✅ All routes loaded successfully
```

### 3. Setup Frontend (React/Vite)

In a **new terminal**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:8080/
```

## Verify the Setup

1. **Open Frontend**: Visit `http://localhost:8080/`
2. **Check Backend**: Visit `http://localhost:8000/docs` in your browser
3. **Try to Register**: Click "Sign Up" and create an account
4. **Check Logs**: 
   - Backend console should show API requests
   - Frontend browser console should show no fetch errors

## Troubleshooting

### Error: "MongoDB connection failed"

**Solution**: Ensure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# macOS with Homebrew:
brew services start mongodb-community

# Linux/Docker:
docker run -d -p 27017:27017 mongo:latest
```

### Error: "Connection refused on 127.0.0.1:8000"

**Solution**: Backend server is not running
```bash
# Make sure you're in the backend directory
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Error: "Failed to fetch" in browser

**Solution**: Check that both servers are running:
```bash
# Check backend is accessible
curl -X GET http://127.0.0.1:8000/health
# Should return: {"status":"ok","environment":"development"}

# Check frontend proxy configuration
# Open browser DevTools → Network tab
# Try registering and look for API requests to /api/auth/register
```

### Email already registered

**Solution**: Clear the database or use a different email
```bash
# Remove all users from MongoDB
mongosh
use campus_connect
db.users.deleteMany({})
exit
```

## File Structure

```
.
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── pages/              # Page components (Landing, Login, Register, etc.)
│   │   ├── contexts/           # Auth context
│   │   ├── lib/                # API utilities and config
│   │   └── components/         # UI components
│   ├── vite.config.ts          # Vite configuration with API proxy
│   └── package.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── main.py             # FastAPI app setup
│   │   ├── config.py           # Configuration
│   │   ├── database.py         # MongoDB connection
│   │   ├── models/             # Pydantic models (User, Intent)
│   │   ├── routes/             # API endpoints (auth, intent)
│   │   └── services/           # Business logic
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variable template
│
└── SETUP_GUIDE.md              # This file
```

## Environment Variables

### Backend (.env file in backend directory)

```
ENVIRONMENT=development
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=campus_connect
SECRET_KEY=dev-secret-key-12345
```

### Frontend (Vite auto-detects)

During development:
- API calls are proxied through `http://localhost:8080/api` → `http://127.0.0.1:8000`

In production:
- Set `VITE_API_URL` environment variable to your backend URL

## Development Workflow

### 1. Start all services (3 terminals)

Terminal 1 - MongoDB:
```bash
mongod
```

Terminal 2 - Backend:
```bash
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 3 - Frontend:
```bash
cd frontend && npm run dev
```

### 2. Make code changes

- **Frontend changes**: Hot reload automatically (Vite)
- **Backend changes**: Auto-reload with `--reload` flag
- **Database schema changes**: May need manual restart

### 3. Test features

1. Register at `http://localhost:8080/register`
2. Update profile at `http://localhost:8080/profile`
3. Search for collaborators at `http://localhost:8080/intent`
4. Monitor requests in browser DevTools → Network tab

## Production Deployment

When deploying to Fly.dev or similar:

1. **Backend**: Deploy FastAPI app with MongoDB connection string
2. **Frontend**: Set `VITE_API_URL` to your backend URL
3. **Environment**: Use `.env` files with production credentials
4. **CORS**: Update `settings.cors_origins` in `backend/app/config.py`

Example for Fly.dev:
```python
# In backend/app/config.py
cors_origins: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")
```

Then in Fly config:
```
CORS_ORIGINS=https://yourdomain.fly.dev,https://api.yourdomain.fly.dev
```

## Need Help?

1. Check browser DevTools Console (F12) for errors
2. Check backend logs in terminal
3. Verify MongoDB is running: `mongosh`
4. Test backend directly: `http://127.0.0.1:8000/docs`
5. Check network requests: DevTools → Network tab
