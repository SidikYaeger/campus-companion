# Deployment Guide

Campus Companion is deployed as three pieces:

- Frontend: Vercel
- Backend: Render Web Service
- Database: Neon PostgreSQL

## What You Need

Before clicking deploy, prepare:

- GitHub account with this repository pushed to `main`
- Neon account for PostgreSQL
- Render account for the backend API
- Vercel account for the frontend
- Final Vercel frontend URL, after frontend deploy
- Final Render backend URL, after backend deploy

Keep these values ready:

```text
Neon host
Neon database name
Neon username
Neon password
Render backend URL
Vercel frontend URL
```

Never commit real database passwords or production `.env` files.

## 1. Prepare Neon PostgreSQL

Create a Neon project and database, then keep these values from the Neon
connection details:

- Database host
- Database port
- Database name
- Database username
- Database password
- Pooled or direct connection string

The backend needs a JDBC URL. For Neon, use this shape:

```text
jdbc:postgresql://HOST/DATABASE_NAME?sslmode=require
```

If Neon gives a host with a port, keep it:

```text
jdbc:postgresql://HOST:PORT/DATABASE_NAME?sslmode=require
```

Use the same username and password shown in Neon. For a small Render backend,
the pooled connection string is usually a good default.

## 2. Deploy Backend to Render

Use `render.yaml` or create a Render Web Service manually.

If you deploy using the existing `render.yaml`, keep the repository root as the
Render blueprint root. The file already points Render to `./backend/Dockerfile`.

Recommended settings:

- Runtime: Docker
- Dockerfile path: `./backend/Dockerfile`
- Docker context: `./backend`
- Health check path: `/api/health`

Set these Render environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/DATABASE_NAME?sslmode=require
SPRING_DATASOURCE_USERNAME=your_neon_username
SPRING_DATASOURCE_PASSWORD=your_neon_password
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
JPA_DDL_AUTO=update
```

After deploy, test:

```text
https://your-render-backend-url.onrender.com/api/health
```

Expected response:

```text
Campus Companion backend is running
```

## 3. Deploy Frontend to Vercel

Import the repository into Vercel and set:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

The frontend has `vercel.json` configured so client-side routes such as
`/tasks`, `/calendar`, and `/schedule` load correctly after refresh.

## 4. Update CORS

After Vercel gives the final frontend domain, update Render:

```text
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

For multiple domains, separate them with commas:

```text
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-vercel-domain.vercel.app
```

Redeploy or restart the Render backend after changing CORS.

## 5. Final Checks

- Backend `/api/health` returns a successful response.
- Frontend opens without console CORS errors.
- A new account can register and log in.
- Two different accounts cannot see each other's data.
- Dashboard can load summary data.
- Courses can be created and listed.
- Tasks can be created with a course.
- Calendar events can be created, edited, and deleted.
- Schedule shows courses grouped by day.

Existing records created before account support do not have an owner and are
intentionally hidden from registered users.
