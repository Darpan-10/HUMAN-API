# 🌐 &lt;DEV / DEX&gt;

### *The Intent-Based Collaboration Engine*

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Vision
In the heat of a hackathon, finding the right collaborator shouldn't be about scrolling through endless profiles—it should be about **intent**. 

**&lt;DEV / DEX&gt;** is a high-performance matching engine that parses your project goals and instantly connects you with the most suitable collaborators. It bridges the gap between *what you want to build* and *who you need to build it with*.

## ✨ Key Features
- **🧠 Intent Matching Engine**: Describe your project in plain English. Our backend uses keyword extraction and alignment scoring to find your perfect match.
- **📊 Expertise Visualization**: View granular skill distributions and proficiency levels for every suggested collaborator.
- **⚡ Real-time Collaboration**: Instant discovery of active participants within the hackathon ecosystem.
- **🎨 Premium UI/UX**: A sleek, glassmorphic interface designed for speed and clarity under pressure.

---

## 🛠️ Tech Stack

### Backend
- **Core**: FastAPI (Python)
- **Database**: MongoDB (NoSQL)
- **Security**: JWT Authentication & Bcrypt Hashing
- **Utilities**: Pydantic for validation, Uvicorn as ASGI server

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn UI (Radix Primitives)
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

---

## ⚙️ Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance (running locally at `mongodb://localhost:27017/`)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python seeds/seed_data.py  # Seed the database with initial users/intents
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 How It Works
1. **User Profiling**: Users register with their skills and interests.
2. **Intent Submission**: A user describes a project (e.g., *"I'm building a sustainability app and need a React dev"*).
3. **Keyword Parsing**: The engine extracts core concepts from the intent string.
4. **Alignment Scoring**: Our algorithm calculates an alignment score based on skill overlap and interest relevance.
5. **Dynamic Ranking**: Results are returned with "High" or "Medium" alignment tags, prioritized by suitability.

---

## 🏆 Hackathon Value
&lt;DEV / DEX&gt; solves the **#1 bottleneck** in collaborative events: team formation. By automating the discovery process, developers can spend less time searching and more time shipping.

---
*Built with ❤️ for the Hackathon Community.*
