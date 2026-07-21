# Slice of Swadesh - Installation & Setup Guide

This guide details the step-by-step process of installing and launching the Slice of Swadesh platform locally.

## Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)
- MongoDB (local community edition or Atlas cluster)

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd slice-of-swadesh
   ```

2. **Install Workspace Dependencies**
   Run the following command at the root to install all dependencies for both frontend, backend, and shared workspaces:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `backend/.env.example` to `backend/.env` and update the database and provider keys.
   - Copy `frontend/.env.example` to `frontend/.env` and verify API endpoints.

4. **Initialize Shared Package**
   Compile typescript declarations inside the shared package:
   ```bash
   npm run build --workspace=shared
   ```

5. **Start Development Servers**
   To start both frontend and backend concurrently in hot-reload mode:
   ```bash
   npm run dev
   ```
   Alternatively, run them separately:
   - Backend API: `npm run dev:backend`
   - Frontend Next.js: `npm run dev:frontend`
