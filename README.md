# Team Task Manager

A full-stack collaborative task management system built with React, Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based authentication with secure password hashing.
- **Roles**: Project-level Admin and Member access control.
- **Project Management**: Create projects and invite team members.
- **Task Board**: Kanban-style task management (To Do, In Progress, Done).
- **Dashboard**: Real-time analytics of task statuses and overdue items.

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Recharts, Context API, Axios, Vanilla CSS.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT).

## Folder Structure
```text
/team-task-manager
  ├── backend/           # Node.js + Express backend API
  └── frontend/          # React + Vite frontend application
```

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   *Make sure `MONGO_URI` is correctly pointing to your local DB or Atlas.*
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Make sure `VITE_API_URL` points to `http://localhost:5000/api`.*
4. Start the frontend server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## Deployment Guide (Railway)

This application is deployment-ready for [Railway](https://railway.app/). We recommend deploying the backend and frontend as two separate services from the same GitHub repository.

### Step 1: Deploy MongoDB
1. In your Railway project, click **New** > **Database** > **Add MongoDB**.
2. Once created, copy the connection string.

### Step 2: Deploy Backend
1. Click **New** > **GitHub Repo** and select this repository.
2. Go to the Service Settings -> **Root Directory** and set it to `/backend`.
3. Go to the **Variables** tab and add:
   - `PORT`: `5000`
   - `MONGO_URI`: *(Paste the MongoDB connection string from Step 1)*
   - `JWT_SECRET`: *(A random secure string)*
   - `NODE_ENV`: `production`
4. Deploy the service and generate a public domain (e.g., `https://backend-production.up.railway.app`).

### Step 3: Deploy Frontend
1. Click **New** > **GitHub Repo** and select this same repository again.
2. Go to the Service Settings -> **Root Directory** and set it to `/frontend`.
3. Go to the **Variables** tab and add:
   - `VITE_API_URL`: *(Paste the backend URL from Step 2, appended with `/api`, e.g., `https://backend-production.up.railway.app/api`)*
4. Deploy the service and generate a public domain.

Your Team Task Manager is now live!
