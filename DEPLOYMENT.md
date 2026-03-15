# PromptCraft AI - Production Deployment Guide

Follow these steps to deploy PromptCraft AI publicly.

## 1. Database: MongoDB Atlas (Free Tier)
1. Sign up/Login at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared/Free Tier).
3. In **Network Access**, add `0.0.0.0/0` (Allow all IPs for Render).
4. In **Database Access**, create a user with a password.
5. Click **Connect** -> **Drivers** -> Copy the connection string.
   - Example: `mongodb+srv://user:<password>@cluster0.abc.mongodb.net/promptcraft`

## 2. Backend: Render (Web Service)
1. Sign up/Login at [Render](https://render.com/).
2. Create a **New Web Service** and connect your GitHub/GitLab repository.
3. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**:
   - `PORT`: `5000`
   - `MONGO_URI`: (Your MongoDB Atlas string)
   - `GEMINI_API_KEY`: (Your Google AI API Key)
   - `FRONTEND_URL`: `https://your-app.vercel.app` (Add this AFTER frontend deployment)

## 3. Frontend: Vercel
1. Sign up/Login at [Vercel](https://vercel.com/).
2. Create a **New Project** and connect your repository.
3. **Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api` (The URL Render gave you)

## 4. Security & Access
- The application is **Read-Only** for public users by design (code cannot be modified via browser).
- API is protected by **Helmet.js** and **Rate Limiting** (100 requests per 15 mins per User).
- Sensitive keys are stored securely in environment variables on Render/Vercel.

## 5. Public Links (Example)
- **Frontend**: `https://promptcraft-ai.vercel.app`
- **Backend**: `https://promptcraft-api.onrender.com`
