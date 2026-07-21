# Deployment Guide (Release Candidate)

Slice of Swadesh is designed to be deployed to modern cloud infrastructure. This guide covers deploying the backend to Railway/Render, the frontend to Vercel, and using managed services for MongoDB and Redis.

## Recommended Stack

| Component | Platform | Free Tier Available? |
| :--- | :--- | :--- |
| **Frontend** | Vercel | Yes |
| **Backend** | Railway or Render | Yes |
| **Database** | MongoDB Atlas | Yes |
| **Cache** | Redis Cloud | Yes |
| **Images** | Cloudinary | Yes |

---

## 1. Environment Variables (`.env`)

You will need to configure environment variables for both the Backend and Frontend.

### Backend `.env`
Create these variables in your Railway/Render dashboard:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/slice-of-swadesh

# Cache
REDIS_URL=redis://default:<password>@redis-cloud-url:6379

# Security
JWT_SECRET=generate_a_strong_random_secret_here
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Image Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email / Notifications (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend `.env`
Create these variables in your Vercel project settings:

```env
# API Connection
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.up.railway.app
```

---

## 2. Deploying the Backend (Railway)

1. Connect your GitHub repository to Railway.
2. Select the `backend` folder as the root directory for the service.
3. Railway will automatically detect the `Dockerfile`.
4. Go to **Variables** and paste the backend `.env` keys.
5. Deploy.
6. Once deployed, copy the public URL and update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` in the frontend configuration.

---

## 3. Deploying the Frontend (Vercel)

1. Import your GitHub repository to Vercel.
2. Set the **Framework Preset** to Next.js.
3. Set the **Root Directory** to `frontend`.
4. Vercel will automatically detect the settings.
5. Go to **Environment Variables** and add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`.
6. Click **Deploy**.
7. Once deployed, copy the Vercel domain and update `CORS_ORIGIN` in the backend configuration.

---

## 4. Production Checklist

Before officially launching, verify the following:

- [ ] **HTTPS:** Ensure both Vercel and Railway endpoints are using `https://`.
- [ ] **CORS:** Ensure `CORS_ORIGIN` on the backend strictly matches the frontend URL.
- [ ] **Health Check:** Visit `https://your-backend-domain/health` and verify `database: connected` and `redis: connected`.
- [ ] **WebSockets:** Ensure real-time notifications and order tracking updates work in the deployed environment.
- [ ] **Database Backups:** Enable automated backups in MongoDB Atlas.
- [ ] **Admin Account:** Manually create or seed the first Admin account in the production database.

---

## Using Docker Compose

If you prefer to deploy everything on a single VPS (Virtual Private Server) like DigitalOcean or AWS EC2, you can use the provided `docker-compose.prod.yml`.

1. Clone the repository to your VPS.
2. Create `.env` files in `backend/` and `frontend/`.
3. Run:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
*(Note: You will need to setup an Nginx reverse proxy and SSL certificates using Let's Encrypt for a production VPS deployment.)*
