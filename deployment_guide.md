# Deployment Guide - Slice of Swadesh

This guide explains how to deploy the **Slice of Swadesh** application in a production environment.

## Overview

- **Frontend**: Next.js App Router, deployed to **Vercel**.
- **Backend**: Express.js & TypeScript, deployed to **Railway** or **Render**.
- **Database**: **MongoDB Atlas** (Managed MongoDB).
- **Cache / Sessions**: **Redis Cloud** (Managed Redis).

---

## Step 1: Managed Databases Setup

### 1. MongoDB Atlas (Database)
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (the Shared/M0 free tier is sufficient).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, whitelist `0.0.0.0/0` (allows cloud platforms like Vercel and Railway to connect).
5. Go to **Clusters** > **Connect** > **Drivers** to copy your connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/swadesh?retryWrites=true&w=majority
   ```

### 2. Redis Cloud (Caching & Socket Session Store)
1. Sign up for a free account at [Redis](https://redis.io/try-free/).
2. Create a free subscription and database.
3. Under **Configuration**, copy the **Public Endpoint** and **Password**.
4. Combine them into a connection URL:
   ```text
   redis://:<password>@<public-endpoint>
   ```

---

## Step 2: Backend Deployment (Railway or Render)

### Option A: Deploying on Railway (Recommended)
1. Go to [Railway](https://railway.app/) and sign in using your GitHub account.
2. Click **New Project** > **Deploy from GitHub repo** and select `Slice-of-Swadesh`.
3. Select the `master` branch.
4. Once added, go to the service settings and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Go to **Variables** and add the following environment variables:
   ```env
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/swadesh?retryWrites=true&w=majority
   REDIS_URL=redis://:<password>@<redis-endpoint-host>:<port>
   JWT_SECRET=your-highly-secure-long-jwt-secret-string
   JWT_REFRESH_SECRET=your-highly-secure-long-jwt-refresh-secret-string
   ```
6. Railway will generate a public URL for your backend (e.g., `https://backend-production-xxxx.up.railway.app`). Copy this URL.

### Option B: Deploying on Render
1. Go to [Render](https://render.com/) and link your GitHub account.
2. Click **New** > **Web Service** and choose `Slice-of-Swadesh`.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the same Environment Variables as listed under the Railway section above.

---

## Step 3: Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/) with GitHub.
2. Click **Add New** > **Project** and import `Slice-of-Swadesh`.
3. In the project setup panel, expand **Framework Preset** and ensure it is set to **Next.js**.
4. Expand **Root Directory** and select `frontend`.
5. Under **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-railway-url.railway.app
   ```
6. Click **Deploy**. Vercel will automatically build the Next.js frontend and host it.

---

## Step 4: Docker Compose Production Deployment (Self-Hosted VPS)

If you prefer to deploy the entire stack on a self-hosted Virtual Private Server (VPS) using Docker:

1. Clone the repository on your VPS.
2. Create a `.env` file in the root directory:
   ```env
   MONGO_ROOT_USER=admin
   MONGO_ROOT_PASSWORD=your_secure_db_password
   ```
3. Create a `.env` file inside the `backend/` directory:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb://admin:your_secure_db_password@mongodb:27017/swadesh?authSource=admin
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your_long_secure_secret
   JWT_REFRESH_SECRET=your_long_secure_refresh_secret
   CORS_ORIGIN=http://your-server-ip-or-domain:3000
   ```
4. Create a `.env` file inside the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://your-server-ip-or-domain:5000
   ```
5. Run the production docker-compose bundle:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
6. The application will be accessible at:
   - **Frontend**: `http://your-server-ip-or-domain:3000`
   - **Backend API**: `http://your-server-ip-or-domain:5000`
